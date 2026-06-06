"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HPRBadge } from "@/components/Badges";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

type QueueStatus = "waiting" | "checked-in" | "in-session" | "completed";

const QUEUE_PATIENTS = [
  { id: "p1", name: "Rohit Kumar", age: 32, time: "4:30 PM", mode: "video" as const, status: "checked-in" as QueueStatus, waitMins: 5, reason: "Digestive issues, fatigue", abha: "rohit@abha" },
  { id: "p2", name: "Meera Patel", age: 45, time: "5:00 PM", mode: "clinic" as const, status: "waiting" as QueueStatus, waitMins: 35, reason: "Joint pain, mobility", abha: "meera@abha" },
  { id: "p3", name: "Suresh Rao", age: 58, time: "5:30 PM", mode: "video" as const, status: "waiting" as QueueStatus, waitMins: 65, reason: "Skin condition, Pitta", abha: null },
  { id: "p4", name: "Kavitha Nair", age: 29, time: "3:30 PM", mode: "clinic" as const, status: "completed" as QueueStatus, waitMins: 0, reason: "Follow-up — Panchakarma", abha: "kavitha@abha" },
];

const STATUS_CONFIG: Record<QueueStatus, { label: string; color: string; dot: string }> = {
  waiting: { label: "Waiting", color: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  "checked-in": { label: "Checked In", color: "bg-herb-green/10 text-herb-green", dot: "bg-herb-green" },
  "in-session": { label: "In Session", color: "bg-blue-50 text-blue-700", dot: "bg-blue-400 animate-pulse" },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};

export default function ProDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const doctorName = user?.name ?? "Dr. Aditi Shastri";
  const doctorInitials = doctorName.split(" ").filter(w => w).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const [isOnline, setIsOnline] = useState(true);

  const todayStats = {
    total: QUEUE_PATIENTS.length,
    completed: QUEUE_PATIENTS.filter((p) => p.status === "completed").length,
    remaining: QUEUE_PATIENTS.filter((p) => p.status !== "completed").length,
    avgDuration: "24",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Doctor header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-herb-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{doctorInitials}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl font-semibold text-foreground">{doctorName}</h1>
              <span className="text-[10px] bg-herb-green/10 text-herb-green font-semibold px-2 py-0.5 rounded-full">
                Pro
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Ayurveda · Holistic Wellness Clinic</p>
            <HPRBadge hprId="HPR-4902-8822" showId className="mt-1.5" />
          </div>
        </div>

        {/* Online toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={cn("relative w-12 h-6 rounded-full transition-all", isOnline ? "bg-herb-green" : "bg-muted")}
          >
            <div
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                isOnline ? "left-7" : "left-1"
              )}
            />
          </button>
        </div>
      </div>

      {!isOnline ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted-foreground">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="font-semibold text-foreground">You are offline</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs">
            Toggle online to start receiving new booking requests and manage your queue.
          </p>
          <button
            onClick={() => setIsOnline(true)}
            className="mt-4 px-6 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-colors"
          >
            Go Online
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: todayStats.total, color: "text-foreground" },
              { label: "Done", value: todayStats.completed, color: "text-herb-green" },
              { label: "Pending", value: todayStats.remaining, color: "text-amber-600" },
              { label: "Avg (min)", value: todayStats.avgDuration, color: "text-foreground" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
                <p className={cn("font-display text-2xl font-bold", s.color)}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Left: Queue */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-foreground">Patient Queue · Today</h2>
                <button className="text-xs text-herb-green font-medium">Edit Schedule</button>
              </div>

              <div className="space-y-3">
                {QUEUE_PATIENTS.map((patient) => {
                  const statusConf = STATUS_CONFIG[patient.status];
                  const isPending = patient.status === "checked-in" || patient.status === "waiting";

                  return (
                    <div
                      key={patient.id}
                      className={cn(
                        "bg-white rounded-2xl border p-5 transition-all",
                        patient.status === "checked-in" ? "border-herb-green/40 shadow-sm" : "border-border",
                        patient.status === "completed" && "opacity-60"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-sage">{patient.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                              <span className="text-xs text-muted-foreground">{patient.age}y</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{patient.reason}</p>
                            {patient.abha && (
                              <p className="text-[10px] text-herb-green mt-0.5">ABHA ✓ · {patient.abha}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className={cn("w-2 h-2 rounded-full", statusConf.dot)} />
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusConf.color)}>
                            {statusConf.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{patient.time}</span>
                        <span>·</span>
                        <span>{patient.mode === "video" ? "📹 Video" : "🏥 In-Clinic"}</span>
                        {isPending && (
                          <>
                            <span>·</span>
                            <span className={patient.status === "checked-in" ? "text-herb-green font-medium" : ""}>
                              Wait: {patient.waitMins}m
                            </span>
                          </>
                        )}
                      </div>

                      {isPending && (
                        <div className="flex gap-2 mt-3">
                          <Link
                            href={`/pro/emr?patient=${patient.id}`}
                            className="flex-1"
                          >
                            <button className="w-full py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all active:scale-95">
                              {patient.mode === "video" ? "📹 Start Video Call" : "📋 Open EMR"}
                            </button>
                          </Link>
                          <Link href={`/pro/patient/${patient.id}`}>
                            <button className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                              View Intake
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="space-y-4">
              <Link href="/pro/emr">
                <div className="bg-white rounded-2xl border border-copper/30 p-5 flex items-center gap-3 hover:border-copper/50 hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Open EMR Builder</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Write SOAP notes & digital prescriptions</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-muted-foreground">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Today&apos;s Schedule</h3>
                {[
                  { time: "3:30 PM", patient: "Kavitha Nair", done: true },
                  { time: "4:30 PM", patient: "Rohit Kumar", done: false, active: true },
                  { time: "5:00 PM", patient: "Meera Patel", done: false },
                  { time: "5:30 PM", patient: "Suresh Rao", done: false },
                ].map((s) => (
                  <div key={s.time} className={cn("flex items-center gap-3 py-2 border-b border-border last:border-0", s.done && "opacity-50")}>
                    <span className="text-xs font-mono text-muted-foreground w-14 flex-shrink-0">{s.time}</span>
                    <span className={cn("text-xs flex-1", s.active ? "font-semibold text-herb-green" : "text-foreground")}>
                      {s.patient}
                    </span>
                    {s.done && <span className="text-[10px] text-muted-foreground">Done</span>}
                    {s.active && <span className="text-[10px] text-herb-green font-semibold">Now</span>}
                  </div>
                ))}
              </div>

              <div className="bg-ivory-deep rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-1">Monthly Summary</h3>
                <p className="text-xs text-muted-foreground mb-3">June 2026</p>
                {[
                  { label: "Consultations", value: "48" },
                  { label: "Prescriptions", value: "42" },
                  { label: "Revenue", value: "₹67,200" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
