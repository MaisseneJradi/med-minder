import { Users, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { LogEntry } from "@/lib/airtable";

export default function StatsCards({
  patientCount,
  logs,
}: {
  patientCount: number;
  logs: LogEntry[];
}) {
  const pris = logs.filter((l) => l.status === "pris").length;
  const oublie = logs.filter((l) => l.status === "oublié").length;
  const attente = logs.filter((l) => l.status === "en attente").length;

  const cards = [
    { label: "Patients", value: patientCount, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Prises confirmées", value: pris, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "En attente", value: attente, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Oubliés", value: oublie, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}
