"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HPRBadge } from "@/components/Badges";
import { MOCK_PRACTITIONERS } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

type Step = "configure" | "payment" | "confirmed";

const PAYMENT_METHODS = [
  { id: "gpay", label: "Google Pay", icon: "🟢" },
  { id: "phonepe", label: "PhonePe", icon: "🟣" },
  { id: "paytm", label: "Paytm", icon: "🔵" },
  { id: "upi", label: "UPI ID", icon: "🏦" },
  { id: "card", label: "Debit / Credit Card", icon: "💳" },
  { id: "netbank", label: "Net Banking", icon: "🏛️" },
];

function BookingContent() {
  const params = useSearchParams();
  const { user } = useAuth();

  const doctorId = params.get("doctor") ?? "doc-001";
  const slot = params.get("slot") ?? "4:30 PM";
  const date = params.get("date") ?? new Date().toISOString().split("T")[0];
  const mode = (params.get("mode") ?? "video") as "video" | "clinic";

  const doctor = MOCK_PRACTITIONERS.find((d) => d.id === doctorId) ?? MOCK_PRACTITIONERS[0];

  const [step, setStep] = useState<Step>("configure");
  const [consultMode, setConsultMode] = useState<"video" | "clinic">(mode);
  const [selectedPatient, setSelectedPatient] = useState("self");
  const [reason, setReason] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("gpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const dateLabel = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const gst = Math.round(doctor.fee * 0.18);
  const convFee = 18;
  const total = doctor.fee + gst + convFee;

  function handlePayNow() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("confirmed");
    }, 2000);
  }

  if (step === "confirmed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center py-12">
        <div className="w-24 h-24 rounded-full bg-herb-green/10 border-4 border-herb-green flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="oklch(0.29 0.09 158)" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-sm mt-2">
          You&apos;re scheduled with {doctor.name}
        </p>
        <div className="w-full max-w-sm mt-6 bg-white rounded-2xl border border-border p-5 text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-herb-gradient flex items-center justify-center">
              <span className="text-white font-bold">{doctor.avatar}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{doctor.name}</p>
              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>
          </div>
          {[
            ["Date", dateLabel],
            ["Time", slot],
            ["Mode", consultMode === "video" ? "📹 Video Consultation" : "🏥 In-Clinic"],
            ["Amount Paid", formatCurrency(total)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 mt-6 w-full max-w-sm">
          <Link href="/appointments">
            <button className="w-full py-3 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all">
              View My Appointments
            </button>
          </Link>
          <div className="flex gap-2.5">
            <Link href="/waiting-room" className="flex-1">
              <button className="w-full py-3 border border-herb-green/40 text-herb-green text-sm font-medium rounded-xl hover:bg-herb-green/5 transition-colors">
                Go to Waiting Room
              </button>
            </Link>
            <Link href="/" className="flex-1">
              <button className="w-full py-3 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/discover" className="hover:text-foreground">Discover</Link>
        <span>›</span>
        <Link href={`/doctor/${doctor.id}`} className="hover:text-foreground">{doctor.name}</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Book Appointment</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        {[
          { id: "configure", label: "Configure" },
          { id: "payment", label: "Payment" },
        ].map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  step === s.id || (s.id === "configure" && step === "payment")
                    ? "bg-herb-green text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              <span className={cn("text-xs font-medium", step === s.id ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i === 0 && <div className="w-8 h-0.5 bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: Form */}
        <div className="space-y-4">
          {step === "configure" && (
            <>
              {/* Doctor summary */}
              <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-herb-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">{doctor.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  <HPRBadge hprId={doctor.hprId} className="mt-1.5" />
                  <p className="text-xs text-herb-green mt-1 font-medium">
                    📅 {dateLabel} · {slot} · {consultMode === "video" ? "📹 Video" : "🏥 Clinic"}
                  </p>
                </div>
              </div>

              {/* Mode */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Consultation Mode</h3>
                <div className="flex rounded-xl border border-border overflow-hidden bg-background">
                  {(["video", "clinic"] as const)
                    .filter((m) => doctor.consultModes.includes(m))
                    .map((m) => (
                      <button
                        key={m}
                        onClick={() => setConsultMode(m)}
                        className={cn(
                          "flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                          consultMode === m ? "bg-herb-green text-white" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {m === "video" ? "📹 Video Consult" : "🏥 In-Clinic"}
                      </button>
                    ))}
                </div>
              </div>

              {/* Patient */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Patient</h3>
                <div className="space-y-2">
                  {["self", "family"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPatient(p)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                        selectedPatient === p ? "border-herb-green bg-herb-green/5" : "border-border hover:border-herb-green/30"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          selectedPatient === p ? "border-herb-green bg-herb-green" : "border-muted-foreground/40"
                        )}
                      >
                        {selectedPatient === p && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {p === "self" ? `Myself — ${user?.name ?? "You"}` : "Family Member"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p === "self"
                            ? user?.abhaLinked
                              ? `${user.phone?.slice(-4) ?? ""}@abha`
                              : `+91 ${user?.phone ?? ""}`
                            : "Add or select a family profile"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Chief Complaint</h3>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your primary concern (optional)…"
                  className="w-full text-sm resize-none p-3 rounded-xl border border-border focus:outline-none focus:border-herb-green/50 focus:ring-2 focus:ring-herb-green/10 transition-all placeholder:text-muted-foreground"
                />
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full py-3.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all active:scale-95 shadow-sm"
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === "payment" && (
            <>
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedPayment(m.id)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border text-sm transition-all text-left",
                        selectedPayment === m.id
                          ? "border-herb-green bg-herb-green/5"
                          : "border-border hover:border-herb-green/30"
                      )}
                    >
                      <span className="text-xl flex-shrink-0">{m.icon}</span>
                      <span className="text-xs font-medium text-foreground">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("configure")}
                  className="px-6 py-3 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all active:scale-95 shadow-sm disabled:opacity-70"
                >
                  {isProcessing ? "Processing…" : `Pay ${formatCurrency(total)}`}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: Invoice */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-5 sticky top-20">
            <h3 className="font-semibold text-foreground text-sm mb-4">Order Summary</h3>
            <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
              <div className="w-10 h-10 rounded-xl bg-herb-gradient flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{doctor.avatar}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{dateLabel} · {slot}</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Consultation Fee", formatCurrency(doctor.fee)],
                ["GST (18%)", formatCurrency(gst)],
                ["Convenience Fee", formatCurrency(convFee)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-foreground border-t border-border pt-3 mt-3">
              <span className="text-sm">Total</span>
              <span className="text-herb-green">{formatCurrency(total)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              Secure payment · 256-bit SSL encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-herb-green border-t-transparent animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
