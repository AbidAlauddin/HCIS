# HCIS Talent Mapping System

Desktop-based Human Capital Information System (HCIS) for employee talent mapping, career planning, and workforce development management.

Built with **Tauri**, **React**, **TypeScript**, and **Supabase**.

---

## Overview

HCIS Talent Mapping System is an internal HR application designed to simplify employee data management, talent mapping, career planning, leadership program tracking, KPI evaluation, and reporting.

The system is developed as a desktop application to provide a simple deployment process without requiring a dedicated hosting server.

---

## Features

### Employee Management

* Employee profile management
* Employment information management
* Education history
* Grade history
* Rank history
* Branch history

### Talent Mapping

* Employee strengths assessment
* Employee weaknesses assessment
* Talent interest tracking
* Achievement records
* Development recommendations

### Career Planning

* Branch career planning
* Department career planning
* Career preference prioritization

### KPI Management

* Annual KPI records
* Performance tracking
* Historical KPI data

### Leadership Development

* BLDP management
* ILDP management
* ALDP management
* Leadership program history

### Document Management

* Employee document storage
* Document download
* Document tracking

### Reporting

* Talent Mapping Report
* Employee Data Report
* Excel Export

### Backup System

* JSON Backup
* JSON Restore
* Data Recovery Support

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* React Query
* React Hook Form
* Zod

### UI

* Tailwind CSS
* shadcn/ui
* Lucide Icons

### Desktop

* Tauri
* Rust

### Backend & Database

* Supabase
* PostgreSQL

### Export & Backup

* ExcelJS
* JSON Backup

---

## Project Structure

```text
src/
│
├── app/
├── routes/
├── layouts/
├── pages/
│
├── components/
│
├── features/
│   ├── employees/
│   ├── branches/
│   ├── departments/
│   ├── positions/
│   ├── grades/
│   ├── ranks/
│   ├── leadership-programs/
│   └── reports/
│
├── services/
│   ├── export/
│   └── backup/
│
├── hooks/
├── schemas/
├── constants/
├── types/
├── utils/
└── lib/
```

---

## Development Setup

### Requirements

* Node.js 22+
* npm 10+
* Rust Stable
* Tauri v2
* Supabase Project

### Clone Repository

```bash
git clone https://github.com/your-username/hcis-talent-mapping.git

cd hcis-talent-mapping
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

DATABASE_URL=
```

---

### Run Development

```bash
npm run tauri dev
```

---

### Build Application

```bash
npm run tauri build
```

---

## Database

Database design is documented in:

```text
docs/
├── erd.md
├── schema-prisma-v1.md
├── seed-master-data.md
```

Main entities:

* Employee
* Branch
* Department
* Position
* Grade
* Rank
* Leadership Program
* KPI
* Career Plan
* Talent Mapping
* Employee Documents

---
