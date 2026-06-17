"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useAppointments } from "@/lib/hooks";
import { cancelAppointment } from "@/lib/queries";
import type { AppointmentRow } from "@/lib/queries";

type Tab = "upcoming" | "past" | "cancelled";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={value >= s ? "#F59E0B" : "none"}
          stroke={value >= s ? "#F59E0B" : "#D1D5DB"}
          strokeWidth={1.5}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { data: appointments, loading, refetch } = useAppointments(user?.id);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const upcoming = (appointments ?? []).filter((a) => a.status === "upcoming");
  const past = (appointments ?? []).filter((a) => a.status === "past");
  const cancelled = (appointments ?? []).filter((a) => a.status === "cancelled");

  const currentList = activeTab === "upcoming" ? upcoming : activeTab === "past" ? past : cancelled;

  async function handleCancel(id: string) {
    await cancelAppointment(id, "Cancelled by patient");
    setCancellingId(null);
    refetch();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your AYUSH consultations</p>
        </div>
        <Link href="/discover">
          <button className="px-4 py-2.5 bg-herb-green text-white text-sm font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
            + Book Consult
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
        {(["upcoming", "past", "cancelled"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all",
              activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {tab === "upcoming" && upcoming.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-herb-green/15 text-herb-green font-semibold px-1.5 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 h-36 animate-pulse">
              <div className="w-1/3 h-4 bg-muted rounded mb-3" />
              <div className="w-1/2 h-3 bg-muted rounded mb-2" />
              <div className="w-1/4 h-3 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && currentList.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <span className="text-4xl">{activeTab === "upcoming" ? "🗓️" : activeTab === "past" ? "✅" : "❌"}</span>
          <p className="font-semibold text-foreground mt-3">No {activeTab} appointments</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            {activeTab === "upcoming" ? "Book a consultation with a verified AYUSH practitioner" : `No ${activeTab} appointments to show`}
          </p>
          {activeTab === "upcoming" && (
            <Link href="/discover">
              <button className="px-5 py-2.5 bg-herb-green text-white text-sm font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                Browse Practitioners
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Appointment cards */}
      {!loading && currentList.length > 0 && (
        <div className="space-y-4">
          {currentList.map((appt: AppointmentRow) => (
            <div key={appt.id} className={cn(
              "bg-white rounded-2xl border p-5 transition-all",
              appt.status === "upcoming" ? "border-herb-green/30 shadow-sm" : "border-border",
              appt.status === "cancelled" && "opacity-75"
            )}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    appt.status === "upcoming" ? "bg-herb-gradient" : appt.status === "cancelled" ? "bg-muted" : "bg-sage/20"
                  )}>
                    <span className={cn("font-bold", appt.status === "upcoming" ? "text-white" : appt.status === "cancelled" ? "text-muted-foreground" : "text-sage")}>
                      {appt.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{appt.doctor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{appt.specialty}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs font-medium text-foreground">{appt.date}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {appt.mode === "video" ? "📹 Video" : "🏥 In-Clinic"}
                      </span>
                      <span className="text-xs text-muted-foreground">· {appt.fee}</span>
                      {appt.duration && <span className="text-xs text-muted-foreground">· {appt.duration}</span>}
                    </div>
                    {appt.rating && <div className="mt-1.5"><StarRating value={appt.rating} /></div>}
                    {appt.status === "cancelled" && appt.reason && (
                      <p className="text-xs text-red-500 mt-1">Reason: {appt.reason}</p>
                    )}
                    {appt.refunded && appt.status === "cancelled" && (
                      <p className="text-xs text-herb-green mt-0.5">✓ Full refund issued</p>
                    )}
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0",
                  appt.status === "upcoming" ? "bg-herb-green/10 text-herb-green border-herb-green/20" :
                  appt.status === "past" ? "bg-muted text-muted-foreground border-border" :
                  "bg-red-50 text-red-500 border-red-100"
                )}>
                  {appt.status === "upcoming" ? "Confirmed" : appt.status === "past" ? "Completed" : "Cancelled"}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {appt.status === "upcoming" && (
                  <>
                    {appt.mode === "video" && (
                      <Link href="/waiting-room" className="flex-1">
                        <button className="w-full py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                          📹 Join Room
                        </button>
                      </Link>
                    )}
                    <Link href={`/doctor/${appt.id}`}>
                      <button className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                        View Doctor
                      </button>
                    </Link>
                    <button
                      onClick={() => setCancellingId(appt.id)}
                      className="px-4 py-2 border border-red-100 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {appt.status === "past" && (
                  <>
                    {appt.hasPrescription && (
                      <Link href="/prescription" className="flex-1">
                        <button className="w-full py-2 bg-herb-green/10 text-herb-green text-xs font-semibold rounded-xl hover:bg-herb-green/20 transition-colors">
                          📋 View Prescription
                        </button>
                      </Link>
                    )}
                    <Link href={`/doctor/${appt.id}`}>
                      <button className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                        Book Again
                      </button>
                    </Link>
                  </>
                )}
                {appt.status === "cancelled" && (
                  <Link href="/discover">
                    <button className="px-4 py-2 border border-herb-green/30 text-herb-green rounded-xl text-xs font-semibold hover:bg-herb-green/5 transition-colors">
                      Book a Replacement
                    </button>
                  </Link>
                )}
              </div>

              {cancellingId === appt.id && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm font-semibold text-foreground mb-1">Cancel this appointment?</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Free cancellation until 24h before the session. A full refund will be issued within 3–5 business days.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCancellingId(null)}
                      className="flex-1 py-2 border border-border rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Keep Appointment
                    </button>
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors"
                    >
                      Confirm Cancel
                    </button>
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
