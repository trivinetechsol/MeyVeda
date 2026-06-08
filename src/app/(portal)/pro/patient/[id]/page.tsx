import PatientIntakeClient from "./client";

export function generateStaticParams() {
  return ["p1", "p2", "p3"].map((id) => ({ id }));
}

export default function PatientIntakePage() {
  return <PatientIntakeClient />;
}
