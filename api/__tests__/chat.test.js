/**
 * Unit tests for the /api/chat Azure Function handler.
 * Mocks @azure/functions and Node built-in https so no real HTTP calls are made.
 */

"use strict";

let registeredHandler;

jest.mock("@azure/functions", () => ({
  app: {
    http: (_name, opts) => {
      registeredHandler = opts.handler;
    },
  },
}));

jest.mock("https", () => ({
  request: jest.fn(),
}));

jest.mock("applicationinsights", () => ({
  setup: jest.fn().mockReturnThis(),
  setAutoCollectConsole: jest.fn().mockReturnThis(),
  start: jest.fn(),
  defaultClient: { trackTrace: jest.fn(), flush: jest.fn() },
}));

const https = require("https");

// Sets up https.request to simulate a successful/failed DeepSeek response.
// Triggers callback synchronously inside req.end() for reliable test timing.
function mockDeepSeekResponse(statusCode, responseBody) {
  const EventEmitter = require("events");
  https.request.mockImplementation((_opts, callback) => {
    const res = new EventEmitter();
    res.statusCode = statusCode;
    const req = new EventEmitter();
    req.write = jest.fn();
    req.end = jest.fn(() => {
      callback(res);
      res.emit("data", JSON.stringify(responseBody));
      res.emit("end");
    });
    return req;
  });
}

function makeRequest(method = "POST", jsonBody = null) {
  return {
    method,
    json: jest.fn().mockResolvedValue(jsonBody),
    headers: { get: jest.fn().mockReturnValue(null) },
  };
}

const fakeContext = { error: jest.fn(), log: jest.fn() };

describe("Azure Function /api/chat", () => {
  beforeAll(() => {
    process.env.DEEPSEEK_API_KEY = "test-api-key";
    require("../index.js");
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.DEEPSEEK_API_KEY = "test-api-key";
  });

  it("registers a handler", () => {
    expect(typeof registeredHandler).toBe("function");
  });

  it("returns 204 for OPTIONS preflight", async () => {
    const req = makeRequest("OPTIONS");
    const result = await registeredHandler(req, fakeContext);
    expect(result.status).toBe(204);
  });

  it("returns 400 when message is missing", async () => {
    const req = makeRequest("POST", {});
    const result = await registeredHandler(req, fakeContext);
    expect(result.status).toBe(400);
    expect(JSON.parse(result.body).error).toMatch(/missing/i);
  });

  it("returns 400 when body is not JSON", async () => {
    const req = { method: "POST", json: jest.fn().mockRejectedValue(new SyntaxError("bad json")), headers: { get: jest.fn().mockReturnValue(null) } };
    const result = await registeredHandler(req, fakeContext);
    expect(result.status).toBe(400);
  });

  it("returns 500 when DEEPSEEK_API_KEY is not configured", async () => {
    delete process.env.DEEPSEEK_API_KEY;
    const req = makeRequest("POST", { message: "Hello" });
    const result = await registeredHandler(req, fakeContext);
    expect(result.status).toBe(500);
    expect(JSON.parse(result.body).error).toMatch(/api_key/i);
  });

  it("returns 200 with reply on successful DeepSeek response", async () => {
    mockDeepSeekResponse(200, {
      choices: [{ message: { content: "Answer:\nRutao works at Domyn.\n\nEvidence:\n- \"Domyn\"" } }],
    });
    const req = makeRequest("POST", { message: "Where does Rutao work?" });
    const result = await registeredHandler(req, fakeContext);
    expect(result.status).toBe(200);
    expect(JSON.parse(result.body).reply).toContain("Domyn");
  });

  it("returns 502 when DeepSeek API returns a non-200 status", async () => {
    mockDeepSeekResponse(500, { error: "Internal Server Error" });
    const req = makeRequest("POST", { message: "Tell me about Rutao" });
    const result = await registeredHandler(req, fakeContext);
    expect(result.status).toBe(502);
    expect(JSON.parse(result.body).error).toMatch(/failed to reach/i);
  });

  it("includes CORS headers in all responses", async () => {
    const req = makeRequest("OPTIONS");
    const result = await registeredHandler(req, fakeContext);
    expect(result.headers["Access-Control-Allow-Origin"]).toBe("*");
  });
});
