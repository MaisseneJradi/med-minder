import { useQuery } from "@tanstack/react-query";
import { fetchPatients, fetchLogs } from "@/lib/airtable";
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientCard";
import StatsCards from "@/components/StatsCards";
import { Loader2 } from "lucide-react";
import heroImg from "@/assets/hero-medical.png";

export default function Index() {
  const { data: patients = [], isLoading: loadingP } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
  const { data: logs = [], isLoading: loadingL } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  });

  const loading = loadingP || loadingL;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container py-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
              Rappels de médicaments
              <br />
              <span className="text-primary">intelligents & automatisés</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Suivi en temps réel, alertes familiales et confirmation de prise —
              tout connecté à Airtable et automatisé via n8n.
            </p>
          </div>
          <img
            src={heroImg}
            alt="Rappel de médicaments"
            width={320}
            height={205}
            className="w-72 md:w-80 select-none"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="container pb-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <StatsCards patientCount={patients.length} logs={logs} />
        )}
      </section>

      {/* Patient grid */}
      <section className="container pb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Patients</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((p) => (
              <PatientCard key={p.airtableId} patient={p} />
            ))}
            {patients.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-10">
                Aucun patient trouvé dans Airtable.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
