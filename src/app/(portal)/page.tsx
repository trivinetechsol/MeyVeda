"use client";

import { useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { ABHABadge } from "@/components/Badges";
import { PractitionerCard } from "@/components/PractitionerCard";
import { MOCK_DINACHAR_TASKS, MOCK_PRACTITIONERS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import type { DinacharTask } from "@/lib/types";

export default function HomePage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const [tasks, setTasks] = useState<DinacharTask[]>(MOCK_DINACHAR_TASKS);

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const categoryIcon: Record<DinacharTask["category"], string> = {
    diet: "🥗",
    exercise: "🧘",
    mindfulness: "🌬️",
    medicine: "🌿",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s your wellness overview for today</p>
          {user?.abhaLinked && (
            <div className="mt-2">
              <ABHABadge abhaId={`${user.phone?.slice(-4) ?? ""}@abha`} linked />
            </div>
          )}
        </div>
        <Link href="/consult">
          <div className="hidden sm:flex items-center gap-2 bg-herb-green text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-colors cursor-pointer">
            <span>📹</span>
            <span>Join Today&apos;s Consult</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Upcoming consult banner */}
          <div className="bg-herb-gradient rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-white/5" />
            <div className="absolute -right-2 -bottom-6 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-widest">
                  Upcoming Consult
                </p>
                <h3 className="font-display text-lg font-semibold mt-1">Dr. Aditi Shastri</h3>
                <p className="text-sm text-white/70 mt-0.5">Ayurveda · Today, 4:30 PM</p>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Link href="/consult">
                    <button className="px-4 py-1.5 bg-white text-herb-green text-xs font-semibold rounded-full hover:bg-white/90 transition-colors">
                      Join Room
                    </button>
                  </Link>
                  <Link href="/waiting-room">
                    <button className="px-4 py-1.5 bg-white/15 text-white text-xs font-medium rounded-full hover:bg-white/25 transition-colors">
                      Waiting Room
                    </button>
                  </Link>
                  <button className="px-4 py-1.5 bg-white/15 text-white text-xs font-medium rounded-full hover:bg-white/25 transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 items-center justify-center flex-shrink-0">
                <span className="text-white font-bold font-display text-lg">AS</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/discover", icon: "🩺", label: "Book Consult", sub: "6 AYUSH specialties" },
              { href: "/ai-chat", icon: "✨", label: "AyurSanvaad", sub: "AI Companion" },
              { href: "/apothecary", icon: "🏥", label: "Apothecary", sub: "Your medicines" },
              { href: "/records", icon: "📁", label: "Health Records", sub: "Timeline & ABHA" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-white rounded-2xl p-4 border border-border hover:border-herb-green/30 hover:shadow-sm transition-all cursor-pointer text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Dinacharya Tracker */}
          <section className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display font-semibold text-foreground text-base">
                Today&apos;s Dinacharya
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-herb-green">{progressPct}%</span>
                <Link href="/dinacharya" className="text-xs text-herb-green font-medium">Full view →</Link>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {completedCount} of {tasks.length} completed
            </p>
            <Progress value={progressPct} className="h-1.5 mb-4 bg-sand" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left",
                    task.done
                      ? "bg-herb-green/5 border-herb-green/20"
                      : "bg-background border-border hover:border-herb-green/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      task.done ? "border-herb-green bg-herb-green" : "border-muted-foreground/40"
                    )}
                  >
                    {task.done && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{categoryIcon[task.category]}</span>
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          task.done ? "task-complete text-muted-foreground" : "text-foreground"
                        )}
                      >
                        {task.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {task.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{task.time}</span>
                </button>
              ))}
            </div>
          </section>

          {/* AI Card */}
          <Link href="/ai-chat">
            <div className="bg-white rounded-2xl p-5 border border-copper/30 hover:border-copper/50 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-ivory-gradient border border-copper/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✨</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">AyurSanvaad AI</h3>
                    <span className="text-[10px] bg-copper/10 text-copper font-medium px-2 py-0.5 rounded-full">
                      AI Companion
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    How can I help you balance your wellness routine today?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Gut health tips", "Balance Pitta dosha", "Sleep routine", "Immunity boost"].map(
                      (q) => (
                        <span
                          key={q}
                          className="text-[10px] border border-border rounded-full px-2.5 py-1 text-muted-foreground hover:border-herb-green/40 hover:text-herb-green cursor-pointer transition-colors"
                        >
                          {q}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Wellness score */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-foreground text-sm">Wellness Score</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Based on Dinacharya adherence</p>
              </div>
              <span className="font-display text-3xl font-bold text-herb-green">74</span>
            </div>
            <Progress value={74} className="h-2 bg-sand" />
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>Needs improvement</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Prakriti */}
          <div className="bg-ivory-deep rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground text-sm">Your Prakriti</h2>
              <span className="text-xs text-herb-green font-medium">Assessed</span>
            </div>
            <div className="flex gap-2">
              {[
                { dosha: "Vata", pct: 40, color: "bg-sky-100 text-sky-700" },
                { dosha: "Pitta", pct: 38, color: "bg-amber-100 text-amber-700" },
                { dosha: "Kapha", pct: 22, color: "bg-emerald-100 text-emerald-700" },
              ].map((d) => (
                <div
                  key={d.dosha}
                  className={`flex-1 rounded-xl p-3 text-center ${d.color}`}
                >
                  <p className="font-bold text-sm font-display">{d.pct}%</p>
                  <p className="text-[10px] font-medium mt-0.5">{d.dosha}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2.5">
              Dominant: Vata-Pitta. Focus on grounding routines and cooling foods.
            </p>
          </div>

          {/* Top Practitioners */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground">Top Practitioners</h2>
              <Link href="/discover" className="text-xs text-herb-green font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_PRACTITIONERS.slice(0, 3).map((doctor) => (
                <PractitionerCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
