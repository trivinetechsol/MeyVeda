"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "intake" | "vitals" | "medical-history" | "history" | "care-team" | "reports";

type VitalsRecord = {
  date: string; doctor: string; doctorInitials: string; isYou?: boolean;
  bpSys: number; bpDia: number; pulse: number; temp: number;
  spo2: number; rr: number; weight: number; height: number;
};

function vStat(key: string, n: number): "normal" | "warning" | "alert" {
  if (key === "bpSys")  return n < 90 ? "alert"   : n <= 120 ? "normal" : n <= 139 ? "warning" : "alert";
  if (key === "bpDia")  return n < 60 ? "warning"  : n <= 80  ? "normal" : n <= 89  ? "warning" : "alert";
  if (key === "pulse")  return n < 60 || n > 100   ? "warning" : "normal";
  if (key === "temp")   return n < 97 ? "warning"  : n <= 99  ? "normal" : n <= 100.4 ? "warning" : "alert";
  if (key === "spo2")   return n < 90 ? "alert"    : n < 95   ? "warning" : "normal";
  if (key === "rr")     return n < 12 || n > 20    ? "warning" : "normal";
  return "normal";
}

function bmi(w: number, h: number) { return (w / Math.pow(h / 100, 2)).toFixed(1); }

function trend(curr: number, prev: number, positive: "up" | "down"): { arrow: string; color: string } {
  const delta = ((curr - prev) / prev) * 100;
  if (Math.abs(delta) < 2) return { arrow: "→", color: "text-muted-foreground" };
  const up = curr > prev;
  const good = positive === "up" ? up : !up;
  return { arrow: up ? "↑" : "↓", color: good ? "text-herb-green" : "text-amber-600" };
}

const PATIENTS: Record<string, {
  name: string; age: number; gender: string; phone: string;
  abha: string | null; prakriti: string; reason: string;
  mode: "video" | "clinic"; time: string; symptoms: string[];
  duration: string;
}> = {
  p1: {
    name: "Rohit Kumar", age: 32, gender: "Male", phone: "+91 98765 43210",
    abha: "rohit@abha", prakriti: "Vata-Pitta",
    reason: "Digestive issues and chronic fatigue for 3 weeks",
    mode: "video", time: "4:30 PM",
    symptoms: ["Fatigue", "Bloating", "Poor digestion", "Disturbed sleep", "Low appetite"],
    duration: "3 weeks · Gradually worsening",
  },
  p2: {
    name: "Meera Patel", age: 45, gender: "Female", phone: "+91 87654 32109",
    abha: "meera@abha", prakriti: "Pitta-Kapha",
    reason: "Joint pain and reduced mobility in knees and hips",
    mode: "clinic", time: "5:00 PM",
    symptoms: ["Joint pain", "Morning stiffness", "Reduced mobility", "Swelling"],
    duration: "6 months · Worsening in winters",
  },
  p3: {
    name: "Suresh Rao", age: 58, gender: "Male", phone: "+91 76543 21098",
    abha: null, prakriti: "Kapha",
    reason: "Chronic skin condition — recurring patches since last year",
    mode: "video", time: "5:30 PM",
    symptoms: ["Dry patches", "Itching", "Redness", "Scaling"],
    duration: "1 year · Recurring episodes",
  },
};

type VisitRecord = {
  id: string;
  date: string; time: string; duration: string;
  mode: "video" | "clinic";
  doctor: string; specialty: string; doctorInitials: string; isYou?: boolean;
  chiefComplaint: string;
  soap: { S: string; O: string; A: string; P: string };
  diagnosis: string;
  vitals: { bpSys: number; bpDia: number; pulse: number; temp: number; spo2: number; rr: number; weight: number; height: number } | null;
  medications: { name: string; dose: string; frequency: string; anupana: string; system: string }[];
  investigations: string[];
  referrals: { specialty: string; urgency: string }[];
  followUpDate: string | null;
  followUpInstructions: string;
  type: "initial" | "follow-up" | "review" | "urgent";
};

const VISITS: Record<string, VisitRecord[]> = {
  p1: [
    {
      id: "v1-4", date: "05 Jun 2026", time: "4:30 PM", duration: "28 min", mode: "video",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "follow-up",
      chiefComplaint: "Persistent bloating and fatigue — not improving despite previous Rx",
      soap: {
        S: "Patient reports continued abdominal bloating after meals, fatigue by 3–4 PM daily. Sleep has improved marginally (6–6.5 hrs). Appetite remains poor in the mornings. Stress at work ongoing. Reports cold extremities and occasional headache.",
        O: "Pulse (Nadi): Vata predominant, irregular rhythm. Tongue: slightly coated, Ama present. Abdomen: mild distension. BP 118/76, Pulse 72 bpm, SpO₂ 98%, Temp 98.6°F, Wt 72 kg.",
        A: "Vataja Grahani with persistent Ama accumulation. Agni (digestive fire) remains weak. Anxiety contributing to Vata aggravation. Triphala + Ashwagandha regimen partially effective — dose adjustment needed. Add Brahmi Ghrita for Medhya (cognitive) support.",
        P: "Increase Ashwagandha to 5g BD. Add Brahmi Ghrita 5ml OD with warm milk at bedtime. Continue Triphala. Advise warm water fasting for 1 day this week. Dinacharya: Abhyanga 3x/week. Avoid raw cold foods. Yoga: Pavanamuktasana sequence daily.",
      },
      diagnosis: "Vataja Grahani (IBS) with Ama — follow-up, dose escalation",
      vitals: { bpSys: 118, bpDia: 76, pulse: 72, temp: 98.6, spo2: 98, rr: 16, weight: 72, height: 175 },
      medications: [
        { name: "Ashwagandha Churna",  dose: "5g",    frequency: "Twice daily with warm milk",     anupana: "Warm milk",  system: "Ayurveda" },
        { name: "Triphala Churna",     dose: "3g",    frequency: "Bedtime with warm water",         anupana: "Warm water", system: "Ayurveda" },
        { name: "Brahmi Ghrita",       dose: "5ml",   frequency: "Once daily at bedtime",           anupana: "Warm milk",  system: "Ayurveda" },
      ],
      investigations: ["LFT", "CBC"],
      referrals: [],
      followUpDate: "05 Jul 2026",
      followUpInstructions: "Review LFT + CBC results. Reassess Agni. Consider Panchakarma eval if no improvement.",
    },
    {
      id: "v1-3", date: "28 May 2026", time: "6:00 PM", duration: "22 min", mode: "video",
      doctor: "Dr. Rajan Menon", specialty: "Homeopathy", doctorInitials: "RM",
      type: "follow-up",
      chiefComplaint: "Sleep disturbance, generalised anxiety, palpitations at night",
      soap: {
        S: "Patient unable to sleep before 1:30 AM. Wakes at 3–4 AM with anxious thoughts. Palpitations noted 2–3x/week at night. Work deadline stress. No chest pain or breathlessness. Appetite slightly suppressed.",
        O: "Alert and oriented. Anxious affect. BP 116/74, HR 70 bpm, SpO₂ 98%. No peripheral oedema. Respiratory clear.",
        A: "Stress-induced anxiety with sleep disruption and nocturnal palpitations. Homeopathic picture: Nux Vomica type (fastidious, overworked, stimulant-seeking). Passiflora Q for sleep support.",
        P: "Nux Vomica 30C 4 pellets twice daily x 4 weeks. Passiflora Q 10 drops in water at bedtime. Counsel: reduce screen time after 9 PM, avoid coffee after 3 PM. Breathing exercises (4-7-8).",
      },
      diagnosis: "Stress-induced anxiety with insomnia and nocturnal palpitations",
      vitals: { bpSys: 116, bpDia: 74, pulse: 70, temp: 98.5, spo2: 98, rr: 15, weight: 72, height: 175 },
      medications: [
        { name: "Nux Vomica 30C",  dose: "4 pellets", frequency: "Twice daily",  anupana: "Plain water", system: "Homeopathy" },
        { name: "Passiflora Q",    dose: "10 drops",  frequency: "Bedtime",      anupana: "Water",       system: "Homeopathy" },
      ],
      investigations: [],
      referrals: [],
      followUpDate: "28 Jun 2026",
      followUpInstructions: "Reassess sleep quality and anxiety levels. Adjust potency if insufficient response.",
    },
    {
      id: "v1-2", date: "14 Apr 2026", time: "5:00 PM", duration: "32 min", mode: "video",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "follow-up",
      chiefComplaint: "Bloating after meals, irregular bowel habits, persistent fatigue, low mood",
      soap: {
        S: "Reports bloating 30–60 min after meals, alternating constipation and loose stools, fatigue by afternoon. Low mood linked to work stress. Weight unchanged. Sleep 5–6 hrs.",
        O: "Nadi: Vata irregular. Tongue: white coating, mild tremor. Abdomen: distension, tympanic. BP 122/80, Pulse 76, SpO₂ 97%, Temp 98.4°F, Wt 73 kg.",
        A: "Vataja Grahani progressing with emotional overlay. Agni remains compromised. Prakriti re-confirmed Vata-Pitta. Starter Ashwagandha partially effective — needs dose increase and adjunct therapy.",
        P: "Increase Ashwagandha to 3g BD (from 1g). Add Jeerakadyarishta 15ml twice daily after meals. Dietary: Vata-pacifying diet strictly. Lifestyle: sleep by 10:30 PM, reduce travel.",
      },
      diagnosis: "Vataja Grahani — dose escalation, emotional overlay",
      vitals: { bpSys: 122, bpDia: 80, pulse: 76, temp: 98.4, spo2: 97, rr: 17, weight: 73, height: 175 },
      medications: [
        { name: "Ashwagandha Churna",   dose: "3g",    frequency: "Twice daily after meals", anupana: "Warm milk",  system: "Ayurveda" },
        { name: "Jeerakadyarishta",     dose: "15ml",  frequency: "Twice daily after meals", anupana: "Equal water", system: "Ayurveda" },
      ],
      investigations: ["HbA1c", "Vitamin D3"],
      referrals: [],
      followUpDate: "05 Jun 2026",
      followUpInstructions: "Review Vit D and HbA1c. Monitor mood and bowel habits. Consider stress counselling referral.",
    },
    {
      id: "v1-1", date: "18 Feb 2026", time: "3:30 PM", duration: "45 min", mode: "clinic",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "initial",
      chiefComplaint: "First visit — digestive issues for 3 months, chronic fatigue, general wellness",
      soap: {
        S: "Patient presents with 3-month history of bloating, irregular bowel habits, fatigue, and poor sleep. Works in IT, night shifts 2–3x/week. Diet mostly processed and irregular. No significant past history. No current medications. Family history: father has T2DM.",
        O: "Prakriti assessment: Vata-Pitta (Vata dominant). Nadi: irregular, Vata quality. Tongue: slightly dry, mild tremor. Abdomen: mild distension. BP 120/78, Pulse 74, SpO₂ 96%, Temp 99.1°F, Wt 74 kg, Ht 175 cm. BMI 24.2.",
        A: "Vataja Grahani (IBS, Vata-dominant digestive disorder) with Agni dushti. Lifestyle factors heavily contributing. Initial Ama accumulation. Vata-Pitta Prakriti with stress as primary trigger.",
        P: "Start with Ashwagandha Churna 1g OD (mild dose). Advise Vata-pacifying diet: warm, cooked, oily, avoid raw/cold food. Dinacharya: Abhyanga self-massage, early bedtime. Yoga: Surya Namaskar 6 rounds. Review in 8 weeks.",
      },
      diagnosis: "Vataja Grahani (IBS, Vata dominant) — Initial presentation and Prakriti assessment",
      vitals: { bpSys: 120, bpDia: 78, pulse: 74, temp: 99.1, spo2: 96, rr: 18, weight: 74, height: 175 },
      medications: [
        { name: "Ashwagandha Churna", dose: "1g", frequency: "Once daily at bedtime", anupana: "Warm milk", system: "Ayurveda" },
      ],
      investigations: ["CBC", "LFT", "Thyroid (TSH + T3 + T4)", "Vitamin D3", "Vitamin B12"],
      referrals: [],
      followUpDate: "14 Apr 2026",
      followUpInstructions: "Review investigation results. Assess Agni improvement. Adjust formulation based on response.",
    },
  ],
  p2: [
    {
      id: "v2-3", date: "01 Jun 2026", time: "5:00 PM", duration: "35 min", mode: "clinic",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "follow-up",
      chiefComplaint: "Bilateral knee pain worsening — difficulty climbing stairs, morning stiffness > 45 min",
      soap: {
        S: "Morning stiffness lasting 45–60 min. Pain VAS 6/10 at rest, 8/10 on stairs. Swelling in right knee. Reports mild improvement with Kanchanara Guggulu from previous Siddha Rx. On Amlodipine 5mg for hypertension (stable).",
        O: "Gait: antalgic. Bilateral crepitus. Right knee mild effusion. ROM: flexion 100°. Nadi: Vata-Pitta. BP 138/88, Pulse 82, SpO₂ 97%, Temp 98.2°F, Wt 78 kg.",
        A: "Sandhivata (Vata-dominant osteoarthritis) with Pitta-mediated inflammation. Ama in Sandhi (joint spaces). Weight at 78kg — obesity exacerbating mechanical load. Combined AYUSH approach with existing Siddha Rx appropriate.",
        P: "Add Maharasnadi Kashayam 15ml twice daily before meals. Add Rasna Saptakam 10ml OD. Local: Mahanarayan Taila Abhyanga to knees twice daily. Dietary: anti-inflammatory Pitta diet, no nightshades. Weight management target: 72kg. Physiotherapy 3x/week.",
      },
      diagnosis: "Sandhivata (Bilateral Knee OA) — Pitta-Vata mixed, Ama involvement",
      vitals: { bpSys: 138, bpDia: 88, pulse: 82, temp: 98.2, spo2: 97, rr: 17, weight: 78, height: 162 },
      medications: [
        { name: "Maharasnadi Kashayam", dose: "15ml", frequency: "Twice daily before meals", anupana: "Warm water", system: "Ayurveda" },
        { name: "Rasna Saptakam",       dose: "10ml", frequency: "Once daily",               anupana: "Warm water", system: "Ayurveda" },
        { name: "Shallaki (Boswellia)", dose: "400mg",frequency: "Thrice daily with meals",   anupana: "Water",      system: "Ayurveda" },
      ],
      investigations: ["ESR + CRP", "Uric Acid", "X-ray Bilateral Knees (standing)"],
      referrals: [{ specialty: "Orthopedics", urgency: "routine" }],
      followUpDate: "01 Jul 2026",
      followUpInstructions: "Review X-ray + inflammatory markers. Reassess pain score. Consider Panchakarma (Janu Basti) if no improvement.",
    },
    {
      id: "v2-2", date: "15 May 2026", time: "11:00 AM", duration: "20 min", mode: "clinic",
      doctor: "Dr. Priya Varma", specialty: "Siddha", doctorInitials: "PV",
      type: "review",
      chiefComplaint: "Follow-up — joint pain, referred by physio for Siddha opinion",
      soap: {
        S: "Joint pain with inflammation visible in knees. Reports mild improvement with diet changes. Morning stiffness present. No fever. BP controlled on Amlodipine.",
        O: "Bilateral knee mild effusion. Thambira Chendooram indicated. BP 142/90, Pulse 85, SpO₂ 96%, Temp 98.0°F, Wt 79 kg.",
        A: "Pitta-Vata vatham affecting Sandhi. Siddha approach: reduce Pitta-mediated inflammation first. Kanchanara Guggulu appropriate cross-system.",
        P: "Start Kanchanara Guggulu 2 tabs twice daily. Siddha dietary protocol: avoid sour, fermented, spicy foods. Warm Castor oil application locally.",
      },
      diagnosis: "Pitta-Vata aggravation — joint inflammation (Siddha assessment)",
      vitals: { bpSys: 142, bpDia: 90, pulse: 85, temp: 98.0, spo2: 96, rr: 18, weight: 79, height: 162 },
      medications: [
        { name: "Kanchanara Guggulu", dose: "2 tabs", frequency: "Twice daily with warm water", anupana: "Warm water", system: "Siddha" },
      ],
      investigations: [],
      referrals: [],
      followUpDate: "01 Jun 2026",
      followUpInstructions: "Coordinate with Dr. Aditi's Ayurveda plan. Report any GI side effects.",
    },
    {
      id: "v2-1", date: "20 Mar 2026", time: "10:30 AM", duration: "40 min", mode: "clinic",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "initial",
      chiefComplaint: "Initial visit — bilateral knee pain, weight gain, joint stiffness",
      soap: {
        S: "6-month history of bilateral knee pain, worse on standing from sitting and on stairs. Morning stiffness ~30 min. Weight gain of 8kg in 2 years. Known hypertension on Amlodipine 5mg (stable). Post-hysterectomy 2019. Family history: mother has OA, father had CVD.",
        O: "Prakriti: Pitta-Kapha. Nadi: Pitta-Kapha. Bilateral crepitus, mild synovial thickening. ROM limited. BP 136/86, Pulse 80, SpO₂ 97%, Temp 98.3°F, Wt 80 kg, Ht 162 cm. BMI 30.5.",
        A: "Sandhivata with Ama accumulation. Kapha contributing to excess weight and joint loading. Pitta causing inflammatory component. Hypertension noted and monitored by allopathic physician — no change in that Rx.",
        P: "Start Vata-Kapha pacifying diet. Weight reduction target 72kg. Abhyanga to joints with Dhanwantaram Taila. Begin yoga: Tadasana, Virabhadrasana, Setu Bandhasana. Start Punarnava Mandoora 2 tabs BD for Kapha and joint support.",
      },
      diagnosis: "Sandhivata (OA, bilateral knees) — Initial assessment, Pitta-Kapha Prakriti",
      vitals: { bpSys: 136, bpDia: 86, pulse: 80, temp: 98.3, spo2: 97, rr: 16, weight: 80, height: 162 },
      medications: [
        { name: "Punarnava Mandoora", dose: "2 tabs", frequency: "Twice daily before meals", anupana: "Warm water", system: "Ayurveda" },
      ],
      investigations: ["CBC", "ESR + CRP", "Uric acid", "Lipid Panel", "Fasting Blood Sugar", "X-ray Knees"],
      referrals: [],
      followUpDate: "15 May 2026",
      followUpInstructions: "Review investigation results. Assess weight progress. Adjust formulations.",
    },
  ],
  p3: [
    {
      id: "v3-2", date: "20 May 2026", time: "6:00 PM", duration: "25 min", mode: "video",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "follow-up",
      chiefComplaint: "Skin patches worsening — new lesions on scalp, itching intensified",
      soap: {
        S: "Patient reports new plaques on scalp and posterior elbows since last visit. Itching increased in evenings. Stress at work (pending retirement paperwork). HbA1c 6.8% (checked by cardiologist — stable). BP and cholesterol controlled on allopathic Rx.",
        O: "Skin: erythematous silvery-scaled plaques on scalp (>5cm) and bilateral elbows. PASI score: ~8. Koebner phenomenon absent. Nadi: Kapha-Pitta. BP 128/82, Pulse 68, SpO₂ 97%, Temp 98.8°F, Wt 88 kg.",
        A: "Kushtaroga (Psoriasis) — Kapha-Pitta type. Stress as major trigger (Vata involvement secondary). Metabolic syndrome (DM2 + HTN + dyslipidaemia) may be slowing healing. Systemic Shodhana (purification) needed alongside Shamana.",
        P: "Continue Neem + Manjishtha. Add Khadirarishta 20ml twice daily after meals. External: Marichadi Taila topically to plaques at night. Advise: reduce stress, maintain low glycaemic diet. Review in 4 weeks.",
      },
      diagnosis: "Kushtaroga (Plaque Psoriasis) — Kapha-Pitta, stress-aggravated",
      vitals: { bpSys: 128, bpDia: 82, pulse: 68, temp: 98.8, spo2: 97, rr: 15, weight: 88, height: 170 },
      medications: [
        { name: "Neem Capsule",      dose: "500mg", frequency: "Twice daily",              anupana: "Water",       system: "Ayurveda" },
        { name: "Manjishtha Extract",dose: "500mg", frequency: "Once daily",               anupana: "Warm water",  system: "Ayurveda" },
        { name: "Khadirarishta",     dose: "20ml",  frequency: "Twice daily after meals",  anupana: "Equal water", system: "Ayurveda" },
      ],
      investigations: ["HbA1c", "Lipid Panel", "CBC"],
      referrals: [{ specialty: "Dermatology", urgency: "routine" }],
      followUpDate: "20 Jun 2026",
      followUpInstructions: "Review PASI score, check investigation results. Consider Panchakarma (Virechana) consult if no improvement.",
    },
    {
      id: "v3-1", date: "10 Mar 2026", time: "5:30 PM", duration: "38 min", mode: "video",
      doctor: "Dr. Aditi Shastri", specialty: "Ayurveda", doctorInitials: "AS", isYou: true,
      type: "initial",
      chiefComplaint: "First visit — recurring skin patches for 1 year, no improvement on allopathic treatment",
      soap: {
        S: "58M with 1-year history of recurring erythematous scaly plaques. Has tried steroid creams and salicylic acid lotions — partial temporary relief. Known T2DM (Metformin), HTN (Telmisartan), Dyslipidaemia (Rosuvastatin). Ex-smoker (quit 2012). Stress: recently retired.",
        O: "Prakriti: Kapha. Nadi: Kapha-Pitta. Skin: silvery-scaled plaques over elbows and scalp. PASI: ~6. Tongue: coated, Kapha. BP 130/84, Pulse 70, SpO₂ 96%, Temp 98.5°F, Wt 90 kg, Ht 170 cm. BMI 31.1.",
        A: "Kushtaroga — Kapha dominant psoriasis. Underlying Ama, metabolic toxin accumulation. DM + dyslipidaemia as Santarpana (excess nourishment) causes. Allopathic medications reviewed — no direct drug-AYUSH interaction of concern.",
        P: "Start Panchatikta Ghrita 5ml OD before breakfast (Shodhana base). Neem capsules 500mg BD. Dietary: no dairy, no wheat, reduce sugar strictly. Lifestyle: stress management critical. Yoga: Pranayama (Anulom Vilom) 10 min daily.",
      },
      diagnosis: "Kushtaroga (Plaque Psoriasis) — Initial presentation, Kapha dominant, Ama accumulation",
      vitals: { bpSys: 130, bpDia: 84, pulse: 70, temp: 98.5, spo2: 96, rr: 16, weight: 90, height: 170 },
      medications: [
        { name: "Panchatikta Ghrita", dose: "5ml",   frequency: "Once daily before breakfast", anupana: "Warm water", system: "Ayurveda" },
        { name: "Neem Capsule",       dose: "500mg",  frequency: "Twice daily",                anupana: "Water",      system: "Ayurveda" },
      ],
      investigations: ["CBC", "LFT", "KFT", "HbA1c", "Lipid Panel"],
      referrals: [],
      followUpDate: "20 May 2026",
      followUpInstructions: "Review all investigations. Assess Panchatikta Ghrita tolerance. Evaluate PASI change.",
    },
  ],
};

const CARE_TEAMS: Record<string, { id: string; name: string; initials: string; specialty: string; qualification: string; hprId: string; since: string; lastVisit: string; nextFollowUp: string; totalRx: number; isYou?: boolean }[]> = {
  p1: [
    { id: "doc-aditi", name: "Dr. Aditi Shastri", initials: "AS", specialty: "Ayurveda",   qualification: "BAMS, MD (Ayu)",  hprId: "HPR-4902-8822", since: "18 Feb 2026", lastVisit: "05 Jun 2026", nextFollowUp: "05 Jul 2026", totalRx: 2, isYou: true },
    { id: "doc-rajan", name: "Dr. Rajan Menon",   initials: "RM", specialty: "Homeopathy", qualification: "BHMS, MD (Hom)", hprId: "HPR-3301-7654", since: "28 May 2026", lastVisit: "28 May 2026", nextFollowUp: "28 Jun 2026", totalRx: 1 },
  ],
  p2: [
    { id: "doc-aditi", name: "Dr. Aditi Shastri", initials: "AS", specialty: "Ayurveda", qualification: "BAMS, MD (Ayu)",   hprId: "HPR-4902-8822", since: "20 Mar 2026", lastVisit: "01 Jun 2026", nextFollowUp: "01 Jul 2026", totalRx: 2, isYou: true },
    { id: "doc-priya", name: "Dr. Priya Varma",   initials: "PV", specialty: "Siddha",   qualification: "BSMS, MD (Sid)", hprId: "HPR-6611-2290", since: "15 May 2026", lastVisit: "15 May 2026", nextFollowUp: "20 Jun 2026", totalRx: 1 },
  ],
  p3: [
    { id: "doc-aditi", name: "Dr. Aditi Shastri", initials: "AS", specialty: "Ayurveda", qualification: "BAMS, MD (Ayu)", hprId: "HPR-4902-8822", since: "10 Mar 2026", lastVisit: "20 May 2026", nextFollowUp: "20 Jun 2026", totalRx: 2, isYou: true },
  ],
};

const VITALS_HISTORY: Record<string, VitalsRecord[]> = {
  p1: [
    { date: "05 Jun 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 118, bpDia: 76, pulse: 72, temp: 98.6, spo2: 98, rr: 16, weight: 72, height: 175 },
    { date: "28 May 2026", doctor: "Dr. Rajan Menon",   doctorInitials: "RM",               bpSys: 116, bpDia: 74, pulse: 70, temp: 98.5, spo2: 98, rr: 15, weight: 72, height: 175 },
    { date: "14 Apr 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 122, bpDia: 80, pulse: 76, temp: 98.4, spo2: 97, rr: 17, weight: 73, height: 175 },
    { date: "18 Feb 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 120, bpDia: 78, pulse: 74, temp: 99.1, spo2: 96, rr: 18, weight: 74, height: 175 },
  ],
  p2: [
    { date: "01 Jun 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 138, bpDia: 88, pulse: 82, temp: 98.2, spo2: 97, rr: 17, weight: 78, height: 162 },
    { date: "15 May 2026", doctor: "Dr. Priya Varma",   doctorInitials: "PV",               bpSys: 142, bpDia: 90, pulse: 85, temp: 98.0, spo2: 96, rr: 18, weight: 79, height: 162 },
    { date: "20 Mar 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 136, bpDia: 86, pulse: 80, temp: 98.3, spo2: 97, rr: 16, weight: 80, height: 162 },
    { date: "15 Jan 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 130, bpDia: 84, pulse: 78, temp: 98.1, spo2: 98, rr: 16, weight: 81, height: 162 },
  ],
  p3: [
    { date: "20 May 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 128, bpDia: 82, pulse: 68, temp: 98.8, spo2: 97, rr: 15, weight: 88, height: 170 },
    { date: "10 Mar 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 130, bpDia: 84, pulse: 70, temp: 98.5, spo2: 96, rr: 16, weight: 90, height: 170 },
    { date: "15 Jan 2026", doctor: "Dr. Aditi Shastri", doctorInitials: "AS", isYou: true,  bpSys: 126, bpDia: 80, pulse: 66, temp: 98.6, spo2: 97, rr: 15, weight: 91, height: 170 },
  ],
};

const REPORTS = [
  { name: "CBC Report",            date: "10 Apr 2026", type: "Lab", size: "1.2 MB" },
  { name: "Liver Function Test",   date: "10 Apr 2026", type: "Lab", size: "0.8 MB" },
  { name: "Previous Prescription", date: "14 Apr 2026", type: "Rx",  size: "0.2 MB" },
];

type AllergyEntry = { allergen: string; type: "drug" | "food" | "environmental" | "other"; reaction: string; severity: "mild" | "moderate" | "severe" | "life-threatening"; since: string };
type MedEntry     = { name: string; dose: string; frequency: string; system: "Ayurveda" | "Homeopathy" | "Siddha" | "Naturopathy" | "Allopathic" | "OTC"; prescribedBy: string; since: string; active: boolean };
type PMHEntry     = { condition: string; year: string; status: "resolved" | "ongoing" | "managed"; notes: string };
type SurgeryEntry = { procedure: string; year: string; hospital: string; notes?: string };
type FamilyEntry  = { relation: string; condition: string; age?: string; notes?: string };
type SocialHistory = { occupation: string; marital: string; tobacco: string; alcohol: string; diet: string; exercise: string; notes?: string };
type ImmunEntry   = { vaccine: string; date: string; doses: string; status: "complete" | "partial" | "due" };

const MEDICAL_HISTORY: Record<string, {
  allergies: AllergyEntry[]; medications: MedEntry[]; pmh: PMHEntry[];
  surgeries: SurgeryEntry[]; family: FamilyEntry[]; social: SocialHistory;
  immunizations: ImmunEntry[];
}> = {
  p1: {
    allergies: [
      { allergen: "Sulfonamides",  type: "drug",  reaction: "Skin rash, pruritus",       severity: "moderate", since: "2018" },
      { allergen: "Peanuts",       type: "food",  reaction: "Urticaria, swelling",        severity: "moderate", since: "Childhood" },
    ],
    medications: [
      { name: "Ashwagandha Churna",  dose: "5g",    frequency: "Twice daily",   system: "Ayurveda",   prescribedBy: "Dr. Aditi Shastri", since: "May 2026",  active: true  },
      { name: "Triphala Churna",     dose: "3g",    frequency: "Bedtime",       system: "Ayurveda",   prescribedBy: "Dr. Aditi Shastri", since: "May 2026",  active: true  },
      { name: "Brahmi Ghrita",       dose: "5ml",   frequency: "Once daily",    system: "Ayurveda",   prescribedBy: "Dr. Aditi Shastri", since: "Jun 2026",  active: true  },
      { name: "Nux Vomica 30C",      dose: "4 pellets", frequency: "Twice daily", system: "Homeopathy", prescribedBy: "Dr. Rajan Menon",   since: "May 2026",  active: true  },
      { name: "Passiflora Q",        dose: "10 drops", frequency: "Bedtime",     system: "Homeopathy", prescribedBy: "Dr. Rajan Menon",   since: "May 2026",  active: true  },
      { name: "Vitamin D3 (OTC)",    dose: "60k IU",  frequency: "Once weekly", system: "OTC",         prescribedBy: "Self",              since: "Mar 2026",  active: true  },
    ],
    pmh: [
      { condition: "IBS — Irritable Bowel Syndrome", year: "2022", status: "ongoing",  notes: "Flares with stress" },
      { condition: "Seasonal allergic rhinitis",      year: "2018", status: "managed",  notes: "Managed with antihistamines" },
    ],
    surgeries: [],
    family: [
      { relation: "Father", condition: "Type 2 Diabetes",  age: "58y", notes: "On insulin" },
      { relation: "Mother", condition: "Hypothyroidism",    age: "55y" },
    ],
    social: {
      occupation: "Software Engineer", marital: "Married",
      tobacco: "None", alcohol: "Occasional (social)",
      diet: "Non-vegetarian", exercise: "Walking 20 min/day",
      notes: "High-stress work environment. Works night shifts 2–3x/week.",
    },
    immunizations: [
      { vaccine: "COVID-19 (Covishield)",    date: "Aug 2021", doses: "2/2",  status: "complete" },
      { vaccine: "COVID-19 Booster",         date: "Feb 2022", doses: "1/1",  status: "complete" },
      { vaccine: "Hepatitis B",              date: "2019",     doses: "3/3",  status: "complete" },
      { vaccine: "Influenza (Seasonal)",     date: "Oct 2025", doses: "Annual", status: "complete" },
      { vaccine: "Tetanus (Td booster)",     date: "2021",     doses: "1/1",  status: "complete" },
    ],
  },
  p2: {
    allergies: [
      { allergen: "Penicillin",      type: "drug",          reaction: "Anaphylaxis",           severity: "life-threatening", since: "2015" },
      { allergen: "Dust mites",      type: "environmental", reaction: "Rhinitis, sneezing",    severity: "mild",             since: "2010" },
      { allergen: "Shellfish",       type: "food",          reaction: "Urticaria, vomiting",   severity: "severe",           since: "2012" },
    ],
    medications: [
      { name: "Maharasnadi Kashayam",    dose: "15ml",   frequency: "Twice daily before meals", system: "Ayurveda",  prescribedBy: "Dr. Aditi Shastri", since: "Jun 2026",  active: true  },
      { name: "Kanchanara Guggulu",      dose: "2 tabs", frequency: "Twice daily",              system: "Siddha",    prescribedBy: "Dr. Priya Varma",   since: "May 2026",  active: true  },
      { name: "Shallaki (Boswellia)",    dose: "400mg",  frequency: "Thrice daily with meals",  system: "Ayurveda",  prescribedBy: "Dr. Aditi Shastri", since: "Jun 2026",  active: true  },
      { name: "Amlodipine 5mg",          dose: "5mg",    frequency: "Once daily (morning)",     system: "Allopathic", prescribedBy: "Dr. Kiran Shah",    since: "2020",      active: true  },
      { name: "Paracetamol 500mg (OTC)", dose: "500mg",  frequency: "As needed for pain",       system: "OTC",        prescribedBy: "Self",              since: "On demand", active: false },
    ],
    pmh: [
      { condition: "Hypertension",      year: "2020", status: "managed", notes: "Amlodipine 5mg daily" },
      { condition: "Gestational DM",    year: "2004", status: "resolved", notes: "During pregnancy, resolved post-delivery" },
    ],
    surgeries: [
      { procedure: "Appendectomy",         year: "2000", hospital: "Apollo Hospitals, Mumbai" },
      { procedure: "Hysterectomy (partial)", year: "2019", hospital: "Lilavati Hospital, Mumbai", notes: "Uterine fibroids" },
    ],
    family: [
      { relation: "Father", condition: "Hypertension, CVD",   age: "Deceased at 68" },
      { relation: "Mother", condition: "Osteoarthritis",       age: "78y", notes: "Bilateral knee replacement" },
      { relation: "Sister", condition: "Rheumatoid Arthritis", age: "48y" },
    ],
    social: {
      occupation: "School teacher (retired)", marital: "Married",
      tobacco: "None", alcohol: "None",
      diet: "Vegetarian", exercise: "Physiotherapy 3x/week, light walking",
      notes: "Post-retirement. Sedentary lifestyle. Weight management counselled.",
    },
    immunizations: [
      { vaccine: "COVID-19 (Covaxin)",     date: "Sep 2021", doses: "2/2",  status: "complete" },
      { vaccine: "COVID-19 Booster",       date: "Mar 2022", doses: "1/1",  status: "complete" },
      { vaccine: "Hepatitis B",            date: "2018",     doses: "2/3",  status: "partial"  },
      { vaccine: "Influenza (Seasonal)",   date: "Oct 2025", doses: "Annual", status: "complete" },
      { vaccine: "Pneumococcal (PPSV23)",  date: "Due",      doses: "0/1",  status: "due"      },
    ],
  },
  p3: {
    allergies: [
      { allergen: "NSAIDs (Aspirin, Ibuprofen)", type: "drug", reaction: "Gastric bleed risk",     severity: "severe",   since: "2017" },
      { allergen: "Latex",                       type: "other", reaction: "Contact dermatitis",     severity: "moderate", since: "2015" },
    ],
    medications: [
      { name: "Neem Capsule",               dose: "500mg", frequency: "Twice daily",              system: "Ayurveda",   prescribedBy: "Dr. Aditi Shastri", since: "May 2026",  active: true  },
      { name: "Khadirarishta",              dose: "20ml",  frequency: "Twice daily after meals",  system: "Ayurveda",   prescribedBy: "Dr. Aditi Shastri", since: "May 2026",  active: true  },
      { name: "Manjishtha Extract",         dose: "500mg", frequency: "Once daily",               system: "Ayurveda",   prescribedBy: "Dr. Aditi Shastri", since: "May 2026",  active: true  },
      { name: "Telmisartan 40mg",           dose: "40mg",  frequency: "Once daily (morning)",     system: "Allopathic", prescribedBy: "Dr. Nair (cardiologist)", since: "2016", active: true },
      { name: "Rosuvastatin 10mg",          dose: "10mg",  frequency: "Once daily (night)",       system: "Allopathic", prescribedBy: "Dr. Nair (cardiologist)", since: "2018", active: true },
      { name: "Metformin 500mg",            dose: "500mg", frequency: "Twice daily with meals",   system: "Allopathic", prescribedBy: "Dr. Nair",         since: "2018",      active: true  },
    ],
    pmh: [
      { condition: "Hypertension",          year: "2016", status: "managed",  notes: "Telmisartan 40mg" },
      { condition: "Dyslipidaemia",         year: "2018", status: "managed",  notes: "Rosuvastatin 10mg" },
      { condition: "Type 2 Diabetes",       year: "2018", status: "managed",  notes: "Diet + Metformin, HbA1c 6.8%" },
      { condition: "Psoriasis (Plaque)",    year: "2025", status: "ongoing",  notes: "Scalp + elbows, under AYUSH management" },
    ],
    surgeries: [
      { procedure: "Right knee arthroscopy", year: "2021", hospital: "Manipal Hospitals, Bangalore", notes: "Meniscal tear" },
    ],
    family: [
      { relation: "Father", condition: "Hypertension, Stroke",    age: "Deceased at 72" },
      { relation: "Mother", condition: "Type 2 Diabetes",         age: "80y" },
      { relation: "Brother", condition: "Psoriasis (Psoriatic Arthritis)", age: "54y" },
    ],
    social: {
      occupation: "Retired Bank Manager", marital: "Married",
      tobacco: "Ex-smoker (quit 2012, 20 pack-years)", alcohol: "Rare",
      diet: "Non-vegetarian, low-salt, low-sugar diet",
      exercise: "Evening walk 30 min · 5x/week",
      notes: "Regular follow-ups with cardiologist. HbA1c monitored every 3 months.",
    },
    immunizations: [
      { vaccine: "COVID-19 (Covishield)",  date: "Jul 2021",  doses: "2/2",  status: "complete" },
      { vaccine: "COVID-19 Booster",       date: "Jan 2022",  doses: "1/1",  status: "complete" },
      { vaccine: "Hepatitis B",            date: "2015",      doses: "3/3",  status: "complete" },
      { vaccine: "Influenza (Seasonal)",   date: "Nov 2025",  doses: "Annual", status: "complete" },
      { vaccine: "Pneumococcal (PPSV23)", date: "2020",       doses: "1/1",  status: "complete" },
      { vaccine: "Shingles (Shingrix)",    date: "Due",       doses: "0/2",  status: "due"      },
    ],
  },
};

export default function PatientIntakeClient() {
  const params = useParams();
  const id = (params.id as string) || "p1";
  const patient = PATIENTS[id] ?? PATIENTS.p1;
  const visits = VISITS[id] ?? VISITS.p1;
  const careTeam = CARE_TEAMS[id] ?? CARE_TEAMS.p1;
  const vitalsHistory = VITALS_HISTORY[id] ?? VITALS_HISTORY.p1;
  const latestVitals = vitalsHistory[0];
  const prevVitals = vitalsHistory[1];
  const medHistory = MEDICAL_HISTORY[id] ?? MEDICAL_HISTORY.p1;
  const [activeTab, setActiveTab] = useState<Tab>("intake");
  const [expandedVisit, setExpandedVisit] = useState<string | null>(visits[0]?.id ?? null);
  const [visitSoapTab, setVisitSoapTab]   = useState<"S" | "O" | "A" | "P">("S");
  const [openMHSection, setOpenMHSection] = useState<Record<string, boolean>>({
    allergies: true, medications: true, pmh: false, surgeries: false, family: false, social: false, immunizations: false,
  });
  const statStyle = { normal: "bg-herb-green/10 text-herb-green border-herb-green/20", warning: "bg-amber-50 text-amber-700 border-amber-200", alert: "bg-red-50 text-red-600 border-red-200" };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
        <Link href="/pro" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{patient.name}</span>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sage text-xl">{patient.name[0]}</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">{patient.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {patient.age}y · {patient.gender} · {patient.prakriti} Prakriti
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{patient.phone}</p>
              {patient.abha ? (
                <p className="text-xs text-herb-green mt-1">ABHA ✓ · {patient.abha}</p>
              ) : (
                <p className="text-xs text-amber-600 mt-1">ABHA not linked</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100">
              <span>{patient.mode === "video" ? "📹" : "🏥"}</span>
              <span className="font-medium">
                {patient.mode === "video" ? "Video" : "In-Clinic"} · {patient.time}
              </span>
            </div>
            <Link href={`/pro/emr?patient=${id}`}>
              <button className="px-4 py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all">
                Open EMR
              </button>
            </Link>
            {patient.mode === "video" && (
              <Link href="/consult">
                <button className="px-4 py-2 bg-clinical-dark text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all">
                  📹 Start Call
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit flex-wrap">
        {(["intake", "vitals", "medical-history", "history", "care-team", "reports"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "intake" ? "Intake" : tab === "vitals" ? "Vitals" : tab === "medical-history" ? "Med History" : tab === "history" ? "Visits" : tab === "care-team" ? "Care Team" : "Reports"}
            {tab === "care-team" && careTeam.length > 1 && (
              <span className={cn("ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full", activeTab === tab ? "bg-herb-green/10 text-herb-green" : "bg-background text-muted-foreground")}>
                {careTeam.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "intake" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Reason for Visit</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{patient.reason}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm text-foreground">{patient.duration}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Self-Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {patient.symptoms.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Current Medications</h3>
              <p className="text-sm text-muted-foreground">None reported · Patient denies allopathic medication use</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Known Allergies</h3>
              <p className="text-sm text-muted-foreground">No known allergies reported</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">AYUSH History</h3>
              <div className="space-y-2">
                {[
                  { label: "Prakriti (recorded)", value: patient.prakriti },
                  { label: "Prior AYUSH treatment", value: "Ayurveda" },
                  { label: "Panchakarma history", value: "None" },
                  { label: "Dietary preference", value: "Vegetarian" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ivory-deep rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm">Last Recorded Vitals</h3>
                <button onClick={() => setActiveTab("vitals")} className="text-[10px] text-herb-green font-semibold hover:underline">Full history →</button>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">{latestVitals.date} · {latestVitals.doctor}</p>
              <div className="space-y-1">
                {[
                  { label: "BP",          value: `${latestVitals.bpSys}/${latestVitals.bpDia} mmHg`, key: "bpSys", n: latestVitals.bpSys },
                  { label: "Pulse",       value: `${latestVitals.pulse} bpm`,                         key: "pulse",  n: latestVitals.pulse },
                  { label: "Temp",        value: `${latestVitals.temp} °F`,                            key: "temp",   n: latestVitals.temp  },
                  { label: "SpO₂",        value: `${latestVitals.spo2}%`,                              key: "spo2",   n: latestVitals.spo2  },
                  { label: "Weight / BMI", value: `${latestVitals.weight} kg · BMI ${bmi(latestVitals.weight, latestVitals.height)}`, key: "weight", n: latestVitals.weight },
                ].map((v) => {
                  const st = vStat(v.key, v.n);
                  return (
                    <div key={v.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{v.label}</span>
                      <span className={cn("font-medium", st === "warning" ? "text-amber-600" : st === "alert" ? "text-red-500" : "text-foreground")}>{v.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">AI Intake Summary</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patient reports {patient.symptoms.slice(0, 2).join(" and ").toLowerCase()} as primary concerns.
                Based on self-reported symptoms and {patient.prakriti} Prakriti profile, this appears consistent with a Vata aggravation pattern.
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">ⓘ AI summary — verify clinically. Not a diagnosis.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "vitals" && (
        <div className="space-y-5">
          {/* Key vitals — latest reading highlight cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Blood Pressure", value: `${latestVitals.bpSys}/${latestVitals.bpDia}`, unit: "mmHg", key: "bpSys", icon: "🩺", prev: prevVitals ? `${prevVitals.bpSys}/${prevVitals.bpDia}` : null, trendVal: prevVitals ? { curr: latestVitals.bpSys, prev: prevVitals.bpSys, pos: "down" as const } : null },
              { label: "Pulse",         value: `${latestVitals.pulse}`, unit: "bpm",   key: "pulse", icon: "💓", prev: prevVitals ? String(prevVitals.pulse) : null, trendVal: prevVitals ? { curr: latestVitals.pulse, prev: prevVitals.pulse, pos: "down" as const } : null },
              { label: "SpO₂",          value: `${latestVitals.spo2}`, unit: "%",    key: "spo2",  icon: "🫁", prev: prevVitals ? String(prevVitals.spo2) : null, trendVal: prevVitals ? { curr: latestVitals.spo2, prev: prevVitals.spo2, pos: "up" as const } : null },
              { label: "BMI",           value: bmi(latestVitals.weight, latestVitals.height), unit: "", key: "bmi",   icon: "⚖️", prev: prevVitals ? bmi(prevVitals.weight, prevVitals.height) : null, trendVal: prevVitals ? { curr: latestVitals.weight, prev: prevVitals.weight, pos: "down" as const } : null },
            ].map(v => {
              const st = v.key === "bmi"
                ? (parseFloat(v.value) < 18.5 ? "warning" : parseFloat(v.value) < 25 ? "normal" : parseFloat(v.value) < 30 ? "warning" : "alert")
                : vStat(v.key, parseFloat(v.value));
              const tr = v.trendVal ? trend(v.trendVal.curr, v.trendVal.prev, v.trendVal.pos) : null;
              return (
                <div key={v.label} className={cn("rounded-2xl border p-4", statStyle[st])}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg">{v.icon}</span>
                    {tr && <span className={cn("text-sm font-bold", tr.color)}>{tr.arrow}</span>}
                  </div>
                  <p className="text-xl font-bold font-display">{v.value}<span className="text-xs font-normal ml-1">{v.unit}</span></p>
                  <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wider">{v.label}</p>
                  {v.prev && <p className="text-[10px] mt-1 opacity-70">Prev: {v.prev}{v.unit}</p>}
                </div>
              );
            })}
          </div>

          {/* Latest full reading detail */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Latest Reading</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{latestVitals.date} · Recorded by {latestVitals.doctor}</p>
              </div>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", latestVitals.isYou ? "bg-herb-green text-white border-herb-green" : "bg-muted text-muted-foreground border-border")}>
                {latestVitals.isYou ? "You" : latestVitals.doctorInitials}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "BP Systolic",  value: latestVitals.bpSys,  unit: "mmHg", key: "bpSys" },
                { label: "BP Diastolic", value: latestVitals.bpDia,  unit: "mmHg", key: "bpDia" },
                { label: "Pulse Rate",   value: latestVitals.pulse,   unit: "bpm",  key: "pulse" },
                { label: "Temperature",  value: latestVitals.temp,    unit: "°F",   key: "temp"  },
                { label: "SpO₂",         value: latestVitals.spo2,    unit: "%",    key: "spo2"  },
                { label: "Resp. Rate",   value: latestVitals.rr,      unit: "/min", key: "rr"    },
                { label: "Weight",       value: latestVitals.weight,  unit: "kg",   key: "weight"},
                { label: "Height",       value: latestVitals.height,  unit: "cm",   key: "height"},
              ].map(f => {
                const st = vStat(f.key, f.value);
                return (
                  <div key={f.label} className={cn("rounded-xl border p-3 text-center", statStyle[st])}>
                    <p className="text-sm font-bold">{f.value}<span className="text-[10px] font-normal ml-0.5">{f.unit}</span></p>
                    <p className="text-[10px] mt-0.5">{f.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical vitals table */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">Vitals History</h3>
              <span className="text-xs text-muted-foreground">{vitalsHistory.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-background">
                    {["Date", "Doctor", "BP (mmHg)", "Pulse", "Temp (°F)", "SpO₂", "RR", "Weight", "BMI"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vitalsHistory.map((v, i) => {
                    const prev = vitalsHistory[i + 1];
                    const bpT   = prev ? trend(v.bpSys, prev.bpSys, "down")   : null;
                    const pulT  = prev ? trend(v.pulse, prev.pulse, "down")    : null;
                    const spo2T = prev ? trend(v.spo2,  prev.spo2,  "up")     : null;
                    const wtT   = prev ? trend(v.weight, prev.weight, "down")  : null;
                    const vBmi  = bmi(v.weight, v.height);
                    const bmiSt = parseFloat(vBmi) < 18.5 ? "warning" : parseFloat(vBmi) < 25 ? "normal" : parseFloat(vBmi) < 30 ? "warning" : "alert";
                    return (
                      <tr key={i} className={cn("transition-colors hover:bg-background", i === 0 ? "bg-herb-green/3" : "")}>
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                          {v.date}
                          {i === 0 && <span className="ml-2 text-[9px] bg-herb-green text-white px-1.5 py-0.5 rounded-full font-bold">Latest</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold", v.isYou ? "bg-herb-gradient text-white" : "bg-muted text-foreground")}>
                              {v.doctorInitials}
                            </div>
                            <span className="text-muted-foreground">{v.doctor.replace("Dr. ", "")}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px] border", statStyle[vStat("bpSys", v.bpSys)])}>
                            {v.bpSys}/{v.bpDia}
                          </span>
                          {bpT && <span className={cn("ml-1 text-[10px] font-bold", bpT.color)}>{bpT.arrow}</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px] border", statStyle[vStat("pulse", v.pulse)])}>
                            {v.pulse}
                          </span>
                          {pulT && <span className={cn("ml-1 text-[10px] font-bold", pulT.color)}>{pulT.arrow}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px] border", statStyle[vStat("temp", v.temp)])}>
                            {v.temp}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px] border", statStyle[vStat("spo2", v.spo2)])}>
                            {v.spo2}%
                          </span>
                          {spo2T && <span className={cn("ml-1 text-[10px] font-bold", spo2T.color)}>{spo2T.arrow}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px] border", statStyle[vStat("rr", v.rr)])}>
                            {v.rr}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-foreground font-medium">
                          {v.weight} kg
                          {wtT && <span className={cn("ml-1 text-[10px] font-bold", wtT.color)}>{wtT.arrow}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px] border", statStyle[bmiSt])}>
                            {vBmi}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border flex flex-wrap gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-herb-green/20 border border-herb-green/30 inline-block" /> Normal range</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200 inline-block" /> Borderline</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-50 border border-red-200 inline-block" /> Out of range</span>
              <span className="flex items-center gap-1.5"><span className="font-bold text-herb-green">↑↓</span> Trend vs previous visit</span>
            </div>
          </div>

          {/* Record new vitals CTA */}
          <Link href={`/pro/emr?patient=${id}`}>
            <div className="bg-herb-gradient rounded-2xl p-5 flex items-center gap-4 hover:opacity-90 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Record Vitals for Today</p>
                <p className="text-xs text-white/75 mt-0.5">Open EMR to capture this visit's readings</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {activeTab === "medical-history" && (
        <div className="space-y-4">
          {/* Allergies */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, allergies: !s.allergies }))}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Allergies</h3>
                {medHistory.allergies.some(a => a.severity === "life-threatening" || a.severity === "severe") && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">⚠ Critical</span>
                )}
                <span className="text-[10px] text-muted-foreground">{medHistory.allergies.length} recorded</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.allergies ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.allergies && (
              <div className="border-t border-border">
                {medHistory.allergies.length === 0 ? (
                  <p className="px-5 py-4 text-xs text-muted-foreground italic">No known allergies (NKDA)</p>
                ) : (
                  <div className="divide-y divide-border">
                    {medHistory.allergies.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                          a.severity === "life-threatening" ? "bg-red-600" : a.severity === "severe" ? "bg-red-400" : a.severity === "moderate" ? "bg-amber-400" : "bg-yellow-300"
                        )} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{a.allergen}</p>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{a.type}</span>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                              a.severity === "life-threatening" ? "bg-red-100 text-red-700 border border-red-200" :
                              a.severity === "severe" ? "bg-red-50 text-red-600" :
                              a.severity === "moderate" ? "bg-amber-50 text-amber-700" : "bg-yellow-50 text-yellow-700"
                            )}>{a.severity}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Reaction: {a.reaction}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Since {a.since}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Medications */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, medications: !s.medications }))}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Active Medications</h3>
                <span className="text-[10px] text-muted-foreground">{medHistory.medications.filter(m => m.active).length} active</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.medications ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.medications && (
              <div className="border-t border-border">
                <div className="divide-y divide-border">
                  {medHistory.medications.map((m, i) => (
                    <div key={i} className={cn("flex items-start gap-3 px-5 py-3.5", !m.active && "opacity-60")}>
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                        m.active ? (m.system === "Allopathic" ? "bg-blue-400" : "bg-herb-green") : "bg-muted-foreground"
                      )} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{m.name}</p>
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full",
                            m.system === "Ayurveda"   ? "bg-herb-green/10 text-herb-green" :
                            m.system === "Homeopathy" ? "bg-blue-50 text-blue-700" :
                            m.system === "Allopathic" ? "bg-slate-100 text-slate-700" :
                            m.system === "Siddha"     ? "bg-amber-50 text-amber-700" :
                            "bg-muted text-muted-foreground"
                          )}>{m.system}</span>
                          {!m.active && <span className="text-[10px] text-muted-foreground">(discontinued)</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.dose} · {m.frequency}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">By {m.prescribedBy} · since {m.since}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {medHistory.medications.some(m => m.system === "Allopathic") && medHistory.medications.some(m => m.system === "Ayurveda" || m.system === "Homeopathy") && (
                  <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
                    <p className="text-[10px] text-amber-700 font-medium">
                      ⚠ Patient is on concurrent AYUSH + Allopathic medications. Review for interactions before prescribing.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Past Medical History */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, pmh: !s.pmh }))}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Past Medical History</h3>
                <span className="text-[10px] text-muted-foreground">{medHistory.pmh.length} conditions</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.pmh ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.pmh && (
              <div className="border-t border-border">
                {medHistory.pmh.length === 0 ? (
                  <p className="px-5 py-4 text-xs text-muted-foreground italic">No significant past medical history</p>
                ) : (
                  <div className="divide-y divide-border">
                    {medHistory.pmh.map((p, i) => (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                          p.status === "ongoing" ? "bg-red-400" : p.status === "managed" ? "bg-amber-400" : "bg-herb-green"
                        )} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{p.condition}</p>
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                              p.status === "ongoing" ? "bg-red-50 text-red-600" : p.status === "managed" ? "bg-amber-50 text-amber-700" : "bg-herb-green/10 text-herb-green"
                            )}>{p.status}</span>
                          </div>
                          {p.notes && <p className="text-xs text-muted-foreground mt-0.5">{p.notes}</p>}
                          <p className="text-[10px] text-muted-foreground mt-0.5">Since {p.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Surgical History */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, surgeries: !s.surgeries }))}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Surgical / Procedure History</h3>
                <span className="text-[10px] text-muted-foreground">
                  {medHistory.surgeries.length === 0 ? "None" : `${medHistory.surgeries.length} procedure${medHistory.surgeries.length !== 1 ? "s" : ""}`}
                </span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.surgeries ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.surgeries && (
              <div className="border-t border-border">
                {medHistory.surgeries.length === 0 ? (
                  <p className="px-5 py-4 text-xs text-muted-foreground italic">No surgical history</p>
                ) : (
                  <div className="divide-y divide-border">
                    {medHistory.surgeries.map((s, i) => (
                      <div key={i} className="px-5 py-3.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{s.procedure}</p>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{s.year}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.hospital}</p>
                        {s.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{s.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Family History */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, family: !s.family }))}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Family History</h3>
                <span className="text-[10px] text-muted-foreground">{medHistory.family.length} entries</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.family ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.family && (
              <div className="border-t border-border">
                {medHistory.family.length === 0 ? (
                  <p className="px-5 py-4 text-xs text-muted-foreground italic">No significant family history</p>
                ) : (
                  <div className="divide-y divide-border">
                    {medHistory.family.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted-foreground">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{f.relation}</p>
                            {f.age && <span className="text-[10px] text-muted-foreground">{f.age}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{f.condition}</p>
                          {f.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{f.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social History */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, social: !s.social }))}>
              <h3 className="font-semibold text-foreground text-sm">Social History</h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.social ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.social && (
              <div className="border-t border-border px-5 py-4">
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { label: "Occupation",      value: medHistory.social.occupation },
                    { label: "Marital Status",  value: medHistory.social.marital },
                    { label: "Tobacco",         value: medHistory.social.tobacco },
                    { label: "Alcohol",         value: medHistory.social.alcohol },
                    { label: "Diet",            value: medHistory.social.diet },
                    { label: "Exercise",        value: medHistory.social.exercise },
                  ]).map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="text-xs text-foreground mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                {medHistory.social.notes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">{medHistory.social.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Immunizations */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors"
              onClick={() => setOpenMHSection(s => ({ ...s, immunizations: !s.immunizations }))}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Immunizations</h3>
                {medHistory.immunizations.some(v => v.status === "due") && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Due</span>
                )}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className={cn("text-muted-foreground transition-transform", openMHSection.immunizations ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openMHSection.immunizations && (
              <div className="border-t border-border divide-y divide-border">
                {medHistory.immunizations.map((v, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                        v.status === "complete" ? "bg-herb-green" : v.status === "partial" ? "bg-amber-400" : "bg-red-400"
                      )} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{v.vaccine}</p>
                        <p className="text-[10px] text-muted-foreground">{v.doses} doses · {v.date}</p>
                      </div>
                    </div>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                      v.status === "complete" ? "bg-herb-green/10 text-herb-green" :
                      v.status === "partial"  ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-600"
                    )}>{v.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div>
          {/* Summary bar */}
          <div className="flex items-center gap-4 flex-wrap bg-white rounded-2xl border border-border px-5 py-3.5 mb-5">
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground">{visits.length}</p>
              <p className="text-[10px] text-muted-foreground">Total visits</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground">{visits.filter(v => v.isYou).length}</p>
              <p className="text-[10px] text-muted-foreground">By you</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground">{[...new Set(visits.map(v => v.doctor))].length}</p>
              <p className="text-[10px] text-muted-foreground">Doctors</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">
                {visits[visits.length - 1]?.date} → {visits[0]?.date}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Care timeline</p>
            </div>
            <Link href={`/pro/emr?patient=${id}`}>
              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-herb-green text-white text-xs font-semibold rounded-xl hover:bg-herb-green/90 transition-all flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Visit
              </button>
            </Link>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-px bg-border hidden sm:block" />

            <div className="space-y-4">
              {visits.map((visit, i) => {
                const isExpanded = expandedVisit === visit.id;
                const specialtyColor =
                  visit.specialty === "Ayurveda"   ? "bg-herb-green/10 text-herb-green"   :
                  visit.specialty === "Homeopathy"  ? "bg-blue-50 text-blue-700"           :
                  visit.specialty === "Siddha"      ? "bg-amber-50 text-amber-700"         :
                  visit.specialty === "Naturopathy" ? "bg-teal-50 text-teal-700"           :
                                                       "bg-muted text-muted-foreground";
                const typeColor =
                  visit.type === "initial"  ? "bg-herb-green text-white"   :
                  visit.type === "urgent"   ? "bg-red-500 text-white"       :
                  visit.type === "review"   ? "bg-amber-500 text-white"     :
                                              "bg-muted text-foreground";

                return (
                  <div key={visit.id} className="flex gap-4 sm:gap-5">
                    {/* Timeline node */}
                    <div className="flex-shrink-0 flex flex-col items-center hidden sm:flex">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold z-10 mt-1",
                        visit.isYou ? "bg-herb-gradient text-white shadow-sm" : "bg-white border-2 border-border text-foreground"
                      )}>
                        {visit.doctorInitials}
                      </div>
                      {i < visits.length - 1 && <div className="flex-1 w-px bg-transparent" />}
                    </div>

                    {/* Visit card */}
                    <div className={cn(
                      "flex-1 min-w-0 bg-white rounded-2xl border transition-all",
                      isExpanded ? "border-herb-green/30 shadow-sm" : "border-border hover:border-border/60 hover:shadow-sm"
                    )}>
                      {/* Card header — always visible */}
                      <button
                        className="w-full text-left p-4 sm:p-5"
                        onClick={() => setExpandedVisit(isExpanded ? null : visit.id)}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-start gap-3">
                            {/* Mobile avatar */}
                            <div className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 sm:hidden",
                              visit.isYou ? "bg-herb-gradient text-white" : "bg-muted text-foreground"
                            )}>
                              {visit.doctorInitials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-foreground">{visit.date}</p>
                                <span className="text-[10px] text-muted-foreground">{visit.time}</span>
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", typeColor)}>
                                  {visit.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">{visit.doctor}</span>
                                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", specialtyColor)}>
                                  {visit.specialty}
                                </span>
                                {visit.isYou && (
                                  <span className="text-[10px] font-semibold bg-herb-green text-white px-2 py-0.5 rounded-full">You</span>
                                )}
                                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                  {visit.mode === "video" ? "📹 Video" : "🏥 In-clinic"} · {visit.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                            className={cn("text-muted-foreground transition-transform flex-shrink-0 mt-1", isExpanded ? "rotate-180" : "")}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>

                        {/* Chief complaint + diagnosis — always visible */}
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">CC:</span> {visit.chiefComplaint}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-semibold text-foreground">Dx:</span> {visit.diagnosis}
                          </p>
                          {/* Quick chips */}
                          {!isExpanded && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {visit.medications.length > 0 && (
                                <span className="text-[10px] bg-herb-green/10 text-herb-green px-2 py-0.5 rounded-full font-medium">
                                  {visit.medications.length} med{visit.medications.length !== 1 ? "s" : ""}
                                </span>
                              )}
                              {visit.investigations.length > 0 && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                  {visit.investigations.length} test{visit.investigations.length !== 1 ? "s" : ""} ordered
                                </span>
                              )}
                              {visit.referrals.length > 0 && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                  Referral: {visit.referrals[0].specialty}
                                </span>
                              )}
                              {visit.followUpDate && (
                                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                  Follow-up: {visit.followUpDate}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="border-t border-border">
                          {/* Vitals strip */}
                          {visit.vitals && (
                            <div className="px-5 py-3.5 bg-background border-b border-border">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Vitals at this visit</p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { label: "BP",    val: `${visit.vitals.bpSys}/${visit.vitals.bpDia}`, unit: "mmHg",  st: statStyle[vStat("bpSys", visit.vitals.bpSys)]  },
                                  { label: "Pulse", val: `${visit.vitals.pulse}`,    unit: "bpm",   st: statStyle[vStat("pulse", visit.vitals.pulse)]  },
                                  { label: "Temp",  val: `${visit.vitals.temp}`,     unit: "°F",    st: statStyle[vStat("temp",  visit.vitals.temp)]   },
                                  { label: "SpO₂",  val: `${visit.vitals.spo2}`,     unit: "%",     st: statStyle[vStat("spo2",  visit.vitals.spo2)]   },
                                  { label: "RR",    val: `${visit.vitals.rr}`,       unit: "/min",  st: statStyle[vStat("rr",    visit.vitals.rr)]     },
                                  { label: "Wt",    val: `${visit.vitals.weight}`,   unit: "kg",    st: "bg-muted text-foreground border-border"        },
                                ].map(v => (
                                  <span key={v.label} className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full border", v.st)}>
                                    {v.label} {v.val}{v.unit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* SOAP notes */}
                          <div className="px-5 py-4 border-b border-border">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SOAP Notes</p>
                              <div className="flex gap-0.5 bg-muted rounded-lg p-0.5">
                                {(["S", "O", "A", "P"] as const).map(tab => (
                                  <button key={tab} onClick={() => setVisitSoapTab(tab)}
                                    className={cn("px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                                      visitSoapTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}>
                                    {tab}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-muted/40 rounded-xl px-4 py-3 min-h-[60px]">
                              {visitSoapTab === "S" && <><span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider block mb-1">Subjective</span>{visit.soap.S}</>}
                              {visitSoapTab === "O" && <><span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider block mb-1">Objective</span>{visit.soap.O}</>}
                              {visitSoapTab === "A" && <><span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider block mb-1">Assessment</span>{visit.soap.A}</>}
                              {visitSoapTab === "P" && <><span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider block mb-1">Plan</span>{visit.soap.P}</>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border">
                            {/* Medications */}
                            <div className="px-5 py-4">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                Medications Prescribed ({visit.medications.length})
                              </p>
                              {visit.medications.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No medications prescribed</p>
                              ) : (
                                <div className="space-y-2">
                                  {visit.medications.map((m, mi) => (
                                    <div key={mi} className="flex items-start gap-2">
                                      <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                                        m.system === "Ayurveda"   ? "bg-herb-green" :
                                        m.system === "Homeopathy" ? "bg-blue-400" :
                                        m.system === "Siddha"     ? "bg-amber-400" : "bg-muted-foreground"
                                      )} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-foreground leading-snug">{m.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{m.dose} · {m.frequency}</p>
                                        {m.anupana && <p className="text-[10px] text-muted-foreground">Anupana: {m.anupana}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Investigations + Referrals + Follow-up */}
                            <div className="px-5 py-4 space-y-4">
                              {visit.investigations.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    Investigations Ordered
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {visit.investigations.map(inv => (
                                      <span key={inv} className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                                        {inv}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {visit.referrals.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Referrals</p>
                                  {visit.referrals.map((r, ri) => (
                                    <div key={ri} className="flex items-center gap-2">
                                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                                        r.urgency === "emergent" ? "bg-red-50 text-red-600" : r.urgency === "urgent" ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground"
                                      )}>{r.urgency}</span>
                                      <span className="text-xs text-foreground">→ {r.specialty}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {visit.followUpDate && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Follow-up</p>
                                  <p className="text-xs font-semibold text-foreground">{visit.followUpDate}</p>
                                  {visit.followUpInstructions && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{visit.followUpInstructions}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer actions */}
                          <div className="px-5 py-3.5 bg-background border-t border-border rounded-b-2xl flex items-center gap-3">
                            <Link href={`/pro/emr?patient=${id}`}>
                              <button className="text-xs text-herb-green font-semibold hover:underline">
                                Open EMR for new visit →
                              </button>
                            </Link>
                            <span className="text-border">·</span>
                            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                              📥 Export visit PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "care-team" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5">
            <p className="text-xs font-semibold text-amber-900">Multi-Doctor Care</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {patient.name} is receiving treatment from {careTeam.length} practitioner{careTeam.length !== 1 ? "s" : ""}.
              {careTeam.length > 1 && " Review their prescriptions to avoid interactions before adding new formulations."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careTeam.map(doc => (
              <div key={doc.id} className={cn("bg-white rounded-2xl border p-5 relative overflow-hidden", doc.isYou ? "border-herb-green/30" : "border-border")}>
                {doc.isYou && (
                  <span className="absolute top-4 right-4 text-[10px] bg-herb-green text-white font-semibold px-2 py-0.5 rounded-full">You</span>
                )}
                <div className="flex items-start gap-3 mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-base", doc.isYou ? "bg-herb-gradient text-white" : "bg-muted text-foreground")}>
                    {doc.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty} · {doc.qualification}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{doc.hprId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Since",      value: doc.since },
                    { label: "Last visit", value: doc.lastVisit },
                    { label: "Rx count",   value: String(doc.totalRx) },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs font-semibold text-foreground">{item.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Follow-up: <span className="text-herb-green font-medium">{doc.nextFollowUp}</span></p>
                  {!doc.isYou && (
                    <button className="text-xs text-herb-green font-medium hover:underline">View Rx</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Combined active medicines across all doctors */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-1">All Active Prescriptions</h3>
            <p className="text-xs text-muted-foreground mb-4">Medicines currently prescribed by all treating doctors</p>
            <div className="space-y-3">
              {careTeam.map(doc => (
                <div key={doc.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold", doc.isYou ? "bg-herb-gradient text-white" : "bg-muted text-foreground")}>
                      {doc.initials}
                    </div>
                    <p className="text-xs font-semibold text-foreground">{doc.name} <span className="font-normal text-muted-foreground">— {doc.specialty}</span></p>
                  </div>
                  <div className="ml-7 space-y-1.5">
                    {visits
                      .filter(v => v.doctor === doc.name)
                      .slice(0, 1)
                      .map((v, i) => (
                        <div key={i} className="text-xs text-muted-foreground bg-background rounded-lg px-3 py-2 border border-border">
                          <span className="font-medium text-foreground">Rx ({v.date}):</span> {v.medications.map(m => m.name).join(" + ") || "—"}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-3">
          {REPORTS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{r.type === "Lab" ? "🧪" : "📄"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.type} · {r.size}</p>
              </div>
              <button className="text-xs text-herb-green font-medium">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
