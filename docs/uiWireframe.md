# HCIS Talent Mapping System

## UI Wireframe Documentation

Version: 1.0

---

# Design Principle

Target User:

* HRD
* Admin SDM

Karakteristik:

* Banyak input data
* Banyak tabel
* Fokus produktivitas
* Bukan aplikasi publik

---

# Layout Structure

```text
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────┬───────────────────────────┤
│ Sidebar      │ Content                   │
│              │                           │
│              │                           │
└──────────────┴───────────────────────────┘
```

---

# Login Page

Route:

```text
/login
```

---

Layout

```text
┌──────────────────────┐
│ HCIS Talent Mapping  │
│                      │
│ Email                │
│ [______________]     │
│                      │
│ Password             │
│ [______________]     │
│                      │
│ [ Login ]            │
└──────────────────────┘
```

---

# Dashboard

Route

```text
/dashboard
```

---

Cards

```text
Total Employee

Total Branch

Total Department

Total Leadership Program
```

---

Future

```text
Chart KPI
Chart Grade
Chart Talent Mapping
```

---

# Sidebar Menu

```text
Dashboard

Master Data
├── Branch
├── Department
├── Position
├── Grade
├── Rank
└── Leadership Program

Employee

Reports

Settings
```

---

# Branch Page

Route

```text
/dashboard/branches
```

---

Layout

```text
┌────────────────────────────┐
│ Branch Management          │
│                            │
│ Search                     │
│ [______________]           │
│                            │
│ [+ Add Branch]             │
│                            │
├────────────────────────────┤
│ Code │ Name │ Action       │
├────────────────────────────┤
│ SMG  │ Semarang            │
│ TGL  │ Tegal               │
└────────────────────────────┘
```

---

Actions

* Create
* Edit
* Delete

---

# Employee List

Route

```text
/dashboard/employees
```

---

Header

```text
Employee Management
```

---

Filter Section

```text
Search Name

Search NPK

Branch

Department

Position

[ Search ]
[ Reset ]
```

---

Action

```text
[ Add Employee ]
[ Export Excel ]
```

---

Table

```text
┌───────────────────────────────────────────────┐
│ NPK │ Name │ Branch │ Position │ Action       │
├───────────────────────────────────────────────┤
│ ...                                           │
└───────────────────────────────────────────────┘
```

---

Pagination

Bottom Table

---

# Employee Create

Route

```text
/dashboard/employees/create
```

---

Section

## Personal Information

Field

* NPK
* NIK
* Full Name
* Birth Date
* Gender

---

## Contact Information

Field

* Phone
* Email
* Address

---

## Employment Information

Field

* Branch
* Department
* Position
* Grade
* Rank

---

Button

```text
[ Save ]
[ Cancel ]
```

---

# Employee Detail

Route

```text
/dashboard/employees/:id
```

---

Layout

```text
┌───────────────────────────────────────┐
│ Employee Information                  │
│                                       │
│ Name                                  │
│ Branch                                │
│ Position                              │
└───────────────────────────────────────┘

Tabs
```

---

# Employee Detail Tabs

```text
Profile

Branch History

Rank History

Grade History

Education

Leadership

KPI

Career Plan

Talent Mapping

Documents
```

---

# Tab Profile

Display

```text
Employee Information

NPK

NIK

Name

Birth Date

Gender

Branch

Department

Position

Grade

Rank
```

---

# Tab Branch History

Table

```text
Branch

Start Date

End Date

Current

Action
```

---

Action

```text
Add

Edit

Delete
```

---

# Tab Rank History

Table

```text
Rank

Start Date

End Date

Current

Action
```

---

# Tab Grade History

Table

```text
Grade

Start Date

End Date

Current

Action
```

---

# Tab Education

Table

```text
Education Level

Institution

Major

Graduation Year

Latest

Action
```

---

# Tab Leadership

Table

```text
Program

Year

Notes

Action
```

---

# Tab KPI

Table

```text
Year

Score

Notes

Action
```

---

Example

```text
2025 | 95.50
2024 | 92.25
2023 | 89.00
```

---

# Tab Career Plan

Layout

```text
Branch Plan

1.
2.

Department Plan

1.
2.
```

---

Example

```text
Branch

1. Bekasi
2. Magelang

Department

1. SDM
2. Pelayanan
```

---

# Tab Talent Mapping

Fields

```text
Strengths

Weaknesses

Talent Interest

Achievement

Development Notes
```

---

Layout

```text
Strengths

[ Textarea ]

Weaknesses

[ Textarea ]

Talent Interest

[ Textarea ]

Achievement

[ Textarea ]

Development Notes

[ Textarea ]
```

---

# Tab Documents

Upload Area

```text
Drag File Here
```

---

Document List

```text
Document Type

File Name

Upload Date

Action
```

---

Actions

```text
Download

Delete
```

---

# Reports Page

Route

```text
/dashboard/reports
```

---

Layout

```text
Talent Mapping Report
```

---

Filters

```text
Branch

Department

Grade

Rank
```

---

Button

```text
[ Preview ]

[ Export Excel ]
```

---

# Export Flow

User Select Filter

↓

Preview Data

↓

Export Excel

↓

Talent-Mapping-YYYY-MM-DD.xlsx

---

# Modal Standard

Used For

* Create
* Edit
* Delete

---

Delete Confirmation

```text
Delete Data?

This action cannot be undone.

[ Cancel ]
[ Delete ]
```

---

# Empty State

All Tables

```text
No Data Available
```

---

# Loading State

All Tables

```text
Loading...
```

or Skeleton Loader

---

# Responsive Strategy

Desktop First

Minimum Width:

1280px

---

Tablet

Support

---

Mobile

Not Priority

Because:

Internal HRD Application

Desktop Focus

---

# Definition of Done

UI dianggap siap jika:

✓ Semua halaman terdefinisi

✓ Semua route terdefinisi

✓ Semua tab employee terdefinisi

✓ Export flow jelas

✓ CRUD flow jelas

✓ Dapat langsung diimplementasikan ke React
