# HCIS Talent Mapping System
## Database Validation Checklist

Version: 1.0

---

# Tujuan

Memastikan struktur database benar-benar mendukung:

- CRUD Karyawan
- Talent Mapping
- Career Plan
- KPI
- Export Excel HRD
- Backup Data

sebelum membuat migration.

---

# Checklist Master Data

## Branch

Field:

- id
- code
- name

Status:

[ ]

---

## Position

Field:

- id
- code
- name

Status:

[ ]

---

## Grade

Field:

- id
- grade_code
- grade_order
- max_grade

Status:

[ ]

---

## Rank

Field:

- id
- rank_code
- rank_name

Status:

[ ]

---

## Department

Field:

- id
- code
- name

Status:

[ ]

---

## Leadership Program

Field:

- id
- code
- name

Status:

[ ]

---

# Checklist Employee

## Identitas

- npk
- nik
- full_name
- birth_date
- gender

Status:

[ ]

---

## Kontak

- phone
- email
- address

Status:

[ ]

---

## Status

- marital_status

Status:

[ ]

---

## Relasi

- current_branch_id
- current_position_id

Status:

[ ]

---

# Checklist Export

Apakah semua kolom excel memiliki sumber data?

Nama
[ ]

NPK
[ ]

NIK
[ ]

Tanggal Lahir
[ ]

Gender
[ ]

Cabang
[ ]

Golongan
[ ]

Grade
[ ]

Pendidikan
[ ]

Leadership
[ ]

KPI
[ ]

Career Plan
[ ]

Talent Mapping
[ ]

Catatan
[ ]

Status Keluarga
[ ]

---

# Checklist Backup

Harus dapat dibackup:

employees
[ ]

employee_grades
[ ]

employee_ranks
[ ]

employee_kpis
[ ]

employee_career_plans
[ ]

employee_talents
[ ]

employee_documents
[ ]

---

# Database Ready

Jika semua checklist tercentang:

✓ Siap membuat schema.prisma
✓ Siap migration
✓ Siap development