# HCIS Talent Mapping System
## Development Roadmap

Version: 1.0

---

# Overview

Target:

Desktop Application

Stack:

- Tauri v2
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Supabase
- PostgreSQL
- Prisma
- ExcelJS

Estimasi:

- Solo Developer
- 2–3 jam/hari

Durasi:

8–12 minggu

---

# PHASE 0
## Project Setup

Target

Project dapat dijalankan dan terhubung ke Supabase.

---

Task

### Setup Repository

Create:

github.com/company/hcis-talent-mapping

---

### Setup Tauri

Install:

- Tauri v2
- React
- TypeScript

---

### Setup UI

Install:

- TailwindCSS
- shadcn/ui

---

### Setup Database

Create:

Supabase Project

---

### Setup Prisma

Install:

- Prisma
- Prisma Client

---

### Create Initial Migration

Tables:

- users
- branches
- departments
- positions
- grades
- ranks
- leadership_programs

---

Definition of Done

✓ Project running

✓ Supabase connected

✓ Prisma connected

✓ Migration success

---

# PHASE 1
## Authentication

Target

User dapat login.

---

Task

### Login Page

Fields:

- Email
- Password

---

### Auth Service

Functions:

login()

logout()

getCurrentUser()

---

### Session Persistence

Remember Login

---

Definition of Done

✓ Login

✓ Logout

✓ Session Restore

---

# PHASE 2
## Master Data

Target

Semua master data selesai.

---

Module

### Branch

CRUD

### Position

CRUD

### Grade

CRUD

### Rank

CRUD

### Department

CRUD

### Leadership Program

CRUD

---

Definition of Done

✓ Semua master data CRUD

✓ Search

✓ Pagination

---

# PHASE 3
## Employee Core

Target

Data karyawan selesai.

---

Module

### Employee List

Features:

- Search
- Filter
- Pagination

---

### Employee Create

Form:

- NPK
- NIK
- Nama
- Gender
- Birth Date
- Branch
- Position

---

### Employee Edit

---

### Employee Delete

Soft Delete

---

Definition of Done

✓ CRUD Employee

✓ Search

✓ Filter

---

# PHASE 4
## Employee Detail Tabs

Target

Semua tab selesai.

---

Tab

### Branch History

CRUD

---

### Rank History

CRUD

---

### Grade History

CRUD

---

### Education

CRUD

---

### Leadership

CRUD

---

### KPI

CRUD

---

Definition of Done

✓ Semua tab berjalan

---

# PHASE 5
## Career Plan

Target

Career Plan berjalan.

---

Features

### Branch Plan

Urutan 1

Urutan 2

---

### Department Plan

Urutan 1

Urutan 2

---

Definition of Done

✓ Career Plan tersimpan

✓ Career Plan tampil

---

# PHASE 6
## Talent Mapping

Target

Talent Mapping berjalan.

---

Fields

- Minat Bakat
- Prestasi
- Catatan

---

Definition of Done

✓ Save

✓ Update

✓ Load

---

# PHASE 7
## Document Management

Target

Dokumen karyawan.

---

Upload

- KTP
- KK
- NPWP
- Ijazah
- CV

---

Storage

Supabase Storage

---

Features

- Upload
- Download
- Delete

---

Definition of Done

✓ Upload

✓ Download

✓ Delete

---

# PHASE 8
## Excel Export

Target

Fitur utama aplikasi.

---

Module

Talent Mapping Export

---

Features

### Multi Header

### Merge Cell

### Border

### Auto Width

### Filter

- Branch
- Grade
- Rank

---

Library

ExcelJS

---

Definition of Done

✓ Format sesuai HRD

✓ File berhasil diunduh

---

# PHASE 9
## Backup System

Target

Mengurangi risiko kehilangan data.

---

Features

### Export Backup

Generate:

backup-yyyy-mm-dd.json

---

Contains

- Employees
- KPI
- Career Plan
- Talent Mapping
- Documents Metadata

---

### Restore Backup

Import JSON

Restore Data

---

Definition of Done

✓ Export JSON

✓ Import JSON

✓ Restore Success

---

# PHASE 10
## Polish

Target

Production Ready.

---

Task

### Error Handling

### Loading State

### Empty State

### Toast Notification

### Form Validation

### Security Review

---

Definition of Done

✓ Tidak ada bug mayor

✓ Semua fitur berjalan

✓ Siap digunakan HRD

---

# V2 Future Roadmap

## Import Excel

Mass Import Employee

---

## Multi User

Admin
HRD
Viewer

---

## Audit Log

Riwayat Perubahan

---

## Dashboard Analytics

Chart KPI

Chart Grade

Chart Talent

---

## Succession Planning

Talent Pool

Replacement Matrix

---

## Notification

Reminder KPI

Reminder Career Plan