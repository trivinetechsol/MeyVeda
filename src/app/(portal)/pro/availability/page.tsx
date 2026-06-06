"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type DaySlot = {
  enabled: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
};

const DEFAULT_SLOTS: Record<string, DaySlot> = {
  Mon: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Tue: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Wed: { enabled: true, start: "09:00", end: "13:00", breakStart: "", breakEnd: "" },
  Thu: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Fri: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Sat: { enabled: false, start: "10:00", end: "13:00", breakStart: "", breakEnd: "" },
  Sun: { enabled: false, start: "", end: "", breakStart: "", breakEnd: "" },
};

export default function AvailabilityPage() {
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [slotDuration, setSlotDuration] = useState(30);
  const [bufferMins, setBufferMins] = useState(0);
  const [videoFee, setVideoFee] = useState("800");
  const [clinicFee, setClinicFee] = useState("600");
  const [consultMode, setConsultMode] = useState<"both" | "video" | "clinic">("both");
  const [saved, setSaved] = useState(false);

  function toggleDay(day: string) {
    setSlots((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  }

  function updateSlot(day: string, field: keyof DaySlot, value: string) {
    setSlots((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Availability</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Set working hours, slot duration, and consultation fees</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold rounded-xl transition-all",
            saved
              ? "bg-herb-green/15 text-herb-green border border-herb-green/30"
              : "bg-herb-green text-white hover:bg-herb-green/90"
          )}
        >
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left: Working hours */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Working Hours</h3>
            <div className="space-y-2.5">
              {DAYS.map((day) => {
                const slot = slots[day];
                return (
                  <div
                    key={day}
                    className={cn(
                      "p-3 rounded-xl border transition-all",
                      slot.enabled ? "border-herb-green/20 bg-herb-green/3" : "border-border bg-muted/20"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "relative w-10 h-5 rounded-full transition-all flex-shrink-0",
                          slot.enabled ? "bg-herb-green" : "bg-border"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                            slot.enabled ? "left-5" : "left-0.5"
                          )}
                        />
                      </button>
                      <span className="text-sm font-medium text-foreground w-9 flex-shrink-0">{day}</span>

                      {slot.enabled ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(day, "start", e.target.value)}
                            className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-herb-green/50 bg-white"
                          />
                          <span className="text-xs text-muted-foreground">to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(day, "end", e.target.value)}
                            className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-herb-green/50 bg-white"
                          />
                          {slot.breakStart && (
                            <>
                              <span className="text-xs text-muted-foreground hidden sm:inline">Break:</span>
                              <input
                                type="time"
                                value={slot.breakStart}
                                onChange={(e) => updateSlot(day, "breakStart", e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-herb-green/50 bg-white"
                              />
                              <span className="text-xs text-muted-foreground">–</span>
                              <input
                                type="time"
                                value={slot.breakEnd}
                                onChange={(e) => updateSlot(day, "breakEnd", e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-herb-green/50 bg-white"
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Day off</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slot duration */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Slot Duration</h3>
            <div className="flex gap-2 flex-wrap">
              {[15, 20, 30, 45, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setSlotDuration(d)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-xl border transition-all",
                    slotDuration === d
                      ? "bg-herb-green text-white border-herb-green"
                      : "border-border text-muted-foreground hover:border-herb-green/40"
                  )}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* Consult mode */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Consultation Mode</h3>
            <div className="space-y-2">
              {(["both", "video", "clinic"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setConsultMode(mode)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all",
                    consultMode === mode ? "border-herb-green bg-herb-green/5" : "border-border hover:border-herb-green/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      consultMode === mode ? "border-herb-green bg-herb-green" : "border-muted-foreground/40"
                    )}
                  >
                    {consultMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm text-foreground">
                    {mode === "both" ? "Video & In-Clinic" : mode === "video" ? "📹 Video Only" : "🏥 In-Clinic Only"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Consultation Fees</h3>
            <div className="space-y-3">
              {(consultMode === "both" || consultMode === "video") && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    📹 Video Consultation
                  </label>
                  <div className="flex items-center gap-2 border border-border rounded-xl px-3 focus-within:border-herb-green/50 transition-colors bg-white">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={videoFee}
                      onChange={(e) => setVideoFee(e.target.value)}
                      className="flex-1 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}
              {(consultMode === "both" || consultMode === "clinic") && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    🏥 In-Clinic Consultation
                  </label>
                  <div className="flex items-center gap-2 border border-border rounded-xl px-3 focus-within:border-herb-green/50 transition-colors bg-white">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={clinicFee}
                      onChange={(e) => setClinicFee(e.target.value)}
                      className="flex-1 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buffer */}
          <div className="bg-ivory-deep rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-1">Buffer Between Slots</h3>
            <p className="text-xs text-muted-foreground mb-3">Transition time between consecutive appointments</p>
            <div className="flex gap-2">
              {[0, 5, 10, 15].map((b) => (
                <button
                  key={b}
                  onClick={() => setBufferMins(b)}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-lg border transition-all",
                    bufferMins === b
                      ? "bg-herb-green text-white border-herb-green"
                      : "border-border text-muted-foreground hover:border-herb-green/40"
                  )}
                >
                  {b === 0 ? "None" : `${b}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Slot preview */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-3">Slot Preview · Mon</h3>
            <div className="space-y-1.5">
              {["09:00", "09:30", "10:00", "10:30", "11:00"].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0"
                >
                  <span className="font-mono text-muted-foreground">{t}</span>
                  <span className="text-herb-green font-medium">{slotDuration} min slot</span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground pt-1">+ {Math.floor((8 * 60 - 60) / (slotDuration + bufferMins)) - 5} more slots…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
