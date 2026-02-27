#!/usr/bin/env node
/**
 * Chat Log Viewer — local HTTP server on port 7072.
 * Queries Azure Application Insights for chat logs and serves a vanilla HTML UI.
 * Run: npm run logs  →  open http://localhost:7072
 *
 * Requirements:
 *   - `az login` must be active
 *   - NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING in .env.local
 */

const http = require("http");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// ─── load .env.local ──────────────────────────────────────────────────────────

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .forEach((l) => {
      const [k, ...v] = l.split("=");
      process.env[k.trim()] = v.join("=").trim();
    });
}

// ─── parse ApplicationId from connection string ───────────────────────────────

const connStr = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING || "";
const appIdMatch = connStr.match(/ApplicationId=([^;]+)/i);
if (!appIdMatch) {
  console.error("[log-viewer] ERROR: Could not find ApplicationId in NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING");
  console.error("[log-viewer] Make sure .env.local is present and contains the connection string.");
  process.exit(1);
}
const APP_ID = appIdMatch[1].trim();
console.log(`[log-viewer] Using ApplicationId: ${APP_ID}`);

// ─── query App Insights ───────────────────────────────────────────────────────

function queryAppInsights(days) {
  const query = [
    "traces",
    `| where timestamp > ago(${days}d)`,
    "| where message startswith '[chat]'",
    "| extend d=parse_json(substring(message,7))",
    "| project timestamp, sessionId=tostring(d.sessionId), ip=tostring(d.ip), turn=toint(d.turn), question=tostring(d.question), reply=tostring(d.reply)",
    "| order by timestamp asc",
  ].join(" ");

  const cmd = `az monitor app-insights query --app "${APP_ID}" --analytics-query "${query.replace(/"/g, '\\"')}"`;

  try {
    const raw = execSync(cmd, { encoding: "utf-8", timeout: 30000 });
    const result = JSON.parse(raw);
    // Result shape: { tables: [{ columns: [...], rows: [[...], ...] }] }
    const table = result?.tables?.[0];
    if (!table) return [];

    const cols = table.columns.map((c) => c.name);
    return table.rows.map((row) => {
      const obj = {};
      cols.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });
  } catch (err) {
    throw new Error(`az query failed: ${err.message}`);
  }
}

// ─── group rows into sessions ─────────────────────────────────────────────────

function groupSessions(rows) {
  const map = new Map();

  for (const row of rows) {
    const sid = row.sessionId || "unknown";
    if (!map.has(sid)) {
      map.set(sid, {
        sessionId: sid,
        firstTimestamp: row.timestamp,
        lastTimestamp: row.timestamp,
        ip: row.ip || "unknown",
        turns: [],
      });
    }
    const session = map.get(sid);
    session.lastTimestamp = row.timestamp;
    session.turns.push({
      turn: row.turn,
      timestamp: row.timestamp,
      question: row.question,
      reply: row.reply,
    });
  }

  // Sort sessions newest-first
  const sessions = Array.from(map.values());
  sessions.sort((a, b) => new Date(b.firstTimestamp) - new Date(a.firstTimestamp));
  return sessions;
}

// ─── HTML UI ──────────────────────────────────────────────────────────────────

function renderHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat Log Viewer</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f5; color: #222; }
    header { background: #1e293b; color: #fff; padding: 14px 24px; display: flex; align-items: center; gap: 16px; }
    header h1 { font-size: 1.1rem; font-weight: 600; flex: 1; }
    header select, header button {
      font-size: 0.85rem; padding: 6px 12px; border-radius: 6px;
      border: 1px solid #475569; background: #334155; color: #e2e8f0; cursor: pointer;
    }
    header button { background: #3b82f6; border-color: #2563eb; font-weight: 500; }
    header button:hover { background: #2563eb; }
    #status { padding: 10px 24px; font-size: 0.82rem; color: #64748b; min-height: 32px; }
    #status.ok { color: #16a34a; }
    #status.error { color: #ef4444; }
    #sessions { padding: 0 24px 32px; }
    .session {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
      margin-bottom: 10px; overflow: hidden;
    }
    .session-header {
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      cursor: pointer; user-select: none;
    }
    .session-header:hover { background: #f8fafc; }
    .chevron { font-size: 0.75rem; color: #94a3b8; transition: transform 0.15s; }
    .session.open .chevron { transform: rotate(90deg); }
    .session-meta { font-size: 0.85rem; color: #475569; }
    .session-meta strong { color: #1e293b; font-weight: 600; margin-right: 6px; }
    .badge {
      margin-left: auto; font-size: 0.75rem; background: #eff6ff;
      color: #3b82f6; border: 1px solid #bfdbfe; border-radius: 99px; padding: 2px 8px;
    }
    .turns { display: none; border-top: 1px solid #f1f5f9; padding: 12px 16px; }
    .session.open .turns { display: block; }
    .turn { margin-bottom: 14px; }
    .turn:last-child { margin-bottom: 0; }
    .turn-ts { font-size: 0.72rem; color: #94a3b8; margin-bottom: 4px; }
    .bubble { border-radius: 10px; padding: 8px 12px; font-size: 0.85rem; line-height: 1.5; max-width: 90%; }
    .user-row { display: flex; justify-content: flex-end; margin-bottom: 4px; }
    .user-bubble { background: #3b82f6; color: #fff; }
    .bot-row { display: flex; justify-content: flex-start; }
    .bot-bubble { background: #f1f5f9; color: #1e293b; white-space: pre-wrap; }
    .label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
    .user-label { text-align: right; }
  </style>
</head>
<body>
  <header>
    <h1>Chat Log Viewer</h1>
    <select id="days">
      <option value="1">Last 1d</option>
      <option value="7" selected>Last 7d</option>
      <option value="14">Last 14d</option>
      <option value="30">Last 30d</option>
    </select>
    <button id="refresh">Refresh</button>
  </header>
  <div id="status">Loading…</div>
  <div id="sessions"></div>

  <script>
    const statusEl = document.getElementById("status");
    const sessionsEl = document.getElementById("sessions");
    const daysEl = document.getElementById("days");

    function fmtTime(ts) {
      if (!ts) return "";
      const d = new Date(ts);
      return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function renderSessions(sessions) {
      if (!sessions.length) {
        sessionsEl.innerHTML = '<p style="color:#94a3b8;padding:24px 0">No chat sessions found for this time range.</p>';
        return;
      }
      sessionsEl.innerHTML = sessions.map((s, idx) => {
        const turnCount = s.turns.length;
        const turnsHtml = s.turns.map(t => \`
          <div class="turn">
            <div class="turn-ts">\${fmtTime(t.timestamp)}</div>
            <div class="user-label label">User</div>
            <div class="user-row"><div class="bubble user-bubble">\${escHtml(t.question)}</div></div>
            <div class="label" style="margin-top:6px">Virtual Rutao</div>
            <div class="bot-row"><div class="bubble bot-bubble">\${escHtml(t.reply)}</div></div>
          </div>
        \`).join("");
        return \`
          <div class="session" id="s\${idx}">
            <div class="session-header" onclick="toggle(\${idx})">
              <span class="chevron">▶</span>
              <span class="session-meta">
                <strong>\${fmtTime(s.firstTimestamp)}</strong>
                · \${escHtml(s.ip)}
                · \${s.sessionId === "unknown" ? "<em>no session id</em>" : escHtml(s.sessionId)}
              </span>
              <span class="badge">\${turnCount} \${turnCount === 1 ? "turn" : "turns"}</span>
            </div>
            <div class="turns">\${turnsHtml}</div>
          </div>
        \`;
      }).join("");
    }

    function escHtml(str) {
      return String(str ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function toggle(idx) {
      document.getElementById("s" + idx).classList.toggle("open");
    }

    async function load() {
      statusEl.className = "";
      statusEl.textContent = "Querying Application Insights…";
      sessionsEl.innerHTML = "";
      const days = daysEl.value;
      try {
        const resp = await fetch("/api/sessions?days=" + days);
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || resp.statusText);
        statusEl.className = "ok";
        statusEl.textContent = \`✓ App Insights returned \${data.rawRows} row\${data.rawRows === 1 ? "" : "s"} → \${data.sessions.length} session\${data.sessions.length === 1 ? "" : "s"}, \${data.totalTurns} turn\${data.totalTurns === 1 ? "" : "s"} · \${new Date().toLocaleTimeString()}\`;
        renderSessions(data.sessions);
      } catch (err) {
        statusEl.className = "error";
        statusEl.textContent = "Error: " + err.message;
      }
    }

    document.getElementById("refresh").addEventListener("click", load);
    load();
  </script>
</body>
</html>`;
}

// ─── HTTP server ──────────────────────────────────────────────────────────────

const PORT = 7072;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderHtml());
    return;
  }

  if (url.pathname === "/api/sessions" && req.method === "GET") {
    const days = parseInt(url.searchParams.get("days") || "7", 10);
    const safeDays = [1, 7, 14, 30].includes(days) ? days : 7;
    try {
      const rows = queryAppInsights(safeDays);
      const sessions = groupSessions(rows);
      const totalTurns = sessions.reduce((sum, s) => sum + s.turns.length, 0);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sessions, totalTurns, rawRows: rows.length }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`[log-viewer] Running at http://localhost:${PORT}`);
  console.log(`[log-viewer] ApplicationId: ${APP_ID}`);
});
