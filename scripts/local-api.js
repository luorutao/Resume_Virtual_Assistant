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
    // Directly call the DeepSeek API via the shared httpsPost helper
    // (re-implement inline to avoid coupling to Azure Functions SDK locally)
    const https = require("https");
    function httpsPost(url, headers, bodyObj) {
      return new Promise((resolve, reject) => {
        const { hostname, pathname } = new URL(url);
        const data = JSON.stringify(bodyObj);
        const req = https.request(
          { hostname, path: pathname, method: "POST",
            headers: { ...headers, "Content-Length": Buffer.byteLength(data) } },
          (r) => { let raw = ""; r.on("data", c => raw += c); r.on("end", () => resolve({ status: r.statusCode, body: raw })); }
        );
        req.on("error", reject);
        req.write(data); req.end();
      });
    }

    const parsed = (() => { try { return JSON.parse(body); } catch { return {}; } })();
    const userMessage = parsed?.message?.trim();
    if (!userMessage) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing 'message'" }));
      return;
    }

    // Inline system prompt (same as deployed function)
    const SYSTEM_PROMPT = `You are a resume-grounded assistant for Rutao Luo. Answer using ONLY the resume context. Include Evidence section with verbatim snippets. If not in resume: "I don't know based on the resume."`;
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
    const resp = await httpsPost(
      "https://api.deepseek.com/v1/chat/completions",
      { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      { model, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userMessage }], temperature: 0.1, max_tokens: 800 }
    );
    const data = JSON.parse(resp.body);
    const reply = data.choices?.[0]?.message?.content ?? "No response.";
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ reply }));
  });
});

server.listen(PORT, () => {
  console.log(`[local-api] Chat API running at http://localhost:${PORT}/api/chat`);
  console.log(`[local-api] DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? "✓ loaded" : "✗ MISSING"}`);
});
