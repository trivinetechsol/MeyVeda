import { createClient } from "./supabase";
import type { Practitioner, DinacharTask, HealthRecord } from "./types";

const supabase = createClient();

async function resolvePatientId(id: string): Promise<string> {
  const { data } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", id)
    .maybeSingle();
  return data?.id ?? id;
}

async function resolvePractitionerId(id: string): Promise<string> {
  const { data } = await supabase
    .from("practitioners")
    .select("id")
    .eq("user_id", id)
    .maybeSingle();
  return data?.id ?? id;
}

// ---------------------------------------------------------------------------
// Practitioners  (maps DB `practitioners` → frontend `Practitioner` shape)
// ---------------------------------------------------------------------------

export async function getPractitioners(filters?: {
  discipline?: string;
  search?: string;
  videoAvailable?: boolean;
  under500?: boolean;
  today?: boolean;
  languages?: string[];
  sortBy?: string;
}): Promise<Practitioner[]> {
  let query = supabase
    .from("practitioners")
    .select("*")
    .eq("verification_status", "verified");

  if (filters?.discipline) {
    query = query.contains("disciplines", [filters.discipline]);
  }

  if (filters?.search) {
    const s = `%${filters.search}%`;
    query = query.or(
      `full_name.ilike.${s},specializations.cs.{${filters.search}}`
    );
  }

  if (filters?.videoAvailable) {
    query = query.gt("base_video_fee", 0);
  }

  if (filters?.under500) {
    // 500 INR in paise is 50000 paise
    query = query.lt("base_video_fee", 50000);
  }

  if (filters?.languages && filters.languages.length > 0) {
    query = query.contains("languages", filters.languages);
  }

  if (filters?.today) {
    const todayStr = new Date().toISOString().split("T")[0];
    const { data: slotsData, error: slotsError } = await supabase
      .from("slots")
      .select("practitioner_id")
      .eq("slot_date", todayStr)
      .eq("status", "open");

    if (!slotsError && slotsData) {
      const practitionerIds = Array.from(new Set(slotsData.map((s: any) => s.practitioner_id).filter(Boolean)));
      if (practitionerIds.length > 0) {
        query = query.in("id", practitionerIds);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  if (filters?.sortBy === "rating") {
    query = query.order("rating_avg", { ascending: false });
  } else if (filters?.sortBy === "fee-low-high") {
    query = query.order("base_video_fee", { ascending: true });
  } else if (filters?.sortBy === "experience") {
    query = query.order("experience_years", { ascending: false });
  } else {
    query = query.order("rating_avg", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("getPractitioners error:", error);
    return [];
  }

  return (data ?? []).map(mapPractitioner);
}

export async function getPractitionerById(
  idInput: string
): Promise<Practitioner | null> {
  const resolvedId = await resolvePractitionerId(idInput);
  const { data, error } = await supabase
    .from("practitioners")
    .select("*")
    .eq("id", resolvedId)
    .single();

  if (error || !data) return null;
  return mapPractitioner(data);
}

/** Map a raw DB practitioner row to the frontend Practitioner type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPractitioner(row: any): Practitioner {
  return {
    id: row.id,
    name: row.full_name,
    specialty: (row.specializations ?? [])[0] ?? "",
    discipline: (row.disciplines ?? [])[0] ?? "Ayurveda",
    experience: row.experience_years ?? 0,
    rating: Number(row.rating_avg ?? 0),
    reviews: row.rating_count ?? 0,
    fee: Math.round((row.base_video_fee ?? 0) / 100), // paise → rupees
    hprId: row.hpr_id ?? "",
    isVerified: row.hpr_verified ?? false,
    avatar: getInitials(row.full_name),
    languages: row.languages ?? [],
    consultModes: row.base_clinic_fee
      ? (["video", "clinic"] as ("video" | "clinic")[])
      : (["video"] as ("video" | "clinic")[]),
    nextAvailable: "Tomorrow",
    location: "",
    qualifications: row.qualifications ?? [],
    about: row.bio ?? "",
    clinicFee: Math.round((row.base_clinic_fee ?? 0) / 100),
    slotDuration: row.slot_duration_min ?? 20,
    bufferMin: row.buffer_min ?? 5,
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Dinacharya Tasks  (maps DB `dinacharya_tasks` → frontend `DinacharTask`)
// ---------------------------------------------------------------------------

export async function getDinacharyaTasks(
  patientIdInput: string
): Promise<DinacharTask[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const today = new Date().toISOString().split("T")[0];

  // 1. Get active plan(s) for the patient
  const { data: plans, error: planError } = await supabase
    .from("dinacharya_plans")
    .select("id")
    .eq("patient_id", resolvedPatientId)
    .eq("is_active", true);

  if (planError || !plans || plans.length === 0) {
    if (planError) console.error("getDinacharyaTasks plan error:", planError);
    return [];
  }

  const planIds = plans.map((p) => p.id);

  // 2. Fetch all tasks for these plans
  const { data: tasks, error: tasksError } = await supabase
    .from("dinacharya_tasks")
    .select("*")
    .in("plan_id", planIds)
    .order("time_of_day", { ascending: true });

  if (tasksError || !tasks) {
    console.error("getDinacharyaTasks tasks error:", tasksError);
    return [];
  }

  // 3. Fetch habit logs for today
  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("task_id, is_done")
    .eq("patient_id", resolvedPatientId)
    .eq("log_date", today);

  if (logsError) {
    console.error("getDinacharyaTasks logs error:", logsError);
  }

  const doneTaskIds = new Set(
    (logs ?? [])
      .filter((l) => l.is_done)
      .map((l) => l.task_id)
  );

  return tasks.map((task: any) => ({
    id: task.id,
    time: task.time_of_day ? formatTime(task.time_of_day) : "",
    title: task.title ?? "",
    description: task.description ?? "",
    done: doneTaskIds.has(task.id),
    category: (task.category as "diet" | "exercise" | "mindfulness" | "medicine") ?? "mindfulness",
  }));
}

function formatTime(timeStr: string): string {
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0], 10);
  const m = parts[1] ?? "00";
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12.toString().padStart(2, "0")}:${m} ${period}`;
}

// ---------------------------------------------------------------------------
// Health Records  (maps DB `health_records` → frontend `HealthRecord`)
// ---------------------------------------------------------------------------

export async function getHealthRecords(
  patientIdInput: string
): Promise<HealthRecord[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { data, error } = await supabase
    .from("health_records")
    .select("*, practitioners(full_name)")
    .eq("patient_id", resolvedPatientId)
    .order("record_date", { ascending: false });

  if (error) {
    console.error("getHealthRecords error:", error);
    return [];
  }

  return (data ?? []).map(mapHealthRecord);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHealthRecord(row: any): HealthRecord {
  return {
    id: row.id,
    date: row.record_date ?? "",
    type: row.record_type ?? "consultation",
    title: row.title ?? "",
    doctor: row.practitioners?.full_name ?? row.source_facility ?? "",
    discipline: row.discipline,
    summary: row.summary ?? "",
  };
}

// ---------------------------------------------------------------------------
// Orders  (maps DB `apothecary_orders` + `order_items` → frontend Order type)
// ---------------------------------------------------------------------------

export type OrderItem = {
  name: string;
  brand: string;
  weight: string;
  price: number;
  icon: string;
};

export type Order = {
  id: string;
  number: string;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
  tracking?: string;
  eta?: string;
  autoRefill: boolean;
};

export async function getOrders(patientIdInput: string): Promise<Order[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("patient_id", resolvedPatientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrders error:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    number: row.id.slice(0, 8),
    date: row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    status: row.status ?? "placed",
    tracking: row.tracking_number,
    eta: row.estimated_delivery
      ? new Date(row.estimated_delivery).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : undefined,
    autoRefill: row.refill_order ?? false,
    total: Math.round((row.total_paise ?? 0) / 100),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: (row.order_items ?? []).map((item: any) => ({
      name: item.medicine_name ?? "",
      brand: "MeyVeda Apothecary",
      weight: `${item.quantity} Qty`,
      price: Math.round((item.unit_price_paise ?? 0) / 100),
      icon: "🌿",
    })),
  }));
}

// ---------------------------------------------------------------------------
// Toggle Dinacharya task completion
// ---------------------------------------------------------------------------

export async function toggleDinacharyaTask(
  taskId: string,
  done: boolean
): Promise<void> {
  // 1. Find patient ID associated with the task
  const { data: task, error: taskErr } = await supabase
    .from("dinacharya_tasks")
    .select("plan_id, dinacharya_plans(patient_id)")
    .eq("id", taskId)
    .single();

  if (taskErr || !task) {
    console.error("toggleDinacharyaTask error fetching task:", taskErr);
    return;
  }

  const patientId = (task as any).dinacharya_plans?.patient_id;
  if (!patientId) {
    console.error("toggleDinacharyaTask error: patient_id not found for task", taskId);
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  if (done) {
    const { error: insertErr } = await supabase
      .from("habit_logs")
      .upsert({
        task_id: taskId,
        patient_id: patientId,
        log_date: today,
        is_done: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: "task_id,patient_id,log_date"
      });
    if (insertErr) console.error("toggleDinacharyaTask error logging habit:", insertErr);
  } else {
    const { error: deleteErr } = await supabase
      .from("habit_logs")
      .delete()
      .eq("task_id", taskId)
      .eq("patient_id", patientId)
      .eq("log_date", today);
    if (deleteErr) console.error("toggleDinacharyaTask error deleting habit log:", deleteErr);
  }
}

// ---------------------------------------------------------------------------
// Patient Registry Operations (POST, GET, UPDATE, DELETE)
// ---------------------------------------------------------------------------

export async function getRegistryPatients(): Promise<any[]> {
  const { data: patients, error: patError } = await supabase
    .from("patients")
    .select(`
      id,
      full_name,
      date_of_birth,
      gender,
      prakriti,
      user:users (
        mobile
      )
    `);

  if (patError || !patients) {
    console.error("getRegistryPatients error:", patError);
    return [];
  }

  // Fetch all health records to find vitals, problems, and notes
  const { data: records, error: recError } = await supabase
    .from("health_records")
    .select("*")
    .order("record_date", { ascending: false });

  if (recError) {
    console.error("getRegistryPatients records error:", recError);
  }

  const recordsByPatient: Record<string, any[]> = {};
  for (const r of records ?? []) {
    if (!recordsByPatient[r.patient_id]) {
      recordsByPatient[r.patient_id] = [];
    }
    recordsByPatient[r.patient_id].push(r);
  }

  return patients.map((p: any) => {
    let age = 0;
    if (p.date_of_birth) {
      const birthDate = new Date(p.date_of_birth);
      age = new Date().getFullYear() - birthDate.getFullYear();
    }

    const patientRecords = recordsByPatient[p.id] ?? [];

    // Latest vitals
    const vitalsRecord = patientRecords.find(r => r.title === "Vitals" && r.record_type === "tracker");
    let vitals = null;
    if (vitalsRecord && vitalsRecord.summary) {
      try {
        vitals = JSON.parse(vitalsRecord.summary);
      } catch (e) {}
    }

    // Problems
    const problemsRecord = patientRecords.find(r => r.title === "Problems" && r.record_type === "tracker");
    let problems: any[] = [];
    if (problemsRecord && problemsRecord.summary) {
      try {
        problems = JSON.parse(problemsRecord.summary);
      } catch (e) {}
    }

    // Latest visit date & count
    const visits = patientRecords.filter(r => r.record_type === "consultation");
    const lastVisit = visits[0]?.record_date ?? "No visits";
    let lastVisitDaysAgo = 99;
    if (visits[0]?.record_date) {
      const diffTime = Math.abs(new Date().getTime() - new Date(visits[0].record_date).getTime());
      lastVisitDaysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      id: p.id,
      name: p.full_name || "Unknown",
      age,
      gender: p.gender || "Unknown",
      phone: p.user?.mobile || "",
      abha: null,
      bloodGroup: "O+",
      prakriti: p.prakriti || "Unknown",
      lastVisit: lastVisit !== "No visits" ? new Date(lastVisit).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "No visits",
      lastVisitDaysAgo,
      nextFollowUp: null,
      followUpDue: false,
      isToday: false,
      conditions: problems.map(pr => pr.name).join(" · ") || "No recorded conditions",
      systems: ["Ayurveda"],
      totalVisits: visits.length,
      problems,
      allergySummary: "No known allergies",
      activeMeds: 0,
      vitals,
    };
  });
}

export async function savePatientVitals(patientId: string, vitals: any): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const { data: existing } = await supabase
    .from("health_records")
    .select("id")
    .eq("patient_id", patientId)
    .eq("title", "Vitals")
    .eq("record_date", today)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("health_records")
      .update({ summary: JSON.stringify(vitals) })
      .eq("id", existing.id);
    if (error) console.error("savePatientVitals update error:", error);
  } else {
    const { error } = await supabase
      .from("health_records")
      .insert({
        patient_id: patientId,
        record_type: "tracker",
        title: "Vitals",
        summary: JSON.stringify(vitals),
        record_date: today,
      });
    if (error) console.error("savePatientVitals insert error:", error);
  }
}

export async function addPatientProblem(
  patientId: string,
  problem: { code: string; name: string; status: "active" | "controlled" | "resolved" }
): Promise<void> {
  const { data: existing } = await supabase
    .from("health_records")
    .select("id, summary")
    .eq("patient_id", patientId)
    .eq("title", "Problems")
    .maybeSingle();

  let problems = [];
  if (existing && existing.summary) {
    try {
      problems = JSON.parse(existing.summary);
    } catch (e) {}
  }

  problems.push(problem);

  if (existing) {
    const { error } = await supabase
      .from("health_records")
      .update({ summary: JSON.stringify(problems) })
      .eq("id", existing.id);
    if (error) console.error("addPatientProblem update error:", error);
  } else {
    const { error } = await supabase
      .from("health_records")
      .insert({
        patient_id: patientId,
        record_type: "tracker",
        title: "Problems",
        summary: JSON.stringify(problems),
        record_date: new Date().toISOString().split("T")[0],
      });
    if (error) console.error("addPatientProblem insert error:", error);
  }
}

export async function removePatientProblem(patientId: string, problemCode: string): Promise<void> {
  const { data: existing } = await supabase
    .from("health_records")
    .select("id, summary")
    .eq("patient_id", patientId)
    .eq("title", "Problems")
    .maybeSingle();

  if (!existing || !existing.summary) return;

  let problems = [];
  try {
    problems = JSON.parse(existing.summary);
  } catch (e) {}

  problems = problems.filter((p: any) => p.code !== problemCode);

  const { error } = await supabase
    .from("health_records")
    .update({ summary: JSON.stringify(problems) })
    .eq("id", existing.id);
  if (error) console.error("removePatientProblem error:", error);
}

export async function savePatientNote(patientId: string, noteText: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("health_records")
    .insert({
      patient_id: patientId,
      record_type: "consultation",
      title: "Clinical Note",
      summary: noteText,
      record_date: today,
    });
  if (error) console.error("savePatientNote error:", error);
}


export async function updatePatient(
  patientId: string,
  updates: {
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    city?: string;
    prakriti?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from("patients")
    .update({
      full_name: updates.fullName,
      date_of_birth: updates.dateOfBirth,
      gender: updates.gender?.toLowerCase(),
      city: updates.city,
      prakriti: updates.prakriti
    })
    .eq("id", patientId);

  if (error) {
    console.error("updatePatient error:", error);
    throw error;
  }
}

export async function deletePatientRecord(patientId: string): Promise<void> {
  const { error } = await supabase
    .from("patients")
    .delete()
    .eq("id", patientId);
  if (error) console.error("deletePatientRecord error:", error);
}

// ---------------------------------------------------------------------------
// Appointments (GET, CANCEL)
// ---------------------------------------------------------------------------

export type AppointmentRow = {
  id: string;
  doctor: string;
  practitionerId: string;
  consultationId?: string;
  initials: string;
  specialty: string;
  date: string;
  dateRaw: string;
  mode: "video" | "clinic";
  status: "upcoming" | "past" | "cancelled";
  fee: string;
  duration?: string;
  rating?: number;
  hasPrescription?: boolean;
  reason?: string;
  refunded?: boolean;
  reminder: boolean;
};

export async function getAppointments(patientIdInput: string): Promise<AppointmentRow[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id, mode, status, reason_for_visit,
      scheduled_date, scheduled_time, duration_min,
      cancellation_reason, cancelled_at,
      slot:slots ( fee ),
      practitioner:practitioners (
        id, full_name, specializations, disciplines
      ),
      consultation:consultations (
        id,
        rating:ratings ( stars )
      )
    `)
    .eq("patient_id", resolvedPatientId)
    .order("scheduled_date", { ascending: false })
    .order("scheduled_time", { ascending: false });

  if (error) { console.error("getAppointments error:", error); return []; }

  return (data ?? []).map((row: any) => {
    const prac = row.practitioner ?? {};
    const name = prac.full_name ?? "Unknown Doctor";
    const initials = name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    const specs = [...(prac.specializations ?? []), ...(prac.disciplines ?? [])];
    const fee = row.slot?.fee ? `₹${Math.round(row.slot.fee / 100)}` : "—";

    const dateObj = new Date(row.scheduled_date + "T" + (row.scheduled_time ?? "00:00"));
    const isToday = row.scheduled_date === new Date().toISOString().split("T")[0];
    const dateStr = isToday
      ? `Today, ${fmtTime(row.scheduled_time)}`
      : dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " · " + fmtTime(row.scheduled_time);

    let status: "upcoming" | "past" | "cancelled" = "upcoming";
    if (row.status === "completed") status = "past";
    else if (row.status === "cancelled" || row.status === "no_show") status = "cancelled";
    else if (["scheduled", "checked_in", "in_session", "rescheduled"].includes(row.status)) status = "upcoming";

    const consultArr = Array.isArray(row.consultation) ? row.consultation : row.consultation ? [row.consultation] : [];
    const consult = consultArr[0];
    const ratingObj = consult?.rating;
    const ratingArr = Array.isArray(ratingObj) ? ratingObj : ratingObj ? [ratingObj] : [];

    return {
      id: row.id,
      doctor: name,
      practitionerId: prac.id,
      consultationId: consult?.id,
      initials,
      specialty: specs.join(" · ") || "AYUSH",
      date: dateStr,
      dateRaw: row.scheduled_date,
      mode: row.mode as "video" | "clinic",
      status,
      fee,
      duration: row.duration_min ? `${row.duration_min} min` : undefined,
      rating: ratingArr[0]?.stars,
      hasPrescription: consultArr.length > 0,
      reason: row.cancellation_reason,
      refunded: row.status === "cancelled",
      reminder: false,
    };
  });
}

export async function cancelAppointment(appointmentId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", appointmentId);
  if (error) console.error("cancelAppointment error:", error);
}

export async function bookAppointment(params: {
  userId: string;
  slotId: string;
  practitionerId: string;
  mode: "video" | "clinic";
  reason: string;
  date: string;
  time: string;
  familyMemberId?: string;
}): Promise<void> {
  const resolvedPatientId = await resolvePatientId(params.userId);
  
  const { error: apptError } = await supabase
    .from("appointments")
    .insert({
      slot_id: params.slotId,
      practitioner_id: params.practitionerId,
      patient_id: resolvedPatientId,
      family_member_id: params.familyMemberId || null,
      mode: params.mode,
      status: "scheduled",
      reason_for_visit: params.reason,
      scheduled_date: params.date,
      scheduled_time: params.time,
    });

  if (apptError) {
    console.error("bookAppointment insert error:", apptError);
    throw apptError;
  }

  const { error: slotError } = await supabase
    .from("slots")
    .update({ status: "booked" })
    .eq("id", params.slotId);

  if (slotError) {
    console.error("bookAppointment slot update error:", slotError);
  }
}

export async function submitRating(params: {
  userId: string;
  consultationId: string;
  practitionerId: string;
  stars: number;
  reviewText: string;
}): Promise<void> {
  const resolvedPatientId = await resolvePatientId(params.userId);
  const { error } = await supabase
    .from("ratings")
    .insert({
      consultation_id: params.consultationId,
      patient_id: resolvedPatientId,
      practitioner_id: params.practitionerId,
      stars: params.stars,
      review_text: params.reviewText,
      is_visible: true,
    });
  if (error) {
    console.error("submitRating error:", error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Notifications (GET, MARK READ)
// ---------------------------------------------------------------------------

export type NotificationRow = {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  deepLink: string | null;
  createdAt: string;
  timeAgo: string;
};

export async function getNotifications(userId: string): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) { console.error("getNotifications error:", error); return []; }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title ?? "",
    body: row.body ?? "",
    type: row.type ?? "general",
    isRead: row.is_read ?? false,
    deepLink: row.deep_link,
    createdAt: row.created_at,
    timeAgo: timeAgo(row.created_at),
  }));
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) console.error("markNotificationRead error:", error);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) console.error("markAllNotificationsRead error:", error);
}

// ---------------------------------------------------------------------------
// Family Members (CRUD)
// ---------------------------------------------------------------------------

export type FamilyMemberRow = {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  age: number;
  gender: string;
  abhaId: string | null;
  prakriti: string | null;
};

export async function getFamilyMembers(patientIdInput: string): Promise<FamilyMemberRow[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("owner_patient_id", resolvedPatientId)
    .order("created_at", { ascending: true });

  if (error) { console.error("getFamilyMembers error:", error); return []; }

  return (data ?? []).map((row: any) => {
    let age = 0;
    if (row.date_of_birth) {
      age = new Date().getFullYear() - new Date(row.date_of_birth).getFullYear();
    }
    return {
      id: row.id,
      name: row.full_name ?? "",
      relationship: row.relationship ?? "other",
      dob: row.date_of_birth ?? "",
      age,
      gender: row.gender ?? "",
      abhaId: row.abha_id,
      prakriti: row.prakriti,
    };
  });
}

export async function addFamilyMember(patientIdInput: string, member: {
  fullName: string; relationship: string; dob: string; gender: string;
}): Promise<void> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { error } = await supabase.from("family_members").insert({
    owner_patient_id: resolvedPatientId,
    full_name: member.fullName,
    relationship: member.relationship,
    date_of_birth: member.dob,
    gender: member.gender,
  });
  if (error) console.error("addFamilyMember error:", error);
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const { error } = await supabase.from("family_members").delete().eq("id", id);
  if (error) console.error("deleteFamilyMember error:", error);
}

// ---------------------------------------------------------------------------
// Patient Profile (GET, UPDATE)
// ---------------------------------------------------------------------------

export type PatientProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  gender: string;
  city: string;
  pinCode: string;
  prakriti: string;
  wellnessGoals: string[];
  abhaId: string | null;
  abhaAddress: string | null;
};

export async function getPatientProfile(userId: string): Promise<PatientProfile | null> {
  const { data: pat, error } = await supabase
    .from("patients")
    .select(`
      id, full_name, date_of_birth, gender, city, pin_code, prakriti, wellness_goals,
      user:users (
        id, mobile, email,
        abha:abha_links ( abha_id, abha_address )
      )
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !pat) return null;

  const user = Array.isArray(pat.user) ? pat.user[0] : pat.user;
  const abhaObj = (user as any)?.abha;
  const abha = Array.isArray(abhaObj) ? abhaObj[0] : abhaObj;
  let age = 0;
  if (pat.date_of_birth) age = new Date().getFullYear() - new Date(pat.date_of_birth).getFullYear();

  return {
    id: pat.id,
    name: pat.full_name ?? "",
    email: (user as any)?.email ?? "",
    phone: (user as any)?.mobile ?? "",
    dob: pat.date_of_birth ?? "",
    age,
    gender: pat.gender ?? "",
    city: pat.city ?? "",
    pinCode: pat.pin_code ?? "",
    prakriti: pat.prakriti ?? "Unknown",
    wellnessGoals: pat.wellness_goals ?? [],
    abhaId: (abha as any)?.abha_id ?? null,
    abhaAddress: (abha as any)?.abha_address ?? null,
  };
}

export async function updateProfile(userId: string, updates: {
  fullName?: string; dob?: string; gender?: string; city?: string; pinCode?: string;
  email?: string;
}): Promise<void> {
  const patientUpdates: Record<string, unknown> = {};
  if (updates.fullName) patientUpdates.full_name = updates.fullName;
  if (updates.dob) patientUpdates.date_of_birth = updates.dob;
  if (updates.gender) patientUpdates.gender = updates.gender.toLowerCase();
  if (updates.city) patientUpdates.city = updates.city;
  if (updates.pinCode) patientUpdates.pin_code = updates.pinCode;

  if (Object.keys(patientUpdates).length > 0) {
    const { error } = await supabase.from("patients").update(patientUpdates).eq("user_id", userId);
    if (error) console.error("updateProfile patient error:", error);
  }
  if (updates.email) {
    const { error } = await supabase.from("users").update({ email: updates.email }).eq("id", userId);
    if (error) console.error("updateProfile user error:", error);
  }
}

// ---------------------------------------------------------------------------
// Prescriptions (GET for patient view)
// ---------------------------------------------------------------------------

export type PrescriptionView = {
  id: string;
  date: string;
  doctorName: string;
  doctorInitials: string;
  specialty: string;
  status: string;
  dietaryAdvice: string;
  lifestyleAdvice: string;
  physicalActivity: string;
  followUpDate: string | null;
  chiefComplaint: string;
  assessment: string;
  items: { name: string; dose: string; frequency: string; anupana: string; durationDays: number; instructions: string }[];
};

export async function getPatientPrescriptions(patientIdInput: string): Promise<PrescriptionView[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { data, error } = await supabase
    .from("prescriptions")
    .select(`
      id, status, dietary_advice, lifestyle_advice, physical_activity, followup_date, created_at,
      practitioner:practitioners ( full_name, specializations, disciplines ),
      consultation:consultations (
        emr_note:emr_notes ( chief_complaint, assessment )
      ),
      prescription_items ( medicine_name, dose, frequency, anupana, duration_days, special_instructions, sort_order )
    `)
    .eq("patient_id", resolvedPatientId)
    .order("created_at", { ascending: false });

  if (error) { console.error("getPatientPrescriptions error:", error); return []; }

  return (data ?? []).map((row: any) => {
    const prac = row.practitioner ?? {};
    const name = prac.full_name ?? "Doctor";
    const initials = name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    const consult = Array.isArray(row.consultation) ? row.consultation[0] : row.consultation;
    const emr = consult?.emr_note ? (Array.isArray(consult.emr_note) ? consult.emr_note[0] : consult.emr_note) : {};

    return {
      id: row.id,
      date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
      doctorName: name,
      doctorInitials: initials,
      specialty: [...(prac.specializations ?? []), ...(prac.disciplines ?? [])].join(" · ") || "AYUSH",
      status: row.status ?? "finalized",
      dietaryAdvice: row.dietary_advice ?? "",
      lifestyleAdvice: row.lifestyle_advice ?? "",
      physicalActivity: row.physical_activity ?? "",
      followUpDate: row.followup_date,
      chiefComplaint: emr?.chief_complaint ?? "",
      assessment: emr?.assessment ?? "",
      items: (row.prescription_items ?? [])
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((item: any) => ({
          name: item.medicine_name ?? "",
          dose: item.dose ?? "",
          frequency: item.frequency ?? "",
          anupana: item.anupana ?? "",
          durationDays: item.duration_days ?? 0,
          instructions: item.special_instructions ?? "",
        })),
    };
  });
}

// ---------------------------------------------------------------------------
// Slots (for booking page)
// ---------------------------------------------------------------------------

export type SlotView = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "video" | "clinic";
  fee: number;
  status: string;
};

export async function getPractitionerSlots(practitionerId: string, date: string): Promise<SlotView[]> {
  const { data, error } = await supabase
    .from("slots")
    .select("id, slot_date, start_time, end_time, mode, fee, status")
    .eq("practitioner_id", practitionerId)
    .eq("slot_date", date)
    .eq("status", "open")
    .order("start_time", { ascending: true });

  if (error) { console.error("getPractitionerSlots error:", error); return []; }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    date: row.slot_date,
    startTime: fmtTime(row.start_time),
    endTime: fmtTime(row.end_time),
    mode: row.mode,
    fee: Math.round((row.fee ?? 0) / 100),
    status: row.status,
  }));
}

// ---------------------------------------------------------------------------
// Consent Grants (CRUD)
// ---------------------------------------------------------------------------

export type ConsentView = {
  id: string;
  practitionerName: string;
  practitionerInitials: string;
  action: string;
  duration: string;
  recordTypes: string[];
  expiresAt: string | null;
  createdAt: string;
};

export async function getConsentGrants(patientIdInput: string): Promise<ConsentView[]> {
  const resolvedPatientId = await resolvePatientId(patientIdInput);
  const { data, error } = await supabase
    .from("consent_grants")
    .select(`
      id, action, duration, record_types, expires_at, created_at,
      practitioner:practitioners ( full_name )
    `)
    .eq("patient_id", resolvedPatientId)
    .order("created_at", { ascending: false });

  if (error) { console.error("getConsentGrants error:", error); return []; }

  return (data ?? []).map((row: any) => {
    const name = row.practitioner?.full_name ?? "Unknown";
    return {
      id: row.id,
      practitionerName: name,
      practitionerInitials: name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
      action: row.action ?? "granted",
      duration: row.duration ?? "session_only",
      recordTypes: row.record_types ?? [],
      expiresAt: row.expires_at,
      createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
    };
  });
}

export async function revokeConsent(consentId: string): Promise<void> {
  const { error } = await supabase
    .from("consent_grants")
    .update({ action: "revoked", revoked_at: new Date().toISOString() })
    .eq("id", consentId);
  if (error) console.error("revokeConsent error:", error);
}

// ---------------------------------------------------------------------------
// Bounded Messages (GET, SEND) — Post-consult + Pro Inbox
// ---------------------------------------------------------------------------

export type MessageRow = {
  id: string;
  consultationId: string;
  senderName: string;
  direction: string;
  content: string;
  sentAt: string;
  isRead: boolean;
};

export async function getBoundedMessages(consultationId: string): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("bounded_messages")
    .select("id, consultation_id, direction, content, sent_at, read_at, sender:users ( id )")
    .eq("consultation_id", consultationId)
    .order("sent_at", { ascending: true });

  if (error) { console.error("getBoundedMessages error:", error); return []; }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    consultationId: row.consultation_id,
    senderName: row.direction === "patient_to_doctor" ? "You" : "Doctor",
    direction: row.direction,
    content: row.content ?? "",
    sentAt: row.sent_at ? new Date(row.sent_at).toLocaleString("en-IN") : "",
    isRead: !!row.read_at,
  }));
}

export async function sendBoundedMessage(params: {
  consultationId: string;
  senderUserId: string;
  direction: "doctor_to_patient" | "patient_to_doctor";
  content: string;
}): Promise<void> {
  const { error } = await supabase
    .from("bounded_messages")
    .insert({
      consultation_id: params.consultationId,
      sender_user_id: params.senderUserId,
      direction: params.direction,
      content: params.content,
    });
  if (error) {
    console.error("sendBoundedMessage error:", error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Practitioner Schedules (GET, UPDATE)
// ---------------------------------------------------------------------------

export type ScheduleRow = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  clinicId: string | null;
  isActive: boolean;
};

export async function getPractitionerSchedules(practIdInput: string): Promise<ScheduleRow[]> {
  const practId = await resolvePractitionerId(practIdInput);
  const { data, error } = await supabase
    .from("availability_schedules")
    .select("*")
    .eq("practitioner_id", practId)
    .order("day_of_week", { ascending: true });

  if (error) { console.error("getPractitionerSchedules error:", error); return []; }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time ?? "",
    endTime: row.end_time ?? "",
    breakStart: row.break_start,
    breakEnd: row.break_end,
    clinicId: row.clinic_id,
    isActive: row.is_active ?? true,
  }));
}

export async function updatePractitionerSchedule(practIdInput: string, schedules: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  isActive: boolean;
}[]): Promise<void> {
  const practId = await resolvePractitionerId(practIdInput);
  
  const { error: deleteError } = await supabase
    .from("availability_schedules")
    .delete()
    .eq("practitioner_id", practId);

  if (deleteError) {
    console.error("updatePractitionerSchedule delete error:", deleteError);
    throw deleteError;
  }

  const insertData = schedules.map((s) => ({
    practitioner_id: practId,
    day_of_week: s.dayOfWeek,
    start_time: s.startTime || null,
    end_time: s.endTime || null,
    break_start: s.breakStart || null,
    break_end: s.breakEnd || null,
    is_active: s.isActive,
  }));

  const { error: insertError } = await supabase
    .from("availability_schedules")
    .insert(insertData);

  if (insertError) {
    console.error("updatePractitionerSchedule insert error:", insertError);
    throw insertError;
  }
}

export async function updatePractitionerSettings(practIdInput: string, settings: {
  baseVideoFee: number;
  baseClinicFee: number;
  slotDurationMin: number;
  bufferMin: number;
}): Promise<void> {
  const practId = await resolvePractitionerId(practIdInput);
  const { error } = await supabase
    .from("practitioners")
    .update({
      base_video_fee: settings.baseVideoFee * 100, // rupees -> paise
      base_clinic_fee: settings.baseClinicFee * 100,
      slot_duration_min: settings.slotDurationMin,
      buffer_min: settings.bufferMin,
    })
    .eq("id", practId);

  if (error) {
    console.error("updatePractitionerSettings error:", error);
    throw error;
  }
}

export async function getBlockedDates(practIdInput: string): Promise<{ id: string; date: string; reason: string }[]> {
  const practId = await resolvePractitionerId(practIdInput);
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id, block_date, reason")
    .eq("practitioner_id", practId)
    .gte("block_date", new Date().toISOString().split("T")[0])
    .order("block_date", { ascending: true });

  if (error) { console.error("getBlockedDates error:", error); return []; }
  return (data ?? []).map((r: any) => ({ id: r.id, date: r.block_date, reason: r.reason ?? "" }));
}

// ---------------------------------------------------------------------------
// Practitioner Follow-ups (GET)
// ---------------------------------------------------------------------------

export type FollowUpRow = {
  id: string;
  patientName: string;
  patientInitials: string;
  recommendedDate: string;
  isBooked: boolean;
  nudgeSent: boolean;
  patientAge: number;
};

export async function getPractitionerFollowUps(practIdInput: string): Promise<FollowUpRow[]> {
  const practId = await resolvePractitionerId(practIdInput);
  const { data, error } = await supabase
    .from("follow_ups")
    .select(`
      id, recommended_date, is_booked, nudge_sent_at,
      patient:patients ( full_name, date_of_birth )
    `)
    .eq("practitioner_id", practId)
    .order("recommended_date", { ascending: true });

  if (error) { console.error("getPractitionerFollowUps error:", error); return []; }

  return (data ?? []).map((row: any) => {
    const name = row.patient?.full_name ?? "Unknown";
    let patientAge = 35;
    if (row.patient?.date_of_birth) {
      patientAge = new Date().getFullYear() - new Date(row.patient.date_of_birth).getFullYear();
    }
    return {
      id: row.id,
      patientName: name,
      patientInitials: name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
      recommendedDate: row.recommended_date ?? "",
      isBooked: row.is_booked ?? false,
      nudgeSent: !!row.nudge_sent_at,
      patientAge,
    };
  });
}

export async function nudgeFollowUp(followUpId: string): Promise<void> {
  const { error } = await supabase
    .from("follow_ups")
    .update({ nudge_sent_at: new Date().toISOString() })
    .eq("id", followUpId);
  if (error) console.error("nudgeFollowUp error:", error);
}

export async function updateFollowUpDate(followUpId: string, recommendedDate: string): Promise<void> {
  const { error } = await supabase
    .from("follow_ups")
    .update({ recommended_date: recommendedDate })
    .eq("id", followUpId);
  if (error) console.error("updateFollowUpDate error:", error);
}

// ---------------------------------------------------------------------------
// Practitioner Prescriptions (GET)
// ---------------------------------------------------------------------------

export async function getPractitionerPrescriptions(practIdInput: string): Promise<PrescriptionView[]> {
  const practId = await resolvePractitionerId(practIdInput);
  const { data, error } = await supabase
    .from("prescriptions")
    .select(`
      id, status, dietary_advice, lifestyle_advice, physical_activity, followup_date, created_at,
      patient:patients ( full_name ),
      prescription_items ( medicine_name, dose, frequency, anupana, duration_days, special_instructions, sort_order )
    `)
    .eq("practitioner_id", practId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) { console.error("getPractitionerPrescriptions error:", error); return []; }

  return (data ?? []).map((row: any) => {
    const name = row.patient?.full_name ?? "Patient";
    const initials = name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    return {
      id: row.id,
      date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
      doctorName: name,
      doctorInitials: initials,
      specialty: "",
      status: row.status ?? "finalized",
      dietaryAdvice: row.dietary_advice ?? "",
      lifestyleAdvice: row.lifestyle_advice ?? "",
      physicalActivity: row.physical_activity ?? "",
      followUpDate: row.followup_date,
      chiefComplaint: "",
      assessment: "",
      items: (row.prescription_items ?? [])
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((item: any) => ({
          name: item.medicine_name ?? "",
          dose: item.dose ?? "",
          frequency: item.frequency ?? "",
          anupana: item.anupana ?? "",
          durationDays: item.duration_days ?? 0,
          instructions: item.special_instructions ?? "",
        })),
    };
  });
}

// ---------------------------------------------------------------------------
// Practitioner Inbox (GET)
// ---------------------------------------------------------------------------

export type InboxThread = {
  id: string;
  patientName: string;
  patientInitials: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  consultationId: string;
};

export async function getPractitionerInbox(practIdInput: string): Promise<InboxThread[]> {
  const practId = await resolvePractitionerId(practIdInput);
  const { data: consults, error } = await supabase
    .from("consultations")
    .select(`
      id, created_at,
      patient:patients ( full_name ),
      messages:bounded_messages ( content, sent_at, read_at, direction )
    `)
    .eq("practitioner_id", practId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) { console.error("getPractitionerInbox error:", error); return []; }

  return (consults ?? [])
    .filter((c: any) => (c.messages ?? []).length > 0)
    .map((c: any) => {
      const msgs = (c.messages ?? []).sort((a: any, b: any) =>
        new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
      );
      const last = msgs[0];
      const name = c.patient?.full_name ?? "Patient";
      return {
        id: c.id,
        patientName: name,
        patientInitials: name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
        lastMessage: last?.content ?? "",
        lastMessageTime: last?.sent_at ? timeAgo(last.sent_at) : "",
        unread: msgs.some((m: any) => m.direction === "patient_to_doctor" && !m.read_at),
        consultationId: c.id,
      };
    });
}

// ---------------------------------------------------------------------------
// Practitioner Analytics (GET)
// ---------------------------------------------------------------------------

export type AnalyticsData = {
  totalConsultations: number;
  completedThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  avgRating: number;
  totalRatings: number;
  avgDuration: number;
  monthlyConsults: { month: string; count: number }[];
};

export async function getPractitionerAnalytics(practIdInput: string): Promise<AnalyticsData> {
  const practId = await resolvePractitionerId(practIdInput);
  const thisMonth = new Date();
  const monthStart = `${thisMonth.getFullYear()}-${String(thisMonth.getMonth() + 1).padStart(2, "0")}-01`;

  const [consultRes, ratingRes, paymentRes] = await Promise.all([
    supabase.from("consultations").select("id, duration_min, created_at, is_complete").eq("practitioner_id", practId),
    supabase.from("ratings").select("stars").eq("practitioner_id", practId),
    supabase.from("payments").select("amount_paise, confirmed_at").eq("status", "success"),
  ]);

  const consults = consultRes.data ?? [];
  const ratings = ratingRes.data ?? [];
  const payments = paymentRes.data ?? [];

  const completedThisMonth = consults.filter((c: any) => c.created_at >= monthStart && c.is_complete).length;
  const avgDur = consults.filter((c: any) => c.duration_min).reduce((a: number, c: any) => a + (c.duration_min ?? 0), 0) / (consults.filter((c: any) => c.duration_min).length || 1);
  const avgRating = ratings.length > 0 ? ratings.reduce((a: number, r: any) => a + r.stars, 0) / ratings.length : 0;
  const totalRevenue = payments.reduce((a: number, p: any) => a + (p.amount_paise ?? 0), 0);
  const revenueThisMonth = payments.filter((p: any) => p.confirmed_at && p.confirmed_at >= monthStart).reduce((a: number, p: any) => a + (p.amount_paise ?? 0), 0);

  return {
    totalConsultations: consults.length,
    completedThisMonth,
    totalRevenue: Math.round(totalRevenue / 100),
    revenueThisMonth: Math.round(revenueThisMonth / 100),
    avgRating: Math.round(avgRating * 10) / 10,
    totalRatings: ratings.length,
    avgDuration: Math.round(avgDur),
    monthlyConsults: [],
  };
}

// ---------------------------------------------------------------------------
// Medicines (GET for catalogue)
// ---------------------------------------------------------------------------

export type MedicineRow = {
  id: string;
  name: string;
  genericName: string;
  discipline: string;
  category: string;
  standardDose: string;
  isActive: boolean;
};

export async function getMedicines(search?: string): Promise<MedicineRow[]> {
  let query = supabase
    .from("medicines")
    .select("id, name, generic_name, discipline, category, standard_dose, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(100);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) { console.error("getMedicines error:", error); return []; }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name ?? "",
    genericName: row.generic_name ?? "",
    discipline: row.discipline ?? "",
    category: row.category ?? "",
    standardDose: row.standard_dose ?? "",
    isActive: row.is_active ?? true,
  }));
}

// ---------------------------------------------------------------------------
// Doctor Detail — Reviews (GET)
// ---------------------------------------------------------------------------

export type ReviewRow = {
  id: string;
  stars: number;
  text: string;
  patientName: string;
  date: string;
};

export async function getPractitionerReviews(practId: string): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("ratings")
    .select(`id, stars, review_text, created_at, patient:patients ( full_name )`)
    .eq("practitioner_id", practId)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) { console.error("getPractitionerReviews error:", error); return []; }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    stars: row.stars ?? 5,
    text: row.review_text ?? "",
    patientName: row.patient?.full_name ?? "Patient",
    date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
  }));
}

// ---------------------------------------------------------------------------
// Post-Consult Data (GET)
// ---------------------------------------------------------------------------

export type PostConsultData = {
  consultation: { id: string; mode: string; date: string; duration: number } | null;
  prescription: PrescriptionView | null;
  carePlan: { followUpDate: string | null; followUpReason: string; monitoringNotes: string } | null;
};

export async function getPostConsultData(consultationId: string): Promise<PostConsultData> {
  const { data: consult } = await supabase
    .from("consultations")
    .select("id, mode, session_start, duration_min")
    .eq("id", consultationId)
    .maybeSingle();

  const { data: rx } = await supabase
    .from("prescriptions")
    .select(`
      id, status, dietary_advice, lifestyle_advice, physical_activity, followup_date, created_at,
      practitioner:practitioners ( full_name, specializations, disciplines ),
      prescription_items ( medicine_name, dose, frequency, anupana, duration_days, special_instructions, sort_order )
    `)
    .eq("consultation_id", consultationId)
    .maybeSingle();

  const { data: cp } = await supabase
    .from("care_plans")
    .select("followup_date, followup_reason, monitoring_notes")
    .eq("consultation_id", consultationId)
    .maybeSingle();

  let prescriptionView: PrescriptionView | null = null;
  if (rx) {
    const prac = (rx as any).practitioner ?? {};
    const name = prac.full_name ?? "Doctor";
    prescriptionView = {
      id: rx.id,
      date: rx.created_at ? new Date(rx.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
      doctorName: name,
      doctorInitials: name.split(" ").filter((w: string) => w).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
      specialty: [...(prac.specializations ?? []), ...(prac.disciplines ?? [])].join(" · ") || "AYUSH",
      status: rx.status ?? "finalized",
      dietaryAdvice: rx.dietary_advice ?? "",
      lifestyleAdvice: rx.lifestyle_advice ?? "",
      physicalActivity: rx.physical_activity ?? "",
      followUpDate: rx.followup_date,
      chiefComplaint: "",
      assessment: "",
      items: ((rx as any).prescription_items ?? [])
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((item: any) => ({
          name: item.medicine_name ?? "",
          dose: item.dose ?? "",
          frequency: item.frequency ?? "",
          anupana: item.anupana ?? "",
          durationDays: item.duration_days ?? 0,
          instructions: item.special_instructions ?? "",
        })),
    };
  }

  return {
    consultation: consult ? {
      id: consult.id,
      mode: consult.mode,
      date: consult.session_start ? new Date(consult.session_start).toLocaleDateString("en-IN") : "",
      duration: consult.duration_min ?? 0,
    } : null,
    prescription: prescriptionView,
    carePlan: cp ? {
      followUpDate: cp.followup_date,
      followUpReason: cp.followup_reason ?? "",
      monitoringNotes: cp.monitoring_notes ?? "",
    } : null,
  };
}

// ---------------------------------------------------------------------------
// Admin Queries
// ---------------------------------------------------------------------------

export async function getAdminDashboardStats(): Promise<{
  totalPatients: number; totalPractitioners: number; totalAppointments: number;
  totalOrders: number; revenue: number; pendingVerifications: number;
}> {
  const [pats, pracs, appts, ords, pendingV] = await Promise.all([
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("practitioners").select("id", { count: "exact", head: true }),
    supabase.from("appointments").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("practitioners").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
  ]);

  return {
    totalPatients: pats.count ?? 0,
    totalPractitioners: pracs.count ?? 0,
    totalAppointments: appts.count ?? 0,
    totalOrders: ords.count ?? 0,
    revenue: 0,
    pendingVerifications: pendingV.count ?? 0,
  };
}

export async function getAdminPractitioners(): Promise<any[]> {
  const { data, error } = await supabase
    .from("practitioners")
    .select("id, full_name, disciplines, specializations, qualifications, experience_years, verification_status, rating_avg, rating_count, consultation_count, created_at, hpr_id, user:users ( mobile, email ), clinic_practitioners ( clinic:clinics ( id, name, city ) )")
    .order("created_at", { ascending: false });
  if (error) { console.error("getAdminPractitioners error:", error); return []; }
  return data ?? [];
}

export async function verifyPractitioner(id: string, status: "verified" | "rejected", reason?: string): Promise<void> {
  const updates: Record<string, unknown> = { verification_status: status };
  if (reason) updates.rejection_reason = reason;
  const { error } = await supabase.from("practitioners").update(updates).eq("id", id);
  if (error) console.error("verifyPractitioner error:", error);
}

export async function createPractitioner(p: {
  name: string;
  specialty: string;
  qualification: string;
  hprId: string;
  email: string;
  phone: string;
  practiceType: "independent" | "hospital" | "both";
  clinicName: string;
  hospitalIds: string[];
  city: string;
}): Promise<void> {
  const { data: user, error: userErr } = await supabase
    .from("users")
    .insert({
      mobile: p.phone,
      email: p.email,
      role: "practitioner",
    })
    .select("id")
    .single();

  if (userErr || !user) {
    console.error("createPractitioner error creating user:", userErr);
    throw new Error(userErr?.message ?? "Failed to create practitioner user");
  }

  const { data: prac, error: pracErr } = await supabase
    .from("practitioners")
    .insert({
      user_id: user.id,
      full_name: p.name,
      disciplines: [p.specialty],
      specializations: [p.specialty],
      qualifications: [p.qualification],
      hpr_id: p.hprId,
      verification_status: "pending",
    })
    .select("id")
    .single();

  if (pracErr || !prac) {
    console.error("createPractitioner error creating practitioner:", pracErr);
    throw new Error(pracErr?.message ?? "Failed to create practitioner profile");
  }

  if (p.hospitalIds && p.hospitalIds.length > 0) {
    const associations = p.hospitalIds.map((hid) => ({
      clinic_id: hid,
      practitioner_id: prac.id,
    }));
    const { error: assocErr } = await supabase.from("clinic_practitioners").insert(associations);
    if (assocErr) {
      console.error("createPractitioner error creating clinic affiliations:", assocErr);
    }
  }
}

export async function getAdminPatients(): Promise<any[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("id, full_name, date_of_birth, gender, prakriti, city, created_at, user:users ( mobile, email, is_active, abha:abha_links ( abha_id ) ), consultations ( id, session_start, is_complete, practitioner:practitioners ( id, full_name, disciplines ) )")
    .order("created_at", { ascending: false });
  if (error) { console.error("getAdminPatients error:", error); return []; }
  
  return (data ?? []).map((pat: any) => {
    const user = Array.isArray(pat.user) ? pat.user[0] : pat.user;
    const abha = Array.isArray(user?.abha) ? user.abha : user?.abha ? [user.abha] : [];
    return {
      ...pat,
      abha,
    };
  });
}

export async function togglePatientStatus(patientId: string, isActive: boolean): Promise<void> {
  const { data: pat, error: getErr } = await supabase
    .from("patients")
    .select("user_id")
    .eq("id", patientId)
    .single();

  if (getErr || !pat) {
    console.error("togglePatientStatus error getting patient:", getErr);
    return;
  }

  const { error } = await supabase
    .from("users")
    .update({ is_active: isActive })
    .eq("id", pat.user_id);

  if (error) console.error("togglePatientStatus error updating user:", error);
}

export async function createPatient(p: {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  city: string;
  abha: boolean;
  abhaId?: string;
}): Promise<void> {
  const { data: user, error: userErr } = await supabase
    .from("users")
    .insert({
      mobile: p.phone,
      email: p.email,
      role: "patient",
    })
    .select("id")
    .single();

  if (userErr || !user) {
    console.error("createPatient error creating user:", userErr);
    throw new Error(userErr?.message ?? "Failed to create user");
  }

  const { data: pat, error: patErr } = await supabase
    .from("patients")
    .insert({
      user_id: user.id,
      full_name: p.name,
      date_of_birth: p.dob,
      gender: p.gender.toLowerCase() === "male" ? "M" : p.gender.toLowerCase() === "female" ? "F" : "O",
      city: p.city,
    })
    .select("id")
    .single();

  if (patErr || !pat) {
    console.error("createPatient error creating patient profile:", patErr);
    throw new Error(patErr?.message ?? "Failed to create patient profile");
  }

  if (p.abha && p.abhaId) {
    const { error: abhaErr } = await supabase
      .from("abha_links")
      .insert({
        user_id: user.id,
        abha_id: p.abhaId,
        abha_address: `${p.name.toLowerCase().replace(/\s+/g, "")}@abha`,
        full_name: p.name,
        date_of_birth: p.dob,
        gender: p.gender.toLowerCase() === "male" ? "M" : p.gender.toLowerCase() === "female" ? "F" : "O",
        is_verified: true,
      });
    if (abhaErr) console.error("createPatient error linking ABHA:", abhaErr);
  }
}

export async function getAdminOrders(): Promise<any[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total_paise, created_at, tracking_number, logistics_partner, patient:patients ( full_name, city, user:users ( mobile ) ), order_items ( id, medicine_name, quantity, unit_price_paise, total_price_paise )")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) { console.error("getAdminOrders error:", error); return []; }
  return data ?? [];
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  logisticsPartner?: string
): Promise<void> {
  const updates: Record<string, any> = { status };
  if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
  if (logisticsPartner !== undefined) updates.logistics_partner = logisticsPartner;
  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);
  if (error) {
    console.error("updateOrderStatus error:", error);
    throw new Error(error.message);
  }
}

export async function getAdminMedicines(): Promise<MedicineRow[]> {
  const { data, error } = await supabase
    .from("medicines")
    .select("id, name, generic_name, discipline, category, standard_dose, is_active")
    .order("name", { ascending: true });
  if (error) { console.error("getAdminMedicines error:", error); return []; }
  return (data ?? []).map((row: any) => ({
    id: row.id, name: row.name ?? "", genericName: row.generic_name ?? "",
    discipline: row.discipline ?? "", category: row.category ?? "",
    standardDose: row.standard_dose ?? "", isActive: row.is_active ?? true,
  }));
}

export async function createMedicine(m: {
  name: string;
  genericName: string;
  discipline: string;
  category: string;
  standardDose: string;
}): Promise<void> {
  const { error } = await supabase
    .from("medicines")
    .insert({
      name: m.name,
      generic_name: m.genericName,
      discipline: m.discipline,
      category: m.category,
      standard_dose: m.standardDose,
      is_active: true,
    });
  if (error) {
    console.error("createMedicine error:", error);
    throw new Error(error.message);
  }
}

export async function updateMedicine(
  id: string,
  m: {
    name: string;
    genericName: string;
    discipline: string;
    category: string;
    standardDose: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from("medicines")
    .update({
      name: m.name,
      generic_name: m.genericName,
      discipline: m.discipline,
      category: m.category,
      standard_dose: m.standardDose,
    })
    .eq("id", id);
  if (error) {
    console.error("updateMedicine error:", error);
    throw new Error(error.message);
  }
}

export async function toggleMedicineActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from("medicines")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) {
    console.error("toggleMedicineActive error:", error);
    throw new Error(error.message);
  }
}

export async function getAdminClinics(): Promise<any[]> {
  const { data, error } = await supabase
    .from("clinics")
    .select("id, name, address_line1, city, state, pin_code, phone, is_active, hfr_id, hfr_verified, clinic_practitioners ( practitioner:practitioners ( full_name ) )")
    .order("name", { ascending: true });
  if (error) { console.error("getAdminClinics error:", error); return []; }
  return data ?? [];
}

export async function createClinic(c: {
  name: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  hfrId: string;
  phone: string;
}): Promise<void> {
  const { error } = await supabase
    .from("clinics")
    .insert({
      name: c.name,
      address_line1: c.address,
      city: c.city,
      state: c.state,
      pin_code: c.pin,
      hfr_id: c.hfrId,
      phone: c.phone,
      is_active: true,
    });
  if (error) {
    console.error("createClinic error:", error);
    throw new Error(error.message);
  }
}

export async function toggleClinicActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from("clinics")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) {
    console.error("toggleClinicActive error:", error);
    throw new Error(error.message);
  }
}

export type AddressInput = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
};

export type OrderItemInput = {
  medicineId?: string;
  medicineName: string;
  quantity: number;
  unitPricePaise: number;
};

export type PlaceOrderInput = {
  patientId: string;
  address: AddressInput;
  items: OrderItemInput[];
  shippingFeePaise: number;
};

export async function placeOrder(input: PlaceOrderInput): Promise<string> {
  const resolvedPatientId = await resolvePatientId(input.patientId);

  // 1. Insert address
  const { data: addrData, error: addrError } = await supabase
    .from("patient_addresses")
    .insert({
      patient_id: resolvedPatientId,
      label: "Home",
      full_name: input.address.fullName,
      phone: input.address.phone,
      address_line1: input.address.addressLine1,
      address_line2: input.address.addressLine2 || null,
      city: input.address.city,
      state: input.address.state,
      pin_code: input.address.pinCode,
      is_default: false,
    })
    .select("id")
    .single();

  if (addrError) {
    console.error("placeOrder address error:", addrError);
    throw new Error(addrError.message);
  }

  const addressId = addrData.id;

  // Calculate prices
  const subtotal = input.items.reduce((acc, item) => acc + item.unitPricePaise * item.quantity, 0);
  const total = subtotal + input.shippingFeePaise;

  // 2. Insert order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      patient_id: resolvedPatientId,
      address_id: addressId,
      status: "placed",
      subtotal_paise: subtotal,
      delivery_fee_paise: input.shippingFeePaise,
      total_paise: total,
    })
    .select("id")
    .single();

  if (orderError) {
    console.error("placeOrder order error:", orderError);
    throw new Error(orderError.message);
  }

  const orderId = orderData.id;

  // 3. Insert order items
  const itemsToInsert = input.items.map((item) => ({
    order_id: orderId,
    medicine_id: item.medicineId || null,
    medicine_name: item.medicineName,
    quantity: item.quantity,
    unit_price_paise: item.unitPricePaise,
    total_price_paise: item.unitPricePaise * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    console.error("placeOrder items error:", itemsError);
    throw new Error(itemsError.message);
  }

  return orderId;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function fmtTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hours = parseInt(h, 10);
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}:${m} ${period}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
