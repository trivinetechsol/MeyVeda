"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HPRBadge } from "@/components/Badges";
import { usePractitioner, usePractitionerSlots, useReviews } from "@/lib/hooks";
import { formatCurrency, cn } from "@/lib/utils";

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }),
    date: d.getDate(),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
    full: d.toISOString().split("T")[0],
  };
});

function getPeriod(timeStr: string): "Morning" | "Afternoon" | "Evening" {
  const isPM = timeStr.toLowerCase().includes("pm");
  const hour = parseInt(timeStr.split(":")[0]);
  if (!isPM) {
    return "Morning";
  } else {
    if (hour === 12 || hour < 4) {
      return "Afternoon";
    }
    return "Evening";
  }
}

export default function DoctorProfileClient() {
  const { id } = useParams<{ id: string }>();
  const { data: doctor, loading } = usePractitioner(id);

  const [selectedDate, setSelectedDate] = useState(DATES[0].full);
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; startTime: string; mode: "video" | "clinic" } | null>(null);

  // Fetch slots and reviews dynamically
  const { data: rawSlots, loading: slotsLoading } = usePractitionerSlots(id, selectedDate);
  const { data: rawReviews, loading: reviewsLoading } = useReviews(id);

  const slots = rawSlots ?? [];
  const reviews = rawReviews ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-herb-green border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl">🌿</span>
        <p className="text-sm font-medium text-foreground mt-4">Practitioner not found</p>
      </div>
    );
  }

  // Group slots by Morning, Afternoon, Evening
  const groupedSlots: Record<"Morning" | "Afternoon" | "Evening", typeof slots> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  slots.forEach((slot) => {
    const period = getPeriod(slot.startTime);
    groupedSlots[period].push(slot);
  });

  const totalSlotsCount = slots.length;
  const canBook = selectedSlot !== null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/discover" className="hover:text-foreground transition-colors">Discover</Link>
        <span>›</span>
        <span className="text-foreground font-medium">{doctor.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: Doctor info */}
        <div className="space-y-5">
          {/* Hero card */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-herb-gradient flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-2xl font-bold font-display">{doctor.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-xl font-semibold text-foreground">{doctor.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{doctor.specialty}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <HPRBadge hprId={doctor.hprId} showId />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="oklch(0.75 0.15 70)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {doctor.rating} ({doctor.reviews} reviews)
                  </span>
                  <span>·</span>
                  <span>{doctor.experience} years experience</span>
                  <span>·</span>
                  <span>📍 {doctor.location || "Online"}</span>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-end gap-2">
                <p className="text-xs text-muted-foreground">Consultation Fee</p>
                <p className="font-display text-2xl font-bold text-foreground">{formatCurrency(doctor.fee)}</p>
                <span className="text-xs text-herb-green font-medium">{doctor.nextAvailable}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Experience", value: `${doctor.experience}y` },
                { label: "Consultations", value: `${doctor.reviews}+` },
                { label: "Languages", value: doctor.languages.join(", ") },
              ].map((stat) => (
                <div key={stat.label} className="bg-background rounded-xl p-3 text-center border border-border">
                  <p className="text-sm font-bold text-herb-green font-display">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList className="w-full rounded-xl bg-muted h-10 p-1">
              <TabsTrigger value="about" className="flex-1 text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">About</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="clinic" className="flex-1 text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Clinic</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4 space-y-3">
              <div className="bg-white rounded-xl p-5 border border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
                <p className="text-sm text-foreground leading-relaxed">{doctor.about}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Qualifications</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.qualifications.map((q) => (
                    <span key={q} className="text-xs bg-herb-green/10 text-herb-green font-medium px-3 py-1.5 rounded-full border border-herb-green/20">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 space-y-3">
              {reviewsLoading ? (
                <div className="text-center text-xs text-muted-foreground py-6">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-6">No patient reviews yet.</div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-sage">{review.patientName[0]}</span>
                        </div>
                        <span className="text-sm font-medium">{review.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: review.stars }).map((_, j) => (
                            <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="oklch(0.75 0.15 70)" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    {review.text && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="clinic" className="mt-4">
              <div className="bg-white rounded-xl p-5 border border-border">
                <p className="text-sm font-semibold">Holistic Wellness Clinic</p>
                <p className="text-xs text-muted-foreground mt-1">{doctor.location || "Online Consultation"}</p>
                <div className="mt-3">
                  <span className="text-[10px] bg-herb-green/10 text-herb-green font-medium px-2 py-0.5 rounded-full">
                    HFR Registered
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Booking panel */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-1 lg:hidden">
              <p className="text-xs text-muted-foreground">Consultation Fee</p>
              <p className="font-display text-xl font-bold text-foreground">{formatCurrency(doctor.fee)}</p>
            </div>

            <h3 className="font-semibold text-foreground mb-4">Book Appointment</h3>

            {/* Date picker */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
              {DATES.map((d) => (
                <button
                  key={d.full}
                  onClick={() => {
                    setSelectedDate(d.full);
                    setSelectedSlot(null);
                  }}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-center transition-all",
                    selectedDate === d.full
                      ? "bg-herb-green border-herb-green text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:border-herb-green/40"
                  )}
                >
                  <span className="text-[10px] font-medium opacity-70">{d.label}</span>
                  <span className="text-base font-bold font-display leading-tight">{d.date}</span>
                  <span className="text-[10px] opacity-70">{d.month}</span>
                </button>
              ))}
            </div>

            {/* Slots */}
            {slotsLoading ? (
              <div className="text-center text-xs text-muted-foreground py-8">Loading open slots...</div>
            ) : totalSlotsCount === 0 ? (
              <div className="text-center text-xs text-amber-600 bg-amber-50 rounded-xl p-4 border border-amber-100">
                No open slots available for this date. Please select another date.
              </div>
            ) : (
              Object.entries(groupedSlots).map(([period, periodSlots]) => {
                if (periodSlots.length === 0) return null;
                return (
                  <div key={period} className="mb-3">
                    <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                      {period}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {periodSlots.map((slot) => {
                        const active = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-lg border transition-all",
                              active
                                ? "bg-herb-green text-white border-herb-green font-semibold"
                                : "bg-white border-border hover:border-herb-green/40 text-foreground"
                            )}
                          >
                            {slot.startTime} ({slot.mode === "video" ? "Video" : "Clinic"})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            <div className="mt-5 pt-4 border-t border-border">
              <Link
                href={
                  canBook && selectedSlot
                    ? `/booking?doctor=${doctor.id}&slot=${selectedSlot.startTime}&slotId=${selectedSlot.id}&date=${selectedDate}&mode=${selectedSlot.mode}`
                    : "#"
                }
              >
                <button
                  disabled={!canBook}
                  className={cn(
                    "w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
                    canBook
                      ? "bg-herb-green text-white hover:bg-herb-green/90 shadow-md hover:shadow-lg active:scale-95"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {canBook && selectedSlot ? `Book at ${selectedSlot.startTime} · ${formatCurrency(doctor.fee)}` : "Select a Time Slot"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
