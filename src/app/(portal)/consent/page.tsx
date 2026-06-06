"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ConsentTab = "active" | "expired";

const ACTIVE_CONSENTS = [
  {
    id: "c1",
    requester: "Dr. Aditi Shastri",
    org: "Holistic Wellness Clinic",
    purpose: "Teleconsultation & Prescription",
    dataTypes: ["EMR", "Prescriptions", "Vitals"],
    grantedOn: "05 Jun 2026",
    expiresIn: "25 days",
    icon: "🩺",
  },
  {
    id: "c2",
    requester: "MeyVeda Apothecary",
    org: "MeyVeda Health",
    purpose: "Order Processing & Dispensing",
    dataTypes: ["Prescriptions", "Address"],
    grantedOn: "05 Jun 2026",
    expiresIn: "7 days",
    icon: "🏥",
  },
  {
    id: "c3",
    requester: "Apollo Hospitals",
    org: "Apollo Health & Lifestyle",
    purpose: "Emergency Records Access",
    dataTypes: ["EMR", "Lab Reports", "Allergies"],
    grantedOn: "01 Jun 2026",
    expiresIn: "12 days",
    icon: "🏨",
  },
];

const EXPIRED_CONSENTS = [
  {
    id: "e1",
    requester: "Dr. Ramesh Iyer",
    org: "Ayush Naturopathy Centre",
    purpose: "Naturopathy Consultation",
    dataTypes: ["Vitals", "Lifestyle Data"],
    grantedOn: "10 Apr 2026",
    expiredOn: "10 May 2026",
    icon: "🌿",
  },
];

export default function ConsentPage() {
  const [activeTab, setActiveTab] = useState<ConsentTab>("active");
  const [revoking, setRevoking] = useState<string | null>(null);
  const [consents, setConsents] = useState(ACTIVE_CONSENTS);

  function handleRevoke(id: string) {
    setTimeout(() => {
      setConsents((prev) => prev.filter((c) => c.id !== id));
      setRevoking(null);
    }, 1000);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">ABDM Consent Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control who accesses your health records. All consents are ABDM-compliant.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.45 0.14 250)" strokeWidth={2} className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-blue-800 leading-relaxed">
          Your health data is protected under the DPDP Act 2023. You can revoke any consent at any time. Revoking consent does not delete previously shared data from the requester&apos;s system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left: Consents list */}
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {(["active", "expired"] as ConsentTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-full border capitalize transition-all",
                  activeTab === tab
                    ? "bg-herb-green text-white border-herb-green"
                    : "border-border text-muted-foreground bg-white hover:border-herb-green/30"
                )}
              >
                {tab} ({tab === "active" ? consents.length : EXPIRED_CONSENTS.length})
              </button>
            ))}
          </div>

          {activeTab === "active" && (
            <div className="space-y-3">
              {consents.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl">🔒</span>
                  <p className="text-sm font-medium text-foreground mt-3">No active consents</p>
                  <p className="text-xs text-muted-foreground mt-1">All consents have been revoked</p>
                </div>
              )}
              {consents.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{c.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{c.requester}</p>
                          <p className="text-xs text-muted-foreground">{c.org}</p>
                        </div>
                        <span className="flex-shrink-0 text-[10px] bg-herb-green/10 text-herb-green font-semibold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-foreground mt-2 font-medium">{c.purpose}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.dataTypes.map((d) => (
                          <span key={d} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {d}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-[10px] text-muted-foreground">
                          Granted: {c.grantedOn} · Expires in{" "}
                          <span className={cn("font-semibold", parseInt(c.expiresIn) <= 7 ? "text-amber-600" : "text-herb-green")}>
                            {c.expiresIn}
                          </span>
                        </p>
                        <button
                          onClick={() => setRevoking(c.id)}
                          className="text-[10px] text-red-600 font-semibold border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "expired" && (
            <div className="space-y-3">
              {EXPIRED_CONSENTS.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-border p-5 opacity-60">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{c.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{c.requester}</p>
                          <p className="text-xs text-muted-foreground">{c.org}</p>
                        </div>
                        <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full">
                          Expired
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expired: {c.expiredOn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Consent Summary</h3>
            {[
              { label: "Active Consents", value: consents.length, color: "text-herb-green" },
              { label: "Expired", value: EXPIRED_CONSENTS.length, color: "text-muted-foreground" },
              { label: "Revoked (all time)", value: 2, color: "text-red-500" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("text-sm font-bold", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-ivory-deep rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-2">Your Rights</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {[
                "Right to grant consent",
                "Right to revoke consent",
                "Right to access your data",
                "Right to data portability",
                "Right to erasure request",
              ].map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="oklch(0.29 0.09 158)" strokeWidth={2.5}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Revoke confirmation modal */}
      {revoking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-display font-semibold text-foreground text-center">Revoke Consent?</h3>
            <p className="text-sm text-muted-foreground text-center mt-2 leading-relaxed">
              This will immediately revoke the data access grant. Previously shared data may still be retained by the requester.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setRevoking(null)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevoke(revoking)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
