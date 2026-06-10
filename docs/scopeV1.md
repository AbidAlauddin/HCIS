# HCIS Talent Mapping System

## Scope V1 (MVP)

## Deskripsi Sistem

HCIS Talent Mapping System adalah aplikasi desktop berbasis Tauri + React yang digunakan untuk mengelola data karyawan, talent mapping, career plan, KPI, leadership program, dan menghasilkan laporan Excel sesuai format HRD perusahaan.

Target utama versi V1 adalah menyediakan sistem yang dapat digunakan oleh HRD untuk pengelolaan data dan pembuatan laporan tanpa proses manual menggunakan spreadsheet.

---

# Tujuan V1

* Menyimpan data karyawan secara terpusat
* Menyimpan riwayat grade dan golongan
* Menyimpan KPI tahunan
* Menyimpan data leadership program
* Menyimpan talent mapping
* Menyimpan career plan
* Menyimpan dokumen karyawan
* Menghasilkan laporan Excel sesuai format HRD

---

# Modul V1

## 1. Authentication

### Fitur

* Login menggunakan email dan password
* Logout
* Remember login/session persistence

### Tidak Masuk V1

* Reset password
* Login Google
* SSO

---

## 2. Dashboard

### Widget

* Total Karyawan
* Total Cabang
* Total Jabatan
* Total Grade
* Total Golongan

### Tidak Masuk V1

* Dashboard analytics
* Grafik KPI
* Grafik Talent Mapping

---

## 3. Master Data

### Master Cabang

CRUD

Field:

* Kode Cabang
* Nama Cabang

### Master Jabatan

CRUD

Field:

* Kode Jabatan
* Nama Jabatan

### Master Grade

CRUD

Field:

* Kode Grade
* Urutan Grade
* Maks Grade

### Master Golongan

CRUD

Field:

* Kode Golongan
* Nama Golongan

### Master Leadership Program

CRUD

Field:

* Kode Program
* Nama Program

Contoh:

* BLDP
* ILDP
* ALDP

---

## 4. Data Karyawan

### List Karyawan

Fitur:

* Search Nama
* Search NPK
* Filter Cabang
* Filter Jabatan
* Pagination

### Tambah Karyawan

Field:

* NPK
* NIK
* Nama Lengkap
* Tanggal Lahir
* Jenis Kelamin
* Cabang Saat Ini
* Jabatan Saat Ini
* Status Keluarga

### Edit Karyawan

### Hapus Karyawan (Soft Delete)

---

## 5. Riwayat Penempatan Cabang

Field:

* Cabang
* TMT
* Status Aktif

Contoh:

| Cabang | TMT  |
| ------ | ---- |
| Tegal  | 2020 |
| Bekasi | 2023 |

---

## 6. Riwayat Golongan

Field:

* Golongan
* TMT

Contoh:

| Golongan | TMT  |
| -------- | ---- |
| V        | 2022 |
| VI       | 2025 |

---

## 7. Riwayat Grade

Field:

* Grade
* TMT

Contoh:

| Grade | TMT  |
| ----- | ---- |
| 5     | 2023 |
| 6     | 2025 |

---

## 8. Pendidikan

Field:

* Jenjang Pendidikan
* Institusi
* Jurusan
* Tahun Lulus

---

## 9. Leadership Program

Field:

* Program
* Tahun

Contoh:

* BLDP - 2021
* ILDP - 2022

---

## 10. KPI

Field:

* Tahun
* Nilai KPI

Contoh:

| Tahun | Nilai |
| ----- | ----- |
| 2023  | 3.3   |
| 2024  | 4.4   |
| 2025  | 4.5   |

---

## 11. Career Plan

Field:

* Jenis
* Urutan
* Tujuan

Contoh:

| Jenis  | Urutan | Tujuan      |
| ------ | ------ | ----------- |
| Kantor | 1      | Bekasi      |
| Kantor | 2      | Magelang    |
| Bidang | 1      | Kepesertaan |
| Bidang | 2      | Pelayanan   |

---

## 12. Talent Mapping

Field:

* Minat Bakat
* Prestasi
* Catatan

Contoh:

Minat Bakat:

* Analis

Prestasi:

* Juara 1 Menulis

Catatan:

* Potensi menjadi analis senior

---

## 13. Dokumen Karyawan

Jenis Dokumen:

* KTP
* KK
* NPWP
* Ijazah
* CV

Fitur:

* Upload
* Download
* Hapus

---

## 14. Export Excel

### Tujuan

Menghasilkan laporan Talent Mapping sesuai format HRD perusahaan.

### Fitur

* Export seluruh data
* Export berdasarkan filter
* Multi Header
* Merge Cell
* Border
* Auto Width
* Format tanggal otomatis

### Filter

Cabang:

* Semua
* Tegal
* Bekasi
* Semarang
* Magelang

Golongan:

* I
* II
* III
* IV
* V
* VI

Grade:

* 1 sampai 9

---

# Fitur yang Tidak Masuk V1

* Multi Role Permission
* Approval Workflow
* Email Notification
* Push Notification
* Audit Log
* Backup Otomatis
* Import Excel
* Dashboard Analytics
* Mobile Application
* Absensi
* Cuti
* Payroll
* Performance Management
* Succession Planning

---

# Definisi Selesai (Definition of Done)

V1 dianggap selesai apabila:

* Login berjalan
* Dashboard berjalan
* CRUD Master Data berjalan
* CRUD Karyawan berjalan
* Riwayat Cabang berjalan
* Riwayat Grade berjalan
* Riwayat Golongan berjalan
* Pendidikan berjalan
* Leadership Program berjalan
* KPI berjalan
* Career Plan berjalan
* Talent Mapping berjalan
* Upload Dokumen berjalan
* Export Excel berjalan sesuai format HRD

---

# Tech Stack

Frontend:

* React
* TypeScript
* TailwindCSS
* shadcn/ui
* TanStack Query

Desktop:

* Tauri v2

Backend:

* Supabase

Database:

* PostgreSQL

ORM:

* Prisma

Export:

* ExcelJS

Storage:

* Supabase Storage
