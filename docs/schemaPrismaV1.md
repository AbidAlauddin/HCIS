# HCIS Talent Mapping System

## Prisma Schema V1 Planning

Version: 1.0

---

# Purpose

Dokumen ini menjadi acuan implementasi `schema.prisma` untuk sistem HCIS Talent Mapping.

Target:

* PostgreSQL (Supabase)
* Prisma ORM
* Tauri Desktop App
* React Frontend

---

# Database Provider

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

# Prisma Client

```prisma
generator client {
  provider = "prisma-client-js"
}
```

---

# Enum

## Gender

```prisma
enum Gender {
  L
  P
}
```

---

## CareerPlanType

```prisma
enum CareerPlanType {
  BRANCH
  DEPARTMENT
}
```

---

# Model Order

Migration dilakukan dengan urutan:

1. User
2. Branch
3. Department
4. Position
5. Grade
6. Rank
7. LeadershipProgram
8. Employee
9. EmployeeBranchHistory
10. EmployeeRank
11. EmployeeGrade
12. EmployeeEducation
13. EmployeeLeadership
14. EmployeeKPI
15. EmployeeCareerPlan
16. EmployeeTalent
17. EmployeeDocument

---

# User

Tujuan:

Autentikasi sistem.

Field:

| Field        | Type      |
| ------------ | --------- |
| id           | UUID      |
| email        | Unique    |
| fullName     | String    |
| passwordHash | String    |
| role         | String    |
| createdAt    | Timestamp |
| updatedAt    | Timestamp |

---

# Branch

Master cabang.

Field:

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| code      | Unique    |
| name      | String    |
| createdAt | Timestamp |
| updatedAt | Timestamp |

Contoh:

* Semarang
* Bekasi
* Magelang
* Tegal

---

# Department

Master bidang kerja.

Field:

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| code      | Unique    |
| name      | String    |
| createdAt | Timestamp |
| updatedAt | Timestamp |

Contoh:

* Kepesertaan
* Pelayanan
* SDM
* Keuangan

---

# Position

Master jabatan.

Field:

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| code      | Unique    |
| name      | String    |
| createdAt | Timestamp |
| updatedAt | Timestamp |

Contoh:

* Staff
* Supervisor
* Kepala Bidang
* Kepala Cabang

---

# Grade

Master grade.

Field:

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| gradeCode  | String    |
| gradeOrder | Integer   |
| maxGrade   | Integer   |
| createdAt  | Timestamp |
| updatedAt  | Timestamp |

Contoh:

* Grade 1
* Grade 2
* Grade 3

---

# Rank

Master golongan.

Field:

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| rankCode  | String    |
| rankName  | String    |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

# Leadership Program

Master leadership program.

Field:

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| code      | Unique    |
| name      | String    |
| createdAt | Timestamp |
| updatedAt | Timestamp |

Default Data:

* BLDP
* ILDP
* ALDP

---

# Employee

Data utama karyawan.

Field:

| Field               | Type      |
| ------------------- | --------- |
| id                  | UUID      |
| npk                 | Unique    |
| nik                 | Unique    |
| fullName            | String    |
| birthDate           | Date      |
| gender              | Enum      |
| phone               | Nullable  |
| email               | Nullable  |
| address             | Nullable  |
| maritalStatus       | String    |
| currentBranchId     | FK        |
| currentDepartmentId | FK        |
| currentPositionId   | FK        |
| currentGradeId      | FK        |
| currentRankId       | FK        |
| createdAt           | Timestamp |
| updatedAt           | Timestamp |
| deletedAt           | Nullable  |

---

# Employee Branch History

Riwayat penempatan cabang.

Field:

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| employeeId | FK        |
| branchId   | FK        |
| startDate  | Date      |
| endDate    | Nullable  |
| isCurrent  | Boolean   |
| createdAt  | Timestamp |

---

# Employee Rank

Riwayat golongan.

Field:

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| employeeId | FK        |
| rankId     | FK        |
| startDate  | Date      |
| endDate    | Nullable  |
| isCurrent  | Boolean   |
| createdAt  | Timestamp |

---

# Employee Grade

Riwayat grade.

Field:

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| employeeId | FK        |
| gradeId    | FK        |
| startDate  | Date      |
| endDate    | Nullable  |
| isCurrent  | Boolean   |
| createdAt  | Timestamp |

---

# Employee Education

Riwayat pendidikan.

Field:

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| employeeId     | FK        |
| educationLevel | String    |
| institution    | String    |
| major          | String    |
| graduationYear | Integer   |
| isLatest       | Boolean   |
| createdAt      | Timestamp |

Contoh:

* SMA
* D3
* S1
* S2

---

# Employee Leadership

Program leadership yang pernah diikuti.

Field:

| Field               | Type      |
| ------------------- | --------- |
| id                  | UUID      |
| employeeId          | FK        |
| leadershipProgramId | FK        |
| completionYear      | Integer   |
| notes               | Nullable  |
| createdAt           | Timestamp |

Constraint:

Unique:

employeeId + leadershipProgramId

---

# Employee KPI

Data KPI tahunan.

Field:

| Field      | Type         |
| ---------- | ------------ |
| id         | UUID         |
| employeeId | FK           |
| year       | Integer      |
| score      | Decimal(4,2) |
| notes      | Nullable     |
| createdAt  | Timestamp    |

Constraint:

Unique:

employeeId + year

---

# Employee Career Plan

Rencana karir.

Field:

| Field        | Type        |
| ------------ | ----------- |
| id           | UUID        |
| employeeId   | FK          |
| planType     | Enum        |
| planOrder    | Integer     |
| branchId     | Nullable FK |
| departmentId | Nullable FK |
| notes        | Nullable    |
| createdAt    | Timestamp   |

Plan Type:

* BRANCH
* DEPARTMENT

Contoh:

| Type       | Order | Value     |
| ---------- | ----- | --------- |
| BRANCH     | 1     | Bekasi    |
| BRANCH     | 2     | Magelang  |
| DEPARTMENT | 1     | SDM       |
| DEPARTMENT | 2     | Pelayanan |

Constraint:

Unique:

employeeId + planType + planOrder

---

# Employee Talent

Data talent mapping.

Field:

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID      |
| employeeId       | Unique FK |
| strengths        | Nullable  |
| weaknesses       | Nullable  |
| talentInterest   | Nullable  |
| achievement      | Nullable  |
| developmentNotes | Nullable  |
| createdAt        | Timestamp |
| updatedAt        | Timestamp |

Tujuan:

Menyimpan hasil talent mapping HRD.

---

# Employee Document

Dokumen karyawan.

Field:

| Field        | Type      |
| ------------ | --------- |
| id           | UUID      |
| employeeId   | FK        |
| documentType | String    |
| fileName     | String    |
| fileUrl      | String    |
| uploadedAt   | Timestamp |

Jenis Dokumen:

* KTP
* KK
* NPWP
* CV
* Ijazah
* Sertifikat

Storage:

Supabase Storage

Bucket:

employee-documents

---

# Recommended Index

Employee

* fullName
* currentBranchId
* currentDepartmentId
* currentPositionId
* currentGradeId
* currentRankId

Employee KPI

* year

Career Plan

* planType

Branch History

* isCurrent

Grade History

* isCurrent

Rank History

* isCurrent

---

# Soft Delete

Hanya tabel Employee yang menggunakan:

```text
deletedAt
```

Tujuan:

Menghindari kehilangan data historis.

---

# Export Dependency

Fitur Talent Mapping Export menggunakan:

* Employee
* Branch
* Department
* Position
* EmployeeBranchHistory
* EmployeeRank
* EmployeeGrade
* EmployeeEducation
* EmployeeLeadership
* EmployeeKPI
* EmployeeCareerPlan
* EmployeeTalent

---

# Backup Dependency

Backup JSON mencakup:

* Employee
* EmployeeBranchHistory
* EmployeeRank
* EmployeeGrade
* EmployeeEducation
* EmployeeLeadership
* EmployeeKPI
* EmployeeCareerPlan
* EmployeeTalent
* EmployeeDocument

---

# Definition of Done

Schema dianggap siap jika:

✓ Semua tabel memiliki relasi

✓ Semua FK tervalidasi

✓ Prisma Generate berhasil

✓ Migration berhasil

✓ Seeder berhasil

✓ Siap digunakan React Query

✓ Siap digunakan Excel Export

✓ Siap digunakan Backup System
