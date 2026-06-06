"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

type OrderStatus = "ordered" | "packed" | "shipped" | "out_for_delivery" | "delivered";

type OrderItem = { name: string; brand: string; weight: string; price: number; icon: string };

type Order = {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  tracking?: string;
  eta?: string;
  autoRefill: boolean;
};

const STATUS_STEPS: { id: OrderStatus; label: string; icon: string }[] = [
  { id: "ordered", label: "Ordered", icon: "📦" },
  { id: "packed", label: "Packed", icon: "📫" },
  { id: "shipped", label: "Shipped", icon: "🚚" },
  { id: "out_for_delivery", label: "Out for Delivery", icon: "🏃" },
  { id: "delivered", label: "Delivered", icon: "✅" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  ordered: 0, packed: 1, shipped: 2, out_for_delivery: 3, delivered: 4,
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  ordered: "Ordered",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  ordered: "bg-blue-50 text-blue-700",
  packed: "bg-amber-50 text-amber-700",
  shipped: "bg-herb-green/10 text-herb-green",
  out_for_delivery: "bg-copper/10 text-copper",
  delivered: "bg-muted text-muted-foreground",
};

const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    number: "MV-2026-0605",
    date: "05 Jun 2026",
    status: "shipped",
    tracking: "DTDC · 1234567890",
    eta: "06 Jun 2026 · 3–7 PM",
    autoRefill: false,
    total: 889,
    items: [
      { name: "Ashwagandha Churna", brand: "Kottakkal Arya Vaidya Sala", weight: "100g", price: 285, icon: "🌿" },
      { name: "Triphala Churna", brand: "Himalaya Wellness", weight: "100g", price: 145, icon: "🫙" },
      { name: "Brahmi Ghrita", brand: "Nagarjuna Herbal", weight: "150g", price: 410, icon: "💛" },
    ],
  },
  {
    id: "o2",
    number: "MV-2026-0512",
    date: "12 May 2026",
    status: "delivered",
    autoRefill: true,
    total: 520,
    items: [
      { name: "Chyawanprash", brand: "Dabur", weight: "500g", price: 299, icon: "🫙" },
      { name: "Neem Capsules", brand: "Organic India", weight: "60 caps", price: 245, icon: "💊" },
    ],
  },
  {
    id: "o3",
    number: "MV-2026-0401",
    date: "01 Apr 2026",
    status: "delivered",
    autoRefill: false,
    total: 675,
    items: [
      { name: "Giloy Juice", brand: "Patanjali", weight: "500ml", price: 159, icon: "🥤" },
      { name: "Brahmi Oil", brand: "Bajaj Keo Karpin", weight: "200ml", price: 175, icon: "🫙" },
      { name: "Tulsi Drops", brand: "Himalaya", weight: "30ml", price: 120, icon: "🌱" },
    ],
  },
];

type TabFilter = "active" | "all";

export default function OrdersPage() {
  const { user } = useAuth();
  const userName = user?.name ?? "You";

  const [tab, setTab] = useState<TabFilter>("active");
  const [selectedId, setSelectedId] = useState<string>(MOCK_ORDERS[0].id);
  const [autoRefillMap, setAutoRefillMap] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_ORDERS.map((o) => [o.id, o.autoRefill]))
  );

  const activeOrders = MOCK_ORDERS.filter((o) => o.status !== "delivered");
  const displayOrders = tab === "active" ? activeOrders : MOCK_ORDERS;
  const selectedOrder = MOCK_ORDERS.find((o) => o.id === selectedId) ?? MOCK_ORDERS[0];
  const currentStepIndex = STATUS_INDEX[selectedOrder.status];

  function toggleAutoRefill(id: string) {
    setAutoRefillMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage your Apothecary orders</p>
        </div>
        <Link href="/apothecary">
          <button className="text-xs font-medium text-herb-green border border-herb-green/30 px-3 py-2 rounded-xl hover:bg-herb-green/5 transition-colors">
            + New Order
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([["active", "Active"], ["all", "All Orders"]] as [TabFilter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all",
              tab === key
                ? "bg-herb-green text-white border-herb-green"
                : "border-border text-muted-foreground bg-white hover:border-herb-green/30"
            )}
          >
            {label}
            {key === "active" && activeOrders.length > 0 && (
              <span className="ml-1.5 bg-white/30 text-white text-[10px] font-bold px-1 py-0.5 rounded-full">
                {activeOrders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {displayOrders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">📦</span>
          <p className="font-semibold text-foreground mt-4">No active orders</p>
          <p className="text-xs text-muted-foreground mt-1 mb-5">All your prescriptions have been delivered</p>
          <Link href="/apothecary">
            <button className="px-5 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all">
              Browse Apothecary
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Left: Order list */}
          <div className="space-y-3">
            {displayOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={cn(
                  "w-full text-left bg-white rounded-2xl border p-4 transition-all",
                  selectedId === order.id
                    ? "border-herb-green/50 shadow-sm ring-1 ring-herb-green/20"
                    : "border-border hover:border-herb-green/30"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">{order.number}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0", STATUS_COLOR[order.status])}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{order.date}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-lg">{item.icon}</span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">₹{order.total}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Selected order detail */}
          <div className="space-y-5">
            {/* Status banner */}
            <div className="bg-herb-gradient rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
              <p className="text-xs font-medium text-white/70 uppercase tracking-widest">
                {selectedOrder.number} · {selectedOrder.date}
              </p>
              <h2 className="font-display text-xl font-semibold mt-1">{STATUS_LABEL[selectedOrder.status]}</h2>
              {selectedOrder.eta && (
                <p className="text-sm text-white/70 mt-0.5">Estimated delivery: {selectedOrder.eta}</p>
              )}
              {selectedOrder.tracking && (
                <p className="text-xs text-white/60 mt-2">Tracking: {selectedOrder.tracking}</p>
              )}
            </div>

            {/* Delivery progress */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-5">Delivery Progress</h3>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                <div className="space-y-0">
                  {STATUS_STEPS.map((step, i) => {
                    const isDone = i < currentStepIndex;
                    const isActive = i === currentStepIndex;
                    return (
                      <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                        <div className={cn(
                          "relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm transition-all",
                          isDone && "border-herb-green bg-herb-green",
                          isActive && "border-herb-green bg-white animate-pulse",
                          !isDone && !isActive && "border-border bg-white"
                        )}>
                          {isDone ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span className={cn("text-xs", isActive ? "text-herb-green" : "text-muted-foreground")}>
                              {step.icon}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className={cn("text-sm font-semibold", isDone || isActive ? "text-foreground" : "text-muted-foreground")}>
                            {step.label}
                          </p>
                          {isActive && <p className="text-xs text-herb-green font-medium mt-0.5">In progress</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Items in this Order</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ivory-gradient border border-border flex items-center justify-center text-xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.brand} · {item.weight}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground flex-shrink-0">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery address */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Delivery Address</h3>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">📍</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      23B, Green Valley, MG Road<br />
                      Bengaluru, Karnataka 560001
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment + auto-refill */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">Payment</h3>
                {[
                  ["Subtotal", `₹${selectedOrder.total - 49}`],
                  ["Shipping", "₹49"],
                  ["Total Paid", `₹${selectedOrder.total}`],
                ].map(([label, val]) => (
                  <div key={label} className={cn("flex justify-between text-xs py-1.5 border-b border-border last:border-0", label === "Total Paid" && "font-bold text-sm")}>
                    <span className={label === "Total Paid" ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                    <span className={label === "Total Paid" ? "text-herb-green" : ""}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-refill */}
            <div className="bg-ivory-deep rounded-2xl border border-border p-5 flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">Auto-Refill</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {autoRefillMap[selectedOrder.id]
                    ? "Active — we'll dispatch before your medicines run out."
                    : "Enable to never run out of your prescribed medicines."}
                </p>
              </div>
              <button
                onClick={() => toggleAutoRefill(selectedOrder.id)}
                className={cn("relative w-11 h-6 rounded-full transition-all flex-shrink-0 mt-0.5", autoRefillMap[selectedOrder.id] ? "bg-herb-green" : "bg-muted")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all", autoRefillMap[selectedOrder.id] ? "left-6" : "left-1")} />
              </button>
            </div>

            {selectedOrder.status === "delivered" && (
              <Link href="/apothecary">
                <button className="w-full py-3 border border-herb-green/30 text-herb-green text-sm font-semibold rounded-xl hover:bg-herb-green/5 transition-colors">
                  Reorder →
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
