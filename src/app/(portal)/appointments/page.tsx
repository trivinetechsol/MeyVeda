"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "upcoming" | "past" | "cancelled";

const UPCOMING = [
  {
    id: "a1",
    doctor: "Dr. Aditi Shastri",
    initials: "AS",
    specialty: "Ayurveda · Panchakarma",
    date: "Today, 4:30 PM",
    dateRaw: "2026-06-05",
    mode: "video" as const,
    status: "confirmed" as const,
    fee: "₹800",
    reminder: true,
  },
  {
    id: "a2",
    doctor: "Dr. Vikram Nair",
    initials: "VN",
    specialty: "Yoga Therapy",
    date: "Sat, 7 Jun · 9:00 AM",
    dateRaw: "2026-06-07",
    mode: "video" as const,
    status: "confirmed" as const,
    fee: "₹600",
    reminder: false,
  },
];

const PAST = [
  {
    id: "p1",
    doctor: "Dr. Aditi Shastri",
    initials: "AS",
    specialty: "Ayurveda · Panchakarma",
    date: "14 May 2026 · 4:30 PM",
    mode: "video" as const,
    duration: "32 min",
    rating: 5,
    hasPrescription: true,
    fee: "₹800",
  },
  {
    id: "p2",
    doctor: "Dr. Aditi Shastri",
    initials: "AS",
    specialty: "Ayurveda · Panchakarma",
    date: "18 Feb 2026 · 4:00 PM",
    mode: "video" as const,
    duration: "28 min",
    rating: 5,
    hasPrescription: true,
    fee: "₹800",
  },
  {
    id: "p3",
    doctor: "Dr. Priya Menon",
    initials: "PM",
    specialty: "Naturopathy",
    date: "3 Jan 2026 · 11:00 AM",
    mode: "clinic" as const,
    duration: "45 min",
    rating: 4,
    hasPrescription: false,
    fee: "₹1,200",
  },
];

const CANCELLED = [
  {
    id: "c1",
    doctor: "Dr. Suresh Kumar",
    initials: "SK",
    specialty: "Homeopathy",
    date: "20 Apr 2026 · 3:00 PM",
    mode: "video" as const,
    reason: "Doctor unavailable",
    refunded: true,
    fee: "₹500",
  },
];

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
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
            {tab === "upcoming" && UPCOMING.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-herb-green/15 text-herb-green font-semibold px-1.5 py-0.5 rounded-full">
                {UPCOMING.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upcoming */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {UPCOMING.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
              <span className="text-4xl">🗓️</span>
              <p className="font-semibold text-foreground mt-3">No upcoming appointments</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Book a consultation with a verified AYUSH practitioner</p>
              <Link href="/discover">
                <button className="px-5 py-2.5 bg-herb-green text-white text-sm font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                  Browse Practitioners
                </button>
              </Link>
            </div>
          ) : (
            UPCOMING.map((appt) => (
              <div key={appt.id} className={cn(
                "bg-white rounded-2xl border p-5 transition-all",
                appt.id === "a1" ? "border-herb-green/30 shadow-sm" : "border-border"
              )}>
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-herb-gradient flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{appt.initials}</span>
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
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] bg-herb-green/10 text-herb-green font-semibold px-2.5 py-1 rounded-full border border-herb-green/20">
                      Confirmed
                    </span>
                    {appt.reminder && (
                      <span className="text-[10px] text-muted-foreground">🔔 Reminder set</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {appt.mode === "video" && appt.id === "a1" && (
                    <Link href="/waiting-room" className="flex-1">
                      <button className="w-full py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                        📹 Join Room
                      </button>
                    </Link>
                  )}
                  {appt.mode === "video" && appt.id !== "a1" && (
                    <button className="flex-1 py-2 bg-muted text-muted-foreground text-xs font-semibold rounded-xl cursor-not-allowed" disabled>
                      Join Room
                    </button>
                  )}
                  <Link href={`/doctor/${appt.id}`}>
                    <button className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                      View Doctor
                    </button>
                  </Link>
                  {!appt.reminder && (
                    <button className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                      🔔 Remind Me
                    </button>
                  )}
                  <button
                    onClick={() => setCancellingId(appt.id)}
                    className="px-4 py-2 border border-red-100 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
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
                      <button className="flex-1 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors">
                        Confirm Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Past */}
      {activeTab === "past" && (
        <div className="space-y-4">
          {PAST.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-sage">{appt.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{appt.doctor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{appt.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {appt.date} · {appt.duration} · {appt.mode === "video" ? "Video" : "In-Clinic"} · {appt.fee}
                    </p>
                    <div className="mt-1.5">
                      <StarRating value={appt.rating} />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-muted text-muted-foreground font-medium px-2.5 py-1 rounded-full border border-border flex-shrink-0">
                  Completed
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancelled */}
      {activeTab === "cancelled" && (
        <div className="space-y-4">
          {CANCELLED.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-border p-5 opacity-75">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-muted-foreground">{appt.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{appt.doctor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{appt.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">{appt.date} · {appt.fee}</p>
                    <p className="text-xs text-red-500 mt-1">Reason: {appt.reason}</p>
                    {appt.refunded && (
                      <p className="text-xs text-herb-green mt-0.5">✓ Full refund issued</p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] bg-red-50 text-red-500 font-medium px-2.5 py-1 rounded-full border border-red-100 flex-shrink-0">
                  Cancelled
                </span>
              </div>
              <Link href="/discover">
                <button className="px-4 py-2 border border-herb-green/30 text-herb-green rounded-xl text-xs font-semibold hover:bg-herb-green/5 transition-colors">
                  Book a Replacement
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
