import { supabase } from "@/integrations/supabase/client";

const BASE_ID = "apptwsJbdzD6EFqCr";

export interface Patient {
  airtableId: string;
  id: number;
  nom: string;
  email: string;
  medication: string;
  heure: string;
  fam_email: string;
}

export interface LogEntry {
  airtableId: string;
  id: number;
  date: string;
  status: "en attente" | "pris" | "oublié";
  nompatient: string;
  nom_medicament: string;
}

export async function fetchPatients(): Promise<Patient[]> {
  const { data, error } = await supabase.functions.invoke("airtable-proxy", {
    body: { action: "list", table: "Patient", baseId: BASE_ID },
  });
  if (error) throw error;
  return (data.records || []).map((r: any) => ({
    airtableId: r.id,
    id: r.fields.id,
    nom: r.fields.nom,
    email: r.fields.email,
    medication: r.fields.medication,
    heure: r.fields.heure,
    fam_email: r.fields.fam_email,
  }));
}

export async function fetchLogs(): Promise<LogEntry[]> {
  const { data, error } = await supabase.functions.invoke("airtable-proxy", {
    body: {
      action: "list",
      table: "Logs",
      baseId: BASE_ID,
      sort: [{ field: "date", direction: "desc" }],
    },
  });
  if (error) throw error;
  return (data.records || []).map((r: any) => ({
    airtableId: r.id,
    id: r.fields.id,
    date: r.fields.date,
    status: r.fields.status,
    nompatient: r.fields.nompatient,
    nom_medicament: r.fields["nom medicament"],
  }));
}

export async function confirmMedication(logAirtableId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("airtable-proxy", {
    body: {
      action: "update",
      table: "Logs",
      baseId: BASE_ID,
      recordId: logAirtableId,
      fields: { status: "pris" },
    },
  });
  if (error) throw error;
}
