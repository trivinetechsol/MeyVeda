"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HPRBadge } from "@/components/Badges";
import { MOCK_PRACTITIONERS } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";

const TIME_SLOTS = {
  Morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  Afternoon: ["01:00 PM", "01:30 PM", "02:00 PM", "03:00 PM", "03:30 PM"],
  Evening: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"],
};

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

const BOOKED_SLOTS = ["10:00 AM", "01:30 PM", "03:00 PM"];

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const doctor = MOCK_PRACTITIONERS.find((d) => d.id === id) ?? MOCK_PRACTITIONERS[0];

  const [selectedDate, setSelectedDate] = useState(DATES[0].full);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultMode, setConsultMode] = useState<"video" | "clinic">("video");

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
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="oklch(0.78 0.12 87)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {doctor.rating} ({doctor.reviews} reviews)
                  </span>
                  <span>·</span>
                  <span>{doctor.experience} years experience</span>
                  <span>·</span>
                  <span>📍 {doctor.location}</span>
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
              <TabsTrigger value="reviews" className="flex-1 text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Reviews</TabsTrigger>
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
                    <span key={q} className="text-xs bg-herb-green/8 text-herb-green font-medium px-3 py-1.5 rounded-full border border-herb-green/20">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 space-y-3">
              {[
                { name: "Priya S.", rating: 5, comment: "Dr. Shastri's Panchakarma guidance was transformational. My chronic joint pain reduced significantly within 6 weeks." },
                { name: "Rahul M.", rating: 5, comment: "Very thorough in her diagnosis and extremely knowledgeable about Prakriti analysis." },
                { name: "Kavitha R.", rating: 4, comment: "Excellent consultation. She explains remedies in plain language and provides clear dosage instructions." },
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-sage">{review.name[0]}</span>
                      </div>
                      <span className="text-sm font-medium">{review.name}</span>
                    </div>
                    <div className="flex">
                      {Array(review.rating).fill(0).map((_, j) => (
                        <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="oklch(0.78 0.12 87)" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="clinic" className="mt-4">
              <div className="bg-white rounded-xl p-5 border border-border">
                <p className="text-sm font-semibold">Holistic Wellness Clinic</p>
                <p className="text-xs text-muted-foreground mt-1">{doctor.location}</p>
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

            {/* Mode toggle */}
            <div className="flex rounded-xl border border-border overflow-hidden bg-background mb-4">
              {(["video", "clinic"] as const)
                .filter((m) => doctor.consultModes.includes(m))
                .map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setConsultMode(mode)}
                    className={cn(
                      "flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                      consultMode === mode
                        ? "bg-herb-green text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {mode === "video" ? "📹" : "🏥"} {mode === "video" ? "Video" : "In-Clinic"}
                  </button>
                ))}
            </div>

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
            {Object.entries(TIME_SLOTS).map(([period, slots]) => (
              <div key={period} className="mb-3">
                <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                  {period}
                </p>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => {
                    const booked = BOOKED_SLOTS.includes(slot);
                    const active = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-lg border transition-all",
                          booked && "opacity-40 cursor-not-allowed bg-muted border-border text-muted-foreground",
                          active && !booked && "bg-herb-green text-white border-herb-green font-semibold",
                          !active && !booked && "bg-white border-border hover:border-herb-green/40 text-foreground"
                        )}
                      >
                        {booked ? <s>{slot}</s> : slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-5 pt-4 border-t border-border">
              <Link
                href={
                  canBook
                    ? `/booking?doctor=${doctor.id}&slot=${selectedSlot}&date=${selectedDate}&mode=${consultMode}`
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
                  {canBook ? `Book at ${selectedSlot} · ${formatCurrency(doctor.fee)}` : "Select a Time Slot"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
