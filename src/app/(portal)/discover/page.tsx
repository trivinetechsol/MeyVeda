"use client";

import { useState } from "react";
import { PractitionerCard } from "@/components/PractitionerCard";
import { DISCIPLINES } from "@/lib/data";
import { usePractitioners } from "@/lib/hooks";
import type { AYUSHDiscipline } from "@/lib/types";
import { cn } from "@/lib/utils";

const SYMPTOMS = [
  "Acid reflux", "Insomnia", "Joint pain", "Migraine",
  "Anxiety", "Digestive issues", "Skin conditions", "Fatigue",
  "Back pain", "Immunity boost", "Weight management", "Hormonal balance",
];

export default function DiscoverPage() {
  const [selected, setSelected] = useState<AYUSHDiscipline | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSymptoms, setShowSymptoms] = useState(false);

  // Filter & sorting states
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");

  // Query database dynamically via hook
  const { data: practitioners, loading } = usePractitioners({
    discipline: selected ?? undefined,
    search: searchQuery || undefined,
    videoAvailable: activeFilters.includes("Video Available") || undefined,
    under500: activeFilters.includes("Under ₹500") || undefined,
    today: activeFilters.includes("Today") || undefined,
    languages: activeFilters.filter((f) => ["Hindi", "Tamil", "English"].includes(f)),
    sortBy: sortBy,
  });

  const filtered = practitioners ?? [];

  function toggleFilter(filterName: string) {
    setActiveFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">Find Your Specialist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse verified AYUSH practitioners across 6 disciplines
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-xl">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search symptoms, doctors, specialties…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSymptoms(e.target.value.length > 0);
            }}
            onFocus={() => setShowSymptoms(true)}
            onBlur={() => setTimeout(() => setShowSymptoms(false), 150)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-herb-green/50 focus:ring-2 focus:ring-herb-green/10 transition-all"
          />
          {showSymptoms && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium uppercase tracking-wider">
                  Common Concerns
                </p>
                {SYMPTOMS.filter(
                  (s) => !searchQuery || s.toLowerCase().includes(searchQuery.toLowerCase())
                )
                  .slice(0, 6)
                  .map((symptom) => (
                    <button
                      key={symptom}
                      onMouseDown={() => {
                        setSearchQuery(symptom);
                        setShowSymptoms(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <span className="text-muted-foreground">🔍</span>
                      {symptom}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 flex-wrap">
          {["Video Available", "Under ₹500", "Today", "Hindi", "Tamil", "English"].map((f) => {
            const isActive = activeFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={cn(
                  "text-xs border rounded-full px-3 py-1.5 transition-colors font-medium",
                  isActive
                    ? "bg-herb-green border-herb-green text-white animate-fade-in"
                    : "border-border text-muted-foreground hover:border-herb-green/40 hover:text-herb-green bg-white"
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Left: Discipline filters */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Explore Specialties
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5">
            {DISCIPLINES.map((disc) => {
              const isActive = selected === disc.id;
              return (
                <button
                  key={disc.id}
                  onClick={() => setSelected(isActive ? null : (disc.id as AYUSHDiscipline))}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all duration-200",
                    isActive
                      ? "border-herb-green bg-herb-green/8 shadow-sm"
                      : "border-border bg-white hover:border-herb-green/30 hover:bg-herb-green/4"
                  )}
                >
                  <span className="text-xl">{disc.icon}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight",
                      isActive ? "text-herb-green" : "text-foreground"
                    )}
                  >
                    {disc.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{disc.count} docs</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="animate-pulse">Loading practitioners...</span>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filtered.length}</span> verified practitioners
                  {selected && ` in ${selected}`}
                </>
              )}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white text-muted-foreground focus:outline-none focus:border-herb-green/50 cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Rating</option>
              <option value="fee-low-high">Sort: Fee (low to high)</option>
              <option value="experience">Sort: Experience</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-herb-green border-t-transparent animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {filtered.map((doc) => (
                <PractitionerCard key={doc.id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <span className="text-5xl">🌿</span>
              <p className="text-sm font-medium text-foreground mt-4">No practitioners found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
