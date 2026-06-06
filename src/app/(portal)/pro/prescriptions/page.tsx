"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Status = "active" | "expired" | "revoked";

const PRESCRIPTIONS = [
  {
    id: "rx1",
    patient: "Rohit Kumar",
    initials: "RK",
    date: "14 May 2026",
    expiry: "14 Aug 2026",
    formulations: [
      { name: "Ashwagandha Churna", dose: "1 tsp", freq: "Twice daily", anupana: "Warm milk" },
      { name: "Triphala Churna", dose: "1 tsp", freq: "At bedtime", anupana: "Warm water" },
      { name: "Brahmi Ghrita", dose: "½ tsp", freq: "Morning", anupana: "Before breakfast" },
    ],
    status: "active" as Status,
    abhaLinked: true,
    diagnosis: "Vata imbalance — digestive weakness with chronic fatigue",
  },
  {
    id: "rx2",
    patient: "Meera Patel",
    initials: "MP",
    date: "18 May 2026",
    expiry: "18 Aug 2026",
    formulations: [
      { name: "Shallaki Capsules", dose: "500mg", freq: "Twice daily", anupana: "After meals" },
      { name: "Dashamoola Churna", dose: "1 tsp", freq: "Once daily", anupana: "Warm water" },
    ],
    status: "active" as Status,
    abhaLinked: true,
    diagnosis: "Vata-Kapha joint inflammation — bilateral knee",
  },
  {
    id: "rx3",
    patient: "Kavitha Nair",
    initials: "KN",
    date: "3 May 2026",
    expiry: "3 Aug 2026",
    formulations: [
      { name: "Neem Churna", dose: "½ tsp", freq: "Twice daily", anupana: "Warm water" },
      { name: "Kumkumadi Oil", dose: "External", freq: "At bedtime", anupana: "Topical" },
    ],
    status: "active" as Status,
    abhaLinked: true,
    diagnosis: "Pitta-dominant skin condition",
  },
  {
    id: "rx4",
    patient: "Anjali Mehta",
    initials: "AM",
    date: "10 Apr 2026",
    expiry: "10 Jul 2026",
    formulations: [
      { name: "Medohar Guggulu", dose: "2 tabs", freq: "Twice daily", anupana: "Warm water" },
      { name: "Triphala", dose: "1 tsp", freq: "At bedtime", anupana: "Warm water" },
    ],
    status: "expired" as Status,
    abhaLinked: true,
    diagnosis: "Kapha-predominant weight imbalance",
  },
];

const STATUS_STYLES: Record<Status, { pill: string; border: string }> = {
  active: { pill: "bg-herb-green/10 text-herb-green border-herb-green/20", border: "border-herb-green/20" },
  expired: { pill: "bg-muted text-muted-foreground border-border", border: "border-border" },
  revoked: { pill: "bg-red-50 text-red-600 border-red-100", border: "border-red-100" },
};

export default function PrescriptionsPage() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? PRESCRIPTIONS : PRESCRIPTIONS.filter((rx) => rx.status === filter);

  const counts = {
    all: PRESCRIPTIONS.length,
    active: PRESCRIPTIONS.filter((rx) => rx.status === "active").length,
    expired: PRESCRIPTIONS.filter((rx) => rx.status === "expired").length,
    revoked: PRESCRIPTIONS.filter((rx) => rx.status === "revoked").length,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Prescriptions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">All issued prescriptions · ABDM-linked to patient health lockers</p>
        </div>
        <Link href="/pro/emr">
          <button className="px-4 py-2.5 bg-herb-green text-white text-sm font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
            + New Prescription
          </button>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(["all", "active", "expired", "revoked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-xs font-medium rounded-lg capitalize transition-all",
                filter === f ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} {counts[f] > 0 && `(${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <span className="text-4xl">📝</span>
            <p className="font-semibold text-foreground mt-3">No prescriptions</p>
            <p className="text-xs text-muted-foreground mt-1">Prescriptions you issue will appear here</p>
          </div>
        ) : (
          filtered.map((rx) => (
            <div
              key={rx.id}
              className={cn(
                "bg-white rounded-2xl border overflow-hidden",
                STATUS_STYLES[rx.status].border
              )}
            >
              <button
                className="w-full p-5 text-left"
                onClick={() => setExpanded(expanded === rx.id ? null : rx.id)}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🌿</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{rx.patient}</p>
                        <span className="text-xs text-muted-foreground">· {rx.formulations.length} formulations</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Issued {rx.date} · Expires {rx.expiry}</p>
                      {rx.abhaLinked && (
                        <p className="text-[10px] text-herb-green mt-0.5">ABHA ✓ · Synced to health locker</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize", STATUS_STYLES[rx.status].pill)}>
                      {rx.status}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      className={cn("text-muted-foreground transition-transform", expanded === rx.id && "rotate-180")}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </button>

              {expanded === rx.id && (
                <div className="border-t border-border px-5 pb-5">
                  <div className="pt-4 space-y-4">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Diagnosis
                      </p>
                      <p className="text-sm text-foreground">{rx.diagnosis}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Formulations
                      </p>
                      <div className="space-y-2">
                        {rx.formulations.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 bg-herb-green/4 rounded-xl border border-herb-green/10">
                            <span className="text-sm mt-0.5">🌿</span>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{f.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {f.dose} · {f.freq} · {f.anupana}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-herb-green/10 text-herb-green text-xs font-semibold rounded-xl hover:bg-herb-green/20 transition-colors">
                        📥 Download PDF
                      </button>
                      {rx.status === "active" && (
                        <Link href="/pro/emr" className="flex-1">
                          <button className="w-full py-2 border border-border text-xs font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                            Reissue
                          </button>
                        </Link>
                      )}
                    </div>
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
