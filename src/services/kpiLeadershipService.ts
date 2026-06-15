// ─── services/kpiLeadershipService.ts ────────────────────────────────────────
// Tambahkan file ini di folder services yang sudah ada.
// Pastikan `supabase` client sudah ada dan diimport dari konfigurasi project Anda.

import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface EmployeeKpi {
  id?: string;
  employee_id: string;
  year: number;
  score: number | null;
  category?: string | null;
  notes?: string | null;
}

export interface LeadershipProgram {
  id: string;
  code: string; // "BLDP" | "ILDP" | "ALDP"
  name: string;
}

export interface EmployeeLeadershipProgram {
  id?: string;
  employee_id: string;
  leadership_program_id: string;
  year: number | null;
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

/** Ambil semua KPI milik satu karyawan */
export async function getKpisByEmployee(employeeId: string): Promise<EmployeeKpi[]> {
  const { data, error } = await supabase
    .from("employee_kpis")
    .select("*")
    .eq("employee_id", employeeId)
    .order("year", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Upsert KPI karyawan (insert atau update berdasarkan employee_id + year).
 * Kirim array semua tahun sekaligus.
 */
export async function upsertKpis(kpis: EmployeeKpi[]): Promise<void> {
  if (kpis.length === 0) return;
  const { error } = await supabase
    .from("employee_kpis")
    .upsert(kpis, { onConflict: "employee_id,year" });
  if (error) throw new Error(error.message);
}

// ─── Leadership Programs ──────────────────────────────────────────────────────

/** Ambil daftar master program (BLDP, ILDP, ALDP) */
export async function getLeadershipPrograms(): Promise<LeadershipProgram[]> {
  const { data, error } = await supabase
    .from("leadership_programs")
    .select("id, code, name")
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Ambil leadership programs yang sudah diikuti karyawan */
export async function getLeadershipByEmployee(
  employeeId: string
): Promise<EmployeeLeadershipProgram[]> {
  const { data, error } = await supabase
    .from("employee_leadership_programs")
    .select("*")
    .eq("employee_id", employeeId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Upsert leadership programs karyawan.
 * Hapus dulu yang lama lalu insert yang baru agar sinkron.
 */
export async function upsertLeadershipPrograms(
  employeeId: string,
  programs: EmployeeLeadershipProgram[]
): Promise<void> {
  // Hapus data lama milik karyawan ini
  const { error: delError } = await supabase
    .from("employee_leadership_programs")
    .delete()
    .eq("employee_id", employeeId);
  if (delError) throw new Error(delError.message);

  // Insert yang baru (hanya yang year-nya diisi)
  const toInsert = programs.filter((p) => p.year !== null && p.year !== undefined);
  if (toInsert.length === 0) return;

  const { error: insError } = await supabase
    .from("employee_leadership_programs")
    .insert(toInsert);
  if (insError) throw new Error(insError.message);
}