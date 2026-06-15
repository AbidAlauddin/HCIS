// File: src/utils/exportExcel.ts

import type { Employee } from "../types/employee";
import {
  getKpisByEmployee,
  getLeadershipPrograms,
  getLeadershipByEmployee,
  type EmployeeKpi,
  type EmployeeLeadershipProgram,
  type LeadershipProgram,
} from "../services/kpiLeadershipService";

type SortDir = "asc" | "desc";

export async function exportKaryawanToExcel(
  employees: Employee[],
  branchName: string = "ALL",
  sortKey: keyof Employee | "position_name" = "position_name",
  sortDir: SortDir = "asc"
): Promise<void> {
  // Import dinamis library
  const ExcelJS = (await import("exceljs")).default || await import("exceljs");

  // ─── Ambil master & relasi KPI/Leadership untuk keperluan export ─────────
  // Map: leadership_program_id -> code (BLDP/ILDP/ALDP)
  const leadershipPrograms = await getLeadershipPrograms();
  const programIdToCode = new Map<string, string>(
    leadershipPrograms.map((p: LeadershipProgram) => [p.id, p.code])
  );

  // Ambil KPI & Leadership per employee (parallel) agar worksheet terisi.
  const perEmployeeKpiLeadership = await Promise.all(
    employees.map(async (emp: Employee) => {
      const employeeId = (emp as any).id as string;

      const [kpis, lps] = await Promise.all([
        getKpisByEmployee(employeeId) as Promise<EmployeeKpi[]>,
        getLeadershipByEmployee(employeeId) as Promise<EmployeeLeadershipProgram[]>,
      ]);

      const kpiYearToScore = new Map<number, number | null>();
      kpis.forEach((k) => {
        if (typeof k.year === "number") kpiYearToScore.set(k.year, k.score ?? null);
      });

      // programCode -> year (mis: BLDP -> 2025)
      const codeToYear = new Map<string, number | null>();
      lps.forEach((lp) => {
        const code = programIdToCode.get(lp.leadership_program_id);
        if (!code) return;
        codeToYear.set(code, lp.year ?? null);
      });

      return { employeeId, kpiYearToScore, codeToYear };
    })
  );

  const kpiByEmployeeId = new Map<string, Map<number, number | null>>();
  const leadershipYearByEmployeeId = new Map<string, Map<string, number | null>>();

  perEmployeeKpiLeadership.forEach(({ employeeId, kpiYearToScore, codeToYear }) => {
    kpiByEmployeeId.set(employeeId, kpiYearToScore);
    leadershipYearByEmployeeId.set(employeeId, codeToYear);
  });


  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Data Karyawan");

  // Style Reusable
  const centerStyle = { vertical: 'middle', horizontal: 'center' } as any;
  const borderStyle = {
    top: { style: 'thin' }, left: { style: 'thin' },
    bottom: { style: 'thin' }, right: { style: 'thin' }
  } as any;
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } } as any;

  // Header Baris 1-3
  ws.getCell("A1").value = "DAFTAR PERSONIL";
  ws.getCell("A1").font = { bold: true, size: 14 };
  ws.getCell("A2").value = `CABANG: ${branchName.toUpperCase()}`;
  ws.getCell("A3").value = `TANGGAL: ${new Date().toLocaleDateString("id-ID")}`;

  // Struktur Header Template Baris 4 & 5
  const headersConfig = [
    { ref: 'A4:A5', label: 'NO', width: 5 },
    { ref: 'B4:B5', label: 'NAMA', width: 25 },
    { ref: 'C4:C5', label: 'Tanggal Lahir', width: 15 },
    { ref: 'D4:D5', label: 'L/P', width: 8 },
    { ref: 'E4:E5', label: 'NPK', width: 18 },
    { ref: 'F4:F5', label: 'NIK', width: 22 },
    { ref: 'G4:G5', label: 'JABATAN', width: 25 },
    
    { ref: 'H4:I4', label: 'PENEMPATAN CABANG' },
    { ref: 'H5', label: 'TMT', width: 15 },
    { ref: 'I5', label: 'UMUR', width: 25 },
    
    { ref: 'J4:L4', label: 'GOLONGAN' },
    { ref: 'J5', label: 'GOL', width: 10 },
    { ref: 'K5', label: 'TMT', width: 15 },
    { ref: 'L5', label: 'UMUR', width: 25 },
    
    { ref: 'M4:Q4', label: 'GRADE' },
    { ref: 'M5', label: 'GRADE', width: 10 },
    { ref: 'N5', label: 'TMT', width: 15 },
    { ref: 'O5', label: 'UMUR', width: 25 },
    { ref: 'P5', label: 'MAKS', width: 10 },
    { ref: 'Q5', label: 'GAP', width: 10 },
    
    { ref: 'R4:R5', label: 'Pendidikan Terakhir', width: 20 },
    
    { ref: 'S4:U4', label: 'Leadership Program' },
    { ref: 'S5', label: 'BLDP', width: 10 },
    { ref: 'T5', label: 'ILDP', width: 10 },
    { ref: 'U5', label: 'ALDP', width: 10 },
    
    { ref: 'V4:Y4', label: 'RENCANA KARIR' },
    { ref: 'V5', label: 'KANTOR 1', width: 20 },
    { ref: 'W5', label: 'KANTOR 2', width: 20 },
    { ref: 'X5', label: 'BIDANG 1', width: 20 },
    { ref: 'Y5', label: 'BIDANG 2', width: 20 },
    
    { ref: 'Z4:AB4', label: 'KPI' },
    { ref: 'Z5', label: '2025', width: 10 },
    { ref: 'AA5', label: '2024', width: 10 },
    { ref: 'AB5', label: '2023', width: 10 },
    
    { ref: 'AC4:AC5', label: 'MINAT BAKAT', width: 25 },
    { ref: 'AD4:AD5', label: 'CATATAN', width: 30 },
    { ref: 'AE4:AE5', label: 'STATUS KELUARGA', width: 20 },
  ];

  // Menerapkan konfigurasi merge, warna, border, dan ukuran
  headersConfig.forEach(h => {
    if (h.ref.includes(':')) {
      ws.mergeCells(h.ref);
      const cell = ws.getCell(h.ref.split(':')[0]);
      cell.value = h.label;
      cell.alignment = centerStyle;
      cell.font = { bold: true };
      cell.fill = headerFill;
    } else {
      const cell = ws.getCell(h.ref);
      cell.value = h.label;
      cell.alignment = centerStyle;
      cell.font = { bold: true };
      cell.fill = headerFill;
      if (h.width) ws.getColumn(h.ref.replace(/[0-9]/g, '')).width = h.width;
    }
    if(h.width && h.ref.includes(':')) {
      ws.getColumn(h.ref.split(':')[0].replace(/[0-9]/g, '')).width = h.width;
    }
  });

  for (let r = 4; r <= 5; r++) {
    for (let c = 1; c <= 31; c++) {
      ws.getCell(r, c).border = borderStyle;
    }
  }

  // Fungsi Helper Kalkulasi Umur (Masa Kerja)
  const formatUmurTeks = (dateString?: string | null) => {
    if (!dateString) return "";
    const start = new Date(dateString);
    const end = new Date();
    if (isNaN(start.getTime())) return "";

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return `${years} TAHUN ${months} BULAN ${days} HARI`;
  };

  const fmtDate = (d?: string | null) => d ? new Date(d).toLocaleDateString("id-ID") : "";

  const compareAscDesc = (cmp: number) => (sortDir === "asc" ? cmp : -cmp);

  // ─── Sort (jabatan atau kolom lain) ─────────────────────────────────────
  const rankForPositionName = (pos?: string | null) => {
    const p = (pos || "").toLowerCase().trim();
    if (p.includes("kepala cabang")) return { group: 1, key: p };
    if (p.includes("kepala bidang operasional")) return { group: 2, key: p };
    if (p.includes("kepala bidang pelayanan")) return { group: 3, key: p };
    if (p.includes("kepala bidang kepesertaan")) return { group: 4, key: p };
    return { group: 5, key: p };
  };

  const getValueForSort = (emp: Employee, key: keyof Employee | "position_name") => {
    const v = key === "position_name" ? (emp as any).position_name : (emp as any)[key];
    return v;
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    // Khusus position_name: pakai ranking jabatan
    if (sortKey === "position_name") {
      const aR = rankForPositionName((a as any).position_name);
      const bR = rankForPositionName((b as any).position_name);

      if (aR.group !== bR.group) return compareAscDesc(aR.group - bR.group);
      return compareAscDesc(aR.key.localeCompare(bR.key));
    }

    const av = getValueForSort(a, sortKey);
    const bv = getValueForSort(b, sortKey);

    // normalize
    if (av == null && bv == null) return 0;
    if (av == null) return compareAscDesc(1); // null di akhir untuk asc
    if (bv == null) return compareAscDesc(-1);

    // number compare
    const an = typeof av === "number" ? av : Number(av);
    const bn = typeof bv === "number" ? bv : Number(bv);
    const aIsNum = typeof av === "number" || (!Number.isNaN(an) && String(av).trim() !== "");
    const bIsNum = typeof bv === "number" || (!Number.isNaN(bn) && String(bv).trim() !== "");

    if (aIsNum && bIsNum) return compareAscDesc(an - bn);

    // string compare
    return compareAscDesc(String(av).localeCompare(String(bv)));
  });

  // Memasukkan data dari database ke baris Excel
  sortedEmployees.forEach((emp, i) => {
    const lp = emp.gender?.toLowerCase().startsWith("l") ? "L" : "P";
    const maxGrade = 9;
    const gradeGap = emp.grade != null ? maxGrade - emp.grade : "";

    const employeeId = (emp as any).id as string;

    const kpiYearToScore = kpiByEmployeeId.get(employeeId) ?? new Map<number, number | null>();
    const codeToYear = leadershipYearByEmployeeId.get(employeeId) ?? new Map<string, number | null>();

    const getLeadershipYearCell = (code: string) => {
      const v = codeToYear.get(code);
      return v == null ? "" : v;
    };

    const getKpiScoreCell = (year: number) => {
      const v = kpiYearToScore.get(year);
      return v == null ? "" : v;
    };

    const rowData = [
      i + 1,
      emp.full_name,
      fmtDate(emp.birth_date),
      lp,
      emp.npk,
      emp.nik ? `'${emp.nik}` : "",
      emp.position_name,

      fmtDate(emp.tmt_penempatan), formatUmurTeks(emp.tmt_penempatan),
      emp.golongan, fmtDate(emp.tmt_golongan), formatUmurTeks(emp.tmt_golongan),
      emp.grade, fmtDate(emp.tmt_grade), formatUmurTeks(emp.tmt_grade), maxGrade, gradeGap,

      emp.pendidikan_terakhir,
      getLeadershipYearCell("BLDP"),
      getLeadershipYearCell("ILDP"),
      getLeadershipYearCell("ALDP"),

      emp.career_office_1, emp.career_office_2, emp.career_field_1, emp.career_field_2,
      getKpiScoreCell(2025),
      getKpiScoreCell(2024),
      getKpiScoreCell(2023),

      emp.minat_bakat, emp.catatan, emp.status_keluarga,
    ];

    const row = ws.addRow(rowData);
    
    row.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { vertical: 'middle', wrapText: true }; 
    });

    [1, 4, 10, 13, 16, 17].forEach(colIndex => {
      row.getCell(colIndex).alignment = centerStyle;
    });
  });

  // Tulis buffer
  const buffer = await wb.xlsx.writeBuffer();
  
  // Menerapkan tipe Blob native agar dikenali sebagai Excel
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  // ─── LOGIKA PENAMAAN FILE DINAMIS ───
  const dateStr = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  let fileName = "";

  if (branchName === "ALL") {
    fileName = `Data_Monitoring_Karyawan_Semua Cabang_${dateStr}.xlsx`;
  } else {
    // Pastikan nama cabang ditulis KAPITAL (misal: BREBES)
    fileName = `Data_Monitoring_Karyawan_Cabang_${branchName.toUpperCase()}_${dateStr}.xlsx`;
  }
  
  a.download = fileName;
  // ─────────────────────────────────────
  
  // Picu klik unduh
  document.body.appendChild(a);
  a.click();
  
  // Bersihkan memory
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}