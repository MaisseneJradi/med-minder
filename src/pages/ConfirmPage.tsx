import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmMedication } from "@/lib/airtable";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type State = "idle" | "loading" | "success" | "error";

export default function ConfirmPage() {
  const [params] = useSearchParams();
  const recordId = params.get("record_id");
  const [state, setState] = useState<State>("idle");

  const handleConfirm = async () => {
    if (!recordId) return;
    setState("loading");
    try {
      await confirmMedication(recordId);
      setState("success");
    } catch {
      setState("error");
    }
  };

  if (!recordId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card rounded-xl p-10 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Lien invalide</h1>
          <p className="text-muted-foreground">
            Ce lien ne contient pas d'identifiant de médicament valide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-xl p-10 text-center max-w-md w-full">
        {state === "success" ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Prise confirmée ✅
            </h1>
            <p className="text-muted-foreground">
              Votre prise de médicament a été enregistrée avec succès.
            </p>
          </>
        ) : state === "error" ? (
          <>
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">Erreur</h1>
            <p className="text-muted-foreground mb-4">
              Impossible de confirmer la prise. Veuillez réessayer.
            </p>
            <Button onClick={handleConfirm} className="bg-primary text-primary-foreground">
              Réessayer
            </Button>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {state === "loading" ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Confirmer la prise
            </h1>
            <p className="text-muted-foreground mb-6">
              Cliquez ci-dessous pour confirmer que vous avez pris votre médicament.
            </p>
            <Button
              onClick={handleConfirm}
              disabled={state === "loading"}
              className="bg-primary text-primary-foreground w-full"
              size="lg"
            >
              {state === "loading" ? "Confirmation..." : "J'ai pris mon médicament"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
