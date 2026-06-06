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

function EMRContent() {
  const params = useSearchParams();
  const patientId = params.get("patient") ?? "p1";
  const patientName = patientId === "p1" ? "Rohit Kumar" : patientId === "p2" ? "Meera Patel" : "Suresh Rao";

  const [activeTab, setActiveTab] = useState<SOAPTab>("S");
  const [herbSearch, setHerbSearch] = useState("");
  const [showHerbSuggestions, setShowHerbSuggestions] = useState(false);
  const [selectedHerbs, setSelectedHerbs] = useState<typeof HERB_SUGGESTIONS>([]);
  const [notes, setNotes] = useState({ S: "", O: "", A: "", P: "" });
  const [signed, setSigned] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpScheduled, setFollowUpScheduled] = useState(false);

  const filteredHerbs = HERB_SUGGESTIONS.filter(
    (h) =>
      !selectedHerbs.find((s) => s.name === h.name) &&
      h.name.toLowerCase().includes(herbSearch.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
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
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sage">{patientName[0]}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{patientName}</p>
              <p className="text-xs text-muted-foreground">32y · Male · Vata-Pitta Prakriti</p>
            </div>
            <span className="text-[10px] bg-herb-green/10 text-herb-green font-medium px-2 py-0.5 rounded-full">
              ABHA ✓
            </span>
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
                Uploaded to {patientName}&apos;s ABHA health locker
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-herb-green font-medium bg-herb-green/10 px-3 py-1 rounded-full">
                ✓ ABDM synced
              </span>
            </div>

            {!followUpScheduled ? (
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
            ) : (
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
            )}
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
