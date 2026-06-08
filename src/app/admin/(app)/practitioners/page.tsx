"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Status = "verified" | "pending" | "suspended";
type PracticeType = "independent" | "hospital" | "both";

type Practitioner = {
  id: string; name: string; specialty: string; qualification: string;
  hprId: string; email: string; phone: string;
  practiceType: PracticeType;
  clinicName: string;
  hospitalIds: string[];
  city: string; status: Status; joined: string;
};

const HOSPITALS_LIST = [
  { id: "h1", name: "Arya Vaidya Sala Kottakkal", city: "Malappuram" },
  { id: "h2", name: "National Institute of Ayurveda", city: "Jaipur" },
  { id: "h3", name: "Holistic Wellness Hub", city: "Bengaluru" },
  { id: "h4", name: "AyurVita Panchakarma Centre", city: "Kochi" },
  { id: "h5", name: "Homeo Care Clinic", city: "Chennai" },
];

const INITIAL: Practitioner[] = [
  {
    id: "p1", name: "Dr. Aditi Shastri", specialty: "Ayurveda", qualification: "BAMS, MD (Ayu)",
    hprId: "HPR-4902-8822", email: "aditi@example.com", phone: "+91 98765 43210",
    practiceType: "both", clinicName: "Holistic Wellness Clinic", hospitalIds: ["h3"],
    city: "Bengaluru", status: "verified", joined: "12 Jan 2026",
  },
  {
    id: "p2", name: "Dr. Rajan Mehta", specialty: "Homeopathy", qualification: "BHMS",
    hprId: "HPR-3301-9943", email: "rajan@example.com", phone: "+91 87654 32109",
    practiceType: "independent", clinicName: "Mehta Homeo Centre", hospitalIds: [],
    city: "Mumbai", status: "verified", joined: "18 Feb 2026",
  },
  {
    id: "p3", name: "Dr. Kavya Menon", specialty: "Panchakarma", qualification: "BAMS",
    hprId: "HPR-2204-7712", email: "kavya@example.com", phone: "+91 76543 21098",
    practiceType: "hospital", clinicName: "", hospitalIds: ["h4"],
    city: "Kochi", status: "pending", joined: "05 Jun 2026",
  },
  {
    id: "p4", name: "Dr. Farhan Sheikh", specialty: "Unani", qualification: "BUMS",
    hprId: "HPR-4405-8832", email: "farhan@example.com", phone: "+91 65432 10987",
    practiceType: "independent", clinicName: "Unani Health Hub", hospitalIds: [],
    city: "Hyderabad", status: "pending", joined: "02 Jun 2026",
  },
  {
    id: "p5", name: "Dr. Sunita Rao", specialty: "Yoga & Naturopathy", qualification: "BNYS",
    hprId: "HPR-1102-5521", email: "sunita@example.com", phone: "+91 54321 09876",
    practiceType: "hospital", clinicName: "", hospitalIds: ["h3"],
    city: "Pune", status: "verified", joined: "28 Mar 2026",
  },
  {
    id: "p6", name: "Dr. Priya Krishnan", specialty: "Siddha", qualification: "BSMS",
    hprId: "HPR-5506-2217", email: "priya@example.com", phone: "+91 43210 98765",
    practiceType: "independent", clinicName: "Siddha Wellness", hospitalIds: [],
    city: "Chennai", status: "suspended", joined: "15 Jan 2026",
  },
];

const SPECIALTIES = ["Ayurveda", "Homeopathy", "Yoga & Naturopathy", "Unani", "Siddha", "Panchakarma", "Kayachikitsa"];
const QUALIFICATIONS = ["BAMS", "BHMS", "BUMS", "BNYS", "BSMS", "MD (Ayu)", "MS (Ayu)"];

const STATUS_STYLE: Record<Status, string> = {
  verified: "bg-herb-green/10 text-herb-green",
  pending: "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-600",
};

const PRACTICE_LABEL: Record<PracticeType, string> = {
  independent: "Independent",
  hospital: "Hospital",
  both: "Both",
};

const PRACTICE_STYLE: Record<PracticeType, string> = {
  independent: "bg-blue-50 text-blue-700",
  hospital: "bg-amber-50 text-amber-700",
  both: "bg-herb-green/10 text-herb-green",
};

const EMPTY_FORM: {
  name: string; specialty: string; qualification: string; hprId: string;
  email: string; phone: string; practiceType: PracticeType;
  clinicName: string; hospitalIds: string[]; city: string;
} = {
  name: "", specialty: "Ayurveda", qualification: "BAMS", hprId: "",
  email: "", phone: "", practiceType: "independent",
  clinicName: "", hospitalIds: [], city: "",
};

export default function AdminPractitionersPage() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = practitioners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function changeStatus(id: string, status: Status) {
    setPractitioners((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function toggleHospital(hid: string) {
    setForm((f) => ({
      ...f,
      hospitalIds: f.hospitalIds.includes(hid)
        ? f.hospitalIds.filter((x) => x !== hid)
        : [...f.hospitalIds, hid],
    }));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const newP: Practitioner = {
        id: `p${Date.now()}`,
        ...form,
        status: "pending",
        joined: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setPractitioners((prev) => [newP, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSaving(false);
    }, 800);
  }

  function practiceDisplay(p: Practitioner) {
    const hospitals = p.hospitalIds
      .map((hid) => HOSPITALS_LIST.find((h) => h.id === hid)?.name ?? hid)
      .join(", ");
    if (p.practiceType === "independent") return p.clinicName || "—";
    if (p.practiceType === "hospital") return hospitals || "—";
    const parts = [p.clinicName, hospitals].filter(Boolean);
    return parts.join(" + ") || "—";
  }

  const showClinicField = form.practiceType === "independent" || form.practiceType === "both";
  const showHospitalField = form.practiceType === "hospital" || form.practiceType === "both";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Practitioners</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {practitioners.length} registered · {practitioners.filter((p) => p.status === "pending").length} pending verification
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-herb-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-herb-green/90 transition-all active:scale-95 flex-shrink-0"
        >
          + Add Practitioner
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, specialty, city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20 focus:border-herb-green/50 bg-white"
        />
        <div className="flex gap-1.5">
          {(["all", "verified", "pending", "suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-3 py-2 text-xs font-semibold rounded-xl border transition-all capitalize",
                filterStatus === s
                  ? "bg-herb-green text-white border-herb-green"
                  : "border-border text-muted-foreground bg-white hover:border-herb-green/30"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Practitioner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Specialty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">HPR ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Practice</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-background transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-herb-green text-xs font-bold">{p.name.split(" ")[1]?.[0] ?? p.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-foreground">{p.specialty}</p>
                    <p className="text-[10px] text-muted-foreground">{p.qualification}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{p.hprId}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", PRACTICE_STYLE[p.practiceType])}>
                      {PRACTICE_LABEL[p.practiceType]}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[160px] truncate">{practiceDisplay(p)}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-foreground">{p.city}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize", STATUS_STYLE[p.status])}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status !== "verified" && (
                        <button onClick={() => changeStatus(p.id, "verified")} className="text-[10px] font-semibold text-herb-green hover:underline">
                          Verify
                        </button>
                      )}
                      {p.status !== "suspended" && (
                        <button onClick={() => changeStatus(p.id, "suspended")} className="text-[10px] font-semibold text-red-500 hover:underline">
                          Suspend
                        </button>
                      )}
                      {p.status === "suspended" && (
                        <button onClick={() => changeStatus(p.id, "verified")} className="text-[10px] font-semibold text-amber-600 hover:underline">
                          Reinstate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No practitioners found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Practitioner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Add New Practitioner</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Basic info */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. Full Name"
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Specialty</label>
                  <select
                    value={form.specialty}
                    onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white"
                  >
                    {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Qualification</label>
                  <select
                    value={form.qualification}
                    onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white"
                  >
                    {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">HPR ID</label>
                  <input
                    required
                    value={form.hprId}
                    onChange={(e) => setForm((f) => ({ ...f, hprId: e.target.value }))}
                    placeholder="HPR-XXXX-XXXX"
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="doctor@example.com"
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">City</label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>

                {/* Practice type */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-2">Practice Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["independent", "hospital", "both"] as PracticeType[]).map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setForm((f) => ({
                          ...f,
                          practiceType: pt,
                          clinicName: pt === "hospital" ? "" : f.clinicName,
                          hospitalIds: pt === "independent" ? [] : f.hospitalIds,
                        }))}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-semibold border transition-all capitalize",
                          form.practiceType === pt
                            ? pt === "independent"
                              ? "bg-blue-600 text-white border-blue-600"
                              : pt === "hospital"
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-herb-green text-white border-herb-green"
                            : "border-border text-muted-foreground hover:border-herb-green/40"
                        )}
                      >
                        {pt === "independent" ? "Independent" : pt === "hospital" ? "Hospital" : "Both"}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {form.practiceType === "independent" && "Runs their own private clinic or solo practice."}
                    {form.practiceType === "hospital" && "Practices exclusively within a registered hospital or institution."}
                    {form.practiceType === "both" && "Maintains an independent clinic and is also affiliated with a hospital."}
                  </p>
                </div>

                {/* Independent practice name */}
                {showClinicField && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      {form.practiceType === "both" ? "Independent Clinic Name" : "Clinic / Practice Name"}
                    </label>
                    <input
                      required={form.practiceType === "independent"}
                      value={form.clinicName}
                      onChange={(e) => setForm((f) => ({ ...f, clinicName: e.target.value }))}
                      placeholder="e.g. Shastri Ayurveda Clinic"
                      className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                    />
                  </div>
                )}

                {/* Hospital affiliation */}
                {showHospitalField && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-foreground block mb-2">
                      Hospital Affiliation{form.practiceType === "both" ? " (select all that apply)" : ""}
                    </label>
                    <div className="space-y-2">
                      {HOSPITALS_LIST.map((h) => {
                        const selected = form.hospitalIds.includes(h.id);
                        return (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => toggleHospital(h.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
                              selected
                                ? "border-herb-green bg-herb-green/5"
                                : "border-border hover:border-herb-green/30"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              selected ? "bg-herb-green border-herb-green" : "border-border"
                            )}>
                              {selected && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-medium", selected ? "text-foreground" : "text-foreground")}>{h.name}</p>
                              <p className="text-[10px] text-muted-foreground">{h.city}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {showHospitalField && form.hospitalIds.length === 0 && (
                      <p className="text-[10px] text-amber-600 mt-1.5">Select at least one hospital</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (showHospitalField && form.hospitalIds.length === 0)}
                  className="flex-1 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all disabled:opacity-60"
                >
                  {saving ? "Adding…" : "Add Practitioner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
