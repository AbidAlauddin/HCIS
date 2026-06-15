import { supabase } from "../lib/supabase";
import type { Employee, CreateEmployeePayload, UpdateEmployeePayload } from "../types/employee";

export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("v_employee_talent_mapping")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Employee[];
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const { data, error } = await supabase
    .from("v_employee_talent_mapping")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Employee tidak ditemukan.");
  }

  return data as Employee;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  // Filter out undefined/null optional fields to avoid RLS issues
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  ) as CreateEmployeePayload;

  console.log("Inserting employee payload:", cleanPayload);

  let attempt = 1;
  const maxRetries = 2; // Batas maksimal percobaan

  while (attempt <= maxRetries) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert(cleanPayload)
        .select("*")
        .single();

      if (error) {
        // Cek jika error murni karena kegagalan jaringan / fetch
        if (error.message.includes("Failed to fetch") || error.message.includes("Load failed")) {
          throw new Error(error.message); // Lempar ke blok catch untuk di-retry
        }
        console.error("Supabase insert error:", error);
        throw new Error(`Gagal membuat data karyawan: ${error.message || "Unknown error"}`);
      }

      if (!data) {
        throw new Error("Gagal membuat data karyawan.");
      }

      return data as Employee;
    } catch (err: any) {
      const isNetworkError =
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("Load failed") ||
        err.message?.includes("Network Error");

      // Jika ini error jaringan dan belum mencapai batas maksimal, lakukan retry
      if (isNetworkError && attempt < maxRetries) {
        console.warn(`Request gagal (attempt ${attempt}). Mencoba ulang dalam 500ms...`);
        attempt++;
        // Jeda 500ms untuk memberi waktu koneksi stabil sebelum mencoba lagi
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      // Jika bukan error jaringan atau percobaan sudah habis, tampilkan error
      throw new Error(err.message || "Terjadi kesalahan yang tidak diketahui");
    }
  }

  throw new Error("Gagal membuat data karyawan setelah beberapa percobaan.");
}

export async function updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
  let attempt = 1;
  const maxRetries = 2;

  while (attempt <= maxRetries) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("Load failed")) {
          throw new Error(error.message);
        }
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Gagal memperbarui data karyawan.");
      }

      return data as Employee;
    } catch (err: any) {
      const isNetworkError =
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("Load failed") ||
        err.message?.includes("Network Error");

      if (isNetworkError && attempt < maxRetries) {
        console.warn(`Update gagal (attempt ${attempt}). Mencoba ulang dalam 500ms...`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      throw new Error(err.message || "Terjadi kesalahan yang tidak diketahui");
    }
  }
  
  throw new Error("Gagal memperbarui data karyawan.");
}

export async function deleteEmployee(id: string): Promise<void> {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export function hitungMasaKerjaCabang(tanggalMulai: string): number {
  const mulai = new Date(tanggalMulai);
  const today = new Date();
  const years = today.getFullYear() - mulai.getFullYear();
  const months = today.getMonth() - mulai.getMonth();
  const days = today.getDate() - mulai.getDate();
  return years + months / 12 + days / 365.25;
}

export function getGeneration(tanggal_lahir?: string): string {
  if (!tanggal_lahir) return "Unknown";
  const year = new Date(tanggal_lahir).getFullYear();
  if (year >= 1997) return "Gen Z";
  if (year >= 1981) return "Millennial";
  if (year >= 1965) return "Gen X";
  if (year >= 1946) return "Baby Boomer";
  return "Silent Generation";
}