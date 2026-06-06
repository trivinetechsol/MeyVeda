"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Category = "all" | "appointments" | "prescriptions" | "orders" | "wellness";

type Notification = {
  id: string;
  category: Exclude<Category, "all">;
  icon: string;
  title: string;
  body: string;
  time: string;
  group: "today" | "yesterday" | "earlier";
  read: boolean;
  action?: { label: string; href: string };
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  // Today
  {
    id: "n1", category: "prescriptions", icon: "📋", group: "today",
    title: "Care plan ready",
    body: "Dr. Aditi Shastri has signed and uploaded your prescription to your ABHA health locker.",
    time: "2h ago", read: false,
    action: { label: "View Care Plan", href: "/prescription" },
  },
  {
    id: "n2", category: "appointments", icon: "🗓️", group: "today",
    title: "Consultation in 1 hour",
    body: "Your video consultation with Dr. Aditi Shastri is at 4:30 PM. Check your camera and mic.",
    time: "3h ago", read: false,
    action: { label: "Go to Waiting Room", href: "/waiting-room" },
  },
  {
    id: "n3", category: "wellness", icon: "🌅", group: "today",
    title: "Morning Dinacharya reminder",
    body: "You've completed 3 of 7 morning practices. Keep going — Yoga & Pranayama is next.",
    time: "6h ago", read: true,
    action: { label: "Open Dinacharya", href: "/dinacharya" },
  },
  {
    id: "n4", category: "wellness", icon: "🌿", group: "today",
    title: "Medicine reminder — Ashwagandha",
    body: "Time for your afternoon Ashwagandha Churna with warm water. 1 tsp · Twice daily.",
    time: "1:00 PM", read: true,
  },
  // Yesterday
  {
    id: "n5", category: "orders", icon: "📦", group: "yesterday",
    title: "Order out for delivery",
    body: "Your Apothecary order (Ashwagandha + Triphala) is out for delivery. Expected by 6 PM today.",
    time: "Yesterday, 9:00 AM", read: true,
    action: { label: "Track Order", href: "/orders" },
  },
  {
    id: "n6", category: "appointments", icon: "🗓️", group: "yesterday",
    title: "Follow-up scheduled",
    body: "Dr. Shastri has scheduled your follow-up for 15 Jun 2026 at 4:30 PM. Added to your appointments.",
    time: "Yesterday, 5:15 PM", read: true,
    action: { label: "View Appointments", href: "/appointments" },
  },
  // Earlier
  {
    id: "n7", category: "prescriptions", icon: "🛡️", group: "earlier",
    title: "ABHA consent request",
    body: "Dr. Aditi Shastri has requested access to your health records for 90 days. Review and approve.",
    time: "3 Jun 2026", read: true,
    action: { label: "Manage Consent", href: "/consent" },
  },
  {
    id: "n8", category: "wellness", icon: "✨", group: "earlier",
    title: "Weekly wellness summary",
    body: "Your Dinacharya adherence was 78% this week. Your wellness score improved by +4 points.",
    time: "2 Jun 2026", read: true,
    action: { label: "View Dinacharya", href: "/dinacharya" },
  },
  {
    id: "n9", category: "orders", icon: "📦", group: "earlier",
    title: "Order delivered",
    body: "Your Ayurvedic herbs order has been delivered. Enjoy your wellness journey!",
    time: "1 Jun 2026", read: true,
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  appointments: "Appointments",
  prescriptions: "Health",
  orders: "Orders",
  wellness: "Wellness",
};

const CATEGORY_ICONS: Record<Exclude<Category, "all">, string> = {
  appointments: "🗓️",
  prescriptions: "📋",
  orders: "📦",
  wellness: "🌿",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const filtered = notifications.filter(
    (n) => activeCategory === "all" || n.category === activeCategory
  );

  const groups = ["today", "yesterday", "earlier"] as const;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-semibold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-copper text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Stay up to date with your care</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-herb-green font-medium hover:underline flex-shrink-0"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {(["all", "appointments", "prescriptions", "orders", "wellness"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full border transition-all",
              activeCategory === cat
                ? "bg-herb-green text-white border-herb-green"
                : "border-border text-muted-foreground hover:border-herb-green/40 hover:text-foreground"
            )}
          >
            {cat !== "all" && <span>{CATEGORY_ICONS[cat as Exclude<Category, "all">]}</span>}
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grouped notifications */}
      <div className="space-y-6">
        {groups.map((group) => {
          const groupItems = filtered.filter((n) => n.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
                {group === "today" ? "Today" : group === "yesterday" ? "Yesterday" : "Earlier"}
              </p>
              <div className="space-y-2">
                {groupItems.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={cn(
                      "bg-white rounded-2xl border p-4 transition-all cursor-pointer",
                      !notif.read ? "border-herb-green/20 shadow-sm" : "border-border"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg",
                        !notif.read ? "bg-herb-green/10" : "bg-muted"
                      )}>
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm", !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                            {notif.title}
                          </p>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-herb-green flex-shrink-0" />
                            )}
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notif.time}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
                        {notif.action && (
                          <Link href={notif.action.href}>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2.5 text-xs text-herb-green font-semibold hover:underline"
                            >
                              {notif.action.label} →
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <span className="text-4xl">🔔</span>
            <p className="font-semibold text-foreground mt-3">All caught up</p>
            <p className="text-xs text-muted-foreground mt-1">No notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
