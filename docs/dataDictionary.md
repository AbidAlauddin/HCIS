# Data Dictionary

## HCIS Talent Mapping System V1

---

# Table: users

## Deskripsi

Digunakan untuk autentikasi pengguna aplikasi.

| Field         | Type         | Required | Description          |
| ------------- | ------------ | -------- | -------------------- |
| id            | UUID         | Yes      | Primary Key          |
| email         | VARCHAR(255) | Yes      | Email login          |
| full_name     | VARCHAR(255) | Yes      | Nama pengguna        |
| password_hash | TEXT         | Yes      | Password terenkripsi |
| role          | VARCHAR(50)  | Yes      | Role pengguna        |
| created_at    | TIMESTAMP    | Yes      | Tanggal dibuat       |
| updated_at    | TIMESTAMP    | Yes      | Tanggal diubah       |

---

# Table: branches

## Deskripsi

Master data cabang.

| Field      | Type         | Required | Description    |
| ---------- | ------------ | -------- | -------------- |
| id         | UUID         | Yes      | Primary Key    |
| code       | VARCHAR(20)  | Yes      | Kode cabang    |
| name       | VARCHAR(255) | Yes      | Nama cabang    |
| created_at | TIMESTAMP    | Yes      | Tanggal dibuat |
| updated_at | TIMESTAMP    | Yes      | Tanggal diubah |

---

# Table: positions

## Deskripsi

Master data jabatan.

| Field      | Type         | Required | Description    |
| ---------- | ------------ | -------- | -------------- |
| id         | UUID         | Yes      | Primary Key    |
| code       | VARCHAR(20)  | Yes      | Kode jabatan   |
| name       | VARCHAR(255) | Yes      | Nama jabatan   |
| created_at | TIMESTAMP    | Yes      | Tanggal dibuat |
| updated_at | TIMESTAMP    | Yes      | Tanggal diubah |

---

# Table: grades

## Deskripsi

Master data grade.

| Field       | Type        | Required | Description    |
| ----------- | ----------- | -------- | -------------- |
| id          | UUID        | Yes      | Primary Key    |
| grade_code  | VARCHAR(20) | Yes      | Kode grade     |
| grade_order | INTEGER     | Yes      | Urutan grade   |
| max_grade   | INTEGER     | Yes      | Grade maksimal |
| created_at  | TIMESTAMP   | Yes      | Tanggal dibuat |
| updated_at  | TIMESTAMP   | Yes      | Tanggal diubah |

---

# Table: ranks

## Deskripsi

Master data golongan.

| Field      | Type         | Required | Description    |
| ---------- | ------------ | -------- | -------------- |
| id         | UUID         | Yes      | Primary Key    |
| rank_code  | VARCHAR(20)  | Yes      | Kode golongan  |
| rank_name  | VARCHAR(255) | Yes      | Nama golongan  |
| created_at | TIMESTAMP    | Yes      | Tanggal dibuat |
| updated_at | TIMESTAMP    | Yes      | Tanggal diubah |

---

# Table: leadership_programs

## Deskripsi

Master program leadership.

| Field      | Type         | Required | Description    |
| ---------- | ------------ | -------- | -------------- |
| id         | UUID         | Yes      | Primary Key    |
| code       | VARCHAR(20)  | Yes      | Kode program   |
| name       | VARCHAR(255) | Yes      | Nama program   |
| created_at | TIMESTAMP    | Yes      | Tanggal dibuat |
| updated_at | TIMESTAMP    | Yes      | Tanggal diubah |

---

# Table: employees

## Deskripsi

Data utama karyawan.

| Field               | Type         | Required | Description              |
| ------------------- | ------------ | -------- | ------------------------ |
| id                  | UUID         | Yes      | Primary Key              |
| npk                 | VARCHAR(50)  | Yes      | Nomor pegawai            |
| nik                 | VARCHAR(50)  | Yes      | Nomor induk kependudukan |
| full_name           | VARCHAR(255) | Yes      | Nama lengkap             |
| birth_date          | DATE         | Yes      | Tanggal lahir            |
| gender              | CHAR(1)      | Yes      | L atau P                 |
| phone               | VARCHAR(50)  | No       | Nomor telepon            |
| email               | VARCHAR(255) | No       | Email                    |
| address             | TEXT         | No       | Alamat                   |
| marital_status      | VARCHAR(100) | Yes      | Status keluarga          |
| current_branch_id   | UUID         | Yes      | Cabang saat ini          |
| current_position_id | UUID         | Yes      | Jabatan saat ini         |
| created_at          | TIMESTAMP    | Yes      | Tanggal dibuat           |
| updated_at          | TIMESTAMP    | Yes      | Tanggal diubah           |
| deleted_at          | TIMESTAMP    | No       | Soft delete              |

---

# Table: employee_branch_histories

## Deskripsi

Riwayat penempatan cabang.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| employee_id | UUID      |
| branch_id   | UUID      |
| start_date  | DATE      |
| end_date    | DATE      |
| is_current  | BOOLEAN   |
| created_at  | TIMESTAMP |

---

# Table: employee_ranks

## Deskripsi

Riwayat golongan.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| employee_id | UUID      |
| rank_id     | UUID      |
| start_date  | DATE      |
| end_date    | DATE      |
| is_current  | BOOLEAN   |
| created_at  | TIMESTAMP |

---

# Table: employee_grades

## Deskripsi

Riwayat grade.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| employee_id | UUID      |
| grade_id    | UUID      |
| start_date  | DATE      |
| end_date    | DATE      |
| is_current  | BOOLEAN   |
| created_at  | TIMESTAMP |

---

# Table: employee_educations

## Deskripsi

Riwayat pendidikan.

| Field           | Type         |
| --------------- | ------------ |
| id              | UUID         |
| employee_id     | UUID         |
| education_level | VARCHAR(100) |
| institution     | VARCHAR(255) |
| major           | VARCHAR(255) |
| graduation_year | INTEGER      |
| is_latest       | BOOLEAN      |
| created_at      | TIMESTAMP    |

---

# Table: employee_leaderships

## Deskripsi

Leadership program yang pernah diikuti.

| Field                 | Type      |
| --------------------- | --------- |
| id                    | UUID      |
| employee_id           | UUID      |
| leadership_program_id | UUID      |
| completion_year       | INTEGER   |
| notes                 | TEXT      |
| created_at            | TIMESTAMP |

---

# Table: employee_kpis

## Deskripsi

Nilai KPI tahunan.

| Field       | Type         |
| ----------- | ------------ |
| id          | UUID         |
| employee_id | UUID         |
| year        | INTEGER      |
| score       | DECIMAL(4,2) |
| notes       | TEXT         |
| created_at  | TIMESTAMP    |

---

# Table: employee_career_plans

## Deskripsi

Rencana karir karyawan.

| Field         | Type        |
| ------------- | ----------- |
| id            | UUID        |
| employee_id   | UUID        |
| plan_type     | VARCHAR(50) |
| plan_order    | INTEGER     |
| branch_id     | UUID NULL   |
| department_id | UUID NULL   |
| notes         | TEXT        |
| created_at    | TIMESTAMP   |

Nilai plan_type:

* BRANCH
* DEPARTMENT

---

# Table: employee_talents

## Deskripsi

Talent mapping.

| Field           | Type      |
| --------------- | --------- |
| id              | UUID      |
| employee_id     | UUID      |
| talent_interest | TEXT      |
| achievement     | TEXT      |
| notes           | TEXT      |
| created_at      | TIMESTAMP |

---

# Table: employee_documents

## Deskripsi

Dokumen karyawan.

| Field         | Type         |
| ------------- | ------------ |
| id            | UUID         |
| employee_id   | UUID         |
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

# Naming Convention

## Database

* snake_case
* singular table names not allowed
* UUID sebagai primary key

Contoh:

employees
employee_grades
employee_kpis

---

# Soft Delete

Gunakan field:

deleted_at TIMESTAMP NULL

Untuk:

* employees

Tidak menggunakan hard delete pada data karyawan.
