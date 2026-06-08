"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Filter = "all" | "today" | "followup" | "recent";

type Problem = { code: string; name: string; status: "active" | "controlled" | "resolved" };

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abha: string | null;
  bloodGroup: string;
  prakriti: string;
  lastVisit: string;        // display string
  lastVisitDaysAgo: number; // for filter logic
  nextFollowUp: string | null;
  followUpDue: boolean;
  isToday: boolean;
  conditions: string;
  systems: string[];        // AYUSH systems under care
  totalVisits: number;
  problems: Problem[];
  allergySummary: string;
  activeMeds: number;
  vitals: { bpSys: number; bpDia: number; pulse: number; spo2: number; weight: number } | null;
};

const ALL_PATIENTS: Patient[] = [
  {
    id: "p1", name: "Rohit Kumar",    age: 32, gender: "Male",   phone: "+91 98765 43210", abha: "rohit@abha",
    bloodGroup: "B+", prakriti: "Vata-Pitta",
    lastVisit: "05 Jun 2026", lastVisitDaysAgo: 1, nextFollowUp: "05 Jul 2026", followUpDue: false, isToday: true,
    conditions: "IBS (Vataja Grahani) · Anxiety",
    systems: ["Ayurveda", "Homeopathy"], totalVisits: 4,
    problems: [
      { code: "GRH-V",  name: "Vataja Grahani",  status: "active"     },
      { code: "ANX-01", name: "Anxiety / Stress", status: "active"     },
    ],
    allergySummary: "Sulfonamides (mod) · Peanuts (mod)",
    activeMeds: 6,
    vitals: { bpSys: 118, bpDia: 76, pulse: 72, spo2: 98, weight: 72 },
  },
  {
    id: "p2", name: "Meera Patel",    age: 45, gender: "Female", phone: "+91 87654 32109", abha: "meera@abha",
    bloodGroup: "A+", prakriti: "Pitta-Kapha",
    lastVisit: "01 Jun 2026", lastVisitDaysAgo: 5, nextFollowUp: "01 Jul 2026", followUpDue: false, isToday: true,
    conditions: "Sandhivata (Knee OA) · Hypertension",
    systems: ["Ayurveda", "Siddha"], totalVisits: 3,
    problems: [
      { code: "SNV-01", name: "Sandhivata",   status: "active"     },
      { code: "STH-01", name: "Sthaulya",     status: "active"     },
      { code: "HTN-01", name: "Hypertension", status: "controlled" },
    ],
    allergySummary: "Penicillin (life-threatening) · Shellfish (severe)",
    activeMeds: 5,
    vitals: { bpSys: 138, bpDia: 88, pulse: 82, spo2: 97, weight: 78 },
  },
  {
    id: "p3", name: "Suresh Rao",     age: 58, gender: "Male",   phone: "+91 76543 21098", abha: null,
    bloodGroup: "O+", prakriti: "Kapha",
    lastVisit: "20 May 2026", lastVisitDaysAgo: 17, nextFollowUp: "20 Jun 2026", followUpDue: true, isToday: true,
    conditions: "Psoriasis (Kushtaroga) · DM2 · Hypertension",
    systems: ["Ayurveda"], totalVisits: 2,
    problems: [
      { code: "KSH-01", name: "Kushtaroga",    status: "active"     },
      { code: "DM-02",  name: "Prameha (DM2)", status: "controlled" },
      { code: "HTN-01", name: "Hypertension",  status: "controlled" },
    ],
    allergySummary: "NSAIDs (severe) · Latex (moderate)",
    activeMeds: 6,
    vitals: { bpSys: 128, bpDia: 82, pulse: 68, spo2: 97, weight: 88 },
  },
  {
    id: "p4", name: "Kavitha Nair",   age: 29, gender: "Female", phone: "+91 91234 56780", abha: "kavitha@abha",
    bloodGroup: "AB+", prakriti: "Vata-Kapha",
    lastVisit: "03 Jun 2026", lastVisitDaysAgo: 3, nextFollowUp: "03 Jul 2026", followUpDue: false, isToday: false,
    conditions: "Post-Panchakarma maintenance · PCOD",
    systems: ["Ayurveda"], totalVisits: 6,
    problems: [
      { code: "PCOD-01", name: "PCOD",                  status: "controlled" },
      { code: "STR-01",  name: "Stress / Burnout",      status: "active"     },
    ],
    allergySummary: "No known drug allergies",
    activeMeds: 3,
    vitals: { bpSys: 110, bpDia: 70, pulse: 68, spo2: 99, weight: 58 },
  },
  {
    id: "p5", name: "Arjun Menon",    age: 41, gender: "Male",   phone: "+91 82345 67891", abha: "arjun@abha",
    bloodGroup: "B−", prakriti: "Pitta",
    lastVisit: "28 Apr 2026", lastVisitDaysAgo: 39, nextFollowUp: null, followUpDue: false, isToday: false,
    conditions: "Acid peptic disease · Migraine",
    systems: ["Ayurveda", "Naturopathy"], totalVisits: 3,
    problems: [
      { code: "APD-01",  name: "Amlapitta (Acid PD)",   status: "active"  },
      { code: "MIG-01",  name: "Shiro Roga (Migraine)", status: "active"  },
    ],
    allergySummary: "No known allergies",
    activeMeds: 4,
    vitals: { bpSys: 124, bpDia: 80, pulse: 74, spo2: 98, weight: 75 },
  },
  {
    id: "p6", name: "Priya Sundaram", age: 36, gender: "Female", phone: "+91 73456 78902", abha: null,
    bloodGroup: "O−", prakriti: "Vata",
    lastVisit: "12 May 2026", lastVisitDaysAgo: 25, nextFollowUp: "12 Jun 2026", followUpDue: true, isToday: false,
    conditions: "Hypothyroidism · Hair loss",
    systems: ["Ayurveda"], totalVisits: 4,
    problems: [
      { code: "THY-01", name: "Hypothyroidism",   status: "controlled" },
      { code: "KES-01", name: "Khalitya (Hair loss)", status: "active" },
    ],
    allergySummary: "Iodine contrast (mild)",
    activeMeds: 5,
    vitals: { bpSys: 108, bpDia: 68, pulse: 66, spo2: 98, weight: 61 },
  },
  {
    id: "p7", name: "Vikram Desai",   age: 52, gender: "Male",   phone: "+91 94567 89013", abha: "vikram@abha",
    bloodGroup: "A−", prakriti: "Kapha-Pitta",
    lastVisit: "18 Jan 2026", lastVisitDaysAgo: 138, nextFollowUp: null, followUpDue: false, isToday: false,
    conditions: "Type 2 Diabetes · Dyslipidaemia",
    systems: ["Ayurveda", "Allopathy co-management"], totalVisits: 2,
    problems: [
      { code: "DM-02",  name: "Prameha (DM2)",    status: "controlled" },
      { code: "MDO-01", name: "Medovriddhi (Dyslipidaemia)", status: "controlled" },
    ],
    allergySummary: "No known allergies",
    activeMeds: 5,
    vitals: { bpSys: 132, bpDia: 84, pulse: 70, spo2: 97, weight: 92 },
  },
  {
    id: "p8", name: "Lalitha Krishnan", age: 68, gender: "Female", phone: "+91 65678 90124", abha: "lalitha@abha",
    bloodGroup: "B+", prakriti: "Vata-Kapha",
    lastVisit: "31 May 2026", lastVisitDaysAgo: 6, nextFollowUp: "14 Jun 2026", followUpDue: true, isToday: false,
    conditions: "Osteoporosis · Chronic back pain",
    systems: ["Ayurveda"], totalVisits: 7,
    problems: [
      { code: "OST-01", name: "Asthi Kshaya (Osteoporosis)", status: "active"  },
      { code: "KT-01",  name: "Kati Shoola (Back pain)",     status: "active"  },
    ],
    allergySummary: "Aspirin (moderate)",
    activeMeds: 6,
    vitals: { bpSys: 142, bpDia: 88, pulse: 76, spo2: 96, weight: 64 },
  },
];

type EditState = {
  notes: string;
  bpSys: string; bpDia: string; pulse: string; spo2: string; weight: string; temp: string;
  newProblem: string; newProblemCode: string;
};

const initialEdit = (): EditState => ({
  notes: "", bpSys: "", bpDia: "", pulse: "", spo2: "", weight: "", temp: "",
  newProblem: "", newProblemCode: "",
});

function vStat(key: string, n: number): "normal" | "warning" | "alert" {
  if (key === "bpSys")  return n < 90 ? "alert"  : n <= 120 ? "normal" : n <= 139 ? "warning" : "alert";
  if (key === "bpDia")  return n < 60 ? "warning" : n <= 80  ? "normal" : n <= 89  ? "warning" : "alert";
  if (key === "pulse")  return n < 60 || n > 100  ? "warning" : "normal";
  if (key === "spo2")   return n < 90 ? "alert"   : n < 95   ? "warning" : "normal";
  return "normal";
}

const statStyle = {
  normal:  "bg-herb-green/10 text-herb-green border-herb-green/20",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  alert:   "bg-red-50 text-red-600 border-red-200",
};

export default function PatientsPage() {
  const [query, setQuery]           = useState("");
  const [filter, setFilter]         = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [patients, setPatients]     = useState(ALL_PATIENTS);
  const [edit, setEdit]             = useState<EditState>(initialEdit());
  const [saved, setSaved]           = useState(false);
  const [activePanel, setActivePanel] = useState<"overview" | "vitals" | "problems" | "notes">("overview");

  const filtered = useMemo(() => {
    let list = patients;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.abha?.toLowerCase().includes(q) ?? false) ||
        p.conditions.toLowerCase().includes(q) ||
        p.problems.some(pr => pr.name.toLowerCase().includes(q))
      );
    }
    if (filter === "today")   list = list.filter(p => p.isToday);
    if (filter === "followup") list = list.filter(p => p.followUpDue);
    if (filter === "recent")  list = list.filter(p => p.lastVisitDaysAgo <= 30);
    return list;
  }, [patients, query, filter]);

  const selected = patients.find(p => p.id === selectedId) ?? null;

  function openPanel(id: string) {
    setSelectedId(id);
    setEdit(initialEdit());
    setSaved(false);
    setActivePanel("overview");
  }

  function closePanel() {
    setSelectedId(null);
    setSaved(false);
  }

  function saveVitals() {
    if (!selected) return;
    const bpSys  = parseFloat(edit.bpSys);
    const bpDia  = parseFloat(edit.bpDia);
    const pulse  = parseFloat(edit.pulse);
    const spo2   = parseFloat(edit.spo2);
    const weight = parseFloat(edit.weight);
    setPatients(prev => prev.map(p => {
      if (p.id !== selected.id) return p;
      return {
        ...p,
        vitals: {
          bpSys:  !isNaN(bpSys)  ? bpSys  : p.vitals?.bpSys  ?? 0,
          bpDia:  !isNaN(bpDia)  ? bpDia  : p.vitals?.bpDia  ?? 0,
          pulse:  !isNaN(pulse)  ? pulse  : p.vitals?.pulse   ?? 0,
          spo2:   !isNaN(spo2)   ? spo2   : p.vitals?.spo2    ?? 0,
          weight: !isNaN(weight) ? weight : p.vitals?.weight  ?? 0,
        },
        lastVisit: "06 Jun 2026",
        lastVisitDaysAgo: 0,
      };
    }));
    setSaved(true);
  }

  function addProblem() {
    if (!selected || !edit.newProblem.trim()) return;
    setPatients(prev => prev.map(p => {
      if (p.id !== selected.id) return p;
      return {
        ...p,
        problems: [...p.problems, {
          code: edit.newProblemCode.toUpperCase() || "NEW",
          name: edit.newProblem.trim(),
          status: "active" as const,
        }],
        conditions: p.conditions + " · " + edit.newProblem.trim(),
      };
    }));
    setEdit(e => ({ ...e, newProblem: "", newProblemCode: "" }));
    setSaved(true);
  }

  function saveNotes() {
    setSaved(true);
  }

  const FILTER_TABS: { id: Filter; label: string; count: () => number }[] = [
    { id: "all",      label: "All Patients",  count: () => patients.length },
    { id: "today",    label: "Today's Queue", count: () => patients.filter(p => p.isToday).length },
    { id: "followup", label: "Follow-up Due", count: () => patients.filter(p => p.followUpDue).length },
    { id: "recent",   label: "Last 30 Days",  count: () => patients.filter(p => p.lastVisitDaysAgo <= 30).length },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Patient Registry</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Search, view, and update any patient record — independent of appointments
          </p>
        </div>
        <Link href="/pro/walk-in">
          <button className="flex items-center gap-2 px-4 py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              <line x1="20" y1="4" x2="20" y2="10"/><line x1="17" y1="7" x2="23" y2="7"/>
            </svg>
            Walk-in Patient
          </button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedId(null); }}
          placeholder="Search by name, phone, ABHA ID, diagnosis, or condition…"
          className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-2xl bg-white focus:outline-none focus:border-herb-green/50 focus:ring-2 focus:ring-herb-green/10 placeholder:text-muted-foreground transition-all shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit flex-wrap">
        {FILTER_TABS.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)}
            className={cn("px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
              filter === t.id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {t.label}
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold",
              filter === t.id ? "bg-herb-green/10 text-herb-green" : "bg-muted-foreground/20 text-muted-foreground"
            )}>{t.count()}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0 ? "No patients found" : `${filtered.length} patient${filtered.length !== 1 ? "s" : ""}`}
          {query && ` matching "${query}"`}
        </p>
        {filter === "followup" && filtered.length > 0 && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            {filtered.length} follow-up{filtered.length !== 1 ? "s" : ""} overdue
          </span>
        )}
      </div>

      {/* Patient list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted-foreground">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <p className="font-semibold text-foreground">No patients found</p>
          <p className="text-xs text-muted-foreground mt-1">Try a different name, phone number, or condition</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id}
              className={cn("bg-white rounded-2xl border transition-all",
                selectedId === p.id ? "border-herb-green/40 shadow-sm ring-1 ring-herb-green/20" : "border-border hover:border-border/80 hover:shadow-sm"
              )}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-sage/15 flex items-center justify-center flex-shrink-0 relative">
                    <span className="font-bold text-sage text-lg">{p.name[0]}</span>
                    {p.followUpDue && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white" title="Follow-up overdue" />
                    )}
                  </div>

                  {/* Core info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{p.name}</p>
                          <span className="text-xs text-muted-foreground">{p.age}y · {p.gender}</span>
                          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{p.bloodGroup}</span>
                          {p.abha ? (
                            <span className="text-[10px] text-herb-green font-semibold">ABHA ✓</span>
                          ) : (
                            <span className="text-[10px] text-amber-600">No ABHA</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.phone}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-shrink-0">
                        {p.isToday && (
                          <span className="bg-herb-green/10 text-herb-green font-semibold px-2 py-0.5 rounded-full border border-herb-green/20">Today</span>
                        )}
                        {p.followUpDue && (
                          <span className="bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">Follow-up due</span>
                        )}
                      </div>
                    </div>

                    {/* Conditions + problems */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.problems.map(pr => (
                        <span key={pr.code} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          pr.status === "active"     ? "bg-red-50 text-red-600 border-red-200" :
                          pr.status === "controlled" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          "bg-herb-green/10 text-herb-green border-herb-green/20"
                        )}>
                          {pr.code} · {pr.name}
                        </span>
                      ))}
                    </div>

                    {/* Meta row */}
                    <div className="mt-2.5 flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
                      <span>Last visit: <span className="font-semibold text-foreground">{p.lastVisit}</span></span>
                      <span>·</span>
                      <span>{p.totalVisits} visit{p.totalVisits !== 1 ? "s" : ""}</span>
                      {p.nextFollowUp && (
                        <>
                          <span>·</span>
                          <span>Next: <span className={cn("font-semibold", p.followUpDue ? "text-amber-600" : "text-foreground")}>{p.nextFollowUp}</span></span>
                        </>
                      )}
                      <span>·</span>
                      <span>{p.activeMeds} active meds</span>
                      <span>·</span>
                      <span className="italic">{p.prakriti} Prakriti</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => selectedId === p.id ? closePanel() : openPanel(p.id)}
                    className={cn("flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all",
                      selectedId === p.id
                        ? "bg-herb-green text-white"
                        : "bg-herb-green/10 text-herb-green hover:bg-herb-green hover:text-white"
                    )}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    {selectedId === p.id ? "Close Panel" : "Update Record"}
                  </button>
                  <Link href={`/pro/emr?patient=${p.id}`}>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      Open EMR
                    </button>
                  </Link>
                  <Link href={`/pro/prescribe?patient=${p.id}`}>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-herb-green/30 text-herb-green hover:bg-herb-green hover:text-white transition-all">
                      <span className="text-[11px]">✍️</span>
                      Write Rx
                    </button>
                  </Link>
                  <Link href={`/pro/patient/${p.id}`}>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                      Full Intake
                    </button>
                  </Link>
                  {p.vitals && (
                    <div className="flex gap-1.5 ml-1">
                      {[
                        { k: "bpSys",  label: `${p.vitals.bpSys}/${p.vitals.bpDia}`, unit: "", },
                        { k: "pulse",  label: `${p.vitals.pulse}`,  unit: "bpm" },
                        { k: "spo2",   label: `${p.vitals.spo2}`,   unit: "%" },
                      ].map(v => (
                        <span key={v.k} className={cn("text-[10px] font-semibold px-2 py-1 rounded-full border",
                          statStyle[vStat(v.k, v.k === "bpSys" ? p.vitals!.bpSys : v.k === "pulse" ? p.vitals!.pulse : p.vitals!.spo2)]
                        )}>
                          {v.label}{v.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Inline edit panel */}
              {selectedId === p.id && (
                <div className="border-t border-border bg-background rounded-b-2xl">
                  {/* Panel nav */}
                  <div className="flex gap-0 border-b border-border px-5">
                    {([
                      { id: "overview", label: "Overview"       },
                      { id: "vitals",   label: "Record Vitals"  },
                      { id: "problems", label: "Problem List"   },
                      { id: "notes",    label: "Add Note"       },
                    ] as { id: typeof activePanel; label: string }[]).map(t => (
                      <button key={t.id} onClick={() => { setActivePanel(t.id); setSaved(false); }}
                        className={cn("px-4 py-3 text-xs font-semibold border-b-2 transition-all -mb-px",
                          activePanel === t.id
                            ? "border-herb-green text-herb-green"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        )}>
                        {t.label}
                      </button>
                    ))}
                    {saved && (
                      <div className="ml-auto flex items-center gap-1.5 px-4 py-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="text-herb-green" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span className="text-[11px] text-herb-green font-semibold">Saved</span>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-5">
                    {/* Overview */}
                    {activePanel === "overview" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Active Problems</p>
                          <div className="space-y-1.5">
                            {p.problems.map(pr => (
                              <div key={pr.code} className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0",
                                  pr.status === "active" ? "bg-red-400" : pr.status === "controlled" ? "bg-amber-400" : "bg-herb-green"
                                )} />
                                <span className="text-xs text-foreground">{pr.name}</span>
                                <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{pr.code}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-2">Allergies</p>
                          <p className="text-xs text-foreground">{p.allergySummary}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-1">Systems Under Care</p>
                          <div className="flex flex-wrap gap-1.5">
                            {p.systems.map(s => (
                              <span key={s} className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          {p.vitals && (
                            <>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Last Recorded Vitals</p>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: "BP",    value: `${p.vitals.bpSys}/${p.vitals.bpDia}`, unit: "mmHg", k: "bpSys",  n: p.vitals.bpSys  },
                                  { label: "Pulse", value: `${p.vitals.pulse}`,  unit: "bpm",  k: "pulse",  n: p.vitals.pulse  },
                                  { label: "SpO₂",  value: `${p.vitals.spo2}`,   unit: "%",    k: "spo2",   n: p.vitals.spo2   },
                                  { label: "Wt",    value: `${p.vitals.weight}`, unit: "kg",   k: "weight", n: 0                },
                                ].map(v => (
                                  <div key={v.k} className={cn("rounded-xl p-2.5 border", v.k !== "weight" ? statStyle[vStat(v.k, v.n)] : "bg-muted text-foreground border-border")}>
                                    <p className="text-[10px] font-medium opacity-70">{v.label}</p>
                                    <p className="text-sm font-bold mt-0.5">{v.value} <span className="text-[10px] font-normal opacity-60">{v.unit}</span></p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-1">Active Medications</p>
                          <p className="text-xs text-muted-foreground">{p.activeMeds} medications on file</p>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            <Link href={`/pro/patient/${p.id}`}>
                              <button className="text-[11px] text-herb-green font-semibold hover:underline">
                                View full medical history →
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vitals */}
                    {activePanel === "vitals" && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-4">
                          Record vitals for today's visit. Leave blank to keep the previous reading.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                          {([
                            { key: "bpSys",  label: "BP Systolic",  unit: "mmHg", placeholder: p.vitals?.bpSys.toString()  ?? "118" },
                            { key: "bpDia",  label: "BP Diastolic", unit: "mmHg", placeholder: p.vitals?.bpDia.toString()  ?? "76"  },
                            { key: "pulse",  label: "Pulse",        unit: "bpm",  placeholder: p.vitals?.pulse.toString()  ?? "72"  },
                            { key: "spo2",   label: "SpO₂",         unit: "%",    placeholder: p.vitals?.spo2.toString()   ?? "98"  },
                            { key: "weight", label: "Weight",       unit: "kg",   placeholder: p.vitals?.weight.toString() ?? "70"  },
                            { key: "temp",   label: "Temperature",  unit: "°F",   placeholder: "98.6" },
                          ] as const).map(f => (
                            <div key={f.key}>
                              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{f.label} <span className="normal-case font-normal">({f.unit})</span></label>
                              <input
                                type="number"
                                value={edit[f.key]}
                                onChange={e => setEdit(prev => ({ ...prev, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:border-herb-green/50 bg-white"
                              />
                            </div>
                          ))}
                        </div>
                        <button onClick={saveVitals}
                          className="px-5 py-2.5 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                          Save Vitals
                        </button>
                      </div>
                    )}

                    {/* Problems */}
                    {activePanel === "problems" && (
                      <div>
                        <div className="space-y-2 mb-5">
                          {p.problems.map((pr, i) => (
                            <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-xl px-3.5 py-2.5">
                              <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                                pr.status === "active" ? "bg-red-400" : pr.status === "controlled" ? "bg-amber-400" : "bg-herb-green"
                              )} />
                              <span className="text-xs font-semibold text-foreground flex-1">{pr.name}</span>
                              <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{pr.code}</span>
                              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                                pr.status === "active" ? "text-red-600 bg-red-50" : pr.status === "controlled" ? "text-amber-700 bg-amber-50" : "text-herb-green bg-herb-green/10"
                              )}>{pr.status}</span>
                              <button onClick={() => {
                                setPatients(prev => prev.map(pt =>
                                  pt.id !== p.id ? pt : { ...pt, problems: pt.problems.filter((_, j) => j !== i) }
                                ));
                              }} className="text-muted-foreground hover:text-red-500 transition-colors ml-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Add Problem</p>
                        <div className="flex gap-2 mb-2">
                          <input
                            value={edit.newProblem}
                            onChange={e => setEdit(prev => ({ ...prev, newProblem: e.target.value }))}
                            placeholder="Problem / diagnosis name"
                            className="flex-1 px-3 py-2 text-xs border border-border rounded-xl focus:outline-none focus:border-herb-green/50 bg-white"
                          />
                          <input
                            value={edit.newProblemCode}
                            onChange={e => setEdit(prev => ({ ...prev, newProblemCode: e.target.value }))}
                            placeholder="Code"
                            className="w-24 px-3 py-2 text-xs border border-border rounded-xl focus:outline-none focus:border-herb-green/50 bg-white font-mono uppercase"
                          />
                          <button onClick={addProblem} disabled={!edit.newProblem.trim()}
                            className={cn("px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                              edit.newProblem.trim() ? "bg-herb-green text-white hover:bg-herb-green/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}>
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {activePanel === "notes" && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Add a clinical note to this patient's record without opening a full EMR session.
                        </p>
                        <textarea
                          rows={5}
                          value={edit.notes}
                          onChange={e => setEdit(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Clinical observations, interim advice, phone consultation summary, medication adjustment notes…"
                          className="w-full px-3.5 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-herb-green/50 bg-white resize-none placeholder:text-muted-foreground"
                        />
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={saveNotes} disabled={!edit.notes.trim()}
                            className={cn("px-5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                              edit.notes.trim() ? "bg-herb-green text-white hover:bg-herb-green/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}>
                            Save Note
                          </button>
                          <p className="text-[10px] text-muted-foreground">
                            Saved notes are time-stamped and appended to the visit history
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
