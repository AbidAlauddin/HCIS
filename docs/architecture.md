# HCIS Talent Mapping System
## Architecture Documentation

Version: 1.0

---

# High Level Architecture

┌─────────────────────────┐
│ Desktop App (Tauri)     │
│ React + TypeScript      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Service Layer           │
│ React Query             │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Supabase API            │
│ PostgreSQL              │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Supabase Storage        │
│ Employee Documents      │
└─────────────────────────┘

---

# Application Layers

Layer dibagi menjadi:

1. Presentation Layer
2. Feature Layer
3. Service Layer
4. Data Layer

---

# Presentation Layer

Folder:

src/

├── pages
├── layouts
├── components

---

Tanggung Jawab:

- Menampilkan UI
- Form Input
- Tabel
- Modal
- Navigasi

---

Tidak Boleh:

- Query Database
- Logic Bisnis

---

# Feature Layer

Folder:

features/

Setiap modul memiliki folder sendiri.

---

Contoh

features/

employees/

branches/

grades/

ranks/

reports/

---

Isi:

components/
pages/
hooks/
schemas/
services/
types/

---

# Service Layer

Folder:

src/services

---

Contoh

employeeService.ts

branchService.ts

reportService.ts

---

Tanggung Jawab:

- Query Supabase
- Mutation
- Business Logic

---

Tidak Boleh:

- Render UI

---

# Data Layer

Supabase

↓

PostgreSQL

---

Storage:

Supabase Storage

---

# Final Folder Structure

src/

├── app/
│
├── routes/
│
├── layouts/
│
├── pages/
│
├── components/
│
├── features/
│
├── services/
│
├── hooks/
│
├── schemas/
│
├── types/
│
├── constants/
│
├── utils/
│
└── lib/

---

# Detailed Feature Structure

features/

employees/

├── pages/
│   ├── EmployeeListPage.tsx
│   ├── EmployeeCreatePage.tsx
│   └── EmployeeDetailPage.tsx
│
├── components/
│   ├── EmployeeTable.tsx
│   ├── EmployeeForm.tsx
│   ├── EmployeeFilter.tsx
│   └── EmployeeHeader.tsx
│
├── hooks/
│   ├── useEmployees.ts
│   ├── useEmployee.ts
│   └── useCreateEmployee.ts
│
├── services/
│   └── employeeService.ts
│
├── schemas/
│   └── employee.schema.ts
│
├── types/
│   └── employee.types.ts
│
└── utils/

---

# Routing Structure

/

↓

login

↓

dashboard

---

/dashboard

/dashboard/employees

/dashboard/employees/create

/dashboard/employees/:id

/dashboard/branches

/dashboard/positions

/dashboard/grades

/dashboard/ranks

/dashboard/departments

/dashboard/leadership-programs

/dashboard/reports

---

# Layout Structure

RootLayout

↓

AuthLayout

↓

DashboardLayout

---

Dashboard Layout

┌─────────────┬─────────────┐
│ Sidebar     │ Content     │
│             │             │
└─────────────┴─────────────┘

---

# State Management

Gunakan:

TanStack Query

---

Server State

- Employees
- KPI
- Branches
- Positions
- Reports

---

Tidak Perlu:

Redux

Zustand

MobX

Untuk V1.

---

# React Query Strategy

Query Key Standard

employees

employee-detail

branches

positions

grades

ranks

departments

leadership-programs

kpis

career-plans

reports

---

# Form Strategy

Library

React Hook Form

+

Zod

---

Flow

Form

↓

Validate

↓

Submit

↓

Service

↓

Supabase

---

# Supabase Integration

Connection

src/lib/supabase.ts

---

Example

createClient()

↓

export supabase

---

Semua service menggunakan instance ini.

---

# Authentication Flow

User Login

↓

Supabase Auth

↓

Store Session

↓

Redirect Dashboard

---

App Start

↓

Check Session

↓

Restore Session

↓

Dashboard

---

# Employee Detail Architecture

Employee

↓

Tabs

├── Profile
├── Branch History
├── Rank History
├── Grade History
├── Education
├── Leadership
├── KPI
├── Career Plan
├── Talent Mapping
└── Documents

---

Setiap tab adalah komponen terpisah.

---

# Export Architecture

Folder

src/services/export

---

Files

talentMappingExport.ts

---

Flow

Database

↓

Transform Data

↓

ExcelJS

↓

Download

---

Tidak Boleh

Export Logic di React Component

---

# Backup Architecture

Folder

src/services/backup

---

Files

backupExport.ts

backupImport.ts

---

Output

backup-yyyy-mm-dd.json

---

Contains

- Employees
- KPI
- Career Plan
- Talent Mapping
- Documents Metadata

---

# Document Storage

Supabase Storage

Bucket

employee-documents

---

Folder Structure

employee-documents/

employee-id/

ktp.pdf

ijazah.pdf

cv.pdf

---

# Error Handling

Centralized

src/lib/errorHandler.ts

---

Toast

Success

Error

Warning

Info

---

# Logging

Development

console.error()

---

Production

Custom Logger

Future Version

---

# Security

Never expose:

- Service Role Key

Allowed:

- Anon Key

---

Row Level Security

Enabled

---

Policy

Authenticated User Only

---

# Performance

Pagination

20 rows/page

---

Search

Debounce

500 ms

---

Export

Server-side query

Transform in memory

Generate Excel

---

# Recommended Packages

Core

- react-router-dom
- @tanstack/react-query

Forms

- react-hook-form
- zod
- @hookform/resolvers

UI

- shadcn/ui
- lucide-react

Date

- date-fns

Export

- exceljs

Tables

- @tanstack/react-table

Notification

- sonner

Upload

- react-dropzone

---

# Definition of Ready

Project siap mulai coding jika:

✓ ERD selesai

✓ Data Dictionary selesai

✓ UI Flow selesai

✓ Export Specification selesai

✓ Architecture selesai

✓ Roadmap selesai

✓ Supabase Project dibuat

✓ Repository dibuat