# HCIS Talent Mapping System

## Prisma Schema Plan

Version: 1.0

---

# Prisma Configuration

Database:

PostgreSQL (Supabase)

Provider:

```prisma
provider = "postgresql"
```

ID Strategy:

```prisma
id String @id @default(uuid()) @db.Uuid
```

Timestamp Strategy:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
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

# Model Users

```prisma
model User {
  id           String   @id @default(uuid()) @db.Uuid

  email        String   @unique
  fullName     String

  passwordHash String

  role         String

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

# Model Branch

```prisma
model Branch {
  id          String @id @default(uuid()) @db.Uuid

  code        String @unique
  name        String

  employees   Employee[]

  histories   EmployeeBranchHistory[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# Model Department

```prisma
model Department {
  id          String @id @default(uuid()) @db.Uuid

  code        String @unique
  name        String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# Model Position

```prisma
model Position {
  id          String @id @default(uuid()) @db.Uuid

  code        String @unique
  name        String

  employees   Employee[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# Model Grade

```prisma
model Grade {
  id          String @id @default(uuid()) @db.Uuid

  gradeCode   String
  gradeOrder  Int

  maxGrade    Int

  employees   EmployeeGrade[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# Model Rank

```prisma
model Rank {
  id          String @id @default(uuid()) @db.Uuid

  rankCode    String
  rankName    String

  employees   EmployeeRank[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# Model LeadershipProgram

```prisma
model LeadershipProgram {
  id          String @id @default(uuid()) @db.Uuid

  code        String @unique
  name        String

  employees   EmployeeLeadership[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

# Model Employee

```prisma
model Employee {
  id                 String @id @default(uuid()) @db.Uuid

  npk                String @unique
  nik                String @unique

  fullName           String

  birthDate          DateTime

  gender             Gender

  phone              String?
  email              String?

  address            String?

  maritalStatus      String

  currentBranchId    String @db.Uuid
  currentPositionId  String @db.Uuid

  currentBranch      Branch
  currentPosition    Position

  branchHistories    EmployeeBranchHistory[]

  grades             EmployeeGrade[]
  ranks              EmployeeRank[]

  educations         EmployeeEducation[]

  leaderships        EmployeeLeadership[]

  kpis               EmployeeKPI[]

  careerPlans        EmployeeCareerPlan[]

  talent             EmployeeTalent?

  documents          EmployeeDocument[]

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  deletedAt          DateTime?
}
```

---

# Model EmployeeBranchHistory

```prisma
model EmployeeBranchHistory {
  id          String @id @default(uuid()) @db.Uuid

  employeeId  String @db.Uuid
  branchId    String @db.Uuid

  startDate   DateTime
  endDate     DateTime?

  isCurrent   Boolean @default(false)

  employee    Employee
  branch      Branch

  createdAt   DateTime @default(now())
}
```

---

# Model EmployeeRank

```prisma
model EmployeeRank {
  id          String @id @default(uuid()) @db.Uuid

  employeeId  String @db.Uuid
  rankId      String @db.Uuid

  startDate   DateTime
  endDate     DateTime?

  isCurrent   Boolean @default(false)

  employee    Employee
  rank        Rank

  createdAt   DateTime @default(now())
}
```

---

# Model EmployeeGrade

```prisma
model EmployeeGrade {
  id          String @id @default(uuid()) @db.Uuid

  employeeId  String @db.Uuid
  gradeId     String @db.Uuid

  startDate   DateTime
  endDate     DateTime?

  isCurrent   Boolean @default(false)

  employee    Employee
  grade       Grade

  createdAt   DateTime @default(now())
}
```

---

# Model EmployeeEducation

```prisma
model EmployeeEducation {
  id              String @id @default(uuid()) @db.Uuid

  employeeId      String @db.Uuid

  educationLevel  String

  institution     String

  major           String

  graduationYear  Int

  isLatest        Boolean @default(false)

  employee        Employee

  createdAt       DateTime @default(now())
}
```

---

# Model EmployeeLeadership

```prisma
model EmployeeLeadership {
  id                    String @id @default(uuid()) @db.Uuid

  employeeId            String @db.Uuid

  leadershipProgramId   String @db.Uuid

  completionYear        Int

  notes                 String?

  employee              Employee

  leadershipProgram     LeadershipProgram

  createdAt             DateTime @default(now())
}
```

---

# Model EmployeeKPI

```prisma
model EmployeeKPI {
  id          String @id @default(uuid()) @db.Uuid

  employeeId  String @db.Uuid

  year        Int

  score       Decimal @db.Decimal(4,2)

  notes       String?

  employee    Employee

  createdAt   DateTime @default(now())

  @@unique([employeeId, year])
}
```

---

# Model EmployeeCareerPlan

```prisma
model EmployeeCareerPlan {
  id              String @id @default(uuid()) @db.Uuid

  employeeId      String @db.Uuid

  planType        CareerPlanType

  planOrder       Int

  branchId        String? @db.Uuid

  departmentId    String? @db.Uuid

  notes           String?

  employee        Employee

  branch          Branch?

  department      Department?

  createdAt       DateTime @default(now())
}
```

---

# Model EmployeeTalent

```prisma
model EmployeeTalent {
  id                String @id @default(uuid()) @db.Uuid

  employeeId        String @unique @db.Uuid

  talentInterest    String?

  achievement       String?

  notes             String?

  employee          Employee

  createdAt         DateTime @default(now())

  updatedAt         DateTime @updatedAt
}
```

---

# Model EmployeeDocument

```prisma
model EmployeeDocument {
  id            String @id @default(uuid()) @db.Uuid

  employeeId    String @db.Uuid

  documentType  String

  fileName      String

  fileUrl       String

  employee      Employee

  uploadedAt    DateTime @default(now())
}
```

---

# Index Recommendation

Tambahkan index pada:

```prisma
npk
nik
fullName
currentBranchId
currentPositionId
year
planType
```

Untuk mempercepat:

* Search Karyawan
* Filter Cabang
* Filter Jabatan
* Export Excel
* KPI Query

---

# V1 Migration Order

1. Branch
2. Department
3. Position
4. Grade
5. Rank
6. LeadershipProgram
7. Employee
8. EmployeeBranchHistory
9. EmployeeRank
10. EmployeeGrade
11. EmployeeEducation
12. EmployeeLeadership
13. EmployeeKPI
14. EmployeeCareerPlan
15. EmployeeTalent
16. EmployeeDocument

---

# Ready for Development

Dokumen ini menjadi acuan pembuatan:

* schema.prisma
* migration
* repository layer
* service layer
* React Query hooks
* form validation
* export query
