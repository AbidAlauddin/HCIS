# HCIS Talent Mapping System
## UI Flow & Navigation

---

# Application Structure

Login
│
└── Dashboard
    │
    ├── Master Data
    │   ├── Cabang
    │   ├── Jabatan
    │   ├── Grade
    │   ├── Golongan
    │   └── Leadership Program
    │
    ├── Data Karyawan
    │   ├── List Karyawan
    │   ├── Tambah Karyawan
    │   └── Detail Karyawan
    │
    └── Laporan
        └── Export Talent Mapping

---

# Login Page

URL:
/
atau
/login

Tujuan:
Autentikasi pengguna aplikasi.

Komponen:

- Logo
- Email
- Password
- Tombol Login

Flow:

User Login
↓
Dashboard

---

# Dashboard

URL:
/dashboard

Tujuan:
Menampilkan ringkasan data.

Widget:

- Total Karyawan
- Total Cabang
- Total Jabatan
- Total Grade
- Total Golongan

Shortcut:

- Tambah Karyawan
- Export Excel

---

# Sidebar Navigation

Dashboard

Master Data
├── Cabang
├── Jabatan
├── Grade
├── Golongan
└── Leadership Program

Karyawan

Laporan

Logout

---

# Master Cabang

URL:
/branches

Fitur:

- List Cabang
- Tambah Cabang
- Edit Cabang
- Hapus Cabang

Table:

| Kode | Nama Cabang |
|--------|--------|

Action:

- Edit
- Delete

---

# Master Jabatan

URL:
/positions

Fitur:

- List
- Tambah
- Edit
- Hapus

Table:

| Kode | Nama Jabatan |
|--------|--------|

---

# Master Grade

URL:
/grades

Fitur:

- List
- Tambah
- Edit
- Hapus

Table:

| Grade | Urutan | Maks |
|--------|--------|--------|

---

# Master Golongan

URL:
/ranks

Fitur:

- List
- Tambah
- Edit
- Hapus

Table:

| Kode | Nama |
|--------|--------|

---

# Master Leadership Program

URL:
/leadership-programs

Fitur:

- List
- Tambah
- Edit
- Hapus

Table:

| Kode | Nama |
|--------|--------|

---

# Data Karyawan

URL:
/employees

Fitur:

- Search Nama
- Search NPK
- Filter Cabang
- Filter Jabatan
- Pagination

Table:

| NPK | Nama | Cabang | Jabatan |
|--------|--------|--------|--------|

Action:

- Detail
- Edit
- Hapus

Button:

Tambah Karyawan

---

# Tambah Karyawan

URL:
/employees/create

Form:

Informasi Dasar

- NPK
- NIK
- Nama Lengkap
- Tanggal Lahir
- Jenis Kelamin
- Cabang
- Jabatan
- Status Keluarga

Button:

- Simpan
- Batal

---

# Detail Karyawan

URL:
/employees/:id

Layout:

Employee Header
↓
Tab Navigation

---

# Employee Header

Menampilkan:

- Nama
- NPK
- Jabatan
- Cabang
- Umur

Action:

- Edit
- Hapus

---

# Detail Tab

Tab:

1. Profil
2. Penempatan Cabang
3. Golongan
4. Grade
5. Pendidikan
6. Leadership
7. KPI
8. Career Plan
9. Talent Mapping
10. Dokumen

---

# Tab Profil

Informasi dasar karyawan.

Field:

- NPK
- NIK
- Nama
- Tanggal Lahir
- Jenis Kelamin
- Cabang
- Jabatan
- Status Keluarga

---

# Tab Penempatan Cabang

Table:

| Cabang | TMT | Sampai |
|---------|---------|---------|

Action:

- Tambah
- Edit
- Hapus

---

# Tab Golongan

Table:

| Golongan | TMT |
|-----------|-----------|

Action:

- Tambah
- Edit
- Hapus

---

# Tab Grade

Table:

| Grade | TMT |
|---------|---------|

Action:

- Tambah
- Edit
- Hapus

---

# Tab Pendidikan

Table:

| Jenjang | Institusi | Jurusan | Tahun |
|-----------|-----------|-----------|-----------|

Action:

- Tambah
- Edit
- Hapus

---

# Tab Leadership

Table:

| Program | Tahun |
|-----------|-----------|

Action:

- Tambah
- Edit
- Hapus

---

# Tab KPI

Table:

| Tahun | Nilai |
|---------|---------|

Action:

- Tambah
- Edit
- Hapus

---

# Tab Career Plan

Table:

| Tipe | Urutan | Tujuan |
|---------|---------|---------|

Contoh:

| Kantor | 1 | Bekasi |
| Kantor | 2 | Magelang |
| Bidang | 1 | Kepesertaan |

Action:

- Tambah
- Edit
- Hapus

---

# Tab Talent Mapping

Field:

Minat Bakat

Prestasi

Catatan

Action:

- Simpan

---

# Tab Dokumen

Table:

| Jenis | Nama File |
|---------|---------|

Action:

- Upload
- Download
- Hapus

---

# Laporan

URL:
/reports

Menu:

Export Talent Mapping

---

# Export Talent Mapping

Filter:

Cabang
Golongan
Grade

Button:

Export Excel

Output:

talent-mapping.xlsx

Format:

- Multi Header
- Merge Cell
- Border
- Auto Width

Sesuai template HRD.

---

# Future Module (Not V1)

- Multi Role Permission
- Approval Workflow
- Audit Log
- Import Excel
- Dashboard Analytics
- Mobile App
- Payroll
- Absensi
- Cuti