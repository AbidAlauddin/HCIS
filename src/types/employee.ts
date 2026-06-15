export type StatusTalent =
  | "Ready Now"
  | "Ready Later"
  | "Future Star"
  | "Growth Employee"
  | null;

export interface CareerHistory {
  id: string;
  jabatan: string;
  cabang: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  jenis: "Promosi" | "Mutasi" | "Rotasi" | "Jabatan Awal";
}

export interface Employee {
  id: string;
  npk: string;
  nik: string;
  full_name: string;
  birth_date: string | null;
  gender: string;
  position_name: string;
  branch_name: string;
  tmt_penempatan: string | null;
  golongan: string | null;
  tmt_golongan: string | null;
  grade: number | null;
  tmt_grade: string | null;
  pendidikan_terakhir: string | null;
  career_office_1: string | null;
  career_office_2: string | null;
  career_field_1: string | null;
  career_field_2: string | null;
  minat_bakat: string | null;
  catatan: string | null;
  status_keluarga: string | null;
  created_at: string | null;
  updated_at: string | null;
  nama?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: "Laki-laki" | "Perempuan";
  alamat?: string;
  no_hp?: string;
  email?: string;
  cabang?: string;
  jabatan?: string;
  unit_kerja?: string;
  tanggal_masuk?: string;
  status_pegawai?: "Tetap" | "Kontrak" | "Magang";
  jurusan?: string;
  universitas?: string;
  tahun_lulus?: number;
  kpi_tahun_berjalan?: number | null;
  kpi_tahun_sebelumnya?: number | null;
  kategori_kpi?: string;
  status_talent?: StatusTalent;
  talent_category?: string;
  readiness?: string;
  potential?: string;
  performance?: string;
  ildp?: boolean;
  aldp?: boolean;
  mdp?: boolean;
  program_lain?: string;
  career_history?: CareerHistory[];
}

export type CreateEmployeePayload = Omit<Employee, "id" | "created_at" | "updated_at">;
export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;
