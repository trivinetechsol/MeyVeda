"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Period = "7d" | "30d" | "90d";

const WEEKLY_REVENUE = [
  { day: "Mon", consults: 8, revenue: 6400 },
  { day: "Tue", consults: 12, revenue: 9600 },
  { day: "Wed", consults: 5, revenue: 3000 },
  { day: "Thu", consults: 11, revenue: 8800 },
  { day: "Fri", consults: 14, revenue: 11200 },
  { day: "Sat", consults: 0, revenue: 0 },
  { day: "Sun", consults: 0, revenue: 0 },
];

const TOP_CONDITIONS = [
  { label: "Digestive disorders", count: 18, pct: 38 },
  { label: "Stress & sleep", count: 12, pct: 25 },
  { label: "Joint & musculoskeletal", count: 9, pct: 19 },
  { label: "Skin conditions", count: 5, pct: 10 },
  { label: "Others", count: 4, pct: 8 },
];

const RATING_DIST = [75, 18, 5, 2, 0];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const maxRevenue = Math.max(...WEEKLY_REVENUE.map((d) => d.revenue));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Practice insights and performance metrics</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 text-xs font-medium rounded-lg transition-all",
                period === p ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p === "7d" ? "This week" : p === "30d" ? "This month" : "Last 90 days"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Consultations", value: period === "7d" ? "50" : period === "30d" ? "48" : "132", delta: "+12%", up: true },
          { label: "Revenue", value: period === "7d" ? "₹39K" : period === "30d" ? "₹67.2K" : "₹1.9L", delta: "+8%", up: true },
          { label: "Avg Rating", value: "4.9 ★", delta: "+0.1", up: true },
          { label: "New Patients", value: period === "7d" ? "6" : period === "30d" ? "14" : "38", delta: "-3%", up: false },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4">
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            <p className={cn("text-[10px] font-medium mt-1", s.up ? "text-herb-green" : "text-red-500")}>
              {s.delta} vs prev period
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          {/* Revenue bar chart */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground text-sm">Revenue This Week</h3>
              <span className="text-xs text-muted-foreground font-medium">₹39,000</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {WEEKLY_REVENUE.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground">
                    {d.revenue > 0 ? `₹${(d.revenue / 1000).toFixed(0)}K` : ""}
                  </span>
                  <div
                    className={cn("w-full rounded-t-lg transition-all", d.revenue > 0 ? "bg-herb-green/80" : "bg-muted")}
                    style={{
                      height: maxRevenue > 0 ? `${Math.max((d.revenue / maxRevenue) * 88, d.revenue > 0 ? 8 : 0)}%` : "0%",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consult volume */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Consultation Volume</h3>
              <span className="text-xs text-muted-foreground">50 this week</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {WEEKLY_REVENUE.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={cn("w-full rounded-t-md", d.consults > 0 ? "bg-copper/60" : "bg-muted")}
                    style={{ height: `${(d.consults / 14) * 100}%`, minHeight: d.consults > 0 ? "4px" : "0" }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top conditions */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Top Conditions Treated</h3>
            <div className="space-y-3">
              {TOP_CONDITIONS.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{c.label}</span>
                    <span className="text-muted-foreground">{c.count} ({c.pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-herb-green rounded-full transition-all"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* Mode split */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Consultation Mode</h3>
            <div className="space-y-3">
              {[
                { label: "Video", pct: 68, count: 34, color: "bg-herb-green" },
                { label: "In-Clinic", pct: 32, count: 16, color: "bg-copper" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">{m.label}</span>
                    <span className="text-muted-foreground">{m.pct}% · {m.count} sessions</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className={cn("h-full rounded-full", m.color)} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discipline split */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Discipline Split</h3>
            <div className="space-y-2.5">
              {[
                { label: "Ayurveda", pct: 72, color: "bg-herb-green" },
                { label: "Yoga Integration", pct: 15, color: "bg-sage" },
                { label: "Naturopathy", pct: 13, color: "bg-copper" },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{d.label}</span>
                    <span className="text-muted-foreground">{d.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className={cn("h-full rounded-full", d.color)} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-ivory-deep rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Patient Ratings</h3>
            <div className="flex items-center gap-3 mb-4">
              <p className="font-display text-4xl font-bold text-foreground">4.9</p>
              <div>
                <div className="flex gap-0.5 text-amber-400">★★★★★</div>
                <p className="text-xs text-muted-foreground mt-0.5">38 reviews</p>
              </div>
            </div>
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-muted-foreground w-4">{star}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${RATING_DIST[i]}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-6 text-right">{RATING_DIST[i]}%</span>
              </div>
            ))}
          </div>

          {/* Earnings summary */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Earnings · June 2026</h3>
            {[
              { label: "Gross", value: "₹67,200" },
              { label: "Platform fee (5%)", value: "−₹3,360" },
              { label: "Net payout", value: "₹63,840" },
            ].map((e, i) => (
              <div
                key={e.label}
                className={cn(
                  "flex justify-between text-xs py-2 border-b border-border last:border-0",
                  i === 2 && "font-semibold text-herb-green"
                )}
              >
                <span className={i === 2 ? "text-foreground font-semibold" : "text-muted-foreground"}>
                  {e.label}
                </span>
                <span>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
