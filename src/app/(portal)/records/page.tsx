"use client";

import { useState } from "react";
import { MOCK_HEALTH_RECORDS } from "@/lib/data";
import { ABHABadge } from "@/components/Badges";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import type { HealthRecord } from "@/lib/types";

type FilterTab = "All" | "Consultations" | "Prescriptions" | "Lab" | "Trackers";

const TABS: FilterTab[] = ["All", "Consultations", "Prescriptions", "Lab", "Trackers"];

const typeMap: Record<HealthRecord["type"], { label: string; icon: string; color: string }> = {
  consultation: { label: "Consultation", icon: "🩺", color: "bg-emerald-50 text-emerald-700" },
  prescription: { label: "Prescription", icon: "🌿", color: "bg-amber-50 text-amber-700" },
  lab: { label: "Lab / Assessment", icon: "🔬", color: "bg-blue-50 text-blue-700" },
  tracker: { label: "Tracker Report", icon: "📊", color: "bg-purple-50 text-purple-700" },
};

const filterMap: Record<FilterTab, HealthRecord["type"] | null> = {
  All: null,
  Consultations: "consultation",
  Prescriptions: "prescription",
  Lab: "lab",
  Trackers: "tracker",
};

export default function RecordsPage() {
  const { user } = useAuth();
  const abhaId = user?.abhaLinked
    ? `${user.phone?.slice(-4) ?? ""}@abha`
    : undefined;

  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = MOCK_HEALTH_RECORDS.filter((r) => {
    const f = filterMap[activeTab];
    return !f || r.type === f;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Health Timeline</h1>
          <div className="mt-2 flex items-center gap-3">
            {abhaId ? (
              <ABHABadge abhaId={abhaId} linked />
            ) : (
              <span className="text-xs text-amber-600 font-medium">ABHA not linked</span>
            )}
            <p className="text-xs text-muted-foreground">ABDM Interoperable Health History</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-xs font-medium text-herb-green border border-herb-green/30 px-3 py-2 rounded-xl hover:bg-herb-green/5 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          Share Records
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Consultations", value: "12", icon: "🩺" },
          { label: "Prescriptions", value: "8", icon: "🌿" },
          { label: "Lab Reports", value: "5", icon: "🔬" },
          { label: "Months Active", value: "14", icon: "📅" },
          { label: "Practitioners", value: "4", icon: "👨‍⚕️" },
          { label: "Consents Active", value: "3", icon: "🔒" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-border text-center">
            <span className="text-xl">{s.icon}</span>
            <p className="font-bold text-herb-green font-display text-lg mt-1">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Timeline */}
        <div>
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all",
                  activeTab === tab
                    ? "bg-herb-green text-white border-herb-green"
                    : "border-border text-muted-foreground bg-white hover:border-herb-green/30"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Records */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-1">
              {filtered.map((record) => {
                const meta = typeMap[record.type];
                const isExpanded = expanded === record.id;
                return (
                  <div key={record.id} className="relative flex gap-4">
                    <div className="relative z-10 mt-4 w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-herb-green flex items-center justify-center">
                        <span className="text-xs">{meta.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 pb-4">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : record.id)}
                        className="w-full bg-white rounded-xl border border-border p-4 text-left hover:border-herb-green/20 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", meta.color)}>
                                {meta.label}
                              </span>
                              {record.discipline && (
                                <span className="text-[10px] text-muted-foreground">{record.discipline}</span>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold text-foreground mt-1.5">{record.title}</h3>
                            {record.doctor && (
                              <p className="text-xs text-muted-foreground mt-0.5">{record.doctor}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {new Date(record.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                              })}
                            </span>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              className={cn(
                                "text-muted-foreground transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground leading-relaxed">{record.summary}</p>
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 py-2 text-xs border border-herb-green/30 text-herb-green rounded-lg font-medium hover:bg-herb-green/5 transition-colors">
                                📥 Download
                              </button>
                              <button className="flex-1 py-2 text-xs border border-border text-muted-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                                🔗 Share via ABHA
                              </button>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl">📋</span>
                <p className="text-sm font-medium text-foreground mt-4">No records found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Book your first consultation to start your timeline
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">ABHA Linked Facilities</h3>
            {["AIIMS Delhi", "Apollo Hospitals", "Kottakkal Arya Vaidya Sala"].map((f) => (
              <div key={f} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-xs text-foreground">{f}</p>
                <span className="text-[10px] text-herb-green font-medium">Linked ✓</span>
              </div>
            ))}
          </div>

          <div className="bg-ivory-deep rounded-2xl border border-border p-4">
            <h3 className="font-semibold text-foreground text-sm mb-2">ABDM Locker</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your health records are securely stored in the ABDM Health Locker. You control all access via consent.
            </p>
            <button className="mt-3 w-full py-2 text-xs border border-herb-green/30 text-herb-green rounded-xl font-medium hover:bg-herb-green/5 transition-colors">
              Manage Consents →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Quick Actions</h3>
            {[
              { icon: "📤", label: "Upload Document" },
              { icon: "🔗", label: "Link ABHA Facility" },
              { icon: "📊", label: "Health Analytics" },
            ].map((a) => (
              <button
                key={a.label}
                className="w-full flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border last:border-0 text-left"
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
