import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { LogEntry } from "@/lib/airtable";

const statusConfig = {
  pris: { icon: CheckCircle2, class: "bg-success/10 text-success", label: "Pris" },
  "en attente": { icon: Clock, class: "bg-warning/10 text-warning", label: "En attente" },
  oublié: { icon: AlertTriangle, class: "bg-destructive/10 text-destructive", label: "Oublié" },
} as const;

export default function LogsTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Patient</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Médicament</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Statut</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const cfg = statusConfig[log.status] || statusConfig["en attente"];
              const Icon = cfg.icon;
              return (
                <tr key={log.airtableId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-foreground">
                    {log.date
                      ? new Date(log.date).toLocaleString("fr-TN", { timeZone: "Africa/Tunis" })
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-foreground">{log.nompatient}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{log.nom_medicament}</td>
                  <td className="px-5 py-3.5">
                    <span className={`status-badge ${cfg.class}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                  Aucun enregistrement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
