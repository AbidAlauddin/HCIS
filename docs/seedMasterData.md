# HCIS Talent Mapping System

## Master Data Seeder

Version: 1.0

---

# Purpose

Dokumen ini mendefinisikan data awal (master data) yang harus tersedia setelah migration pertama selesai.

Tujuan:

* Mempermudah development
* Mempermudah testing
* Memastikan data referensi konsisten
* Mempercepat deployment

---

# Seeder Execution Order

1. Branch
2. Department
3. Position
4. Grade
5. Rank
6. Leadership Program

---

# Branch Seeder

Table:

branches

---

## Data

| Code | Name     |
| ---- | -------- |
| SMG  | Semarang |
| TGL  | Tegal    |
| BKS  | Bekasi   |
| MGL  | Magelang |

---

# Department Seeder

Table:

departments

---

## Data

| Code | Name                |
| ---- | ------------------- |
| KEP  | Kepesertaan         |
| PEL  | Pelayanan           |
| SDM  | SDM                 |
| KEU  | Keuangan            |
| UMUM | Umum                |
| TI   | Teknologi Informasi |

---

# Position Seeder

Table:

positions

---

## Data

| Code | Name          |
| ---- | ------------- |
| STF  | Staff         |
| SPR  | Supervisor    |
| KBD  | Kepala Bidang |
| KCB  | Kepala Cabang |
| MGR  | Manager       |

---

# Grade Seeder

Table:

grades

---

## Data

| Grade Code | Order | Max Grade |
| ---------- | ----- | --------- |
| G1         | 1     | 9         |
| G2         | 2     | 9         |
| G3         | 3     | 9         |
| G4         | 4     | 9         |
| G5         | 5     | 9         |
| G6         | 6     | 9         |
| G7         | 7     | 9         |
| G8         | 8     | 9         |
| G9         | 9     | 9         |

---

# Rank Seeder

Table:

ranks

---

## Data

| Code | Name         |
| ---- | ------------ |
| I    | Golongan I   |
| II   | Golongan II  |
| III  | Golongan III |
| IV   | Golongan IV  |
| V    | Golongan V   |
| VI   | Golongan VI  |

---

# Leadership Program Seeder

Table:

leadership_programs

---

## Data

| Code | Name                                        |
| ---- | ------------------------------------------- |
| BLDP | Basic Leadership Development Program        |
| ILDP | Intermediate Leadership Development Program |
| ALDP | Advanced Leadership Development Program     |

---

# Development Dummy Employee

Digunakan hanya untuk development.

Environment:

Development Only

---

## Employee

| Field      | Value            |
| ---------- | ---------------- |
| NPK        | 100001           |
| NIK        | 3374010101010001 |
| Nama       | Developer Test   |
| Gender     | L                |
| Cabang     | Semarang         |
| Department | TI               |
| Position   | Staff            |
| Grade      | G3               |
| Rank       | III              |

---

# Seeder Structure

Folder:

```text
prisma/
│
├── seed/
│   ├── branch.seed.ts
│   ├── department.seed.ts
│   ├── position.seed.ts
│   ├── grade.seed.ts
│   ├── rank.seed.ts
│   ├── leadership.seed.ts
│   └── employee.seed.ts
│
└── seed.ts
```

---

# Seeder Rules

Gunakan:

upsert()

Bukan:

create()

---

Alasan:

Seeder dapat dijalankan berulang kali tanpa menghasilkan data duplikat.

---

Contoh

```ts
await prisma.branch.upsert({
  where: {
    code: "SMG"
  },
  update: {},
  create: {
    code: "SMG",
    name: "Semarang"
  }
})
```

---

# Definition of Done

Seeder dianggap selesai jika:

✓ Semua master data berhasil masuk

✓ Tidak ada data duplikat

✓ Dapat dijalankan berkali-kali

✓ Data referensi siap digunakan CRUD

✓ Environment development memiliki minimal 1 employee dummy
