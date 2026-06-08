"use client";

import Link from "next/link";

const STATS = [
  { label: "Total Patients", value: "1,247", delta: "+34 this week", icon: "👥", color: "text-herb-green" },
  { label: "Active Practitioners", value: "89", delta: "+3 pending verification", icon: "🩺", color: "text-copper" },
  { label: "Hospitals / Clinics", value: "24", delta: "6 cities", icon: "🏥", color: "text-herb-green" },
  { label: "Monthly Revenue", value: "₹4.2L", delta: "+18% vs last month", icon: "💰", color: "text-ayur-gold" },
  { label: "Orders Today", value: "34", delta: "12 in transit", icon: "📦", color: "text-copper" },
  { label: "Medicines Listed", value: "342", delta: "8 low stock", icon: "💊", color: "text-herb-green" },
];

const RECENT_PRACTITIONERS = [
  { name: "Dr. Kavya Menon", specialty: "Ayurveda · Panchakarma", hpr: "HPR-2204-7712", status: "pending", date: "05 Jun 2026" },
  { name: "Dr. Arjun Pillai", specialty: "Homeopathy", hpr: "HPR-3301-9943", status: "verified", date: "04 Jun 2026" },
  { name: "Dr. Sunita Rao", specialty: "Yoga & Naturopathy", hpr: "HPR-1102-5521", status: "verified", date: "03 Jun 2026" },
  { name: "Dr. Farhan Sheikh", specialty: "Unani Medicine", hpr: "HPR-4405-8832", status: "pending", date: "02 Jun 2026" },
  { name: "Dr. Priya Krishnan", specialty: "Siddha", hpr: "HPR-5506-2217", status: "suspended", date: "01 Jun 2026" },
];

const RECENT_PATIENTS = [
  { name: "Rohit Kumar", phone: "+91 98765 43210", abha: true, registered: "05 Jun 2026" },
  { name: "Ananya Singh", phone: "+91 87654 32109", abha: false, registered: "04 Jun 2026" },
  { name: "Vikram Nair", phone: "+91 76543 21098", abha: true, registered: "04 Jun 2026" },
  { name: "Deepika Patel", phone: "+91 65432 10987", abha: true, registered: "03 Jun 2026" },
  { name: "Suresh Bhat", phone: "+91 54321 09876", abha: false, registered: "02 Jun 2026" },
];

const STATUS_STYLE: Record<string, string> = {
  verified: "bg-herb-green/10 text-herb-green",
  pending: "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-600",
};

export default function AdminDashboardPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform overview · June 2026</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
            <div className="text-xl mb-2">{s.icon}</div>
            <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{s.label}</p>
            <p className="text-[9px] text-muted-foreground mt-1 leading-tight">{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Add Practitioner", href: "/admin/practitioners", icon: "➕ 🩺" },
          { label: "Add Hospital", href: "/admin/hospitals", icon: "➕ 🏥" },
          { label: "Add Medicine", href: "/admin/medicines", icon: "➕ 💊" },
          { label: "View All Orders", href: "/admin/orders", icon: "📦" },
        ].map((a) => (
          <Link key={a.label} href={a.href}>
            <div className="bg-white rounded-xl border border-border p-4 hover:border-herb-green/40 hover:shadow-sm transition-all cursor-pointer text-center">
              <p className="text-sm mb-1">{a.icon}</p>
              <p className="text-xs font-semibold text-foreground">{a.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent practitioners */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-sm">Recent Practitioner Registrations</h2>
            <Link href="/admin/practitioners" className="text-xs text-herb-green font-medium hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_PRACTITIONERS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-xl bg-herb-green/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-herb-green text-xs font-bold">{p.name.split(" ")[1][0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.specialty} · {p.hpr}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>
                    {p.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{p.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent patients */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-sm">Recent Patient Registrations</h2>
            <Link href="/admin/patients" className="text-xs text-herb-green font-medium hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_PATIENTS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sage text-xs font-bold">{p.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {p.abha
                    ? <span className="text-[10px] font-semibold text-herb-green bg-herb-green/10 px-2 py-0.5 rounded-full">ABHA ✓</span>
                    : <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">No ABHA</span>
                  }
                  <span className="text-[10px] text-muted-foreground">{p.registered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
