"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

const FORMULATIONS = [
  {
    name: "Ashwagandha Churna",
    dose: "1 tsp",
    freq: "Twice daily",
    vehicle: "Warm milk",
    duration: "60 days",
    icon: "🌿",
  },
  {
    name: "Triphala Churna",
    dose: "1 tsp",
    freq: "At bedtime",
    vehicle: "Warm water",
    duration: "45 days",
    icon: "🫙",
  },
  {
    name: "Brahmi Ghrita",
    dose: "½ tsp",
    freq: "Morning",
    vehicle: "Before breakfast",
    duration: "30 days",
    icon: "💛",
  },
];

const LIFESTYLE = [
  { icon: "🧘", title: "Yoga", desc: "Bhujangasana, Paschimottanasana — 20 min daily" },
  { icon: "🌅", title: "Dinacharya", desc: "Wake by 6 AM, oil pulling, tongue scraping" },
  { icon: "🥗", title: "Ahara", desc: "Avoid spicy, oily foods. Prefer warm, cooked meals" },
  { icon: "🌙", title: "Sleep", desc: "Retire by 10 PM. Avoid screens 1 hour before sleep" },
];

export default function PrescriptionPage() {
  const { user } = useAuth();
  const patientName = user?.name ?? "Patient";
  const patientInitials = patientName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const abhaId = user?.abhaLinked ? `${user.phone?.slice(-4) ?? ""}@abha` : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Digital Care Plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Prescribed by Dr. Aditi Shastri · Consultation 05 Jun 2026
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 text-xs font-medium border border-border px-3 py-2 rounded-xl hover:bg-muted transition-colors">
            📥 Download PDF
          </button>
          <Link href="/apothecary">
            <button className="flex items-center gap-2 text-xs font-semibold bg-herb-green text-white px-4 py-2 rounded-xl hover:bg-herb-green/90 transition-colors">
              🛒 Order Medicines
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Prescription content */}
        <div className="space-y-5">
          {/* Doctor + Patient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-herb-gradient rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-20 h-20 rounded-full bg-white/5" />
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2">Practitioner</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                  <span className="text-white font-bold">AS</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Dr. Aditi Shastri</p>
                  <p className="text-xs text-white/70">BAMS, MD (Ayu)</p>
                  <p className="text-[10px] text-white/60 mt-0.5">HPR-4902-8822</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Patient</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center">
                  <span className="text-sage font-bold">{patientInitials}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{patientName}</p>
                  <p className="text-xs text-muted-foreground">+91 {user?.phone ?? "—"}</p>
                  {abhaId ? (
                    <p className="text-[10px] text-herb-green mt-0.5">ABHA Linked ✓ · {abhaId}</p>
                  ) : (
                    <p className="text-[10px] text-amber-600 mt-0.5">ABHA not linked</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Assessment */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground text-sm mb-4">Clinical Assessment</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Prakriti", value: "Vata-Pitta" },
                { label: "Nadi", value: "Vata dominant" },
                { label: "Jihva", value: "Mild coating" },
                { label: "Agni", value: "Vishamagni" },
              ].map((a) => (
                <div key={a.label} className="bg-background rounded-xl p-3 text-center border border-border">
                  <p className="text-xs font-semibold text-foreground">{a.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 font-medium">Chief Complaint</p>
              <p className="text-xs text-amber-700 mt-1">
                Chronic fatigue, digestive irregularity, disturbed sleep pattern. Mild Vata aggravation noted.
              </p>
            </div>
          </div>

          {/* Formulations */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground text-sm mb-4">Prescribed Formulations</h2>
            <div className="space-y-3">
              {FORMULATIONS.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-herb-green/4 rounded-xl border border-herb-green/15">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>💊 {item.dose}</span>
                      <span>⏰ {item.freq}</span>
                      <span>🫖 With {item.vehicle}</span>
                      <span>📅 {item.duration}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-herb-green/10 text-herb-green font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                    Rx
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground text-sm mb-4">Lifestyle Guidance (Pathya)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LIFESTYLE.map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 bg-background border border-border rounded-xl">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Follow-up Schedule</h3>
            <div className="flex items-center gap-3 p-3 bg-herb-green/5 border border-herb-green/20 rounded-xl">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm font-semibold text-foreground">5th July 2026</p>
                <p className="text-xs text-muted-foreground">30-day review with Dr. Shastri</p>
              </div>
            </div>
            <button className="mt-3 w-full py-2 text-xs border border-herb-green/30 text-herb-green rounded-xl font-medium hover:bg-herb-green/5 transition-colors">
              Book Follow-up →
            </button>
          </div>

          <div className="bg-ivory-deep rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-2">Disclaimer</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This prescription is intended for the named patient only. Dosages are based on Prakriti assessment. Do not self-medicate. Contact Dr. Shastri if symptoms worsen.
            </p>
          </div>

          <Link href="/apothecary">
            <div className="bg-herb-green/6 rounded-2xl border border-herb-green/20 p-5 flex items-center gap-3 hover:bg-herb-green/10 transition-colors cursor-pointer">
              <span className="text-3xl">🏥</span>
              <div>
                <p className="text-sm font-semibold text-foreground">Order from Apothecary</p>
                <p className="text-xs text-muted-foreground mt-0.5">Get all 3 formulations delivered</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
