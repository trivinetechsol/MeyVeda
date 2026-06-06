"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "intake" | "history" | "reports";

const PATIENTS: Record<string, {
  name: string; age: number; gender: string; phone: string;
  abha: string | null; prakriti: string; reason: string;
  mode: "video" | "clinic"; time: string; symptoms: string[];
  duration: string;
}> = {
  p1: {
    name: "Rohit Kumar", age: 32, gender: "Male", phone: "+91 98765 43210",
    abha: "rohit@abha", prakriti: "Vata-Pitta",
    reason: "Digestive issues and chronic fatigue for 3 weeks",
    mode: "video", time: "4:30 PM",
    symptoms: ["Fatigue", "Bloating", "Poor digestion", "Disturbed sleep", "Low appetite"],
    duration: "3 weeks · Gradually worsening",
  },
  p2: {
    name: "Meera Patel", age: 45, gender: "Female", phone: "+91 87654 32109",
    abha: "meera@abha", prakriti: "Pitta-Kapha",
    reason: "Joint pain and reduced mobility in knees and hips",
    mode: "clinic", time: "5:00 PM",
    symptoms: ["Joint pain", "Morning stiffness", "Reduced mobility", "Swelling"],
    duration: "6 months · Worsening in winters",
  },
  p3: {
    name: "Suresh Rao", age: 58, gender: "Male", phone: "+91 76543 21098",
    abha: null, prakriti: "Kapha",
    reason: "Chronic skin condition — recurring patches since last year",
    mode: "video", time: "5:30 PM",
    symptoms: ["Dry patches", "Itching", "Redness", "Scaling"],
    duration: "1 year · Recurring episodes",
  },
};

const VISITS = [
  { date: "14 Apr 2026", duration: "32 min", mode: "video", diagnosis: "Vata imbalance — digestive weakness", prescription: "Ashwagandha + Triphala + Brahmi Ghrita" },
  { date: "18 Feb 2026", duration: "28 min", mode: "video", diagnosis: "Initial assessment — Vata-Pitta Prakriti", prescription: "Lifestyle advice + Ashwagandha Churna" },
];

const REPORTS = [
  { name: "CBC Report", date: "10 Apr 2026", type: "Lab", size: "1.2 MB" },
  { name: "Liver Function Test", date: "10 Apr 2026", type: "Lab", size: "0.8 MB" },
  { name: "Previous Prescription", date: "14 Apr 2026", type: "Rx", size: "0.2 MB" },
];

export default function PatientIntakePage() {
  const params = useParams();
  const id = (params.id as string) || "p1";
  const patient = PATIENTS[id] ?? PATIENTS.p1;
  const [activeTab, setActiveTab] = useState<Tab>("intake");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
        <Link href="/pro" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{patient.name}</span>
      </div>

      {/* Patient header */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sage text-xl">{patient.name[0]}</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">{patient.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {patient.age}y · {patient.gender} · {patient.prakriti} Prakriti
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{patient.phone}</p>
              {patient.abha ? (
                <p className="text-xs text-herb-green mt-1">ABHA ✓ · {patient.abha}</p>
              ) : (
                <p className="text-xs text-amber-600 mt-1">ABHA not linked</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100">
              <span>{patient.mode === "video" ? "📹" : "🏥"}</span>
              <span className="font-medium">
                {patient.mode === "video" ? "Video" : "In-Clinic"} · {patient.time}
              </span>
            </div>
            <Link href={`/pro/emr?patient=${id}`}>
              <button className="px-4 py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                Open EMR
              </button>
            </Link>
            {patient.mode === "video" && (
              <Link href="/consult">
                <button className="px-4 py-2 bg-clinical-dark text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all">
                  📹 Start Call
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
        {(["intake", "history", "reports"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "intake" ? "Intake" : tab === "history" ? "Visit History" : "Reports"}
          </button>
        ))}
      </div>

      {activeTab === "intake" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Reason for Visit</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{patient.reason}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm text-foreground">{patient.duration}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Self-Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {patient.symptoms.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Current Medications</h3>
              <p className="text-sm text-muted-foreground">None reported · Patient denies allopathic medication use</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Known Allergies</h3>
              <p className="text-sm text-muted-foreground">No known allergies reported</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">AYUSH History</h3>
              <div className="space-y-2">
                {[
                  { label: "Prakriti (recorded)", value: patient.prakriti },
                  { label: "Prior AYUSH treatment", value: "Ayurveda" },
                  { label: "Panchakarma history", value: "None" },
                  { label: "Dietary preference", value: "Vegetarian" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ivory-deep rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Last Recorded Vitals</h3>
              <div className="space-y-1">
                {[
                  { label: "Weight", value: "72 kg" },
                  { label: "Height", value: "175 cm" },
                  { label: "BMI", value: "23.5" },
                  { label: "BP", value: "118/76 mmHg" },
                ].map((v) => (
                  <div key={v.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{v.label}</span>
                    <span className="font-medium text-foreground">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">AI Intake Summary</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patient reports {patient.symptoms.slice(0, 2).join(" and ").toLowerCase()} as primary concerns.
                Based on self-reported symptoms and {patient.prakriti} Prakriti profile, this appears consistent with a Vata aggravation pattern.
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">
                ⓘ AI summary — verify clinically. Not a diagnosis.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          {VISITS.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
              <p className="text-muted-foreground text-sm">No prior visits recorded</p>
            </div>
          ) : (
            VISITS.map((visit, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{visit.date}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visit.duration} · {visit.mode === "video" ? "Video consultation" : "In-clinic"}
                    </p>
                  </div>
                  <button className="text-xs text-herb-green font-medium hover:underline">View Notes</button>
                </div>
                <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Diagnosis:</span> {visit.diagnosis}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Prescribed:</span> {visit.prescription}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-3">
          {REPORTS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{r.type === "Lab" ? "🧪" : "📄"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.type} · {r.size}</p>
              </div>
              <button className="text-xs text-herb-green font-medium">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
