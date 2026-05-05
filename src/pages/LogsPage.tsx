import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/lib/airtable";
import Navbar from "@/components/Navbar";
import LogsTable from "@/components/LogsTable";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function LogsPage() {
  const queryClient = useQueryClient();
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
    refetchInterval: 15000,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suivi des prises</h1>
            <p className="text-sm text-muted-foreground">
              Historique en temps réel • Fuseau Europe/Tunis
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["logs"] })}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <LogsTable logs={logs} />
        )}
      </section>
    </div>
  );
}
