#!/usr/bin/env node
/**
 * Local dev API server — mimics /api/chat Azure Function on port 7071.
 * Run: node scripts/local-api.js
 * Reads DEEPSEEK_API_KEY from .env.local automatically.
 */

const http = require("http");
const path = require("path");
const fs = require("fs");

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .forEach((l) => {
      const [k, ...v] = l.split("=");
      process.env[k.trim()] = v.join("=").trim();
    });
  console.log("[local-api] Loaded .env.local");
}

const PORT = 7071;

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url !== "/api/chat" || req.method !== "POST") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    // Re-use the actual function handler
    const fn = require("../api/chat/index.js");
    const context = {
      log: { error: console.error },
      res: null,
    };
    const parsed = (() => { try { return JSON.parse(body); } catch { return {}; } })();
    await fn(context, { method: "POST", body: parsed });

    const { status = 200, headers = {}, body: respBody } = context.res;
    res.writeHead(status, { "Content-Type": "application/json", ...headers });
    res.end(typeof respBody === "string" ? respBody : JSON.stringify(respBody));
  });
});

server.listen(PORT, () => {
  console.log(`[local-api] Chat API running at http://localhost:${PORT}/api/chat`);
  console.log(`[local-api] DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? "✓ loaded" : "✗ MISSING"}`);
});
