"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type TimeBlock = "morning" | "midday" | "evening" | "night";

type Task = {
  id: string;
  label: string;
  desc: string;
  time: string;
  block: TimeBlock;
  done: boolean;
  icon: string;
};

const INITIAL_TASKS: Task[] = [
  // Morning
  { id: "m1", label: "Wake before sunrise", desc: "Brahma Muhurta — 96 mins before sunrise", time: "5:30 AM", block: "morning", done: true, icon: "🌅" },
  { id: "m2", label: "Kavala — oil pulling", desc: "Swish 1 tbsp sesame oil for 10–15 min", time: "5:45 AM", block: "morning", done: true, icon: "🫧" },
  { id: "m3", label: "Jihva Nirlekhan", desc: "Tongue scraping with copper scraper", time: "6:00 AM", block: "morning", done: true, icon: "👅" },
  { id: "m4", label: "Nasya", desc: "2 drops warm sesame oil in each nostril", time: "6:05 AM", block: "morning", done: false, icon: "💧" },
  { id: "m5", label: "Yoga & Pranayama", desc: "30 min Surya Namaskar + Anulom Vilom", time: "6:15 AM", block: "morning", done: false, icon: "🧘" },
  { id: "m6", label: "Warm water with lemon", desc: "1 cup warm water with ½ lemon — before eating", time: "7:00 AM", block: "morning", done: false, icon: "🍋" },
  { id: "m7", label: "Light, warm breakfast", desc: "Avoid cold foods. Prefer khichdi or upma.", time: "7:30 AM", block: "morning", done: false, icon: "🥣" },
  // Midday
  { id: "d1", label: "Main meal at noon", desc: "Largest meal of the day when Agni is strongest", time: "12:30 PM", block: "midday", done: false, icon: "🍱" },
  { id: "d2", label: "Short walk after lunch", desc: "100 steps (Shatapavali) after eating", time: "1:15 PM", block: "midday", done: false, icon: "🚶" },
  { id: "d3", label: "Avoid cold drinks", desc: "No ice water — impairs Agni", time: "All day", block: "midday", done: true, icon: "🚫" },
  // Evening
  { id: "e1", label: "Light dinner before 7 PM", desc: "Soup, warm vegetables — easy to digest", time: "6:30 PM", block: "evening", done: false, icon: "🥣" },
  { id: "e2", label: "Evening walk", desc: "15–20 min gentle walk outdoors", time: "5:30 PM", block: "evening", done: false, icon: "🌤️" },
  { id: "e3", label: "Meditation — 10 min", desc: "Calm the nervous system before night", time: "7:30 PM", block: "evening", done: false, icon: "🧘" },
  // Night
  { id: "n1", label: "Warm turmeric milk", desc: "Golden milk — 1 tsp turmeric in warm milk", time: "8:30 PM", block: "night", done: false, icon: "🥛" },
  { id: "n2", label: "Digital detox", desc: "No screens 30 min before sleep", time: "9:30 PM", block: "night", done: false, icon: "📵" },
  { id: "n3", label: "Sleep before 10 PM", desc: "Pitta time — body repairs 10 PM – 2 AM", time: "10:00 PM", block: "night", done: false, icon: "🌙" },
];

const BLOCK_META: Record<TimeBlock, { label: string; range: string; icon: string; color: string }> = {
  morning: { label: "Morning Routine", range: "5:30 – 8:00 AM", icon: "🌅", color: "text-amber-600 bg-amber-50 border-amber-100" },
  midday: { label: "Midday Practices", range: "12:00 – 2:00 PM", icon: "☀️", color: "text-orange-600 bg-orange-50 border-orange-100" },
  evening: { label: "Evening Routine", range: "5:00 – 8:00 PM", icon: "🌤️", color: "text-blue-600 bg-blue-50 border-blue-100" },
  night: { label: "Night Routine", range: "8:00 – 10:00 PM", icon: "🌙", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
};

const WEEK_STREAKS = [
  { day: "Mon", pct: 100 },
  { day: "Tue", pct: 85 },
  { day: "Wed", pct: 75 },
  { day: "Thu", pct: 90 },
  { day: "Fri", pct: 60 },
  { day: "Sat", pct: 0 },
  { day: "Sun", pct: 0, today: true },
];

export default function DinacharyaPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const blocks: TimeBlock[] = ["morning", "midday", "evening", "night"];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Dinacharya</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-semibold text-amber-700">4-day streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left: Task blocks */}
        <div className="space-y-5">
          {/* Today's progress */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Today's Progress</span>
              <span className="font-display text-2xl font-bold text-herb-green">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2.5 bg-sand" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{done} of {total} practices completed</span>
              <span>{total - done} remaining</span>
            </div>
          </div>

          {/* Task blocks */}
          {blocks.map((block) => {
            const blockTasks = tasks.filter((t) => t.block === block);
            const blockDone = blockTasks.filter((t) => t.done).length;
            const meta = BLOCK_META[block];
            return (
              <div key={block} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className={cn("flex items-center justify-between px-5 py-3.5 border-b border-border", ``)}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{meta.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                      <p className="text-[10px] text-muted-foreground">{meta.range}</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full border", meta.color)}>
                    {blockDone}/{blockTasks.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {blockTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggle(task.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all hover:bg-muted/40",
                        task.done && "bg-herb-green/2"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          task.done ? "border-herb-green bg-herb-green" : "border-muted-foreground/30"
                        )}
                      >
                        {task.done && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-base flex-shrink-0">{task.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium", task.done ? "line-through text-muted-foreground" : "text-foreground")}>
                          {task.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{task.desc}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">{task.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Stats */}
        <div className="space-y-4">
          {/* Weekly streak */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">This Week</h3>
            <div className="flex items-end gap-1.5">
              {WEEK_STREAKS.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all",
                      d.today ? "bg-copper" :
                      d.pct >= 80 ? "bg-herb-green" :
                      d.pct >= 50 ? "bg-herb-green/50" :
                      d.pct === 0 ? "bg-muted" : "bg-herb-green/30"
                    )}
                    style={{ height: `${Math.max(d.pct * 0.6, d.pct > 0 ? 6 : 3)}px` }}
                  />
                  <span className={cn("text-[10px]", d.today ? "font-bold text-copper" : "text-muted-foreground")}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              Avg this week: 82% · Best day: Monday
            </p>
          </div>

          {/* Wellness impact */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Wellness Score Impact</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Current</span>
              <span className="font-display text-2xl font-bold text-herb-green">74</span>
            </div>
            <Progress value={74} className="h-2 bg-sand mb-3" />
            <div className="space-y-2">
              {[
                { label: "Dinacharya adherence", contrib: "+12" },
                { label: "Sleep quality (estimated)", contrib: "+8" },
                { label: "Prescription adherence", contrib: "+6" },
                { label: "AI check-ins", contrib: "+4" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-herb-green font-medium">{item.contrib}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prakriti tip */}
          <div className="bg-ivory-deep rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌿</span>
              <h3 className="font-semibold text-foreground text-sm">Vata-Pitta Tip</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your Prakriti shows Vata dominance. Consistent Dinacharya is especially grounding for Vata types — irregular routines aggravate Vata and disrupt digestion.
            </p>
          </div>

          {/* Prescription reminders */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Today's Medicines</h3>
            {[
              { name: "Brahmi Ghrita", time: "7:30 AM", done: true },
              { name: "Ashwagandha", time: "1:00 PM", done: false },
              { name: "Triphala", time: "9:30 PM", done: false },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm", m.done ? "opacity-40" : "")}>🌿</span>
                  <div>
                    <p className={cn("text-xs font-medium", m.done ? "line-through text-muted-foreground" : "text-foreground")}>
                      {m.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{m.time}</p>
                  </div>
                </div>
                {m.done
                  ? <span className="text-[10px] text-herb-green">✓ Taken</span>
                  : <button className="text-[10px] text-herb-green font-semibold border border-herb-green/30 px-2 py-0.5 rounded-full hover:bg-herb-green/5">Mark taken</button>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
