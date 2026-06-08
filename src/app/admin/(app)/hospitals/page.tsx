"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type HospitalStatus = "active" | "inactive" | "pending";
type HospitalType = "AYUSH Hospital" | "Wellness Centre" | "Panchakarma Centre" | "Homeopathy Clinic" | "Naturopathy Centre" | "Multi-specialty AYUSH";

type Hospital = {
  id: string; name: string; type: HospitalType; address: string;
  city: string; state: string; pin: string; beds: number;
  hfrId: string; phone: string; email: string;
  specialties: string[]; status: HospitalStatus; added: string;
};

const INITIAL: Hospital[] = [
  { id: "h1", name: "Arya Vaidya Sala Kottakkal", type: "AYUSH Hospital", address: "P.O. Kottakkal", city: "Malappuram", state: "Kerala", pin: "676503", beds: 200, hfrId: "HFR-KL-2201", phone: "+91 483 274 2216", email: "avs@kottakkal.org", specialties: ["Ayurveda", "Panchakarma"], status: "active", added: "10 Jan 2026" },
  { id: "h2", name: "National Institute of Ayurveda", type: "AYUSH Hospital", address: "Madau Singh Road, Amer Road", city: "Jaipur", state: "Rajasthan", pin: "302002", beds: 300, hfrId: "HFR-RJ-1101", phone: "+91 141 263 5816", email: "nia@gov.in", specialties: ["Ayurveda", "Kayachikitsa", "Shalya"], status: "active", added: "15 Jan 2026" },
  { id: "h3", name: "Holistic Wellness Hub", type: "Wellness Centre", address: "123 MG Road", city: "Bengaluru", state: "Karnataka", pin: "560001", beds: 30, hfrId: "HFR-KA-3305", phone: "+91 80 4567 8901", email: "info@holisticwellness.in", specialties: ["Yoga", "Naturopathy", "Ayurveda"], status: "active", added: "20 Feb 2026" },
  { id: "h4", name: "AyurVita Panchakarma Centre", type: "Panchakarma Centre", address: "45 MG Road", city: "Kochi", state: "Kerala", pin: "682001", beds: 20, hfrId: "HFR-KL-4412", phone: "+91 484 234 5678", email: "info@ayurvita.com", specialties: ["Panchakarma", "Ayurveda"], status: "pending", added: "01 Jun 2026" },
  { id: "h5", name: "Homeo Care Clinic", type: "Homeopathy Clinic", address: "78 Anna Salai", city: "Chennai", state: "Tamil Nadu", pin: "600002", beds: 10, hfrId: "HFR-TN-5521", phone: "+91 44 2345 6789", email: "care@homeocare.in", specialties: ["Homeopathy"], status: "inactive", added: "05 Mar 2026" },
];

const HOSPITAL_TYPES: HospitalType[] = ["AYUSH Hospital", "Wellness Centre", "Panchakarma Centre", "Homeopathy Clinic", "Naturopathy Centre", "Multi-specialty AYUSH"];
const SPECIALTY_OPTIONS = ["Ayurveda", "Homeopathy", "Yoga", "Naturopathy", "Unani", "Siddha", "Panchakarma", "Kayachikitsa"];

const STATUS_STYLE: Record<HospitalStatus, string> = {
  active: "bg-herb-green/10 text-herb-green",
  pending: "bg-amber-50 text-amber-700",
  inactive: "bg-muted text-muted-foreground",
};

const EMPTY_FORM = { name: "", type: "AYUSH Hospital" as HospitalType, address: "", city: "", state: "", pin: "", beds: "", hfrId: "", phone: "", email: "", specialties: [] as string[] };

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | HospitalStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = hospitals.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.state.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || h.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function toggleStatus(id: string) {
    setHospitals((prev) => prev.map((h) =>
      h.id === id ? { ...h, status: h.status === "active" ? "inactive" : "active" } : h
    ));
  }

  function toggleSpecialty(sp: string) {
    setForm((f) => ({
      ...f,
      specialties: f.specialties.includes(sp)
        ? f.specialties.filter(s => s !== sp)
        : [...f.specialties, sp],
    }));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const newH: Hospital = {
        id: `h${Date.now()}`,
        ...form,
        beds: Number(form.beds),
        specialties: form.specialties.length ? form.specialties : ["Ayurveda"],
        status: "pending",
        added: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setHospitals((prev) => [newH, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSaving(false);
    }, 800);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Hospitals & Clinics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{hospitals.length} registered · {hospitals.filter(h => h.status === "active").length} active</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-herb-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-herb-green/90 transition-all active:scale-95 flex-shrink-0">
          + Add Hospital
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input type="text" placeholder="Search by name, city, state…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20 bg-white" />
        <div className="flex gap-1.5">
          {(["all", "active", "pending", "inactive"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("px-3 py-2 text-xs font-semibold rounded-xl border transition-all capitalize",
                filterStatus === s ? "bg-herb-green text-white border-herb-green" : "border-border text-muted-foreground bg-white hover:border-herb-green/30"
              )}>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hospital / Clinic</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Beds</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">HFR ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-background transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{h.name}</p>
                    <p className="text-[10px] text-muted-foreground">{h.specialties.join(" · ")}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{h.type}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-foreground">{h.city}</p>
                    <p className="text-[10px] text-muted-foreground">{h.state} · {h.pin}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-foreground">{h.beds}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{h.hfrId}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize", STATUS_STYLE[h.status])}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => toggleStatus(h.id)} className={cn("text-[10px] font-semibold hover:underline", h.status === "active" ? "text-red-500" : "text-herb-green")}>
                      {h.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No hospitals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Add Hospital / Clinic</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Hospital / Clinic Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as HospitalType }))} className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white">
                    {HOSPITAL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Address</label>
                  <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">City</label>
                  <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">State</label>
                  <input required value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="State" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">PIN Code</label>
                  <input required value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value }))} placeholder="6-digit PIN" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Beds</label>
                  <input required type="number" value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} placeholder="0" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">HFR ID</label>
                  <input required value={form.hfrId} onChange={e => setForm(f => ({ ...f, hfrId: e.target.value }))} placeholder="HFR-XX-XXXX" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Phone</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="hospital@example.com" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTY_OPTIONS.map((sp) => (
                      <button key={sp} type="button" onClick={() => toggleSpecialty(sp)}
                        className={cn("text-xs px-3 py-1.5 rounded-full border transition-all",
                          form.specialties.includes(sp) ? "bg-herb-green text-white border-herb-green" : "border-border text-muted-foreground bg-white hover:border-herb-green/40"
                        )}>
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all disabled:opacity-60">
                  {saving ? "Adding…" : "Add Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
