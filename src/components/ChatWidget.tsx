"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Answer:\nHi! I'm an AI assistant trained on Rutao's resume. Ask me anything about his experience, skills, education, or publications.\n\nEvidence:\n- \"Rutao Luo — Financial AI Specialist / Lead at Domyn; ex-Principal Data Scientist at Vanguard\"",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply = data.reply ?? data.error ?? "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /** Render message content — split Answer/Evidence sections */
  function renderContent(content: string) {
    const answerMatch = content.match(/Answer:\s*([\s\S]*?)(?=Evidence:|$)/i);
    const evidenceMatch = content.match(/Evidence:\s*([\s\S]*?)$/i);

    if (!answerMatch) {
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
    }

    const answerText = answerMatch[1].trim();
    const evidenceText = evidenceMatch?.[1].trim();

    return (
      <div className="space-y-2">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{answerText}</p>
        {evidenceText && evidenceText !== "(no supporting resume text found)" && (
          <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
              Evidence
            </p>
            <div className="space-y-1">
              {evidenceText
                .split("\n")
                .filter((l) => l.trim().startsWith("-"))
                .map((line, i) => (
                  <p
                    key={i}
                    className="text-xs text-gray-500 dark:text-gray-400 italic pl-2 border-l-2 border-blue-300 dark:border-blue-700"
                  >
                    {line.replace(/^-\s*"|"$/g, "").replace(/^-\s*/, "")}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with AI about Rutao's resume"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                   bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl
                   flex items-center justify-center transition-all duration-200
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Resume chatbot"
          aria-modal="true"
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)]
                     bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800
                     flex flex-col overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Resume Assistant</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ask about Rutao&apos;s background</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5
                    ${msg.role === "user"
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "bg-blue-100 dark:bg-blue-900/40"}`}
                  aria-hidden="true"
                >
                  {msg.role === "user"
                    ? <User size={13} className="text-gray-600 dark:text-gray-300" />
                    : <Bot size={13} className="text-blue-600 dark:text-blue-400" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5
                    ${msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"}`}
                >
                  {msg.role === "assistant"
                    ? renderContent(msg.content)
                    : <p className="text-sm leading-relaxed">{msg.content}</p>}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                  <Bot size={13} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 size={16} className="text-gray-400 animate-spin" aria-label="Loading response" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about experience, skills…"
                aria-label="Type your question"
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100
                           placeholder-gray-400 dark:placeholder-gray-500 outline-none
                           disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="shrink-0 w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40
                           flex items-center justify-center text-white transition-colors
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <Send size={13} aria-hidden="true" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-1.5">
              Powered by DeepSeek · grounded in resume only
            </p>
          </div>
        </div>
      )}
    </>
  );
}
