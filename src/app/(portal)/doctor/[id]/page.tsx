import DoctorProfileClient from "./client";

export function generateStaticParams() {
  return ["doc-001", "doc-002", "doc-003", "doc-004"].map((id) => ({ id }));
}

export default function DoctorProfilePage() {
  return <DoctorProfileClient />;
}
