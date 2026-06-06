"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

type NavItem =
  | { href: string; icon: string; label: string; badge?: string; exact?: boolean }
  | "separator";

const PATIENT_NAV: NavItem[] = [
  { href: "/", icon: "🏠", label: "Home", exact: true },
  { href: "/appointments", icon: "🗓️", label: "Appointments" },
  { href: "/discover", icon: "🔍", label: "Discover" },
  { href: "/ai-chat", icon: "✨", label: "AyurSanvaad AI" },
  { href: "/dinacharya", icon: "🌅", label: "Dinacharya" },
  { href: "/records", icon: "📁", label: "Health Records" },
  { href: "/apothecary", icon: "🏥", label: "Apothecary" },
  { href: "/notifications", icon: "🔔", label: "Notifications", badge: "3" },
  { href: "/profile", icon: "👤", label: "Profile" },
  "separator",
  { href: "/pro", icon: "💼", label: "MeyVeda Pro", badge: "Pro", exact: true },
];

const PRACTITIONER_NAV: NavItem[] = [
  { href: "/pro", icon: "📊", label: "Dashboard", exact: true },
  { href: "/pro/emr", icon: "📋", label: "EMR Builder" },
  { href: "/pro/follow-ups", icon: "🔔", label: "Follow-ups", badge: "1" },
  { href: "/pro/inbox", icon: "💬", label: "Inbox", badge: "1" },
  { href: "/pro/prescriptions", icon: "📝", label: "Prescriptions" },
  { href: "/pro/analytics", icon: "📈", label: "Analytics" },
  "separator",
  { href: "/pro/availability", icon: "📅", label: "Availability" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

function isActive(pathname: string, item: Exclude<NavItem, "separator">): boolean {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href);
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isPractitioner = user?.role === "practitioner";
  const navItems = isPractitioner ? PRACTITIONER_NAV : PATIENT_NAV;

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 bg-white border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-border flex-shrink-0">
          <Link href={isPractitioner ? "/pro" : "/"} onClick={onClose}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-herb-gradient flex items-center justify-center">
                <span className="text-white text-sm font-bold font-display">M</span>
              </div>
              <span className="font-display text-lg font-semibold">
                <span className="text-herb-green">Mey</span>
                <span className="text-copper">Veda</span>
              </span>
            </div>
          </Link>
          <p className="text-[10px] text-muted-foreground mt-1.5 pl-0.5">
            {isPractitioner ? "Practitioner Portal · HPR" : "AYUSH Digital Health · ABDM"}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item, i) => {
            if (item === "separator") {
              return <div key={`sep-${i}`} className="my-2.5 h-px bg-border" />;
            }

            const active = isActive(pathname, item);
            const activeColor = isPractitioner ? "bg-copper/10 text-copper" : "bg-herb-green/10 text-herb-green";
            const dotColor = isPractitioner ? "bg-copper" : "bg-herb-green";
            const badgeColor = isPractitioner ? "bg-copper/10 text-copper" : "bg-copper/10 text-copper";

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5",
                    active ? activeColor : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-base w-5 text-center leading-none flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && !active && (
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                  {active && <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColor)} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-3.5 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-herb-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user?.name ?? "Guest"}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.abhaLinked ? "ABHA linked · ABDM ✓" : `+91 ${user?.phone ?? "—"}`}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
