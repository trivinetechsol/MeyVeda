// MeyVeda shared type definitions
export interface Practitioner {
  id: string;
  name: string;
  specialty: string;
  discipline: AYUSHDiscipline;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  hprId: string;
  isVerified: boolean;
  avatar: string;
  languages: string[];
  consultModes: ("video" | "clinic")[];
  nextAvailable: string;
  location: string;
  qualifications: string[];
  about: string;
}

export interface Appointment {
  id: string;
  doctor: Practitioner;
  date: string;
  time: string;
  mode: "video" | "clinic";
  status: "upcoming" | "completed" | "cancelled";
  patientName: string;
}

export interface DinacharTask {
  id: string;
  time: string;
  title: string;
  description: string;
  done: boolean;
  category: "diet" | "exercise" | "mindfulness" | "medicine";
}

export interface HealthRecord {
  id: string;
  date: string;
  type: "consultation" | "prescription" | "lab" | "tracker";
  title: string;
  doctor?: string;
  discipline?: AYUSHDiscipline;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export type AYUSHDiscipline =
  | "Ayurveda"
  | "Yoga"
  | "Naturopathy"
  | "Unani"
  | "Siddha"
  | "Homeopathy";
