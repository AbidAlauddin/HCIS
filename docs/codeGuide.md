# HCIS Talent Mapping System

## Coding Guidelines

Version: 1.0

---

# Tech Stack

Frontend

* React 19
* TypeScript
* Vite
* React Router
* TanStack Query
* React Hook Form
* Zod
* TailwindCSS
* shadcn/ui

Desktop

* Tauri v2

Backend Service

* Supabase

Database

* PostgreSQL

ORM

* Prisma

Export

* ExcelJS

---

# General Principles

## Single Responsibility Principle

Satu file hanya memiliki satu tanggung jawab.

Contoh:

❌ Jangan

EmployeePage.tsx

* UI
* Fetch API
* Form Validation
* Export Excel

Dalam satu file.

---

✅ Pisahkan

EmployeePage.tsx

EmployeeTable.tsx

employee.service.ts

employee.schema.ts

employee.types.ts

---

# Folder Structure

src/

├── app/

├── routes/

├── layouts/

├── pages/

├── components/

├── features/

├── services/

├── hooks/

├── lib/

├── types/

├── constants/

├── schemas/

└── utils/

---

# Feature Based Structure

Setiap modul memiliki folder sendiri.

features/

├── employees
├── branches
├── positions
├── grades
├── ranks
├── kpis
├── leaderships
├── talents
└── reports

---

# Employee Module Example

features/

employees/

├── components/
│
├── pages/
│
├── hooks/
│
├── services/
│
├── schemas/
│
├── types/
│
└── utils/

---

# Naming Convention

## Component

PascalCase

✅

EmployeeTable.tsx

EmployeeForm.tsx

---

❌

employeeTable.tsx

employee-form.tsx

---

# Hooks

camelCase

✅

useEmployees.ts

useCreateEmployee.ts

---

# Service

camelCase

✅

employeeService.ts

branchService.ts

---

# Types

PascalCase

✅

Employee.ts

EmployeeKPI.ts

Branch.ts

---

# Constants

UPPER_SNAKE_CASE

✅

MAX_FILE_SIZE

DEFAULT_PAGE_SIZE

---

# React Rules

## Hindari Prop Drilling Berlebihan

Gunakan:

* Context
* TanStack Query

Jika data digunakan banyak komponen.

---

# Page Rules

Page hanya bertugas:

* Menampilkan layout
* Memanggil component

Contoh:

EmployeePage

↓

EmployeeTable

EmployeeFilter

EmployeePagination

---

# Service Layer

Semua query database harus melalui service.

---

❌

Jangan

langsung query Supabase di component.

---

✅

employeeService.ts

```ts
export async function getEmployees() {}
```

Component hanya memanggil service.

---

# React Query

Gunakan untuk:

* List Data
* Detail Data
* Mutation

---

Contoh Query Key

employees

employee-detail

branches

grades

kpis

---

# Form Validation

Gunakan:

* React Hook Form
* Zod

---

Contoh

employee.schema.ts

```ts
export const employeeSchema = z.object({
  npk: z.string(),
  nik: z.string(),
});
```

---

# Type Safety

Dilarang menggunakan:

```ts
any
```

---

Gunakan:

```ts
Employee
Branch
EmployeeKPI
```

---

# Error Handling

Semua request harus memiliki:

```ts
try {
}
catch {
}
```

---

Gunakan toast untuk feedback.

Contoh:

* Berhasil Simpan
* Gagal Simpan
* Berhasil Hapus

---

# Table Standard

Semua tabel harus memiliki:

* Search
* Pagination
* Loading State
* Empty State

---

Loading State

Contoh:

Loading...

atau Skeleton.

---

Empty State

Contoh:

Belum ada data.

---

# Modal Standard

Digunakan untuk:

* Tambah
* Edit
* Delete Confirmation

---

Delete Confirmation

Contoh:

Apakah Anda yakin ingin menghapus data ini?

[ Batal ]
[ Hapus ]

---

# Date Standard

Gunakan:

dd-MM-yyyy

Contoh:

04-06-2026

---

# Currency Standard

Jika diperlukan:

Rp 1.000.000

---

# File Upload

Maksimum:

10 MB

Format:

* PDF
* JPG
* JPEG
* PNG

---

# Excel Export

Semua logic export ditempatkan pada:

services/export/

---

Contoh

services/export/

talentMappingExport.ts

---

Jangan letakkan logic export di component.

---

# Environment Variables

Semua credential disimpan pada:

.env

Contoh:

VITE_SUPABASE_URL=

VITE_SUPABASE_ANON_KEY=

---

Dilarang hardcode credential.

---

# Git Branch Strategy

main

Production

---

develop

Development

---

feature/*

Contoh:

feature/employees

feature/export-excel

feature/kpi-module

---

# Commit Convention

Format:

type: description

---

Contoh

feat: add employee module

feat: add talent mapping export

fix: repair employee form validation

refactor: simplify employee service

docs: update erd

---

# Performance Rules

Gunakan:

React Query Cache

Memoization jika diperlukan

Pagination Server Side

---

Jangan:

Load seluruh data karyawan sekaligus.

---

# Security Rules

Jangan pernah menyimpan:

* Password Plain Text
* Supabase Service Role Key

Di frontend.

---

# Definition of Clean Code

Kode dianggap bersih jika:

* Tidak ada any
* Tidak ada duplicate code
* Service terpisah dari UI
* Form menggunakan Zod
* Query menggunakan React Query
* Component maksimal fokus pada satu fungsi
* Mudah dipahami setelah 6 bulan tidak dibuka
