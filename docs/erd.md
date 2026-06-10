# HCIS Talent Mapping System

## ERD Documentation

Version: 1.0

---

# Entity Relationship Diagram

```text
users

employees
├── branches
├── positions

employees
├── employee_branch_histories
├── employee_ranks
├── employee_grades
├── employee_educations
├── employee_leaderships
├── employee_kpis
├── employee_career_plans
├── employee_talents
└── employee_documents

ranks
└── employee_ranks

grades
└── employee_grades

leadership_programs
└── employee_leaderships

branches
├── employees
├── employee_branch_histories
└── employee_career_plans

departments
└── employee_career_plans
```

---

# Cardinality

## Branches

branches (1)
↓
employees (N)

Satu cabang dapat memiliki banyak karyawan.

---

## Positions

positions (1)
↓
employees (N)

Satu jabatan dapat dimiliki banyak karyawan.

---

## Employee Branch Histories

employees (1)
↓
employee_branch_histories (N)

Satu karyawan dapat memiliki banyak riwayat penempatan cabang.

---

## Employee Grades

employees (1)
↓
employee_grades (N)

Satu karyawan dapat memiliki banyak histori grade.

---

## Grades

grades (1)
↓
employee_grades (N)

Satu grade dapat digunakan banyak karyawan.

---

## Employee Ranks

employees (1)
↓
employee_ranks (N)

Satu karyawan dapat memiliki banyak histori golongan.

---

## Ranks

ranks (1)
↓
employee_ranks (N)

Satu golongan dapat digunakan banyak karyawan.

---

## Employee Educations

employees (1)
↓
employee_educations (N)

Satu karyawan dapat memiliki banyak riwayat pendidikan.

---

## Employee Leaderships

employees (1)
↓
employee_leaderships (N)

Satu karyawan dapat mengikuti banyak program leadership.

---

## Leadership Programs

leadership_programs (1)
↓
employee_leaderships (N)

Satu program leadership dapat diikuti banyak karyawan.

---

## Employee KPIs

employees (1)
↓
employee_kpis (N)

Satu karyawan memiliki banyak KPI berdasarkan tahun.

---

## Employee Career Plans

employees (1)
↓
employee_career_plans (N)

Satu karyawan memiliki banyak rencana karir.

---

## Departments

departments (1)
↓
employee_career_plans (N)

Satu bidang dapat dipilih banyak karyawan.

---

## Employee Talents

employees (1)
↓
employee_talents (1)

V1 menggunakan satu data talent mapping per karyawan.

---

## Employee Documents

employees (1)
↓
employee_documents (N)

Satu karyawan dapat memiliki banyak dokumen.

---

# Table Definition

---

## users

Digunakan untuk autentikasi.

| Field         | Type         |
| ------------- | ------------ |
| id            | UUID PK      |
| email         | VARCHAR(255) |
| full_name     | VARCHAR(255) |
| password_hash | TEXT         |
| role          | VARCHAR(50)  |
| created_at    | TIMESTAMP    |
| updated_at    | TIMESTAMP    |

---

## branches

Master data cabang.

| Field      | Type         |
| ---------- | ------------ |
| id         | UUID PK      |
| code       | VARCHAR(20)  |
| name       | VARCHAR(255) |
| created_at | TIMESTAMP    |
| updated_at | TIMESTAMP    |

---

## departments

Master bidang.

| Field      | Type         |
| ---------- | ------------ |
| id         | UUID PK      |
| code       | VARCHAR(20)  |
| name       | VARCHAR(255) |
| created_at | TIMESTAMP    |
| updated_at | TIMESTAMP    |

Contoh:

* Kepesertaan
* Pelayanan
* SDM
* Keuangan

---

## positions

Master jabatan.

| Field      | Type         |
| ---------- | ------------ |
| id         | UUID PK      |
| code       | VARCHAR(20)  |
| name       | VARCHAR(255) |
| created_at | TIMESTAMP    |
| updated_at | TIMESTAMP    |

---

## grades

Master grade.

| Field       | Type        |
| ----------- | ----------- |
| id          | UUID PK     |
| grade_code  | VARCHAR(20) |
| grade_order | INTEGER     |
| max_grade   | INTEGER     |
| created_at  | TIMESTAMP   |
| updated_at  | TIMESTAMP   |

---

## ranks

Master golongan.

| Field      | Type         |
| ---------- | ------------ |
| id         | UUID PK      |
| rank_code  | VARCHAR(20)  |
| rank_name  | VARCHAR(255) |
| created_at | TIMESTAMP    |
| updated_at | TIMESTAMP    |

---

## leadership_programs

Master leadership program.

| Field      | Type         |
| ---------- | ------------ |
| id         | UUID PK      |
| code       | VARCHAR(20)  |
| name       | VARCHAR(255) |
| created_at | TIMESTAMP    |
| updated_at | TIMESTAMP    |

Contoh:

* BLDP
* ILDP
* ALDP

---

## employees

Data utama karyawan.

| Field               | Type           |
| ------------------- | -------------- |
| id                  | UUID PK        |
| npk                 | VARCHAR(50)    |
| nik                 | VARCHAR(50)    |
| full_name           | VARCHAR(255)   |
| birth_date          | DATE           |
| gender              | CHAR(1)        |
| phone               | VARCHAR(50)    |
| email               | VARCHAR(255)   |
| address             | TEXT           |
| marital_status      | VARCHAR(100)   |
| current_branch_id   | UUID FK        |
| current_position_id | UUID FK        |
| created_at          | TIMESTAMP      |
| updated_at          | TIMESTAMP      |
| deleted_at          | TIMESTAMP NULL |

---

## employee_branch_histories

Riwayat penempatan cabang.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID PK   |
| employee_id | UUID FK   |
| branch_id   | UUID FK   |
| start_date  | DATE      |
| end_date    | DATE      |
| is_current  | BOOLEAN   |
| created_at  | TIMESTAMP |

---

## employee_ranks

Riwayat golongan.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID PK   |
| employee_id | UUID FK   |
| rank_id     | UUID FK   |
| start_date  | DATE      |
| end_date    | DATE      |
| is_current  | BOOLEAN   |
| created_at  | TIMESTAMP |

---

## employee_grades

Riwayat grade.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID PK   |
| employee_id | UUID FK   |
| grade_id    | UUID FK   |
| start_date  | DATE      |
| end_date    | DATE      |
| is_current  | BOOLEAN   |
| created_at  | TIMESTAMP |

---

## employee_educations

Riwayat pendidikan.

| Field           | Type         |
| --------------- | ------------ |
| id              | UUID PK      |
| employee_id     | UUID FK      |
| education_level | VARCHAR(100) |
| institution     | VARCHAR(255) |
| major           | VARCHAR(255) |
| graduation_year | INTEGER      |
| is_latest       | BOOLEAN      |
| created_at      | TIMESTAMP    |

---

## employee_leaderships

Program leadership yang pernah diikuti.

| Field                 | Type      |
| --------------------- | --------- |
| id                    | UUID PK   |
| employee_id           | UUID FK   |
| leadership_program_id | UUID FK   |
| completion_year       | INTEGER   |
| notes                 | TEXT      |
| created_at            | TIMESTAMP |

---

## employee_kpis

KPI tahunan.

| Field       | Type         |
| ----------- | ------------ |
| id          | UUID PK      |
| employee_id | UUID FK      |
| year        | INTEGER      |
| score       | DECIMAL(4,2) |
| notes       | TEXT         |
| created_at  | TIMESTAMP    |

Constraint:

employee_id + year harus unik.

---

## employee_career_plans

Rencana karir.

| Field         | Type         |
| ------------- | ------------ |
| id            | UUID PK      |
| employee_id   | UUID FK      |
| plan_type     | VARCHAR(50)  |
| plan_order    | INTEGER      |
| branch_id     | UUID NULL FK |
| department_id | UUID NULL FK |
| notes         | TEXT         |
| created_at    | TIMESTAMP    |

Nilai plan_type:

* BRANCH
* DEPARTMENT

Contoh:

| employee | type       | order | value       |
| -------- | ---------- | ----- | ----------- |
| Yunan    | BRANCH     | 1     | Bekasi      |
| Yunan    | BRANCH     | 2     | Magelang    |
| Yunan    | DEPARTMENT | 1     | Kepesertaan |

---

## employee_talents

Talent mapping.

| Field           | Type           |
| --------------- | -------------- |
| id              | UUID PK        |
| employee_id     | UUID FK UNIQUE |
| talent_interest | TEXT           |
| achievement     | TEXT           |
| notes           | TEXT           |
| created_at      | TIMESTAMP      |
| updated_at      | TIMESTAMP      |

---

## employee_documents

Dokumen karyawan.

| Field         | Type         |
| ------------- | ------------ |
| id            | UUID PK      |
| employee_id   | UUID FK      |
| document_type | VARCHAR(100) |
| file_name     | VARCHAR(255) |
| file_url      | TEXT         |
| uploaded_at   | TIMESTAMP    |

Jenis dokumen:

* KTP
* KK
* NPWP
* CV
* Ijazah
* Sertifikat

---

# Database Convention

## Primary Key

Semua tabel menggunakan:

UUID

---

## Timestamp

Standar:

created_at
updated_at

---

## Soft Delete

Hanya tabel employees yang menggunakan:

deleted_at

---

# Export Dependency

Tabel yang digunakan pada Export Talent Mapping:

* employees
* branches
* positions
* employee_branch_histories
* employee_ranks
* employee_grades
* employee_educations
* employee_leaderships
* employee_kpis
* employee_career_plans
* employee_talents

Semua data laporan HRD berasal dari tabel-tabel tersebut.
