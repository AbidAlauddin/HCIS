import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, ChevronDown, X, Eye, Edit2, Trash2,
  ChevronLeft, ChevronRight, RefreshCw, AlertTriangle, CheckCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Employee, CreateEmployeePayload } from "../types/employee";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";
// ─── Import service baru ───────────────────────────────────────────────────────
import {
  getKpisByEmployee, upsertKpis,
  getLeadershipPrograms, getLeadershipByEmployee, upsertLeadershipPrograms,
} from "../services/kpiLeadershipService";
import type { EmployeeKpi, LeadershipProgram, EmployeeLeadershipProgram } from "../services/kpiLeadershipService";
import Sidebar from "../components/Sidebar";
import { exportKaryawanToExcel } from "../utils/exportExcel";

const T = {
  bg: "#FAFAFA", surface: "#FFFFFF", border: "#E4E4E7", text: "#111111",
  muted: "#71717A", faint: "#A1A1AA", accent: "#3B82F6",
  accentLight: "rgba(59,130,246,0.08)", danger: "#EF4444",
  dangerLight: "rgba(239,68,68,0.08)", success: "#10B981",
  radius: "12px", font: "'Inter', system-ui, -apple-system, sans-serif",
};

const ALL_GRADE = "Semua Grade";
const ALL_BRANCH = "Semua Cabang";
const TABLE_COLUMNS: Array<{ key: keyof Employee; label: string }> = [
  { key: "npk", label: "NPK" },
  { key: "full_name", label: "Nama" },
  { key: "position_name", label: "Jabatan" },
  { key: "branch_name", label: "Cabang" },
  { key: "golongan", label: "Golongan" },
  { key: "grade", label: "Grade" },
];

const blankForm = (): CreateEmployeePayload => ({
  npk: "", nik: "", full_name: "", birth_date: null, gender: "Laki-laki",
  position_name: "", branch_name: "", tmt_penempatan: null, golongan: null,
  tmt_golongan: null, grade: 1, tmt_grade: null, pendidikan_terakhir: null,
  career_office_1: null, career_office_2: null, career_field_1: null,
  career_field_2: null, minat_bakat: null, catatan: null, status_keluarga: null,
});

const CURRENT_YEAR = new Date().getFullYear();

// ─── Helper: buat array tahun dari tmt_penempatan hingga sekarang ─────────────
function buildYearRange(tmtPenempatan: string | null): number[] {
  if (!tmtPenempatan) return [];
  const startYear = new Date(tmtPenempatan).getFullYear();
  if (isNaN(startYear)) return [];
  const years: number[] = [];
  for (let y = startYear; y <= CURRENT_YEAR; y++) years.push(y);
  return years;
}

// ─── Komponen Reusable ────────────────────────────────────────────────────────
function Label({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 10, fontWeight: 500, color: T.faint, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{children}</p>;
}
function Value({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 14, color: T.text, fontWeight: 500, margin: 0 }}>{children || <span style={{ color: T.faint }}>—</span>}</p>;
}
function FieldGrid({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>{children}</div>;
}
function FormInput({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string | number | null; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
        {label}{required && <span style={{ color: T.danger }}> *</span>}
      </label>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", height: 44, boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 14px", fontSize: 14, color: T.text, outline: "none", transition: "border-color 0.15s" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
      />
    </div>
  );
}
function FormSelect({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
        {label}{required && <span style={{ color: T.danger }}> *</span>}
      </label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{ appearance: "none", width: "100%", height: 44, boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 32px 0 12px", fontSize: 14, color: value ? T.text : T.muted, cursor: "pointer", outline: "none" }}>
          <option value="" disabled hidden>-- Pilih {label} --</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} color={T.faint} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}
const FilterSelect = FormSelect;

function IconBtn({ icon: Icon, title, onClick, danger }: { icon: React.ElementType; title: string; onClick: () => void; danger?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${hovered ? (danger ? T.danger : T.accent) : T.border}`, background: hovered ? (danger ? T.dangerLight : T.accentLight) : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.12s" }}>
      <Icon size={13} color={hovered ? (danger ? T.danger : T.accent) : T.faint} />
    </button>
  );
}
function PagBtn({ icon: Icon, onClick, disabled }: { icon: React.ElementType; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: disabled ? T.faint : T.muted, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={14} />
    </button>
  );
}
function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID");
}

function EmployeeDetailModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"pribadi" | "kepegawaian" | "kpi" | "karir">("pribadi");

  const [loadingKpiLeadership, setLoadingKpiLeadership] = useState(false);
  const [kpiYearToScore, setKpiYearToScore] = useState<Record<number, number | null>>({});
  const [leadershipCodeToYear, setLeadershipCodeToYear] = useState<Record<string, number | null>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!employee?.id) return;
      setLoadingKpiLeadership(true);
      setErrorMsg(null);

      try {
        const [kpis, programs] = await Promise.all([
          getKpisByEmployee(employee.id),
          getLeadershipPrograms(),
        ]);

        const [lps] = await Promise.all([getLeadershipByEmployee(employee.id)]);

        const yMap: Record<number, number | null> = {};
        (kpis ?? []).forEach((k) => {
          if (typeof k.year === "number") yMap[k.year] = k.score ?? null;
        });

        const idToCode = new Map<string, string>((programs ?? []).map((p) => [p.id, p.code]));
        const codeMap: Record<string, number | null> = {};
        (lps ?? []).forEach((lp) => {
          const code = idToCode.get(lp.leadership_program_id);
          if (!code) return;
          codeMap[code] = lp.year ?? null;
        });

        if (!mounted) return;
        setKpiYearToScore(yMap);
        setLeadershipCodeToYear(codeMap);
      } catch (e: any) {
        if (!mounted) return;
        setErrorMsg(e?.message ? String(e.message) : "Gagal memuat KPI & Leadership.");
      } finally {
        if (!mounted) return;
        setLoadingKpiLeadership(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [employee?.id]);

  const kpiCell = (year: number) => {
    const v = kpiYearToScore[year];
    return v == null ? "—" : v;
  };

  const leadershipCell = (code: string) => {
    const v = leadershipCodeToYear[code];
    return v == null ? "—" : v;
  };

  const tabs = [
    { id: "pribadi" as const, label: "Data pribadi" },
    { id: "kepegawaian" as const, label: "Kepegawaian" },
    { id: "kpi" as const, label: "KPI & Leadership" },
    { id: "karir" as const, label: "Karir & lainnya" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", borderRadius: 18, background: T.surface, boxShadow: "0 20px 60px rgba(0,0,0,0.16)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 12px" }}>
          <div>
            <p style={{ fontSize: 11, color: T.faint, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>Detail Karyawan</p>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: "6px 0 0" }}>{employee.full_name}</h2>
            <p style={{ fontSize: 12, color: T.muted, margin: "4px 0 0" }}>NPK {employee.npk}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${T.border}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} color={T.muted} /></button>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  color: activeTab === tab.id ? T.text : T.muted,
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === tab.id ? T.text : "transparent"}`,
                  marginBottom: -1,
                  cursor: "pointer",
                  fontFamily: T.font,
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Konten per tab */}
          {activeTab === "pribadi" && (
            <section style={{ background: T.bg, borderRadius: 14, padding: 18, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: "0 0 10px" }}>Data Pribadi</p>
              <FieldGrid>
                <div><Label>Nama</Label><Value>{employee.full_name}</Value></div>
                <div><Label>NPK</Label><Value>{employee.npk}</Value></div>
                <div><Label>NIK</Label><Value>{employee.nik}</Value></div>
                <div><Label>Tanggal Lahir</Label><Value>{formatDate(employee.birth_date)}</Value></div>
                <div><Label>Jenis Kelamin</Label><Value>{employee.gender}</Value></div>
              </FieldGrid>
            </section>
          )}

          {activeTab === "kepegawaian" && (
            <section style={{ background: T.bg, borderRadius: 14, padding: 18, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: "0 0 10px" }}>Kepegawaian</p>
              <FieldGrid>
                <div><Label>Jabatan</Label><Value>{employee.position_name}</Value></div>
                <div><Label>Cabang</Label><Value>{employee.branch_name}</Value></div>
                <div><Label>TMT Penempatan</Label><Value>{formatDate(employee.tmt_penempatan)}</Value></div>
                <div><Label>Golongan</Label><Value>{employee.golongan}</Value></div>
                <div><Label>TMT Golongan</Label><Value>{formatDate(employee.tmt_golongan)}</Value></div>
                <div><Label>Grade</Label><Value>{employee.grade != null ? String(employee.grade) : "—"}</Value></div>
                <div><Label>TMT Grade</Label><Value>{formatDate(employee.tmt_grade)}</Value></div>
              </FieldGrid>
            </section>
          )}

          {activeTab === "kpi" && (
            <section style={{ background: T.bg, borderRadius: 14, padding: 18, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: "0 0 10px" }}>Leadership Program & KPI</p>
              {loadingKpiLeadership ? (
                <div style={{ fontSize: 13, color: T.faint }}>Memuat KPI & Leadership...</div>
              ) : errorMsg ? (
                <div style={{ fontSize: 13, color: T.danger }}>{errorMsg}</div>
              ) : (
                <FieldGrid>
                  <div><Label>BLDP (Tahun)</Label><Value>{leadershipCell("BLDP")}</Value></div>
                  <div><Label>ILDP (Tahun)</Label><Value>{leadershipCell("ILDP")}</Value></div>
                  <div><Label>ALDP (Tahun)</Label><Value>{leadershipCell("ALDP")}</Value></div>

                  <div><Label>KPI 2025</Label><Value>{kpiCell(2025)}</Value></div>
                  <div><Label>KPI 2024</Label><Value>{kpiCell(2024)}</Value></div>
                  <div><Label>KPI 2023</Label><Value>{kpiCell(2023)}</Value></div>
                </FieldGrid>
              )}
            </section>
          )}

          {activeTab === "karir" && (
            <section style={{ background: T.bg, borderRadius: 14, padding: 18, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: "0 0 10px" }}>Karir & lainnya</p>
              <FieldGrid>
                <div><Label>Career Office 1</Label><Value>{employee.career_office_1}</Value></div>
                <div><Label>Career Office 2</Label><Value>{employee.career_office_2}</Value></div>
                <div><Label>Career Field 1</Label><Value>{employee.career_field_1}</Value></div>
                <div><Label>Career Field 2</Label><Value>{employee.career_field_2}</Value></div>

                <div><Label>Pendidikan Terakhir</Label><Value>{employee.pendidikan_terakhir}</Value></div>
                <div><Label>Minat Bakat</Label><Value>{employee.minat_bakat}</Value></div>
                <div style={{ gridColumn: "1 / -1" }}><Label>Catatan</Label><Value>{employee.catatan}</Value></div>
                <div><Label>Status Keluarga</Label><Value>{employee.status_keluarga}</Value></div>
                <div><Label>Dibuat</Label><Value>{formatDate(employee.created_at)}</Value></div>
                <div><Label>Terakhir Diperbarui</Label><Value>{formatDate(employee.updated_at)}</Value></div>
              </FieldGrid>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab KPI & Leadership (sub-komponen form) ─────────────────────────────────
function TabKpiLeadership({
  tmtPenempatan,
  kpiData,
  setKpiData,
  leadershipPrograms,
  leadershipData,
  setLeadershipData,
  loadingKpi,
}: {
  tmtPenempatan: string | null;
  kpiData: Record<number, string>; // year -> score (string untuk input)
  setKpiData: (d: Record<number, string>) => void;
  leadershipPrograms: LeadershipProgram[];
  leadershipData: Record<string, string>; // leadership_program_id -> year (string)
  setLeadershipData: (d: Record<string, string>) => void;
  loadingKpi: boolean;
}) {
  const years = buildYearRange(tmtPenempatan);

  if (!tmtPenempatan) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 10, textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AlertTriangle size={18} color={T.accent} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: 0 }}>TMT Penempatan belum diisi</p>
        <p style={{ fontSize: 13, color: T.faint, margin: 0 }}>Isi tab Kepegawaian terlebih dahulu, khususnya field TMT Penempatan.</p>
      </div>
    );
  }

  if (loadingKpi) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 10 }}>
        <RefreshCw size={16} color={T.faint} style={{ animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 13, color: T.faint }}>Memuat data...</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Leadership Program ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.faint, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Leadership Program</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 16px" }}>
          {leadershipPrograms.map((prog) => (
            <div key={prog.id}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.muted, marginBottom: 6 }}>
                {prog.code}
                <span style={{ fontSize: 11, fontWeight: 400, color: T.faint, marginLeft: 4 }}>({prog.name})</span>
              </label>
              <input
                type="number"
                min="2000" max={CURRENT_YEAR}
                placeholder="Tahun (opsional)"
                value={leadershipData[prog.id] ?? ""}
                onChange={(e) => setLeadershipData({ ...leadershipData, [prog.id]: e.target.value })}
                style={{ width: "100%", height: 40, boxSizing: "border-box", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 13px", fontSize: 13, color: T.text, outline: "none", fontFamily: T.font }}
                onFocus={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI per Tahun ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.faint, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>KPI per Tahun</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 11, color: T.faint, whiteSpace: "nowrap" }}>{years.length} tahun</span>
        </div>

        {/* Header kolom */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "6px 12px", marginBottom: 6, padding: "0 2px" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: T.faint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tahun</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: T.faint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Nilai KPI</span>
        </div>

        {/* Baris per tahun — scroll jika terlalu banyak */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
          {years.map((year) => (
            <div key={year} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 12px", alignItems: "center" }}>
              {/* Badge tahun */}
              <div style={{ display: "flex", alignItems: "center", height: 40 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 28, padding: "0 10px", borderRadius: 7,
                  background: year === CURRENT_YEAR ? T.accentLight : T.bg,
                  border: `1px solid ${year === CURRENT_YEAR ? T.accent : T.border}`,
                  fontSize: 12, fontWeight: 600,
                  color: year === CURRENT_YEAR ? T.accent : T.muted,
                }}>
                  {year}
                </span>
              </div>
              {/* Input nilai */}
              <input
                type="number"
                min="0" max="5" step="0.01"
                placeholder="Contoh: 4.5"
                value={kpiData[year] ?? ""}
                onChange={(e) => setKpiData({ ...kpiData, [year]: e.target.value })}
                style={{ width: "100%", height: 40, boxSizing: "border-box", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 13px", fontSize: 13, color: T.text, outline: "none", fontFamily: T.font }}
                onFocus={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function EmployeeFormModal({
  data, setField, onClose, onSubmit, loading, isEdit, branchOptions, gradeOptions,
  employeeId,
}: {
  data: CreateEmployeePayload;
  setField: (key: keyof CreateEmployeePayload, value: string | number | null) => void;
  onClose: () => void;
  onSubmit: (
    kpiData: Record<number, string>,
    leadershipData: Record<string, string>
  ) => void;
  loading: boolean;
  isEdit: boolean;
  branchOptions: string[];
  gradeOptions: string[];
  employeeId: string | null; // null saat tambah baru
}) {
  const [activeTab, setActiveTab] = useState<"pribadi" | "kepegawaian" | "kpi" | "karir">("pribadi");

  const tabs = [
    { id: "pribadi" as const, label: "Data pribadi" },
    { id: "kepegawaian" as const, label: "Kepegawaian" },
    { id: "kpi" as const, label: "KPI & Leadership" },
    { id: "karir" as const, label: "Karir & lainnya" },
  ];

  // ── State KPI & Leadership ──
  const [kpiData, setKpiData] = useState<Record<number, string>>({});
  const [leadershipPrograms, setLeadershipPrograms] = useState<LeadershipProgram[]>([]);
  const [leadershipData, setLeadershipData] = useState<Record<string, string>>({});
  const [loadingKpi, setLoadingKpi] = useState(false);

  // Load master leadership programs sekali saja
  useEffect(() => {
    getLeadershipPrograms().then(setLeadershipPrograms).catch(() => {});
  }, []);

  // Load data KPI & Leadership yang sudah ada saat mode edit
  useEffect(() => {
    if (!isEdit || !employeeId) return;
    setLoadingKpi(true);
    Promise.all([
      getKpisByEmployee(employeeId),
      getLeadershipByEmployee(employeeId),
    ]).then(([kpis, lps]: [EmployeeKpi[], EmployeeLeadershipProgram[]]) => {
      // Konversi KPI array → Record<year, score string>
      const kpiMap: Record<number, string> = {};
      kpis.forEach((k) => { if (k.score != null) kpiMap[k.year] = String(k.score); });
      setKpiData(kpiMap);

      // Konversi leadership array → Record<program_id, year string>
      const lpMap: Record<string, string> = {};
      lps.forEach((lp) => { if (lp.year != null) lpMap[lp.leadership_program_id] = String(lp.year); });
      setLeadershipData(lpMap);
    }).catch(() => {}).finally(() => setLoadingKpi(false));
  }, [isEdit, employeeId]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 720, maxHeight: "92vh", display: "flex", flexDirection: "column", borderRadius: 18, background: T.surface, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 48px -8px rgba(0,0,0,0.14)", border: `1px solid ${T.border}`, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "24px 28px 20px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isEdit ? <Edit2 size={17} color={T.muted} /> : <Plus size={17} color={T.muted} />}
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: T.text, margin: 0, letterSpacing: "-0.01em" }}>
                {isEdit ? "Edit karyawan" : "Tambah karyawan"}
              </h2>
              <p style={{ fontSize: 13, color: T.faint, margin: "4px 0 0" }}>
                {isEdit ? "Perbarui informasi karyawan di database." : "Lengkapi data karyawan untuk disimpan ke database."}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${T.border}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={T.muted} />
          </button>
        </div>

        {/* Body scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", minHeight: 0 }}>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: "10px 14px", fontSize: 13, fontWeight: activeTab === tab.id ? 500 : 400, color: activeTab === tab.id ? T.text : T.muted, background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? T.text : "transparent"}`, marginBottom: -1, cursor: "pointer", fontFamily: T.font, transition: "color 0.15s", whiteSpace: "nowrap" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Data Pribadi ── */}
          {activeTab === "pribadi" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
              {/* NPK */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.muted, marginBottom: 6 }}>NPK <span style={{ color: T.danger }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input type="text" value={data.npk || ""} maxLength={10} placeholder="10 digit angka"
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                    onChange={(e) => setField("npk", e.target.value)}
                    style={{ width: "100%", height: 40, boxSizing: "border-box", background: T.bg, borderRadius: 10, border: `1px solid ${data.npk?.length > 0 && data.npk?.length < 10 ? T.danger : T.border}`, padding: "0 48px 0 13px", fontSize: 13, color: T.text, outline: "none", fontFamily: T.font }}
                    onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; e.currentTarget.style.borderColor = data.npk?.length > 0 && data.npk?.length < 10 ? T.danger : T.accent; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = data.npk?.length > 0 && data.npk?.length < 10 ? T.danger : T.border; }}
                  />
                  <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 600, color: data.npk?.length === 10 ? T.success : T.faint, pointerEvents: "none" }}>{data.npk?.length || 0}/10</span>
                </div>
                {data.npk?.length > 0 && <p style={{ fontSize: 11, marginTop: 5, color: data.npk?.length === 10 ? T.success : T.danger, fontWeight: 500 }}>{data.npk?.length === 10 ? "✓ NPK valid" : "Harus tepat 10 digit angka"}</p>}
              </div>
              {/* NIK */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.muted, marginBottom: 6 }}>NIK <span style={{ color: T.danger }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input type="text" value={data.nik || ""} maxLength={16} placeholder="16 digit angka"
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                    onChange={(e) => setField("nik", e.target.value)}
                    style={{ width: "100%", height: 40, boxSizing: "border-box", background: T.bg, borderRadius: 10, border: `1px solid ${data.nik?.length > 0 && data.nik?.length < 16 ? T.danger : T.border}`, padding: "0 48px 0 13px", fontSize: 13, color: T.text, outline: "none", fontFamily: T.font }}
                    onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; e.currentTarget.style.borderColor = data.nik?.length > 0 && data.nik?.length < 16 ? T.danger : T.accent; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = data.nik?.length > 0 && data.nik?.length < 16 ? T.danger : T.border; }}
                  />
                  <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 600, color: data.nik?.length === 16 ? T.success : T.faint, pointerEvents: "none" }}>{data.nik?.length || 0}/16</span>
                </div>
                {data.nik?.length > 0 && <p style={{ fontSize: 11, marginTop: 5, color: data.nik?.length === 16 ? T.success : T.danger, fontWeight: 500 }}>{data.nik?.length === 16 ? "✓ NIK valid" : "Harus tepat 16 digit angka"}</p>}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <FormInput label="Nama lengkap" value={data.full_name} onChange={(v) => setField("full_name", v)} placeholder="Contoh: Budi Santoso" required />
              </div>
              <FormInput label="Tanggal lahir" type="date" value={data.birth_date ?? ""} onChange={(v) => setField("birth_date", v || null)} />
              <FormSelect label="Jenis kelamin" value={data.gender} onChange={(v) => setField("gender", v)} options={["Laki-laki", "Perempuan"]} required />
              <FormInput label="Pendidikan terakhir" value={data.pendidikan_terakhir ?? ""} onChange={(v) => setField("pendidikan_terakhir", v || null)} placeholder="Contoh: S1 Akuntansi" />
              <FormInput label="Status keluarga" value={data.status_keluarga ?? ""} onChange={(v) => setField("status_keluarga", v || null)} placeholder="Lajang / Menikah" />
            </div>
          )}

          {/* ── Tab: Kepegawaian ── */}
          {activeTab === "kepegawaian" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
              <FormInput label="Jabatan" value={data.position_name} onChange={(v) => setField("position_name", v)} placeholder="Contoh: Staff Pelayanan" required />
              <FormSelect label="Cabang" value={data.branch_name ?? ""} onChange={(v) => setField("branch_name", v)} options={branchOptions} required />
              <FormSelect label="Grade" value={String(data.grade ?? "")} onChange={(v) => setField("grade", v)} options={gradeOptions} required />
              <FormSelect label="Golongan" value={data.golongan ?? ""} onChange={(v) => setField("golongan", v || null)} options={["I","II","III","IV","V"]} />
              <FormInput label="TMT penempatan" type="date" value={data.tmt_penempatan ?? ""} onChange={(v) => setField("tmt_penempatan", v || null)} />
              <FormInput label="TMT golongan" type="date" value={data.tmt_golongan ?? ""} onChange={(v) => setField("tmt_golongan", v || null)} />
              <FormInput label="TMT grade" type="date" value={data.tmt_grade ?? ""} onChange={(v) => setField("tmt_grade", v || null)} />
            </div>
          )}

          {/* ── Tab: KPI & Leadership ── */}
          {activeTab === "kpi" && (
            <TabKpiLeadership
              tmtPenempatan={data.tmt_penempatan}
              kpiData={kpiData}
              setKpiData={setKpiData}
              leadershipPrograms={leadershipPrograms}
              leadershipData={leadershipData}
              setLeadershipData={setLeadershipData}
              loadingKpi={loadingKpi}
            />
          )}

          {/* ── Tab: Karir & Lainnya ── */}
          {activeTab === "karir" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
              <FormInput label="Rencana karir kantor 1" value={data.career_office_1 ?? ""} onChange={(v) => setField("career_office_1", v || null)} placeholder="Contoh: Cabang Tegal" />
              <FormInput label="Rencana karir kantor 2" value={data.career_office_2 ?? ""} onChange={(v) => setField("career_office_2", v || null)} placeholder="Contoh: Cabang Semarang" />
              <FormInput label="Rencana karir bidang 1" value={data.career_field_1 ?? ""} onChange={(v) => setField("career_field_1", v || null)} placeholder="Contoh: Staff Pelayanan" />
              <FormInput label="Rencana karir bidang 2" value={data.career_field_2 ?? ""} onChange={(v) => setField("career_field_2", v || null)} placeholder="Contoh: Staff Kepesertaan" />
              <FormInput label="Minat bakat" value={data.minat_bakat ?? ""} onChange={(v) => setField("minat_bakat", v || null)} placeholder="Contoh: Public Speaking" />
              <div style={{ gridColumn: "1 / -1" }}>
                <FormInput label="Catatan" value={data.catatan ?? ""} onChange={(v) => setField("catatan", v || null)} placeholder="Masukkan catatan tambahan..." />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 28px 20px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", gap: 5 }}>
            {tabs.map((tab) => (
              <div key={tab.id} style={{ width: 6, height: 6, borderRadius: "50%", background: activeTab === tab.id ? T.text : T.border, transition: "background 0.2s" }} />
            ))}
          </div>
          <button onClick={onClose} style={{ padding: "0 16px", height: 38, borderRadius: 10, border: `1px solid ${T.border}`, background: "none", cursor: "pointer", fontSize: 13, color: T.muted, fontFamily: T.font }}>Batal</button>
          <button onClick={() => onSubmit(kpiData, leadershipData)} disabled={loading}
            style={{ padding: "0 20px", height: 38, borderRadius: 10, border: "none", background: loading ? "#D4D4D8" : T.text, color: "#fff", cursor: loading ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: T.font, display: "flex", alignItems: "center", gap: 7 }}>
            {loading ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah karyawan"}
          </button>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// ─── Dialog & State Komponen lainnya (tidak berubah) ─────────────────────────
function DeleteDialog({ employee, onConfirm, onCancel, loading }: { employee: Employee; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, borderRadius: 16, background: T.surface, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: T.dangerLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><AlertTriangle size={18} color={T.danger} /></div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 6px" }}>Hapus Karyawan</h3>
            <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.6 }}>Apakah Anda yakin ingin menghapus <strong>{employee.full_name}</strong> (NPK {employee.npk})?</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "9px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: "none", cursor: "pointer", fontSize: 13, color: T.muted, fontFamily: T.font }}>Batal</button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: loading ? "#fca5a5" : T.danger, color: "#fff", cursor: loading ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: T.font }}>{loading ? "Menghapus..." : "Ya, Hapus"}</button>
        </div>
      </div>
    </div>
  );
}
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 12, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: 0 }}>Tidak ada data karyawan</p>
      <p style={{ fontSize: 13, color: T.faint, margin: 0 }}>Coba ubah pencarian atau tambahkan karyawan baru.</p>
      <button onClick={onAdd} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", border: "none", borderRadius: 10, background: T.text, cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 500, fontFamily: T.font }}><Plus size={15} /> Tambah Karyawan</button>
    </div>
  );
}
function TableSkeleton() {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
      {[...Array(6)].map((_, index) => (
        <div key={index} style={{ display: "flex", gap: 16, padding: "16px 20px", borderBottom: index < 5 ? `1px solid ${T.border}` : "none" }}>
          {[80, 160, 120, 120, 100, 100].map((width, cellIndex) => (
            <div key={cellIndex} style={{ width, height: 14, borderRadius: 6, background: "linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s ease infinite" }} />
          ))}
        </div>
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState(ALL_BRANCH);
  const [filterGrade, setFilterGrade] = useState(ALL_GRADE);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Employee>("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<CreateEmployeePayload>(blankForm());
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const branchOptions = useMemo(() => {
    const branches = Array.from(new Set(employees.map((emp) => emp.branch_name).filter(Boolean))).sort();
    return [ALL_BRANCH, ...branches];
  }, [employees]);

  const gradeOptions = useMemo(() => {
    const set = new Set<number>();
    employees.forEach((emp) => { if (emp.grade != null) set.add(emp.grade); });
    return [ALL_GRADE, ...Array.from(set).sort((a, b) => a - b).map(String)];
  }, [employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    try { setEmployees(await getEmployees()); }
    catch (err) { showToast(err instanceof Error ? err.message : String(err), "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { void fetchEmployees(); }, []);

  const handleRefresh = async () => {
    await fetchEmployees();
    showToast("Data berhasil disegarkan", "info");
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      showToast("Menyiapkan export Excel...", "info");
      await exportKaryawanToExcel(employees, "ALL", sortKey as any, sortDir);
      showToast("Export Excel berhasil diunduh!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal mengekspor Excel.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const filtered = employees
    .filter((emp) => {
      const q = search.toLowerCase();
      const matchSearch = !q || emp.full_name.toLowerCase().includes(q) || emp.npk.toLowerCase().includes(q) || emp.nik.toLowerCase().includes(q);
      const matchBranch = filterBranch === ALL_BRANCH || emp.branch_name === filterBranch;
      const matchGrade = filterGrade === ALL_GRADE || String(emp.grade) === filterGrade;
      return matchSearch && matchBranch && matchGrade;
    })
    .sort((a, b) => {
      if (sortKey === "position_name") {
        const rankFor = (pos?: string | null) => {
          const p = (pos || "").toLowerCase().trim();
          if (p.includes("kepala cabang")) return { group: 1, key: p };
          if (p.includes("kepala bidang operasional")) return { group: 2, key: p };
          if (p.includes("kepala bidang pelayanan")) return { group: 3, key: p };
          if (p.includes("kepala bidang kepesertaan")) return { group: 4, key: p };
          return { group: 5, key: p };
        };
        const aR = rankFor(a.position_name), bR = rankFor(b.position_name);
        if (aR.group !== bR.group) return sortDir === "asc" ? aR.group - bR.group : bR.group - aR.group;
        return sortDir === "asc" ? aR.key.localeCompare(bR.key) : bR.key.localeCompare(aR.key);
      }
      if (sortKey === "grade") {
        const aNum = Number(a.grade ?? 0), bNum = Number(b.grade ?? 0);
        return sortDir === "asc" ? aNum - bNum : bNum - aNum;
      }
      const aVal = String(a[sortKey] ?? ""), bVal = String(b[sortKey] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const openAdd = () => { setEditingEmployee(null); setFormData(blankForm()); setFormOpen(true); };
  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    const { id, created_at, updated_at, ...rest } = employee;
    setFormData({ ...rest });
    setFormOpen(true);
  };

  const setField = (key: keyof CreateEmployeePayload, value: string | number | null) => {
    setFormData((prev) => {
      if (key === "grade") {
        const gradeNum = value === null || value === "" ? null : Number(value);
        return { ...(prev as object), [key]: gradeNum } as unknown as CreateEmployeePayload;
      }
      return { ...(prev as object), [key]: value } as unknown as CreateEmployeePayload;
    });
  };

  // ── Submit utama — simpan employee + KPI + Leadership sekaligus ──
  const handleFormSubmit = async (
    kpiData: Record<number, string>,
    leadershipData: Record<string, string>
  ) => {
    if (!formData.npk?.trim()) return showToast("NPK wajib diisi", "error");
    if (!/^\d{10}$/.test(formData.npk.trim())) return showToast("NPK harus tepat 10 digit angka.", "error");
    if (!formData.nik?.trim()) return showToast("NIK wajib diisi", "error");
    if (!/^\d{16}$/.test(formData.nik.trim())) return showToast("NIK harus tepat 16 digit angka.", "error");
    if (!formData.full_name?.trim()) return showToast("Nama Lengkap wajib diisi", "error");
    if (!formData.position_name?.trim()) return showToast("Jabatan wajib diisi", "error");
    if (!formData.branch_name?.trim()) return showToast("Cabang wajib diisi", "error");
    if (formData.grade == null) return showToast("Grade wajib dipilih", "error");

    setFormLoading(true);
    try {
      const { gap_grade, umur_golongan, umur_penempatan, umur_grade, umurGolongan, umurPenempatan, umurGrade, ...validPayload } = formData as any;

      let savedEmployeeId: string;

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, validPayload);
        savedEmployeeId = editingEmployee.id;
      } else {
        const created = await createEmployee(validPayload);
        // Asumsi createEmployee mengembalikan object dengan field id
        savedEmployeeId = (created as any).id;
      }

      // ── Simpan KPI ──
      const years = buildYearRange(formData.tmt_penempatan);
      const kpisToSave: EmployeeKpi[] = years
        .filter((y) => kpiData[y] !== undefined && kpiData[y] !== "")
        .map((y) => ({
          employee_id: savedEmployeeId,
          year: y,
          score: parseFloat(kpiData[y]),
        }));
      if (kpisToSave.length > 0) await upsertKpis(kpisToSave);

      // ── Simpan Leadership Programs ──
      const leadershipToSave: EmployeeLeadershipProgram[] = Object.entries(leadershipData)
        .filter(([, yearStr]) => yearStr !== "")
        .map(([programId, yearStr]) => ({
          employee_id: savedEmployeeId,
          leadership_program_id: programId,
          year: parseInt(yearStr, 10),
        }));
      await upsertLeadershipPrograms(savedEmployeeId, leadershipToSave);

      showToast(editingEmployee ? "Data karyawan berhasil diperbarui!" : "Karyawan baru berhasil ditambahkan!", "success");
      await fetchEmployees();
      setFormOpen(false);
      setEditingEmployee(null);
    } catch (err: any) {
      if (err.message?.includes("nik_must_be_16_digits") || err.code === "23514") {
        showToast("Database menolak! Pastikan NPK (10 angka) & NIK (16 angka) tepat.", "error");
      } else {
        showToast(err instanceof Error ? err.message : String(err), "error");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteEmployee(deleteTarget.id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== deleteTarget.id));
      setDeleteTarget(null);
      if (selectedEmployee?.id === deleteTarget.id) setSelectedEmployee(null);
      showToast("Data karyawan berhasil dihapus!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="page-content" style={{ fontFamily: T.font, display: "flex", minHeight: "100vh", minWidth: 0, background: T.bg, overflowX: "hidden", boxSizing: "border-box" }}>
      <Sidebar activePath="/employees" />

      {toast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: toast.type === "success" ? T.success : toast.type === "error" ? T.danger : T.accent, color: "#fff", padding: "14px 20px", borderRadius: 10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 12, animation: "slideUp 0.3s ease-out" }}>
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <AlertTriangle size={18} />}
          {toast.type === "info" && <RefreshCw size={18} />}
          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: T.font }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", marginLeft: 8, padding: 0 }}><X size={16} /></button>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 28px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0, letterSpacing: "-0.01em" }}>Data Karyawan</h1>
              <p style={{ fontSize: 12, color: T.faint, margin: "2px 0 0" }}>{filtered.length} karyawan ditemukan</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
              <button onClick={handleRefresh} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 18px", border: `1px solid ${T.border}`, borderRadius: 12, background: T.surface, cursor: "pointer", fontSize: 13, color: T.muted, fontFamily: T.font, boxSizing: "border-box" }}><RefreshCw size={16} /> Refresh</button>
              <button
                onClick={handleExportExcel}
                disabled={isExporting}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 18px", border: "none", borderRadius: 12, background: "#10B981", cursor: isExporting ? "not-allowed" : "pointer", fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: T.font, boxSizing: "border-box", opacity: isExporting ? 0.7 : 1 }}
              >
                Export Excel
              </button>
              <button onClick={openAdd} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 18px", border: "none", borderRadius: 12, background: T.text, cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 500, fontFamily: T.font, boxSizing: "border-box" }}><Plus size={16} /> Tambah Karyawan</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200, maxWidth: 720 }}>
              <Search size={14} color={T.faint} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari NPK, nama, nik..." style={{ width: "100%", height: 44, boxSizing: "border-box", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 14px 0 38px", fontSize: 13, color: T.text, outline: "none", fontFamily: T.font }} />
            </div>
            <div style={{ flex: "0 1 180px", minWidth: 150 }}><FilterSelect label="Cabang" value={filterBranch} options={branchOptions} onChange={(v) => { setFilterBranch(v); setPage(1); }} /></div>
            <div style={{ flex: "0 1 180px", minWidth: 150 }}><FilterSelect label="Grade" value={filterGrade} options={gradeOptions} onChange={(v) => { setFilterGrade(v); setPage(1); }} /></div>
            <div style={{ flex: "0 1 180px", minWidth: 150 }}>
              <FilterSelect label="Urutkan By"
                value={sortKey === "npk" ? "NPK" : sortKey === "position_name" ? "Jabatan" : sortKey === "golongan" ? "Golongan" : sortKey === "grade" ? "Grade" : "Nama"}
                options={["Nama", "NPK", "Jabatan", "Golongan", "Grade"]}
                onChange={(v) => { if (v === "NPK") setSortKey("npk"); else if (v === "Jabatan") setSortKey("position_name"); else if (v === "Golongan") setSortKey("golongan"); else if (v === "Grade") setSortKey("grade"); else setSortKey("full_name"); }}
              />
            </div>
            <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")} title={`Urutan ${sortDir === "asc" ? "Menaik" : "Menurun"}`} style={{ height: 44, width: 44, boxSizing: "border-box", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <ChevronDown size={16} color={T.muted} style={{ transform: sortDir === "desc" ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "20px 28px", minWidth: 0, boxSizing: "border-box" }}>
          {loading ? <TableSkeleton /> : paginated.length === 0 ? <EmptyState onAdd={openAdd} /> : (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
              <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: 13, minWidth: 0 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}`, background: "#FAFAFA" }}>
                    {TABLE_COLUMNS.map(({ key, label }) => (
                      <th key={key} onClick={() => handleSort(key)} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 500, color: T.muted, cursor: "pointer", userSelect: "none", whiteSpace: "normal", wordBreak: "break-word", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{label}{sortKey === key && <ChevronDown size={12} style={{ transform: sortDir === "desc" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />}</span>
                      </th>
                    ))}
                    <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 500, color: T.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((emp, index) => (
                    <tr key={emp.id} style={{ borderBottom: index < paginated.length - 1 ? `1px solid ${T.border}` : "none", transition: "background 0.1s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFAFA"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "13px 16px", color: T.faint, fontFamily: "monospace", fontSize: 12, minWidth: 0, wordBreak: "break-word" }}>{emp.npk}</td>
                      <td style={{ padding: "13px 16px", minWidth: 0, wordBreak: "break-word" }}><button onClick={() => setSelectedEmployee(emp)} style={{ background: "none", border: "none", cursor: "pointer", color: T.text, fontWeight: 500, fontSize: 13, padding: 0, fontFamily: T.font, textAlign: "left" }}>{emp.full_name}</button></td>
                      <td style={{ padding: "13px 16px", color: T.muted }}>{emp.position_name || "—"}</td>
                      <td style={{ padding: "13px 16px", color: T.muted }}>{emp.branch_name || "—"}</td>
                      <td style={{ padding: "13px 16px", color: T.muted }}>{emp.golongan || "—"}</td>
                      <td style={{ padding: "13px 16px", color: T.muted }}>{emp.grade != null ? String(emp.grade) : "—"}</td>
                      <td style={{ padding: "13px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                          <IconBtn icon={Eye} title="Detail" onClick={() => setSelectedEmployee(emp)} />
                          <IconBtn icon={Edit2} title="Edit" onClick={() => openEdit(emp)} />
                          <IconBtn icon={Trash2} title="Hapus" onClick={() => setDeleteTarget(emp)} danger />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length > 10 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
              <span style={{ fontSize: 12, color: T.faint }}>{(page - 1) * 10 + 1}–{Math.min(page * 10, filtered.length)} dari {filtered.length}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <PagBtn icon={ChevronLeft} onClick={() => setPage((c) => Math.max(1, c - 1))} disabled={page === 1} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${n === page ? T.accent : T.border}`, background: n === page ? T.accent : T.surface, color: n === page ? "#fff" : T.muted, fontSize: 13, cursor: "pointer", fontFamily: T.font }}>{n}</button>
                ))}
                <PagBtn icon={ChevronRight} onClick={() => setPage((c) => Math.min(totalPages, c + 1))} disabled={page === totalPages} />
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
      {formOpen && (
        <EmployeeFormModal
          data={formData}
          setField={setField}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          isEdit={!!editingEmployee}
          branchOptions={branchOptions.filter((b) => b !== ALL_BRANCH)}
          gradeOptions={Array.from({ length: 9 }, (_, i) => String(i + 1))}
          employeeId={editingEmployee?.id ?? null}
        />
      )}
      {deleteTarget && <DeleteDialog employee={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />}
    </div>
  );
}