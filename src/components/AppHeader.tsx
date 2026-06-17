"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border h-14 flex items-center px-4 gap-3">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Logo — mobile only */}
      <Link href="/" className="lg:hidden flex-shrink-0">
        <span className="font-display text-lg font-semibold">
          <span className="text-herb-green">Mey</span>
          <span className="text-copper">Veda</span>
        </span>
      </Link>

      {/* Search bar */}
      <div className="flex-1 max-w-lg hidden sm:block">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search practitioners, remedies, records…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-muted/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-herb-green/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Mobile search */}
        <button className="sm:hidden p-2 rounded-full hover:bg-muted transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Notifications */}
        <Link href="/notifications">
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-copper border-2 border-background" />
          </button>
        </Link>

        {/* Avatar */}
        <Link href="/profile">
          <div className="w-8 h-8 rounded-full bg-herb-gradient flex items-center justify-center cursor-pointer">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
