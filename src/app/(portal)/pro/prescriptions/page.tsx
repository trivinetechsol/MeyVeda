"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { usePractitionerPrescriptions } from "@/lib/hooks";

type Status = "active" | "expired" | "revoked";

const STATUS_STYLES: Record<Status, { pill: string; border: string }> = {
  active: { pill: "bg-herb-green/10 text-herb-green border-herb-green/20", border: "border-herb-green/20" },
  expired: { pill: "bg-muted text-muted-foreground border-border", border: "border-border" },
  revoked: { pill: "bg-red-50 text-red-600 border-red-100", border: "border-red-100" },
};

const getRxStatus = (statusStr: string, followUpDateStr: string | null): Status => {
  if (statusStr === "revoked") return "revoked";
  if (followUpDateStr && new Date(followUpDateStr) < new Date()) return "expired";
  return "active";
};

const getExpiryDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 90); // Prescriptions expire in 90 days
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const { data: prescriptions = [], loading } = usePractitionerPrescriptions(user?.id);

  const [filter, setFilter] = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const mappedPrescriptions = (prescriptions || []).map((rx) => {
    const status = getRxStatus(rx.status, rx.followUpDate);
    return {
      ...rx,
      patientName: rx.doctorName, // doctorName was mapped to patientName in queries.ts practitioner view
      patientInitials: rx.doctorInitials,
      status,
      expiry: rx.followUpDate 
        ? new Date(rx.followUpDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : getExpiryDate(rx.date),
    };
  });

  const filtered = filter === "all" ? mappedPrescriptions : mappedPrescriptions.filter((rx) => rx.status === filter);

  const counts = {
    all: mappedPrescriptions.length,
    active: mappedPrescriptions.filter((rx) => rx.status === "active").length,
    expired: mappedPrescriptions.filter((rx) => rx.status === "expired").length,
    revoked: mappedPrescriptions.filter((rx) => rx.status === "revoked").length,
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-herb-green border-t-transparent animate-spin" />
        </div>
      ) : (
        /* List */
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
                          <p className="text-sm font-semibold text-foreground">{rx.patientName}</p>
                          <span className="text-xs text-muted-foreground">· {rx.items.length} formulation{rx.items.length !== 1 ? "s" : ""}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Issued {rx.date} · Valid Until {rx.expiry}</p>
                        <p className="text-[10px] text-herb-green mt-0.5">ABHA ✓ · Synced to health locker</p>
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
                      {rx.dietaryAdvice && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Dietary Advice
                          </p>
                          <p className="text-sm text-foreground">{rx.dietaryAdvice}</p>
                        </div>
                      )}

                      {rx.lifestyleAdvice && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Lifestyle Advice
                          </p>
                          <p className="text-sm text-foreground">{rx.lifestyleAdvice}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Formulations
                        </p>
                        <div className="space-y-2">
                          {rx.items.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 bg-herb-green/4 rounded-xl border border-herb-green/10">
                              <span className="text-sm mt-0.5">🌿</span>
                              <div>
                                <p className="text-xs font-semibold text-foreground">{f.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {f.dose} · {f.frequency} {f.anupana ? `· with ${f.anupana}` : ""} {f.durationDays > 0 ? `· for ${f.durationDays} days` : ""}
                                </p>
                                {f.instructions && (
                                  <p className="text-[10px] text-muted-foreground mt-1 italic">Note: {f.instructions}</p>
                                )}
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
      )}
    </div>
  );
}
