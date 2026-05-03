"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Brain,
  X,
  Send,
  Loader2,
  MessageCircle,
  ArrowRight,
  Minimize2,
  ChevronRight,
} from "lucide-react";
import type { ChatMessage } from "@/pages/api/ai/chat";

const QUICK_PROMPTS = [
  { label: "Status pengiriman", text: "Apa status pengiriman saat ini?" },
  { label: "Paket bermasalah", text: "Ada paket yang bermasalah atau kritis?" },
  { label: "Lihat laporan", text: "Tunjukkan laporan bulanan" },
  { label: "Rute berbahaya", text: "Rute mana yang paling berbahaya?" },
];

interface AIChatbotProps {
  onNavigate: (section: string) => void;
}

export function AIChatbot({ onNavigate }: AIChatbotProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya SafeTrack AI Assistant. Saya bisa membantu kamu memantau pengiriman, menganalisa data sensor, dan navigasi ke halaman yang kamu butuhkan. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus();
    }
  }, [open, minimized]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMessage = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setPendingNav(null);

      try {
        const resp = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-6),
          }),
        });

        const data = await resp.json();

        if (!resp.ok || data.error) {
          let friendly = "Maaf, terjadi kesalahan saat menghubungi Gemini AI.";
          if (data.code === "RATE_LIMITED") {
            friendly =
              "Kuota Gemini API tercapai. Coba lagi dalam ~1 menit, atau gunakan API key dengan kuota lebih besar.";
          } else if (data.code === "MISSING_KEY") {
            friendly =
              "GEMINI_API_KEY belum dikonfigurasi. Tambahkan di file .env.local lalu restart server dev.";
          } else if (data.code === "INVALID_KEY") {
            friendly =
              "API key Gemini tidak valid. Buat key baru di https://aistudio.google.com/app/apikey lalu update .env.local.";
          } else if (data.error) {
            friendly = data.error;
          }
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: friendly },
          ]);
          return;
        }

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.reply,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.navigateTo) {
          setPendingNav(data.navigateTo);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Tidak bisa terhubung ke server. Periksa koneksi internet dan pastikan dev server berjalan.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  const handleNav = (section: string) => {
    onNavigate(section);
    setPendingNav(null);
    setMinimized(true);
  };

  const sectionLabels: Record<string, string> = {
    overview: "Dashboard Overview",
    shipments: "Active Shipments",
    sensors: "Sensor Nodes",
    lifecycle: "Device Lifecycle",
    thresholds: "G-Force Thresholds",
    integrity: "0G Data Integrity",
    predictions: "AI Predictions",
    "route-tracking": "Route Tracking & AI",
    "monthly-report": "Laporan Bulanan AI",
    claims: "Claims & Escrow",
    settings: "Settings",
    incidents: "Incident Reports",
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          aria-label="Buka AI Assistant"
        >
          <div className="relative">
            <Brain className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed right-6 z-50 w-[360px] rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 flex flex-col overflow-hidden transition-all duration-300 ${
            minimized ? "bottom-6 h-14" : "bottom-6 h-[520px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 h-14 border-b border-border bg-card shrink-0 cursor-pointer" onClick={() => setMinimized((v) => !v)}>
            <div className="relative shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-none">SafeTrack AI</p>
              <p className="text-[10px] text-green-400 mt-0.5">Online · Gemini 2.5 Flash</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v); }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); setMinimized(false); }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1 mr-2">
                        <Brain className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-secondary text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Navigation suggestion */}
                {pendingNav && sectionLabels[pendingNav] && (
                  <div className="flex justify-start">
                    <div className="h-6 w-6 shrink-0 mt-1 mr-2" />
                    <button
                      onClick={() => handleNav(pendingNav)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/20 transition-colors group"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      Buka: {sectionLabels[pendingNav]}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1 mr-2">
                      <Brain className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Sedang berpikir...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => send(q.text)}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border transition-colors"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-border bg-card shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya sesuatu..."
                    className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="h-3.5 w-3.5 text-primary-foreground" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
