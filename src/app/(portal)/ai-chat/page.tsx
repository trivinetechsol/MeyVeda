"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  "Configure my Dinacharya",
  "Balance Pitta dosha",
  "Tips for better sleep",
  "Improve digestion",
  "Immunity boosters",
  "Manage stress",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "ai-0",
    role: "ai",
    content:
      "Namaste 🙏 I am AyurSanvaad AI, your AYUSH wellness companion. I can help you structure your daily routines, explore AYUSH disciplines, and guide you to the right practitioners.\n\nHow are you feeling today?",
    timestamp: new Date(),
  },
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "Thank you for sharing. Based on what you've described, this may be worth exploring with an Ayurveda or Naturopathy specialist. Would you like me to find verified practitioners near you?",
  pitta:
    "Pitta imbalance often shows as acidity, inflammation, or irritability. I suggest:\n• Avoid spicy and fried foods\n• Drink cooling herbal teas (coriander, fennel)\n• Practice Sheetali Pranayama\n\nWould you like me to configure a Pitta-balancing Dinacharya for you?",
  sleep:
    "For restorative sleep, Ayurveda recommends:\n• Abhyanga (warm oil self-massage) before bed\n• Brahmi Ghrita — ½ tsp at bedtime\n• Phone-free for 60 mins before sleep\n• Sleep before 10:30 PM (Kapha time)\n\nThis is general wellness guidance. A practitioner can personalise this further.",
  digestion:
    "Digestive health (Agni) is foundational in Ayurveda. Quick remedies:\n• Warm water with fresh ginger before meals\n• Triphala Churna at bedtime\n• Avoid cold water and raw foods during meals\n\nIf symptoms persist, I recommend consulting an Ayurvedic gastroenterologist.",
  immunity:
    "AYUSH-backed immunity support includes:\n• Ashwagandha — adaptogenic root for stress & immunity\n• Chyawanprash — 1 tsp daily\n• Tulsi-Ginger tea each morning\n• Adequate sleep before 10 PM\n\nAll recommendations are general and should be validated by a qualified AYUSH practitioner.",
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("pitta") || q.includes("acidity") || q.includes("heat")) return AI_RESPONSES.pitta;
  if (q.includes("sleep") || q.includes("insomnia")) return AI_RESPONSES.sleep;
  if (q.includes("digest") || q.includes("gut") || q.includes("stomach")) return AI_RESPONSES.digestion;
  if (q.includes("immun") || q.includes("boost")) return AI_RESPONSES.immunity;
  return AI_RESPONSES.default;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto">
      {/* Chat header */}
      <div className="px-4 sm:px-6 py-4 border-b border-border bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ivory-gradient border border-copper/30 flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-semibold text-foreground">AyurSanvaad AI</h1>
              <span className="text-[10px] bg-copper/10 text-copper font-semibold px-2 py-0.5 rounded-full">
                AI Companion
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Wellness guidance · Not diagnostic</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-herb-green" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            AyurSanvaad AI provides wellness guidance only. It is not a substitute for clinical diagnosis.
            Consult a verified AYUSH practitioner for medical advice.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.length === 1 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-3">Quick questions</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs border border-border rounded-full px-3 py-1.5 text-foreground hover:border-herb-green/40 hover:bg-herb-green/5 hover:text-herb-green transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-lg bg-ivory-gradient border border-copper/20 flex items-center justify-center flex-shrink-0 mr-2 mt-auto">
                <span className="text-sm">✨</span>
              </div>
            )}
            <div className={cn("max-w-[75%] text-sm leading-relaxed", msg.role === "user" ? "user-bubble" : "ai-bubble")}>
              {msg.content.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
              <p className={cn("text-[10px] mt-1.5", msg.role === "user" ? "text-white/50" : "text-muted-foreground")}>
                {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-lg bg-ivory-gradient border border-copper/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">✨</span>
            </div>
            <div className="ai-bubble flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-sage animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-white border border-border rounded-xl overflow-hidden focus-within:border-herb-green/50 focus-within:ring-2 focus-within:ring-herb-green/10 transition-all">
            <textarea
              rows={1}
              placeholder="Ask about wellness, routines, AYUSH disciplines…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              className="w-full px-3.5 py-2.5 text-sm resize-none focus:outline-none placeholder:text-muted-foreground bg-transparent"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
              input.trim()
                ? "bg-herb-green text-white hover:bg-herb-green/90 shadow-sm active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center mt-2">
          <Link href="/discover" className="text-xs text-herb-green font-medium flex items-center gap-1 hover:underline">
            <span>🩺</span> Find a verified AYUSH practitioner instead
          </Link>
        </div>
      </div>
    </div>
  );
}
