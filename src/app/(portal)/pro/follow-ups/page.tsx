"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Filter = "today" | "week" | "overdue" | "completed";

const FOLLOW_UPS = [
  { id: "p1", patient: "Rohit Kumar", age: 32, lastVisit: "14 May 2026", dueDate: "Today", reason: "Reassess digestive treatment response", filter: "today" as Filter, mode: "video" },
  { id: "p3", patient: "Suresh Rao", age: 58, lastVisit: "22 Apr 2026", dueDate: "30 May 2026", reason: "Panchakarma follow-up (overdue by 7 days)", filter: "overdue" as Filter, mode: "clinic" },
  { id: "p2", patient: "Meera Patel", age: 45, lastVisit: "20 May 2026", dueDate: "8 Jun 2026", reason: "Weight balance — 2-week check", filter: "week" as Filter, mode: "video" },
  { id: "p2b", patient: "Anjali Mehta", age: 38, lastVisit: "1 Jun 2026", dueDate: "9 Jun 2026", reason: "Pitta imbalance — first follow-up", filter: "week" as Filter, mode: "video" },
  { id: "p4", patient: "Kavitha Nair", age: 29, lastVisit: "3 May 2026", dueDate: "20 May 2026", reason: "Skin condition — completed", filter: "completed" as Filter, mode: "clinic" },
];

const FILTER_LABELS: Record<Filter, string> = {
  today: "Due Today",
  week: "This Week",
  overdue: "Overdue",
  completed: "Completed",
};

const STATUS_STYLES: Record<Filter, string> = {
  today: "bg-herb-green/10 text-herb-green border-herb-green/20",
  week: "bg-blue-50 text-blue-700 border-blue-100",
  overdue: "bg-red-50 text-red-600 border-red-100",
  completed: "bg-muted text-muted-foreground border-border",
};

export default function FollowUpsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("today");
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [scheduled, setScheduled] = useState<string[]>([]);

  const filtered = FOLLOW_UPS.filter((f) => f.filter === activeFilter);

  const counts: Record<Filter, number> = {
    today: FOLLOW_UPS.filter((f) => f.filter === "today").length,
    week: FOLLOW_UPS.filter((f) => f.filter === "week").length,
    overdue: FOLLOW_UPS.filter((f) => f.filter === "overdue").length,
    completed: FOLLOW_UPS.filter((f) => f.filter === "completed").length,
  };

  function handleSchedule(id: string) {
    setScheduled((prev) => [...prev, id]);
    setSchedulingId(null);
    setFollowUpDate("");
    setFollowUpNote("");
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-foreground">Follow-ups</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track pending follow-ups and schedule sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["today", "overdue", "week", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "bg-white rounded-xl border p-4 text-center transition-all",
              activeFilter === f ? "border-herb-green/40 shadow-sm" : "border-border hover:border-herb-green/20"
            )}
          >
            <p
              className={cn(
                "font-display text-2xl font-bold",
                f === "overdue" ? "text-red-500" :
                f === "today" ? "text-herb-green" :
                f === "week" ? "text-blue-600" : "text-muted-foreground"
              )}
            >
              {counts[f]}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{FILTER_LABELS[f]}</p>
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5 w-fit">
        {(["today", "week", "overdue", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-4 py-2 text-xs font-medium rounded-lg transition-all",
              activeFilter === f ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <span className="text-4xl">✓</span>
            <p className="font-semibold text-foreground mt-3">All clear</p>
            <p className="text-xs text-muted-foreground mt-1">No follow-ups in this category</p>
          </div>
        ) : (
          filtered.map((fu) => (
            <div
              key={fu.id}
              className={cn(
                "bg-white rounded-2xl border overflow-hidden transition-all",
                fu.filter === "overdue" ? "border-red-200" :
                fu.filter === "today" ? "border-herb-green/30" : "border-border",
                fu.filter === "completed" && "opacity-60"
              )}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-sage">{fu.patient[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{fu.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {fu.age}y · Last visit: {fu.lastVisit}
                      </p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full border", STATUS_STYLES[fu.filter])}>
                    {fu.dueDate}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{fu.reason}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {fu.mode === "video" ? "📹 Video" : "🏥 In-Clinic"}
                </p>

                {fu.filter !== "completed" && !scheduled.includes(fu.id) && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSchedulingId(schedulingId === fu.id ? null : fu.id)}
                      className="flex-1 py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all"
                    >
                      Schedule Follow-up
                    </button>
                    <Link href={`/pro/patient/${fu.id}`}>
                      <button className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                        View Intake
                      </button>
                    </Link>
                  </div>
                )}

                {scheduled.includes(fu.id) && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-herb-green font-medium">
                    <span>✓</span>
                    <span>Follow-up scheduled</span>
                  </div>
                )}
              </div>

              {/* Inline scheduler */}
              {schedulingId === fu.id && (
                <div className="border-t border-border bg-muted/30 p-5 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Schedule Follow-up — {fu.patient}</p>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full text-sm border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:border-herb-green/50 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1.5">
                      Follow-up Note (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={followUpNote}
                      onChange={(e) => setFollowUpNote(e.target.value)}
                      placeholder="Reason for follow-up…"
                      className="w-full text-sm border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-herb-green/50 bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSchedule(fu.id)}
                      disabled={!followUpDate}
                      className={cn(
                        "flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all",
                        followUpDate ? "bg-herb-green text-white hover:bg-herb-green/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      Confirm & Notify Patient
                    </button>
                    <button
                      onClick={() => setSchedulingId(null)}
                      className="px-4 py-2.5 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
