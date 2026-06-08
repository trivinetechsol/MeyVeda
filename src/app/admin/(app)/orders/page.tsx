"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type OrderStatus = "ordered" | "packed" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: string; number: string; patient: string; phone: string;
  items: { name: string; qty: number; price: number }[];
  total: number; status: OrderStatus; city: string;
  placed: string; tracking?: string;
};

const INITIAL: Order[] = [
  { id: "o1", number: "MV-2026-0605", patient: "Rohit Kumar", phone: "+91 98765 43210", items: [{ name: "Ashwagandha Churna", qty: 1, price: 285 }, { name: "Triphala Churna", qty: 1, price: 145 }, { name: "Brahmi Ghrita", qty: 1, price: 410 }], total: 889, status: "shipped", city: "Bengaluru", placed: "05 Jun 2026", tracking: "DTDC · 1234567890" },
  { id: "o2", number: "MV-2026-0604", patient: "Ananya Singh", phone: "+91 87654 32109", items: [{ name: "Chyawanprash", qty: 2, price: 598 }, { name: "Neem Capsules", qty: 1, price: 245 }], total: 892, status: "packed", city: "Delhi", placed: "04 Jun 2026" },
  { id: "o3", number: "MV-2026-0603", patient: "Vikram Nair", phone: "+91 76543 21098", items: [{ name: "Giloy Juice", qty: 1, price: 159 }], total: 208, status: "ordered", city: "Kochi", placed: "03 Jun 2026" },
  { id: "o4", number: "MV-2026-0512", patient: "Deepika Patel", phone: "+91 65432 10987", items: [{ name: "Chyawanprash", qty: 1, price: 299 }, { name: "Neem Capsules", qty: 1, price: 245 }], total: 593, status: "delivered", city: "Ahmedabad", placed: "12 May 2026" },
  { id: "o5", number: "MV-2026-0501", patient: "Suresh Bhat", phone: "+91 54321 09876", items: [{ name: "Brahmi Oil", qty: 2, price: 350 }, { name: "Tulsi Drops", qty: 1, price: 120 }], total: 519, status: "delivered", city: "Mangalore", placed: "01 May 2026" },
  { id: "o6", number: "MV-2026-0430", patient: "Arjun Verma", phone: "+91 32109 87654", items: [{ name: "Ashwagandha Churna", qty: 1, price: 285 }], total: 334, status: "cancelled", city: "Lucknow", placed: "30 Apr 2026" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; style: string }> = {
  ordered:   { label: "Ordered",         style: "bg-blue-50 text-blue-700" },
  packed:    { label: "Packed",           style: "bg-amber-50 text-amber-700" },
  shipped:   { label: "Shipped",          style: "bg-herb-green/10 text-herb-green" },
  delivered: { label: "Delivered",        style: "bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelled",        style: "bg-red-50 text-red-600" },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  ordered: "packed", packed: "shipped", shipped: "delivered",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.patient.toLowerCase().includes(search.toLowerCase()) ||
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function advanceStatus(id: string) {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const next = NEXT_STATUS[o.status];
      return next ? { ...o, status: next } : o;
    }));
    setSelected(null);
  }

  function cancelOrder(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "cancelled" } : o));
    setSelected(null);
  }

  const revenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{orders.length} total · ₹{revenue.toLocaleString("en-IN")} delivered revenue</p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["ordered", "packed", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
            className={cn("bg-white rounded-xl border p-3 text-center transition-all hover:border-herb-green/30",
              filterStatus === s ? "border-herb-green ring-1 ring-herb-green/20" : "border-border"
            )}>
            <p className={cn("font-bold text-lg font-display", STATUS_CONFIG[s].style.includes("herb") ? "text-herb-green" : "text-foreground")}>
              {orders.filter(o => o.status === s).length}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{STATUS_CONFIG[s].label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input type="text" placeholder="Search by patient, order number, city…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Placed</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-background transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{o.number}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-foreground">{o.patient}</p>
                    <p className="text-[10px] text-muted-foreground">{o.city}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-foreground">₹{o.total}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full", STATUS_CONFIG[o.status].style)}>
                      {STATUS_CONFIG[o.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{o.placed}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setSelected(o)} className="text-[10px] font-semibold text-herb-green hover:underline">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground">{selected.number}</h2>
                <p className="text-xs text-muted-foreground">{selected.placed}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-foreground">{selected.patient}</p>
                  <p className="text-xs text-muted-foreground">{selected.phone} · {selected.city}</p>
                </div>
                <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full", STATUS_CONFIG[selected.status].style)}>
                  {STATUS_CONFIG[selected.status].label}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-foreground">{item.name} × {item.qty}</span>
                    <span className="font-semibold">₹{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span>Total</span><span className="text-herb-green">₹{selected.total}</span>
                </div>
              </div>
              {selected.tracking && <p className="text-xs text-muted-foreground mb-4">Tracking: {selected.tracking}</p>}
              <div className="flex gap-2">
                {NEXT_STATUS[selected.status] && (
                  <button onClick={() => advanceStatus(selected.id)} className="flex-1 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all">
                    Mark as {STATUS_CONFIG[NEXT_STATUS[selected.status]!].label}
                  </button>
                )}
                {(selected.status === "ordered" || selected.status === "packed") && (
                  <button onClick={() => cancelOrder(selected.id)} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                )}
                {selected.status === "delivered" || selected.status === "cancelled" ? (
                  <button onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Close</button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
