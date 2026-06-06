import type { Practitioner } from "@/lib/types";
import { HPRBadge } from "./Badges";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface PractitionerCardProps {
  doctor: Practitioner;
}

export function PractitionerCard({ doctor }: PractitionerCardProps) {
  const disciplineColors: Record<string, string> = {
    Ayurveda: "bg-emerald-50 text-emerald-800",
    Yoga: "bg-teal-50 text-teal-800",
    Naturopathy: "bg-amber-50 text-amber-800",
    Unani: "bg-orange-50 text-orange-800",
    Siddha: "bg-purple-50 text-purple-800",
    Homeopathy: "bg-blue-50 text-blue-800",
  };

  return (
    <Link href={`/doctor/${doctor.id}`}>
      <div className="bg-white rounded-2xl p-4 border border-border card-elevated transition-all duration-200 cursor-pointer">
        {/* Top row */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-herb-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg font-display">{doctor.avatar}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground text-sm leading-tight">{doctor.name}</h3>
                <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{doctor.specialty}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="oklch(0.78 0.12 87)" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-xs font-semibold text-foreground">{doctor.rating}</span>
                <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
              </div>
            </div>

            {/* Discipline pill */}
            <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${disciplineColors[doctor.discipline] || "bg-muted text-muted-foreground"}`}>
              {doctor.discipline}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{doctor.experience}y exp</span>
            <span>·</span>
            <span>{doctor.location}</span>
          </div>
          {doctor.isVerified && <HPRBadge />}
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starts at </span>
            <span className="text-sm font-bold text-foreground">{formatCurrency(doctor.fee)}</span>
          </div>
          <div className="text-xs text-herb-green font-medium bg-herb-green/8 px-2.5 py-1 rounded-full">
            {doctor.nextAvailable}
          </div>
        </div>

        {/* Consult mode chips */}
        <div className="mt-2.5 flex gap-1.5">
          {doctor.consultModes.map((mode) => (
            <span
              key={mode}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground capitalize"
            >
              {mode === "video" ? "📹 Video" : "🏥 In-Clinic"}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
