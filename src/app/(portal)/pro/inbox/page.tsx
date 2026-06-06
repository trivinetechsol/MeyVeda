"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Message = { from: "patient" | "doctor"; text: string; time: string };
type Thread = { id: string; patient: string; initials: string; lastMessage: string; time: string; unread: number; messages: Message[] };

const INITIAL_THREADS: Thread[] = [
  {
    id: "t1",
    patient: "Rohit Kumar",
    initials: "RK",
    lastMessage: "Feeling much better with the Ashwagandha, thank you.",
    time: "2h ago",
    unread: 1,
    messages: [
      { from: "patient", text: "Hello Doctor, I have been following the prescription for a week now.", time: "10:15 AM" },
      { from: "doctor", text: "Great progress! Please continue for 3 more weeks. How is your digestion tracking?", time: "10:45 AM" },
      { from: "patient", text: "Feeling much better with the Ashwagandha, thank you.", time: "11:20 AM" },
    ],
  },
  {
    id: "t2",
    patient: "Meera Patel",
    initials: "MP",
    lastMessage: "Can I increase the Shallaki dosage Doctor?",
    time: "Yesterday",
    unread: 0,
    messages: [
      { from: "patient", text: "Doctor, I have been using Shallaki for 2 weeks. I see some improvement in morning stiffness.", time: "Yesterday" },
      { from: "patient", text: "Can I increase the Shallaki dosage Doctor?", time: "Yesterday" },
    ],
  },
  {
    id: "t3",
    patient: "Suresh Rao",
    initials: "SR",
    lastMessage: "Understood. Will start the Neem oil application today.",
    time: "3 days ago",
    unread: 0,
    messages: [
      { from: "doctor", text: "Mr. Rao, please apply Neem oil externally on the affected areas twice daily — morning and before bed.", time: "3 days ago" },
      { from: "patient", text: "Understood. Will start the Neem oil application today.", time: "3 days ago" },
    ],
  },
];

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeId, setActiveId] = useState("t1");
  const [message, setMessage] = useState("");

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  function selectThread(id: string) {
    setActiveId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t))
    );
  }

  function sendMessage() {
    if (!message.trim()) return;
    const newMsg: Message = { from: "doctor", text: message.trim(), time: "Just now" };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, newMsg], lastMessage: message.trim(), time: "Just now" }
          : t
      )
    );
    setMessage("");
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-5 flex items-center gap-3">
        <h1 className="font-display text-xl font-semibold text-foreground">Inbox</h1>
        {totalUnread > 0 && (
          <span className="w-5 h-5 rounded-full bg-herb-green text-white text-[10px] font-bold flex items-center justify-center">
            {totalUnread}
          </span>
        )}
        <p className="text-sm text-muted-foreground">· Bounded messaging · ABDM compliant</p>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "280px 1fr", height: "calc(100vh - 14rem)" }}
      >
        {/* Thread list */}
        <div className="bg-white rounded-2xl border border-border overflow-y-auto flex flex-col">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => selectThread(thread.id)}
              className={cn(
                "flex items-start gap-3 p-4 border-b border-border last:border-0 text-left transition-all",
                activeThread.id === thread.id ? "bg-herb-green/5" : "hover:bg-muted/50"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-sage text-xs">{thread.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn("text-sm truncate", thread.unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground")}>
                    {thread.patient}
                  </p>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {thread.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-herb-green text-white text-[9px] font-bold flex items-center justify-center">
                        {thread.unread}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{thread.time}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{thread.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active thread */}
        <div className="bg-white rounded-2xl border border-border flex flex-col overflow-hidden">
          {/* Thread header */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sage text-xs">{activeThread.initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{activeThread.patient}</p>
              <p className="text-[10px] text-muted-foreground">Active patient · Bounded channel · Encrypted</p>
            </div>
            <button className="text-xs text-herb-green font-medium hover:underline">View Profile</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center py-2">
              <span className="text-[10px] text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                Messages are end-to-end encrypted and ABDM-compliant
              </span>
            </div>
            {activeThread.messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.from === "doctor" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[72%] rounded-2xl px-4 py-2.5",
                    msg.from === "doctor"
                      ? "bg-herb-green text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", msg.from === "doctor" ? "text-white/60" : "text-muted-foreground")}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="px-4 py-3 border-t border-border flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                className="flex-1 text-sm border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-herb-green/50 placeholder:text-muted-foreground"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-4 py-2.5 bg-herb-green text-white rounded-xl text-sm font-medium hover:bg-herb-green/90 transition-colors disabled:opacity-40 flex-shrink-0"
              >
                Send
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Visible to patient in their MeyVeda app · No attachments in beta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
