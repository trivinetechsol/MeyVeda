"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import type { AuthUser } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase";
import { sendOtp, verifyOtp } from "@/lib/otp-client";

type Step = "welcome" | "phone" | "otp" | "role" | "abha" | "patient-intake" | "practitioner-intake";
type Flow = "new" | "returning";

const HEALTH_GOALS = [
  "Improve gut health", "Better sleep", "Stress management", "Joint pain relief",
  "Immunity boost", "Weight balance", "Hormonal balance", "Skin health",
  "Energy & vitality", "Chronic disease care", "Respiratory health", "Mental clarity",
];

const DISCIPLINE_PREFS = [
  { id: "Ayurveda", icon: "🌿", desc: "Herbal & constitutional" },
  { id: "Yoga", icon: "🧘", desc: "Movement & breathing" },
  { id: "Naturopathy", icon: "☀️", desc: "Natural healing" },
  { id: "Homeopathy", icon: "💧", desc: "Micro-dose remedies" },
];

const AYUSH_QUALIFICATIONS = ["BAMS", "BUMS", "BHMS", "BNYS", "MD (Ayu)", "MS (Ayu)", "PhD"];
const AYUSH_SPECIALTIES = [
  "Panchakarma", "Kayachikitsa", "Prasuti & Stri Roga", "Kaumarabhritya",
  "Shalya Tantra", "Shalakya Tantra", "Mano Vigyan", "Swasthavritta",
  "Yoga Therapy", "Naturopathy", "Unani Internal Medicine",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("welcome");
  const [flow, setFlow] = useState<Flow>("new");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(45);
  const [role, setRole] = useState<"patient" | "practitioner" | null>(null);
  const [abhaLinked, setAbhaLinked] = useState<boolean | null>(null);
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Common intake
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say" | "">("");

  // Patient intake
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

  // Practitioner intake
  const [hprNumber, setHprNumber] = useState("");
  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [clinicName, setClinicName] = useState("");

  const STEPS_NEW: Step[] = ["welcome", "phone", "otp", "role", "abha", "patient-intake"];
  const STEPS_RETURNING: Step[] = ["welcome", "phone", "otp"];
  const stepsOrder = flow === "returning" ? STEPS_RETURNING : STEPS_NEW;
  const progressPct = step === "welcome" ? 0 : (stepsOrder.indexOf(step) / (stepsOrder.length - 1)) * 100;

  function startResendTimer() {
    let t = 45;
    setResendTimer(t);
    const interval = setInterval(() => {
      t--;
      setResendTimer(t);
      if (t <= 0) clearInterval(interval);
    }, 1000);
  }

  async function handleSendOTP() {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      // First check if user exists in flow='returning'
      const supabase = createClient();
      const { data: existingUser } = await supabase.from('users').select('id, role').eq('email', email).maybeSingle();
      
      if (flow === "returning" && !existingUser) {
        throw new Error("No account found with this email. Please sign up instead.");
      }
      if (flow === "new" && existingUser) {
        throw new Error("An account with this email already exists. Please sign in.");
      }

      await sendOtp(email);
      startResendTimer();
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpInput(index: number, val: string) {
    if (val.length > 1) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  }

  async function handleVerifyOTP() {
    const otpString = otp.join("");
    if (otpString.length < 6) return;
    setLoading(true);
    setError("");

    try {
      await verifyOtp(email, otpString);

      if (flow === "returning") {
        const supabase = createClient();
        const { data: dbUser, error: userError } = await supabase
          .from("users")
          .select("id, email, mobile, role")
          .eq("email", email)
          .single();
        
        if (userError || !dbUser) throw new Error("Could not load user data.");

        let name = "Unknown";
        if (dbUser.role === "practitioner") {
          const { data: prac } = await supabase.from("practitioners").select("full_name").eq("user_id", dbUser.id).maybeSingle();
          if (prac) name = prac.full_name;
        } else {
          const { data: pat } = await supabase.from("patients").select("full_name").eq("user_id", dbUser.id).maybeSingle();
          if (pat) name = pat.full_name;
        }

        login({
          id: dbUser.id,
          phone: dbUser.mobile || "",
          role: dbUser.role as any,
          name,
          abhaLinked: true,
          email: dbUser.email,
        });
        router.push(dbUser.role === "practitioner" ? "/pro" : "/discover");
      } else {
        setStep("role");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function finishPatient() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: newUser, error: userError } = await supabase.from('users').insert([{
        email,
        role: "patient"
      }]).select().single();

      if (userError) throw userError;

      const { error: patientError } = await supabase.from('patients').insert([{
        user_id: newUser.id,
        full_name: fullName,
        date_of_birth: dob,
        gender: gender,
        wellness_goals: selectedGoals
      }]);

      if (patientError) throw patientError;

      login({ id: newUser.id, phone: "", role: "patient", name: fullName, abhaLinked: abhaLinked === true, email });
      router.push("/discover");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  async function finishPractitioner() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: newUser, error: userError } = await supabase.from('users').insert([{
        email,
        role: "practitioner"
      }]).select().single();

      if (userError) throw userError;

      const { error: pracError } = await supabase.from('practitioners').insert([{
        user_id: newUser.id,
        full_name: fullName,
        gender: gender || null,
        hpr_id: hprNumber || null,
        qualifications: selectedQuals,
        specializations: selectedSpecialty ? [selectedSpecialty] : [],
        disciplines: selectedDisciplines.length > 0 ? selectedDisciplines : ["Ayurveda"],
      }]);

      if (pracError) throw pracError;

      login({ id: newUser.id, phone: "", role: "practitioner", name: fullName, abhaLinked: false, email });
      router.push("/pro");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create practitioner account.");
    } finally {
      setLoading(false);
    }
  }

  function toggleGoal(g: string) {
    setSelectedGoals((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);
  }

  function toggleQual(q: string) {
    setSelectedQuals((p) => p.includes(q) ? p.filter((x) => x !== q) : [...p, q]);
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-background py-8 px-4">
      <div className="w-full max-w-md">
        {step !== "welcome" && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => {
                  const prev = stepsOrder[stepsOrder.indexOf(step) - 1];
                  if (prev) setStep(prev);
                  else setStep("welcome");
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-herb-green rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Welcome ── */}
        {step === "welcome" && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-herb-gradient flex items-center justify-center mb-6 shadow-lg mx-auto">
              <span className="font-display text-white text-3xl font-bold">M</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground tracking-tight leading-tight">
              Reinvent<br />
              <span className="text-herb-green">You.</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
              India&apos;s first AYUSH digital health ecosystem — connecting ancient healing wisdom with verified modern care.
            </p>
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              {["🌿", "🧘", "☀️", "⚗️", "🔮", "💧"].map((icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center text-lg">
                  {icon}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ayurveda · Yoga · Naturopathy · Unani · Siddha · Homeopathy</p>
            <div className="flex items-center gap-2 mt-6 justify-center flex-wrap">
              {["ABDM Compliant", "HPR Verified", "FHIR Records"].map((badge) => (
                <span key={badge} className="text-[10px] bg-herb-green/10 text-herb-green font-semibold px-2.5 py-1 rounded-full border border-herb-green/20">
                  ✓ {badge}
                </span>
              ))}
            </div>
            <button
              onClick={() => { setFlow("new"); setStep("phone"); }}
              className="mt-8 w-full py-4 bg-herb-green text-white rounded-2xl text-base font-semibold hover:bg-herb-green/90 transition-all shadow-md"
            >
              Get Started
            </button>
            <button
              onClick={() => { setFlow("returning"); setStep("phone"); }}
              className="mt-3 w-full py-3 border border-border text-sm font-medium rounded-2xl hover:bg-muted transition-colors text-foreground"
            >
              Sign in to existing account
            </button>
          </div>
        )}

        {/* ── Email ── */}
        {step === "phone" && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-1">
              {flow === "returning" ? "Welcome back" : "Enter your email"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {flow === "returning"
                ? "Enter your registered email address to sign in"
                : "We'll send a one-time password to verify"}
            </p>
            <div className="flex gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-herb-green/50 focus:ring-2 focus:ring-herb-green/10"
              />
            </div>
            {flow === "new" && (
              <p className="text-xs text-muted-foreground mb-4">Your ABHA ID may be automatically linked using Aadhaar later.</p>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-700 mb-4">
                {error}
              </div>
            )}

            <button
              onClick={() => { handleSendOTP(); }}
              disabled={!email || !email.includes("@")}
              className={cn("w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
                (email && email.includes("@")) ? "bg-herb-green text-white hover:bg-herb-green/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed")}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* ── OTP ── */}
        {step === "otp" && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Verify OTP</h2>
            <p className="text-sm text-muted-foreground mb-6">Sent to {email}</p>
            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  className="w-14 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-herb-green transition-all border-border"
                />
              ))}
            </div>
            <div className="text-center mb-6">
              {resendTimer > 0 ? (
                <p className="text-xs text-muted-foreground">Resend OTP in {resendTimer}s</p>
              ) : (
                <button onClick={handleSendOTP} className="text-xs text-herb-green font-medium">Resend OTP</button>
              )}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-700 mb-4">
                {error}
              </div>
            )}
            <button
              onClick={handleVerifyOTP}
              disabled={otp.join("").length < 6 || loading}
              className={cn("w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
                otp.join("").length === 6 ? "bg-herb-green text-white hover:bg-herb-green/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed")}
            >
              {loading ? "Verifying..." : flow === "returning" ? "Sign In" : "Verify & Continue"}
            </button>
          </div>
        )}

        {/* ── Role ── */}
        {step === "role" && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-1">How will you use MeyVeda?</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose your primary role</p>
            <div className="space-y-3 mb-6">
              {[
                { id: "patient" as const, icon: "🏥", title: "Patient / Health Seeker", desc: "Book consultations, manage health records, track wellness" },
                { id: "practitioner" as const, icon: "🩺", title: "AYUSH Practitioner", desc: "Manage patients, prescribe, track practice with EMR" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn("w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                    role === r.id ? "border-herb-green bg-herb-green/5" : "border-border hover:border-herb-green/30")}
                >
                  <span className="text-3xl flex-shrink-0">{r.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (role === "practitioner") setStep("practitioner-intake");
                else setStep("abha");
              }}
              disabled={!role}
              className={cn("w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
                role ? "bg-herb-green text-white hover:bg-herb-green/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed")}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── ABHA (patient only) ── */}
        {step === "abha" && (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground">Link ABHA ID</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              ABHA (Ayushman Bharat Health Account) enables seamless health record sharing across India.
            </p>
            <div className="space-y-3 mb-4">
              {[true, false].map((link) => (
                <button
                  key={link.toString()}
                  onClick={() => setAbhaLinked(link)}
                  className={cn("w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                    abhaLinked === link ? "border-herb-green bg-herb-green/5" : "border-border hover:border-herb-green/30")}
                >
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    abhaLinked === link ? "border-herb-green bg-herb-green" : "border-muted-foreground/40")}>
                    {abhaLinked === link && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{link ? "Yes, link my ABHA ID" : "Skip for now"}</p>
                    <p className="text-xs text-muted-foreground">{link ? "Link via Aadhaar OTP — takes 60 seconds" : "You can link later from Profile → ABHA & ABDM"}</p>
                  </div>
                </button>
              ))}
            </div>
            {abhaLinked && (
              <input
                type="text"
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm mb-4 focus:outline-none focus:border-herb-green/50"
              />
            )}
            <button
              onClick={() => setStep("patient-intake")}
              disabled={abhaLinked === null}
              className={cn("w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
                abhaLinked !== null ? "bg-herb-green text-white hover:bg-herb-green/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed")}
            >
              {abhaLinked ? "Link & Continue" : "Continue"}
            </button>
          </div>
        )}

        {/* ── Patient Intake ── */}
        {step === "patient-intake" && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Your Details & Goals</h2>
            <p className="text-sm text-muted-foreground mb-6">Help us personalise your MeyVeda experience</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohit Kumar"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-herb-green/50 focus:ring-2 focus:ring-herb-green/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-herb-green/50 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-herb-green/50 bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Health Goals (select all that apply)</p>
              <div className="flex flex-wrap gap-2">
                {HEALTH_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn("text-xs px-3 py-1.5 rounded-full border transition-all",
                      selectedGoals.includes(goal) ? "bg-herb-green text-white border-herb-green" : "border-border text-muted-foreground hover:border-herb-green/40")}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preferred AYUSH Disciplines</p>
              <div className="grid grid-cols-2 gap-2">
                {DISCIPLINE_PREFS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDisciplines((p) => p.includes(d.id) ? p.filter((x) => x !== d.id) : [...p, d.id])}
                    className={cn("flex items-center gap-2 p-3 rounded-xl border text-left transition-all",
                      selectedDisciplines.includes(d.id) ? "border-herb-green bg-herb-green/5" : "border-border hover:border-herb-green/30")}
                  >
                    <span className="text-xl">{d.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{d.id}</p>
                      <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-700 mb-4">
                {error}
              </div>
            )}
            <button
              onClick={finishPatient}
              disabled={!fullName || !dob || !gender || loading}
              className={cn("w-full py-3.5 bg-herb-green text-white rounded-xl text-sm font-semibold transition-all shadow-md",
                (!fullName || !dob || !gender || loading) ? "opacity-60 cursor-not-allowed" : "hover:bg-herb-green/90")}
            >
              {loading ? "Creating account..." : "Enter MeyVeda ✨"}
            </button>
          </div>
        )}

        {/* ── Practitioner Intake ── */}
        {step === "practitioner-intake" && (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center">
                <span className="text-xl">🩺</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground">Practitioner Details</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Help us verify and set up your practitioner profile.</p>

            <div className="space-y-4 mb-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Aditi Shastri"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-copper/50 focus:ring-2 focus:ring-copper/10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-copper/50 bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  HPR Registration Number
                </label>
                <input
                  type="text"
                  value={hprNumber}
                  onChange={(e) => setHprNumber(e.target.value)}
                  placeholder="e.g. HPR-4902-8822"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-copper/50 focus:ring-2 focus:ring-copper/10"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Your Health Professional Registry ID from NMC / AYUSH council</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Qualifications (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AYUSH_QUALIFICATIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => toggleQual(q)}
                      className={cn("text-xs px-3 py-1.5 rounded-full border transition-all",
                        selectedQuals.includes(q) ? "bg-copper text-white border-copper" : "border-border text-muted-foreground hover:border-copper/40")}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Primary Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-copper/50 bg-white"
                >
                  <option value="">Select specialty</option>
                  {AYUSH_SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Clinic / Hospital Name (optional)
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="e.g. Holistic Wellness Clinic"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-copper/50 focus:ring-2 focus:ring-copper/10"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-700 mb-4">
                {error}
              </div>
            )}
            <button
              onClick={finishPractitioner}
              disabled={!fullName || !gender || loading}
              className={cn("w-full py-3.5 bg-copper text-white rounded-xl text-sm font-semibold transition-all shadow-md",
                (!fullName || !gender || loading) ? "opacity-60 cursor-not-allowed" : "hover:bg-copper/90")}
            >
              {loading ? "Creating account..." : "Set Up My Practice ✨"}
            </button>
            <button
              onClick={finishPractitioner}
              className="w-full py-2.5 mt-2 border border-border text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              Skip — I&apos;ll fill this in later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
