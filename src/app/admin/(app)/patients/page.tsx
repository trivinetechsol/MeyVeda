"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type PatientStatus = "active" | "suspended";

type CareTeamMember = {
  doctorId: string;
  name: string;
  specialty: string;
  since: string;
};

type Patient = {
  id: string; name: string; phone: string; email: string;
  dob: string; gender: string; bloodGroup: string;
  abha: boolean; abhaId?: string; city: string;
  registered: string; lastVisit: string; status: PatientStatus;
  totalConsults: number;
  careTeam: CareTeamMember[];
};

const INITIAL: Patient[] = [
  {
    id: "u1", name: "Rohit Kumar", phone: "+91 98765 43210", email: "rohit@example.com",
    dob: "12 Mar 1994", gender: "Male", bloodGroup: "B+", abha: true, abhaId: "rohit@abha",
    city: "Bengaluru", registered: "15 Jan 2026", lastVisit: "05 Jun 2026", status: "active", totalConsults: 4,
    careTeam: [
      { doctorId: "p1", name: "Dr. Aditi Shastri", specialty: "Ayurveda", since: "15 Jan 2026" },
      { doctorId: "p2", name: "Dr. Rajan Mehta", specialty: "Homeopathy", since: "28 May 2026" },
    ],
  },
  {
    id: "u2", name: "Ananya Singh", phone: "+91 87654 32109", email: "ananya@example.com",
    dob: "25 Jul 1990", gender: "Female", bloodGroup: "O+", abha: false,
    city: "Delhi", registered: "20 Jan 2026", lastVisit: "01 Jun 2026", status: "active", totalConsults: 2,
    careTeam: [
      { doctorId: "p1", name: "Dr. Aditi Shastri", specialty: "Ayurveda", since: "20 Jan 2026" },
    ],
  },
  {
    id: "u3", name: "Vikram Nair", phone: "+91 76543 21098", email: "vikram@example.com",
    dob: "03 Nov 1985", gender: "Male", bloodGroup: "A+", abha: true, abhaId: "vikram@abha",
    city: "Kochi", registered: "25 Jan 2026", lastVisit: "28 May 2026", status: "active", totalConsults: 7,
    careTeam: [
      { doctorId: "p3", name: "Dr. Kavya Menon", specialty: "Panchakarma", since: "25 Jan 2026" },
      { doctorId: "p1", name: "Dr. Aditi Shastri", specialty: "Ayurveda", since: "10 Mar 2026" },
      { doctorId: "p6", name: "Dr. Priya Krishnan", specialty: "Siddha", since: "15 May 2026" },
    ],
  },
  {
    id: "u4", name: "Deepika Patel", phone: "+91 65432 10987", email: "deepika@example.com",
    dob: "18 Apr 1995", gender: "Female", bloodGroup: "AB+", abha: true, abhaId: "deepika@abha",
    city: "Ahmedabad", registered: "01 Feb 2026", lastVisit: "20 May 2026", status: "active", totalConsults: 3,
    careTeam: [
      { doctorId: "p5", name: "Dr. Sunita Rao", specialty: "Yoga & Naturopathy", since: "01 Feb 2026" },
    ],
  },
  {
    id: "u5", name: "Suresh Bhat", phone: "+91 54321 09876", email: "suresh@example.com",
    dob: "07 Sep 1978", gender: "Male", bloodGroup: "O-", abha: false,
    city: "Mangalore", registered: "10 Feb 2026", lastVisit: "15 Apr 2026", status: "active", totalConsults: 1,
    careTeam: [
      { doctorId: "p4", name: "Dr. Farhan Sheikh", specialty: "Unani", since: "10 Feb 2026" },
    ],
  },
  {
    id: "u6", name: "Meera Krishnan", phone: "+91 43210 98765", email: "meera@example.com",
    dob: "22 Dec 1988", gender: "Female", bloodGroup: "B-", abha: true, abhaId: "meera@abha",
    city: "Chennai", registered: "14 Feb 2026", lastVisit: "10 May 2026", status: "suspended", totalConsults: 0,
    careTeam: [],
  },
  {
    id: "u7", name: "Arjun Verma", phone: "+91 32109 87654", email: "arjun@example.com",
    dob: "14 Jun 1992", gender: "Male", bloodGroup: "A-", abha: false,
    city: "Lucknow", registered: "20 Feb 2026", lastVisit: "25 Apr 2026", status: "active", totalConsults: 5,
    careTeam: [
      { doctorId: "p1", name: "Dr. Aditi Shastri", specialty: "Ayurveda", since: "20 Feb 2026" },
      { doctorId: "p2", name: "Dr. Rajan Mehta", specialty: "Homeopathy", since: "01 Apr 2026" },
    ],
  },
  {
    id: "u8", name: "Priya Sharma", phone: "+91 21098 76543", email: "priya@example.com",
    dob: "30 Jan 1997", gender: "Female", bloodGroup: "O+", abha: true, abhaId: "priya@abha",
    city: "Jaipur", registered: "01 Mar 2026", lastVisit: "02 Jun 2026", status: "active", totalConsults: 2,
    careTeam: [
      { doctorId: "p5", name: "Dr. Sunita Rao", specialty: "Yoga & Naturopathy", since: "01 Mar 2026" },
    ],
  },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

const EMPTY_FORM = {
  name: "", phone: "", email: "", dob: "", gender: "Male",
  bloodGroup: "B+", city: "", abha: false, abhaId: "",
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | PatientStatus>("all");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function toggleStatus(id: string) {
    setPatients((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "suspended" : "active" } : p)
    );
    setSelected(null);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const newP: Patient = {
        id: `u${Date.now()}`,
        name: form.name,
        phone: form.phone,
        email: form.email,
        dob: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        abha: form.abha,
        abhaId: form.abha ? form.abhaId : undefined,
        city: form.city,
        registered: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        lastVisit: "—",
        status: "active",
        totalConsults: 0,
        careTeam: [],
      };
      setPatients((prev) => [newP, ...prev]);
      setForm(EMPTY_FORM);
      setShowAddForm(false);
      setSaving(false);
    }, 800);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {patients.length} registered · {patients.filter((p) => p.abha).length} ABHA linked
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-herb-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-herb-green/90 transition-all active:scale-95 flex-shrink-0"
        >
          + Add Patient
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, phone, city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20 bg-white"
        />
        <div className="flex gap-1.5">
          {(["all", "active", "suspended"] as const).map((s) => (
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

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ABHA</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Doctors</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Consults</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Visit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-background transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sage text-xs font-bold">{p.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.gender} · {p.bloodGroup} · DOB {p.dob}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-foreground">{p.phone}</p>
                    <p className="text-[10px] text-muted-foreground">{p.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {p.abha
                      ? <span className="text-[10px] font-semibold text-herb-green bg-herb-green/10 px-2 py-0.5 rounded-full">✓ Linked</span>
                      : <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Not linked</span>
                    }
                  </td>
                  <td className="px-4 py-3.5 text-xs text-foreground">{p.city}</td>
                  <td className="px-4 py-3.5">
                    {p.careTeam.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {p.careTeam.slice(0, 2).map((d) => (
                          <span key={d.doctorId} className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                            {d.name.replace("Dr. ", "")}
                          </span>
                        ))}
                        {p.careTeam.length > 2 && (
                          <span className="text-[10px] text-herb-green font-medium">+{p.careTeam.length - 2} more</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-foreground font-semibold">{p.totalConsults}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{p.lastVisit}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize",
                      p.status === "active" ? "bg-herb-green/10 text-herb-green" : "bg-red-50 text-red-600"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setSelected(p)} className="text-[10px] font-semibold text-herb-green hover:underline">View</button>
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={cn("text-[10px] font-semibold hover:underline", p.status === "active" ? "text-red-500" : "text-amber-600")}
                      >
                        {p.status === "active" ? "Suspend" : "Reinstate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-muted-foreground">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Patient Details</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center">
                  <span className="text-sage text-xl font-bold">{selected.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.gender} · {selected.bloodGroup} · {selected.city}</p>
                  {selected.abha && <p className="text-xs text-herb-green mt-0.5">ABHA: {selected.abhaId}</p>}
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-5">
                {[
                  ["Phone", selected.phone],
                  ["Email", selected.email],
                  ["Date of Birth", selected.dob],
                  ["Registered", selected.registered],
                  ["Last Visit", selected.lastVisit],
                  ["Total Consultations", String(selected.totalConsults)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{val}</span>
                  </div>
                ))}
              </div>

              {/* Care team */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Care Team · {selected.careTeam.length} {selected.careTeam.length === 1 ? "doctor" : "doctors"}
                </h4>
                {selected.careTeam.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No doctors assigned yet</p>
                ) : (
                  <div className="space-y-2">
                    {selected.careTeam.map((d) => (
                      <div key={d.doctorId} className="flex items-center gap-3 bg-background rounded-xl px-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-herb-green text-[10px] font-bold">
                            {d.name.split(" ")[1]?.[0] ?? d.name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">{d.name}</p>
                          <p className="text-[10px] text-muted-foreground">{d.specialty}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">since {d.since}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => toggleStatus(selected.id)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    selected.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-herb-green text-white hover:bg-herb-green/90"
                  )}
                >
                  {selected.status === "active" ? "Suspend Account" : "Reinstate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient form modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Add New Patient</h2>
              <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Patient full name"
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
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Date of Birth</label>
                  <input
                    required
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white"
                  >
                    {GENDERS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white"
                  >
                    {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">ABHA Linked?</label>
                  <div className="flex gap-2 mt-1">
                    {([true, false] as const).map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, abha: v, abhaId: v ? f.abhaId : "" }))}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-xs font-semibold border transition-all",
                          form.abha === v
                            ? "bg-herb-green text-white border-herb-green"
                            : "border-border text-muted-foreground hover:border-herb-green/30"
                        )}
                      >
                        {v ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
                {form.abha && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-foreground block mb-1">ABHA ID</label>
                    <input
                      value={form.abhaId}
                      onChange={(e) => setForm((f) => ({ ...f, abhaId: e.target.value }))}
                      placeholder="patient@abdm"
                      className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all disabled:opacity-60"
                >
                  {saving ? "Adding…" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
