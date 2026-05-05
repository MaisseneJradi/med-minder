import { Clock, Mail, Pill, Users } from "lucide-react";
import type { Patient } from "@/lib/airtable";

export default function PatientCard({ patient }: { patient: Patient }) {
  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {patient.nom?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{patient.nom}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {patient.email}
            </p>
          </div>
        </div>
        <span className="status-badge bg-primary/10 text-primary">
          <Clock className="h-3 w-3" />
          {patient.heure}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Pill className="h-3.5 w-3.5 text-primary" />
          {patient.medication}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-accent" />
          {patient.fam_email || "—"}
        </span>
      </div>
    </div>
  );
}
