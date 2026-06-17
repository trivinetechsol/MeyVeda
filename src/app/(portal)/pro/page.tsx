"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HPRBadge } from "@/components/Badges";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { usePractitionerAnalytics, usePractitionerPrescriptions, usePractitioner } from "@/lib/hooks";
import { createClient } from "@/lib/supabase";

type QueueStatus = "waiting" | "checked-in" | "in-session" | "completed";

type QueuePatient = {
  id: string;
  appointmentId: string;
  name: string;
  age: number;
  time: string;
  mode: "video" | "clinic";
  status: QueueStatus;
  waitMins: number;
  reason: string;
  abha: string | null;
};

const STATUS_CONFIG: Record<QueueStatus, { label: string; color: string; dot: string }> = {
  waiting: { label: "Waiting", color: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  "checked-in": { label: "Checked In", color: "bg-herb-green/10 text-herb-green", dot: "bg-herb-green" },
  "in-session": { label: "In Session", color: "bg-blue-50 text-blue-700", dot: "bg-blue-400 animate-pulse" },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};

export default function ProDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: practitioner } = usePractitioner(user?.id);
  const { data: analytics } = usePractitionerAnalytics(user?.id);
  const { data: prescriptions } = usePractitionerPrescriptions(user?.id);
  const doctorName = practitioner?.name ?? user?.name ?? "Dr. Aditi Shastri";
  const doctorInitials = doctorName.split(" ").filter(w => w).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const [isOnline, setIsOnline] = useState(true);
  
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQueue() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let practitionerId = 'd0c00001-0000-0000-0000-000000000001';
        if (user) {
          const { data: prac } = await supabase
            .from("practitioners")
            .select("id")
            .eq("user_id", user.id)
            .single();
          if (prac?.id) practitionerId = prac.id;
        }

        const today = new Date().toISOString().split("T")[0];

        const { data: appointments, error } = await supabase
          .from("appointments")
          .select(`
            id,
            mode,
            status,
            reason_for_visit,
            scheduled_time,
            checked_in_at,
            patient:patients (
              id,
              full_name,
              date_of_birth
            )
          `)
          .eq("practitioner_id", practitionerId)
          .eq("scheduled_date", today)
          .order("scheduled_time", { ascending: true });

        if (error) {
          console.error("Supabase Error Details:", error.message || error.details || error);
          // Don't throw, just let it render empty queue
          setQueuePatients([]);
          return;
        }

        const formattedQueue = (appointments || []).map((appt: any) => {
          const patient = appt.patient || {};
          const abhaList = patient.abha || [];
          const abhaId = abhaList.length > 0 ? abhaList[0].abha_id : null;

          let age = 0;
          if (patient.date_of_birth) {
            const birthDate = new Date(patient.date_of_birth);
            const todayDate = new Date();
            age = todayDate.getFullYear() - birthDate.getFullYear();
          }

          let waitMins = 0;
          if (appt.checked_in_at && appt.status === "checked_in") {
            const checkedInTime = new Date(appt.checked_in_at).getTime();
            waitMins = Math.floor((Date.now() - checkedInTime) / 60000);
          } else if (appt.status === "scheduled") {
            const [hours, minutes] = appt.scheduled_time.split(":");
            const scheduledTime = new Date();
            scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            const diff = Math.floor((Date.now() - scheduledTime.getTime()) / 60000);
            waitMins = diff > 0 ? diff : 0;
          }

          let mappedStatus = "waiting";
          if (appt.status === "checked_in") mappedStatus = "checked-in";
          else if (appt.status === "in_session") mappedStatus = "in-session";
          else if (appt.status === "completed") mappedStatus = "completed";

          const formatTime = (timeStr: string) => {
             if (!timeStr) return "";
             const [h, m] = timeStr.split(":");
             const hours = parseInt(h, 10);
             const period = hours >= 12 ? "PM" : "AM";
             const h12 = hours % 12 || 12;
             return `${h12}:${m} ${period}`;
          };

          return {
            id: patient.id,
            appointmentId: appt.id,
            name: patient.full_name || "Unknown",
            age,
            time: formatTime(appt.scheduled_time),
            mode: appt.mode,
            status: mappedStatus as QueueStatus,
            waitMins: Math.max(0, waitMins),
            reason: appt.reason_for_visit || "Consultation",
            abha: abhaId,
          };
        });

        setQueuePatients(formattedQueue);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isOnline) {
      fetchQueue();
    }
  }, [isOnline]);

  const todayStats = {
    total: queuePatients.length,
    completed: queuePatients.filter((p) => p.status === "completed").length,
    remaining: queuePatients.filter((p) => p.status !== "completed").length,
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
            <p className="text-sm text-muted-foreground">
              {practitioner ? `${practitioner.discipline} · ${practitioner.specialty || "Holistic Clinic"}` : "Ayurveda · Holistic Wellness Clinic"}
            </p>
            {practitioner ? (
              practitioner.isVerified ? (
                <HPRBadge hprId={practitioner.hprId} showId className="mt-1.5" />
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 mt-1.5 font-sans">
                  Verification Pending
                </span>
              )
            ) : (
              <HPRBadge hprId="HPR-4902-8822" showId className="mt-1.5" />
            )}
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
                <p className={cn("font-display text-2xl font-bold", s.color)}>
                  {isLoading ? "-" : s.value}
                </p>
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

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-border p-5 h-32 animate-pulse">
                      <div className="w-1/3 h-4 bg-muted rounded mb-2"></div>
                      <div className="w-1/2 h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : queuePatients.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-border">
                  <p className="text-muted-foreground text-sm">No patients in queue for today.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queuePatients.map((patient) => {
                    const statusConf = STATUS_CONFIG[patient.status] || STATUS_CONFIG.waiting;
                    const isPending = patient.status === "checked-in" || patient.status === "waiting";

                    return (
                      <div
                        key={patient.appointmentId}
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
              )}
            </div>

            {/* Right: Quick actions */}
            <div className="space-y-4">
              {/* Walk-in CTA — prominent */}
              <Link href="/pro/walk-in">
                <div className="bg-herb-gradient rounded-2xl p-5 flex items-center gap-3 hover:opacity-90 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="12" y1="3" x2="12" y2="1"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Walk-in Patient</p>
                    <p className="text-xs text-white/75 mt-0.5">Register new patient & start consultation now</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>

              <Link href="/pro/patients">
                <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-3 hover:border-herb-green/30 hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-herb-green">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Patient Search</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Find & update any patient record instantly</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-muted-foreground">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>

              <Link href="/pro/prescribe">
                <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-3 hover:border-herb-green/30 hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✍️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Write Prescription</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Write Rx for any patient anytime</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-muted-foreground">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>

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
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-6 bg-muted rounded animate-pulse" />
                  </div>
                ) : queuePatients.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No appointments scheduled.</p>
                ) : (
                  queuePatients.map((s) => (
                    <div key={s.appointmentId} className={cn("flex items-center gap-3 py-2 border-b border-border last:border-0", s.status === 'completed' && "opacity-50")}>
                      <span className="text-xs font-mono text-muted-foreground w-14 flex-shrink-0">{s.time}</span>
                      <span className={cn("text-xs flex-1", s.status === 'in-session' ? "font-semibold text-herb-green" : "text-foreground")}>
                        {s.name}
                      </span>
                      {s.status === 'completed' && <span className="text-[10px] text-muted-foreground">Done</span>}
                      {s.status === 'in-session' && <span className="text-[10px] text-herb-green font-semibold">Now</span>}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-ivory-deep rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-1">Monthly Summary</h3>
                <p className="text-xs text-muted-foreground mb-3">June 2026</p>
                {[
                  { label: "Consultations", value: analytics ? String(analytics.completedThisMonth) : "0" },
                  { label: "Prescriptions", value: prescriptions ? String(prescriptions.length) : "0" },
                  { label: "Revenue", value: analytics ? `₹${Math.round(analytics.revenueThisMonth / 100).toLocaleString()}` : "₹0" },
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
