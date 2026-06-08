"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type SOAPTab = "S" | "O" | "A" | "P";

const HERB_SUGGESTIONS = [
  { name: "Ashwagandha", latin: "Withania somnifera", dosha: "Vata" },
  { name: "Brahmi", latin: "Bacopa monnieri", dosha: "All" },
  { name: "Triphala", latin: "Three-fruit combination", dosha: "All" },
  { name: "Shilajit", latin: "Mineral pitch", dosha: "Vata-Kapha" },
  { name: "Guduchi", latin: "Tinospora cordifolia", dosha: "All" },
];

const ANUPANA_OPTIONS = ["Warm water", "Warm milk", "Honey", "Ghee", "Before meals", "After meals"];
const FREQ_OPTIONS = ["Once daily", "Twice daily", "Thrice daily", "At bedtime", "As needed"];

const PATIENT_PROBLEMS: Record<string, { id: string; code: string; name: string; description: string; severity: "mild" | "moderate" | "severe"; since: string; status: "active" | "controlled" | "resolved" }[]> = {
  p1: [
    { id: "pr1", code: "GRH-V",  name: "Vataja Grahani",  description: "IBS — Vata dominant, chronic digestive weakness", severity: "moderate", since: "Feb 2026", status: "active"     },
    { id: "pr2", code: "ANX-01", name: "Anxiety / Stress", description: "Stress-induced anxiety, sleep disruption",         severity: "mild",     since: "May 2026", status: "active"     },
  ],
  p2: [
    { id: "pr3", code: "SNV-01", name: "Sandhivata",    description: "Bilateral knee osteoarthritis",              severity: "moderate", since: "Mar 2026", status: "active"     },
    { id: "pr4", code: "STH-01", name: "Sthaulya",      description: "Obesity — BMI 30.1",                         severity: "moderate", since: "Jan 2026", status: "active"     },
    { id: "pr5", code: "HTN-01", name: "Hypertension",  description: "Controlled — on Amlodipine 5mg",             severity: "mild",     since: "2020",     status: "controlled" },
  ],
  p3: [
    { id: "pr6", code: "KSH-01", name: "Kushtaroga",    description: "Recurrent plaque psoriasis — scalp + elbows", severity: "moderate", since: "2025", status: "active"     },
    { id: "pr7", code: "MDO-01", name: "Medovriddhi",   description: "Dyslipidemia — elevated LDL",                 severity: "mild",     since: "2018", status: "controlled" },
    { id: "pr8", code: "DM-02",  name: "Prameha (DM2)", description: "Diet-controlled, HbA1c 6.8%",                severity: "moderate", since: "2018", status: "controlled" },
    { id: "pr9", code: "HTN-01", name: "Hypertension",  description: "Controlled — Telmisartan 40mg",               severity: "mild",     since: "2016", status: "controlled" },
  ],
};

const COMMON_TESTS = [
  { id: "cbc",     name: "CBC",         full: "Complete Blood Count" },
  { id: "lft",     name: "LFT",         full: "Liver Function Tests" },
  { id: "kft",     name: "KFT",         full: "Kidney Function Tests" },
  { id: "fbs",     name: "FBS",         full: "Fasting Blood Sugar" },
  { id: "hba1c",   name: "HbA1c",       full: "Glycated Haemoglobin" },
  { id: "lipid",   name: "Lipid Panel", full: "Total Cholesterol / LDL / HDL / TG" },
  { id: "thyroid", name: "Thyroid",     full: "TSH + T3 + T4" },
  { id: "vitd",    name: "Vit D",       full: "25-OH Vitamin D" },
  { id: "b12",     name: "Vit B12",     full: "Vitamin B12 Level" },
  { id: "urine",   name: "Urine R/M",   full: "Urine Routine & Microscopy" },
  { id: "esr",     name: "ESR + CRP",   full: "Inflammatory Markers" },
  { id: "prakriti",name: "Prakriti",    full: "Prakriti Assessment Chart" },
];

const REFERRAL_SPECIALTIES = [
  "Cardiology", "Orthopedics", "Dermatology", "Gastroenterology",
  "Endocrinology", "Neurology", "Psychiatry / Psychology",
  "Panchakarma Specialist", "Naturopathy", "Homeopathy",
  "General Medicine", "General Surgery", "Gynaecology",
];

const ROS_SYSTEMS = [
  { system: "Constitutional",   symptoms: ["Fever", "Fatigue", "Weight loss", "Night sweats", "Poor appetite"] },
  { system: "Cardiovascular",   symptoms: ["Chest pain", "Palpitations", "Breathlessness on exertion", "Ankle swelling"] },
  { system: "Respiratory",      symptoms: ["Cough", "Wheezing", "Haemoptysis", "Shortness of breath at rest"] },
  { system: "Gastrointestinal", symptoms: ["Nausea / vomiting", "Abdominal pain", "Bloating", "Constipation", "Diarrhoea", "Blood in stool"] },
  { system: "Musculoskeletal",  symptoms: ["Joint pain", "Joint swelling", "Morning stiffness", "Muscle weakness"] },
  { system: "Neurological",     symptoms: ["Headache", "Dizziness / vertigo", "Numbness / tingling", "Memory issues"] },
  { system: "Skin",             symptoms: ["Rash", "Itching / pruritus", "Hair loss", "Skin discolouration"] },
  { system: "Genitourinary",    symptoms: ["Burning micturition", "Increased frequency", "Nocturia", "Haematuria"] },
];

function EMRContent() {
  const params = useSearchParams();
  const isWalkIn = params.get("walkIn") === "1";

  // Walk-in patient details from URL
  const walkInName    = params.get("wn") ?? "";
  const walkInPhone   = params.get("wp") ?? "";
  const walkInGender  = params.get("wg") ?? "";
  const walkInDob     = params.get("wdob") ?? "";
  const walkInBlood   = params.get("wbg") ?? "";
  const walkInMode    = params.get("wm") ?? "clinic";
  const walkInSystem  = params.get("ws") ?? "Ayurveda";
  const walkInPriority = params.get("wpr") ?? "normal";
  const walkInAllergies = params.get("wa") ?? "";
  const walkInComplaint = params.get("wc") ?? "";
  const walkInDuration  = params.get("wd") ?? "";

  // Regular (scheduled) patient
  const patientId = params.get("patient") ?? "p1";
  const scheduledName = patientId === "p1" ? "Rohit Kumar" : patientId === "p2" ? "Meera Patel" : "Suresh Rao";

  const patientName = isWalkIn ? walkInName : scheduledName;
  const patientAge  = isWalkIn ? (walkInDob ? `${new Date().getFullYear() - new Date(walkInDob).getFullYear()}y` : "") : "32y";
  const patientDemo = isWalkIn
    ? [patientAge, walkInGender, walkInBlood].filter(Boolean).join(" · ")
    : "32y · Male · Vata-Pitta Prakriti";

  // Vitals
  const [vitals, setVitals] = useState({ bpSys: "", bpDia: "", pulse: "", temp: "", spo2: "", rr: "", weight: "", height: "" });
  const [vitalsSaved, setVitalsSaved] = useState(false);
  const bmi = vitals.weight && vitals.height
    ? (parseFloat(vitals.weight) / Math.pow(parseFloat(vitals.height) / 100, 2)).toFixed(1)
    : null;
  const bmiStatus = bmi ? (parseFloat(bmi) < 18.5 ? "warning" : parseFloat(bmi) < 25 ? "normal" : parseFloat(bmi) < 30 ? "warning" : "alert") : "normal";

  function vitalStatus(key: string, val: string): "normal" | "warning" | "alert" {
    const n = parseFloat(val);
    if (!val || isNaN(n)) return "normal";
    if (key === "bpSys")  return n < 90 ? "alert"  : n <= 120 ? "normal" : n <= 139 ? "warning" : "alert";
    if (key === "bpDia")  return n < 60 ? "warning" : n <= 80  ? "normal" : n <= 89  ? "warning" : "alert";
    if (key === "pulse")  return n < 60 || n > 100  ? "warning" : "normal";
    if (key === "temp")   return n < 97 ? "warning" : n <= 99  ? "normal" : n <= 100.4 ? "warning" : "alert";
    if (key === "spo2")   return n < 90 ? "alert"   : n < 95   ? "warning" : "normal";
    if (key === "rr")     return n < 12 || n > 20   ? "warning" : "normal";
    return "normal";
  }
  const statusStyle = { normal: "bg-herb-green/10 text-herb-green border-herb-green/20", warning: "bg-amber-50 text-amber-700 border-amber-200", alert: "bg-red-50 text-red-600 border-red-200" };

  const [activeTab, setActiveTab] = useState<SOAPTab>("S");
  const [herbSearch, setHerbSearch] = useState("");
  const [showHerbSuggestions, setShowHerbSuggestions] = useState(false);
  const [selectedHerbs, setSelectedHerbs] = useState<typeof HERB_SUGGESTIONS>([]);
  // Pre-fill S field for both new walk-ins AND returning patients arriving via walk-in flow
  const initialS = walkInComplaint
    ? `Chief complaint: ${walkInComplaint}${walkInDuration ? `\nDuration: ${walkInDuration}` : ""}${walkInAllergies ? `\nAllergies: ${walkInAllergies}` : ""}`
    : "";
  const [notes, setNotes] = useState({ S: initialS, O: "", A: "", P: "" });
  const [signed, setSigned] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpScheduled, setFollowUpScheduled] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Problem list
  const [problems, setProblems] = useState(() =>
    isWalkIn ? [] : (PATIENT_PROBLEMS[patientId] ?? []).map(p => ({ ...p }))
  );
  const [problemsOpen, setProblemsOpen] = useState(true);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [newProblem, setNewProblem] = useState({ name: "", code: "", severity: "moderate" as "mild" | "moderate" | "severe", notes: "" });

  // Investigation orders
  const [orderedTests, setOrderedTests] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState("");
  const [ordersOpen, setOrdersOpen] = useState(false);

  // Referral
  const [referral, setReferral] = useState({ specialty: "", urgency: "routine" as "routine" | "urgent" | "emergent", indication: "" });
  const [referralCreated, setReferralCreated] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

  // Review of Systems
  const [rosOpen, setRosOpen] = useState(false);
  const [rosChecked, setRosChecked] = useState<Record<string, boolean>>({});

  const filteredHerbs = HERB_SUGGESTIONS.filter(
    (h) =>
      !selectedHerbs.find((s) => s.name === h.name) &&
      h.name.toLowerCase().includes(herbSearch.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Walk-in banner — new patient */}
      {isWalkIn && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-xl">🚶</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">Walk-in Patient — Not yet registered</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {walkInMode === "video" ? "📹 Video" : "🏥 In-Clinic"} · {walkInSystem} · Priority: {walkInPriority === "urgent" ? "🟡 Urgent" : "🟢 Routine"}
            </p>
          </div>
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full flex-shrink-0">New</span>
        </div>
      )}
      {/* Walk-in banner — returning (existing) patient */}
      {!isWalkIn && walkInComplaint && (
        <div className="mb-5 bg-herb-green/5 border border-herb-green/20 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-xl">🚶</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-herb-green">Returning Walk-in · {patientName}</p>
            <p className="text-xs text-herb-green/70 mt-0.5">
              {walkInMode === "video" ? "📹 Video" : "🏥 In-Clinic"} · {walkInSystem} · Priority: {walkInPriority === "urgent" ? "🟡 Urgent" : "🟢 Routine"} · Chief complaint pre-filled below
            </p>
          </div>
          <span className="text-xs font-semibold bg-herb-green/10 text-herb-green border border-herb-green/20 px-2.5 py-1 rounded-full flex-shrink-0">Registered</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">EMR Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Session with {patientName} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs font-medium border border-border px-3 py-2 rounded-xl hover:bg-muted transition-colors">
            Save Draft
          </button>
          <button
            onClick={() => setSigned(true)}
            className="flex items-center gap-2 text-xs font-semibold bg-herb-green text-white px-4 py-2 rounded-xl hover:bg-herb-green/90 transition-colors"
          >
            ✍️ Sign & Send
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: SOAP Notes */}
        <div className="space-y-5">
          {/* Patient quick info */}
          <div className={cn("bg-white rounded-2xl border p-4 flex items-center gap-4", isWalkIn ? "border-amber-200 bg-amber-50/50" : "border-border")}>
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", isWalkIn ? "bg-amber-100" : "bg-sage/20")}>
              <span className={cn("font-bold", isWalkIn ? "text-amber-700" : "text-sage")}>{patientName[0]}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{patientName}</p>
              <p className="text-xs text-muted-foreground">{patientDemo}</p>
              {isWalkIn && walkInPhone && <p className="text-xs text-muted-foreground">📱 +91 {walkInPhone}</p>}
            </div>
            {isWalkIn ? (
              <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                Walk-in
              </span>
            ) : (
              <span className="text-[10px] bg-herb-green/10 text-herb-green font-medium px-2 py-0.5 rounded-full">
                ABHA ✓
              </span>
            )}
          </div>

          {/* Problem List */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setProblemsOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Problem List</h3>
                {problems.filter(p => p.status === "active").length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                    {problems.filter(p => p.status === "active").length} active
                  </span>
                )}
                {problems.filter(p => p.status === "controlled").length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {problems.filter(p => p.status === "controlled").length} controlled
                  </span>
                )}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", problemsOpen ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {problemsOpen && (
              <div className="border-t border-border">
                {problems.length > 0 ? (
                  <div className="divide-y divide-border">
                    {problems.map(p => (
                      <div key={p.id} className="flex items-start gap-3 px-5 py-3">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                          p.status === "active" ? "bg-red-400" : p.status === "controlled" ? "bg-amber-400" : "bg-herb-green"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{p.name}</p>
                            <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{p.code}</span>
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                              p.severity === "severe" ? "bg-red-50 text-red-600" : p.severity === "moderate" ? "bg-amber-50 text-amber-700" : "bg-herb-green/10 text-herb-green"
                            )}>{p.severity}</span>
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                              p.status === "active" ? "bg-red-50 text-red-600" : p.status === "controlled" ? "bg-amber-50 text-amber-700" : "bg-herb-green/10 text-herb-green"
                            )}>{p.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Since {p.since}</p>
                        </div>
                        <button
                          onClick={() => setProblems(prev => prev.filter(x => x.id !== p.id))}
                          className="text-muted-foreground hover:text-red-500 transition-colors mt-0.5 flex-shrink-0"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-5 py-4 text-xs text-muted-foreground italic">No active problems recorded</p>
                )}

                {showAddProblem ? (
                  <div className="px-5 pb-4 pt-2 border-t border-border space-y-2.5">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        className="col-span-2 px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50"
                        placeholder="Problem / diagnosis name"
                        value={newProblem.name}
                        onChange={e => setNewProblem(p => ({ ...p, name: e.target.value }))}
                      />
                      <input
                        className="px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50 font-mono uppercase"
                        placeholder="Code"
                        value={newProblem.code}
                        onChange={e => setNewProblem(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newProblem.severity}
                        onChange={e => setNewProblem(p => ({ ...p, severity: e.target.value as "mild" | "moderate" | "severe" }))}
                        className="px-3 py-2 text-xs border border-border rounded-lg focus:outline-none bg-white"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                      <input
                        className="px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50"
                        placeholder="Brief description"
                        value={newProblem.notes}
                        onChange={e => setNewProblem(p => ({ ...p, notes: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!newProblem.name.trim()) return;
                          setProblems(prev => [...prev, {
                            id: `new-${Date.now()}`, code: newProblem.code || "NEW",
                            name: newProblem.name.trim(), description: newProblem.notes,
                            severity: newProblem.severity,
                            since: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
                            status: "active",
                          }]);
                          setNewProblem({ name: "", code: "", severity: "moderate", notes: "" });
                          setShowAddProblem(false);
                        }}
                        disabled={!newProblem.name.trim()}
                        className={cn("flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                          newProblem.name.trim() ? "bg-herb-green text-white hover:bg-herb-green/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >Add to Problem List</button>
                      <button onClick={() => setShowAddProblem(false)}
                        className="px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 pb-3 pt-2 border-t border-border">
                    <button onClick={() => setShowAddProblem(true)}
                      className="flex items-center gap-1.5 text-xs text-herb-green font-semibold hover:underline">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add Problem
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vitals Recording */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Record Vitals</h3>
                {vitalsSaved && (
                  <span className="text-[10px] bg-herb-green/10 text-herb-green font-semibold px-2 py-0.5 rounded-full border border-herb-green/20">Saved ✓</span>
                )}
              </div>
              {vitalsSaved && (
                <button onClick={() => setVitalsSaved(false)} className="text-xs text-herb-green font-medium hover:underline">Edit</button>
              )}
            </div>

            {vitalsSaved ? (
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "BP",   value: `${vitals.bpSys}/${vitals.bpDia}`, unit: "mmHg", key: "bpSys" },
                  { label: "Pulse", value: vitals.pulse, unit: "bpm",  key: "pulse" },
                  { label: "Temp",  value: vitals.temp,  unit: "°F",   key: "temp"  },
                  { label: "SpO₂",  value: vitals.spo2,  unit: "%",    key: "spo2"  },
                  { label: "RR",    value: vitals.rr,    unit: "/min", key: "rr"    },
                  { label: "Wt",    value: vitals.weight, unit: "kg",  key: "weight"},
                  ...(bmi ? [{ label: "BMI", value: bmi, unit: "", key: "bmi" }] : []),
                ].filter(v => v.value && v.value !== "/").map(v => (
                  <span key={v.label} className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusStyle[v.key === "bmi" ? bmiStatus : vitalStatus(v.key, v.value)])}>
                    {v.label} {v.value}{v.unit}
                  </span>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {([
                    { key: "bpSys",  label: "BP Systolic",  unit: "mmHg", placeholder: "118" },
                    { key: "bpDia",  label: "BP Diastolic", unit: "mmHg", placeholder: "76"  },
                    { key: "pulse",  label: "Pulse",        unit: "bpm",  placeholder: "72"  },
                    { key: "temp",   label: "Temperature",  unit: "°F",   placeholder: "98.6"},
                    { key: "spo2",   label: "SpO₂",         unit: "%",    placeholder: "98"  },
                    { key: "rr",     label: "Resp. Rate",   unit: "/min", placeholder: "16"  },
                    { key: "weight", label: "Weight",       unit: "kg",   placeholder: "70"  },
                    { key: "height", label: "Height",       unit: "cm",   placeholder: "170" },
                  ] as const).map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">{f.label}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={vitals[f.key]}
                          onChange={e => setVitals(v => ({ ...v, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className={cn(
                            "w-full px-2.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-herb-green/50 pr-10",
                            vitals[f.key] && vitalStatus(f.key, vitals[f.key]) !== "normal"
                              ? vitalStatus(f.key, vitals[f.key]) === "alert" ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"
                              : "border-border"
                          )}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{f.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  {bmi ? (
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusStyle[bmiStatus])}>
                      BMI {bmi} — {parseFloat(bmi) < 18.5 ? "Underweight" : parseFloat(bmi) < 25 ? "Normal" : parseFloat(bmi) < 30 ? "Overweight" : "Obese"}
                    </span>
                  ) : <span />}
                  <button
                    onClick={() => setVitalsSaved(true)}
                    disabled={!vitals.bpSys && !vitals.pulse}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                      vitals.bpSys || vitals.pulse
                        ? "bg-herb-green text-white hover:bg-herb-green/90 active:scale-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Record Vitals ✓
                  </button>
                </div>
              </>
            )}
          </div>

          {/* AYUSH Assessment */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">AYUSH Assessment</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Prakriti", options: ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha"] },
                { label: "Nadi", options: ["Vata", "Pitta", "Kapha", "Mixed"] },
                { label: "Jihva", options: ["Clean", "Mild coating", "Heavy coating"] },
                { label: "Agni", options: ["Sama", "Vishama", "Teekshna", "Manda"] },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <select className="w-full text-xs border border-border rounded-lg px-2.5 py-2 focus:outline-none focus:border-herb-green/50 bg-white">
                    {field.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* SOAP Tabs */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex gap-1 mb-4 bg-muted rounded-xl p-1">
              {(["S", "O", "A", "P"] as SOAPTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                    activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab} — {
                    tab === "S" ? "Subjective" :
                    tab === "O" ? "Objective" :
                    tab === "A" ? "Assessment" : "Plan"
                  }
                </button>
              ))}
            </div>
            <textarea
              rows={6}
              value={notes[activeTab]}
              onChange={(e) => setNotes((prev) => ({ ...prev, [activeTab]: e.target.value }))}
              placeholder={
                activeTab === "S" ? "Patient's chief complaint, history, symptoms…" :
                activeTab === "O" ? "Pulse (Nadi), tongue (Jihva), clinical findings…" :
                activeTab === "A" ? "Diagnosis, Dosha analysis, Prakriti assessment…" :
                "Treatment plan, formulations, Panchakarma, lifestyle…"
              }
              className="w-full text-sm resize-none focus:outline-none placeholder:text-muted-foreground leading-relaxed"
            />
          </div>

          {/* Herb Dictionary */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Add Herbal Remedy</h3>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search herbs, formulations…"
                value={herbSearch}
                onChange={(e) => { setHerbSearch(e.target.value); setShowHerbSuggestions(true); }}
                onFocus={() => setShowHerbSuggestions(true)}
                onBlur={() => setTimeout(() => setShowHerbSuggestions(false), 150)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-herb-green/50 placeholder:text-muted-foreground"
              />
              {showHerbSuggestions && filteredHerbs.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                  {filteredHerbs.map((h) => (
                    <button
                      key={h.name}
                      onMouseDown={() => {
                        setSelectedHerbs((prev) => [...prev, h]);
                        setHerbSearch("");
                        setShowHerbSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <span className="text-base">🌿</span>
                      <div>
                        <p className="font-medium text-foreground">{h.name}</p>
                        <p className="text-[10px] text-muted-foreground">{h.latin} · Dosha: {h.dosha}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedHerbs.length > 0 && (
              <div className="space-y-3">
                {selectedHerbs.map((herb, i) => (
                  <div key={i} className="p-3 bg-herb-green/4 rounded-xl border border-herb-green/15">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{herb.name}</p>
                        <p className="text-[10px] text-muted-foreground">{herb.latin}</p>
                      </div>
                      <button
                        onClick={() => setSelectedHerbs((prev) => prev.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Dose</label>
                        <input
                          type="text"
                          defaultValue="1 tsp"
                          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Frequency</label>
                        <select className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50 bg-white">
                          {FREQ_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Anupana</label>
                        <select className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50 bg-white">
                          {ANUPANA_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review of Systems */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setRosOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Review of Systems</h3>
                {Object.values(rosChecked).filter(Boolean).length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {Object.values(rosChecked).filter(Boolean).length} flagged
                  </span>
                )}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", rosOpen ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {rosOpen && (
              <div className="border-t border-border px-5 py-4 space-y-4">
                {ROS_SYSTEMS.map(sys => (
                  <div key={sys.system}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{sys.system}</p>
                    <div className="flex flex-wrap gap-2">
                      {sys.symptoms.map(sym => {
                        const key = `${sys.system}::${sym}`;
                        const checked = rosChecked[key] ?? false;
                        return (
                          <button key={sym} onClick={() => setRosChecked(prev => ({ ...prev, [key]: !checked }))}
                            className={cn("text-xs px-3 py-1.5 rounded-full border transition-all",
                              checked ? "bg-amber-50 text-amber-700 border-amber-300 font-semibold" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                            )}>
                            {checked ? "⚠ " : ""}{sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {Object.values(rosChecked).filter(Boolean).length > 0 && (
                  <div className="mt-2 pt-3 border-t border-border">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Positive findings</p>
                    <p className="text-xs text-foreground leading-relaxed">
                      {Object.entries(rosChecked).filter(([,v]) => v).map(([k]) => k.split("::")[1]).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Investigation Orders */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOrdersOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Investigation Orders</h3>
                {orderedTests.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-herb-green/10 text-herb-green border border-herb-green/20">
                    {orderedTests.length} ordered
                  </span>
                )}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", ordersOpen ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {ordersOpen && (
              <div className="border-t border-border px-5 py-4 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Common tests</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TESTS.map(t => {
                      const selected = orderedTests.includes(t.id);
                      return (
                        <button key={t.id}
                          onClick={() => setOrderedTests(prev => selected ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                          title={t.full}
                          className={cn("text-xs px-3 py-1.5 rounded-full border transition-all",
                            selected ? "bg-herb-green text-white border-herb-green" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                          )}>
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:border-herb-green/50"
                    placeholder="Add custom test or investigation…"
                    value={customTest}
                    onChange={e => setCustomTest(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && customTest.trim()) {
                        const id = `custom-${Date.now()}`;
                        setOrderedTests(prev => [...prev, id]);
                        COMMON_TESTS.push({ id, name: customTest.trim(), full: customTest.trim() });
                        setCustomTest("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (!customTest.trim()) return;
                      const id = `custom-${Date.now()}`;
                      setOrderedTests(prev => [...prev, id]);
                      COMMON_TESTS.push({ id, name: customTest.trim(), full: customTest.trim() });
                      setCustomTest("");
                    }}
                    className="px-3 py-2 bg-herb-green/10 text-herb-green text-xs font-semibold rounded-lg hover:bg-herb-green/20 transition-colors"
                  >Add</button>
                </div>
                {orderedTests.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Order list</p>
                    <div className="space-y-1.5">
                      {orderedTests.map(tid => {
                        const test = COMMON_TESTS.find(t => t.id === tid);
                        if (!test) return null;
                        return (
                          <div key={tid} className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                            <div>
                              <span className="font-semibold text-foreground">{test.name}</span>
                              {test.name !== test.full && <span className="text-muted-foreground ml-1.5">{test.full}</span>}
                            </div>
                            <button onClick={() => setOrderedTests(prev => prev.filter(x => x !== tid))}
                              className="text-muted-foreground hover:text-red-500 transition-colors ml-2">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button className="mt-3 w-full py-2 border border-herb-green text-herb-green text-xs font-semibold rounded-xl hover:bg-herb-green/5 transition-colors">
                      🖨 Print / Send to Lab
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Referral */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setReferralOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Referral</h3>
                {referralCreated && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-herb-green/10 text-herb-green border border-herb-green/20">Created ✓</span>
                )}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", referralOpen ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {referralOpen && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                {referralCreated ? (
                  <div className="flex items-center gap-3 bg-herb-green/5 rounded-xl border border-herb-green/20 p-4">
                    <div className="w-8 h-8 rounded-full bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="text-herb-green" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Referral to {referral.specialty}</p>
                      <p className="text-xs text-muted-foreground">{referral.urgency.charAt(0).toUpperCase() + referral.urgency.slice(1)} · {referral.indication}</p>
                    </div>
                    <button onClick={() => setReferralCreated(false)} className="text-xs text-muted-foreground hover:underline">Edit</button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Refer to Specialty</label>
                        <select
                          value={referral.specialty}
                          onChange={e => setReferral(r => ({ ...r, specialty: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-border rounded-lg focus:outline-none bg-white"
                        >
                          <option value="">Select specialty…</option>
                          {REFERRAL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Urgency</label>
                        <div className="flex gap-1.5">
                          {(["routine", "urgent", "emergent"] as const).map(u => (
                            <button key={u} onClick={() => setReferral(r => ({ ...r, urgency: u }))}
                              className={cn("flex-1 py-2 rounded-lg text-[10px] font-semibold capitalize border transition-all",
                                referral.urgency === u
                                  ? u === "emergent" ? "bg-red-500 text-white border-red-500" : u === "urgent" ? "bg-amber-500 text-white border-amber-500" : "bg-herb-green text-white border-herb-green"
                                  : "bg-muted text-muted-foreground border-transparent hover:border-border"
                              )}>
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Clinical Indication</label>
                      <textarea
                        rows={2}
                        value={referral.indication}
                        onChange={e => setReferral(r => ({ ...r, indication: e.target.value }))}
                        placeholder="Brief reason for referral, relevant findings…"
                        className="w-full px-3 py-2 text-xs border border-border rounded-lg focus:outline-none resize-none placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      onClick={() => { if (referral.specialty && referral.indication.trim()) setReferralCreated(true); }}
                      disabled={!referral.specialty || !referral.indication.trim()}
                      className={cn("w-full py-2.5 rounded-xl text-xs font-semibold transition-all",
                        referral.specialty && referral.indication.trim()
                          ? "bg-herb-green text-white hover:bg-herb-green/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      Create Referral
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right: Summary panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5 sticky top-20">
            <h3 className="font-semibold text-foreground text-sm mb-4">Prescription Preview</h3>
            {selectedHerbs.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl">🌿</span>
                <p className="text-xs text-muted-foreground mt-2">Add herbal remedies to preview</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedHerbs.map((herb, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-herb-green/4 rounded-lg">
                    <span className="text-sm mt-0.5">🌿</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{herb.name}</p>
                      <p className="text-[10px] text-muted-foreground">1 tsp · Twice daily</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-border space-y-2">
              <button
                onClick={() => setSigned(true)}
                className="w-full py-2.5 bg-herb-green text-white rounded-xl text-xs font-semibold hover:bg-herb-green/90 transition-all"
              >
                ✍️ Sign & Upload to ABHA
              </button>
              <button className="w-full py-2.5 border border-border text-xs font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                📥 Save as PDF
              </button>
            </div>
          </div>

          <div className="bg-ivory-deep rounded-2xl border border-border p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Digital Signature
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prescriptions signed here are ABDM-linked and will appear in the patient&apos;s ABHA health locker.
            </p>
          </div>
        </div>
      </div>

      {/* Post-sign overlay */}
      {signed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-herb-green/10 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="text-herb-green" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Prescription Signed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isWalkIn ? `Prescription ready for ${patientName}` : `Uploaded to ${patientName}'s ABHA health locker`}
              </p>
              {!isWalkIn && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-herb-green font-medium bg-herb-green/10 px-3 py-1 rounded-full">
                  ✓ ABDM synced
                </span>
              )}
            </div>

            {/* Walk-in: prompt to register patient first */}
            {isWalkIn && !registered && (
              <div className="mb-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                  <p className="text-sm font-semibold text-amber-900">Register this patient?</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Adding {patientName} to the system lets them book appointments, receive ABHA links, and access their prescription history.
                  </p>
                </div>
                <button
                  onClick={() => setRegistered(true)}
                  className="w-full py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-all mb-2"
                >
                  ✓ Add to Patient Registry
                </button>
                <button
                  onClick={() => setRegistered(true)}
                  className="w-full py-2 text-xs font-medium text-muted-foreground hover:underline transition-colors"
                >
                  Skip — patient prefers not to register
                </button>
              </div>
            )}

            {/* Walk-in: registered confirmation */}
            {isWalkIn && registered && (
              <div className="bg-herb-green/5 border border-herb-green/20 rounded-xl p-4 mb-4 text-center">
                <p className="text-sm font-semibold text-herb-green">Patient Registered ✓</p>
                <p className="text-xs text-muted-foreground mt-1">{patientName} added to the patient registry</p>
              </div>
            )}

            {(!isWalkIn || registered) && !followUpScheduled ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground text-center">Schedule a Follow-up?</p>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-1.5">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full text-sm border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:border-herb-green/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-1.5">
                    Reason (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    placeholder="e.g. Reassess treatment response after 2 weeks"
                    className="w-full text-sm border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-herb-green/50 placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  onClick={() => setFollowUpScheduled(true)}
                  disabled={!followUpDate}
                  className={cn(
                    "w-full py-2.5 text-sm font-semibold rounded-xl transition-all",
                    followUpDate ? "bg-herb-green text-white hover:bg-herb-green/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Schedule & Notify Patient
                </button>
                <Link href="/pro" className="block">
                  <button className="w-full py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                    Skip — Return to Dashboard
                  </button>
                </Link>
              </div>
            ) : (!isWalkIn || registered) && followUpScheduled ? (
              <div className="space-y-3 text-center">
                <div className="bg-herb-green/5 border border-herb-green/20 rounded-xl p-4">
                  <p className="text-sm font-semibold text-herb-green">Follow-up Scheduled ✓</p>
                  <p className="text-xs text-muted-foreground mt-1">{followUpDate} · Patient notified via app</p>
                </div>
                <Link href="/pro">
                  <button className="w-full py-3 bg-herb-green text-white text-sm font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                    Return to Dashboard
                  </button>
                </Link>
                <Link href="/pro/prescriptions">
                  <button className="w-full py-2.5 border border-border text-xs font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                    View All Prescriptions
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EMRPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-herb-green border-t-transparent animate-spin" />
      </div>
    }>
      <EMRContent />
    </Suspense>
  );
}
