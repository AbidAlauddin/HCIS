import { useEffect, useState } from "react";
import { exportKaryawanToExcel } from "../utils/exportExcel";
import {
  Users,
  Download,
  DatabaseBackup,
  Upload,
  RefreshCw,
  ChevronRight,
  MapPin,
  Clock,
  ChevronDown,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Employee, CreateEmployeePayload } from "../types/employee";
import {
  getEmployees,
  createEmployee,
  getGeneration,
} from "../services/employeeService";
import Sidebar from "../components/Sidebar";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SummaryData {
  totalKaryawan: number;
  totalLaki: number;
  totalPerempuan: number;
  lastUpdated: string;
}

type GenerationRow = { name: string; count: number };

const GEN_ORDER = ["Gen Z", "Millennial", "Gen X", "Baby Boomer", "Silent Generation"];
const GEN_COLORS: Record<string, string> = {
  "Gen Z":             "#6366f1",
  "Millennial":        "#3b82f6",
  "Gen X":             "#0ea5e9",
  "Baby Boomer":       "#a3a3a3",
  "Silent Generation": "#d4d4d4",
};

const MOCK_BRANCH = [
  { name: "Tegal", karyawan: 28 },
  { name: "Semarang", karyawan: 42 },
];

const MOCK_GRADE = [
  { name: "1", label: "Grade 1", karyawan: 18 },
  { name: "2", label: "Grade 2", karyawan: 34 },
  { name: "3", label: "Grade 3", karyawan: 41 },
  { name: "4", label: "Grade 4", karyawan: 22 },
  { name: "5", label: "Grade 5", karyawan: 10 },
];

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#475569",
  faint: "#94A3B8",
  accent: "#3B82F6",
  accentLight: "rgba(59,130,246,0.06)",
  indigo: "#6366f1",
  success: "#10B981",
  danger: "#EF4444",
  dangerLight: "rgba(239,68,68,0.08)",
  warningBg: "#FFFBEB",
  warningBorder: "#FDE68A",
  warningText: "#D97706",
  radius: "16px",
  font: "'Inter', system-ui, -apple-system, sans-serif",
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
};

// ─── Reusable Components ──────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "24px", display: "flex", flexDirection: "column", boxShadow: T.shadow, boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, fontWeight: 600, color: T.faint, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>{children}</p>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 13, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
      <p style={{ color: T.muted, marginBottom: 4, margin: "0 0 4px" }}>Grade {label}</p>
      <p style={{ color: T.text, fontWeight: 600, margin: 0 }}>{payload[0].value} Karyawan</p>
    </div>
  );
};

function GenderDonut({ laki, perempuan }: { laki: number; perempuan: number }) {
  const total = laki + perempuan;
  const data = [
    { name: "Laki-laki", value: laki, color: "#3b82f6" },
    { name: "Perempuan", value: perempuan, color: "#f472b6" },
  ];
  const lakiPct = total ? Math.round((laki / total) * 100) : 0;
  const perempuanPct = total ? 100 - lakiPct : 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, width: "100%", height: "100%" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <PieChart width={130} height={130}>
          <Pie data={data} cx={60} cy={60} innerRadius={46} outerRadius={62} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
        </PieChart>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", transform: "translateY(-5px)" }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: T.text, lineHeight: 1 }}>{total.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: 11, color: T.faint, marginTop: 4, fontWeight: 500 }}>total</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((d) => {
          const pct = d.name === "Laki-laki" ? lakiPct : perempuanPct;
          return (
            <div key={d.name} style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                  <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                  {d.value.toLocaleString("id-ID")} <span style={{ fontSize: 11, fontWeight: 400, color: T.faint }}>({pct}%)</span>
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: "#F1F5F9", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: d.color, borderRadius: 99, transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BranchCompact({ data }: { data: { name: string; karyawan: number }[] }) {
  const total = data.reduce((s, d) => s + d.karyawan, 0);
  return (
    <div style={{ display: "flex", gap: 12, width: "100%" }}>
      {data.map((d, i) => {
        const pct = total ? Math.round((d.karyawan / total) * 100) : 0;
        const colors = ["#3b82f6", "#6366f1"];
        return (
          <div key={d.name} style={{ flex: 1, background: "#F8FAFC", border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i] ?? T.accent }} />
              <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Cabang {d.name}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.03em", lineHeight: 1 }}>{d.karyawan}</p>
            <p style={{ fontSize: 11, color: T.faint, margin: "6px 0 0", fontWeight: 400 }}>{pct}% dari total kontribusi</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Action Button (Diperbarui dengan fitur visual warning) ────────────────────
function ActionButton({ icon: Icon, label, description, onClick, primary, loading, warning }: {
  icon: React.ElementType; 
  label: string; 
  description: string; 
  onClick?: () => void; 
  primary?: boolean;
  loading?: boolean;
  warning?: boolean; // Prop baru untuk indikator teguran
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex", alignItems: "center", gap: 14, padding: "16px",
        border: `1px solid ${warning ? T.danger : (primary && hovered && !loading ? T.accent : T.border)}`, borderRadius: T.radius,
        background: hovered && !loading ? (warning ? T.dangerLight : (primary ? T.accentLight : "#F8FAFC")) : T.surface,
        boxShadow: hovered && !loading ? "0 4px 6px -1px rgba(0,0,0,0.02)" : "none",
        cursor: loading ? "wait" : "pointer", transition: "all 0.2s ease", textAlign: "left", flex: 1, minWidth: 200,
        opacity: loading ? 0.7 : 1
      }}
    >
      {/* Red dot berkedip jika mode warning aktif */}
      {warning && (
        <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: T.danger, border: "2px solid #fff", animation: "pulse 2s infinite" }} />
      )}

      <div style={{ width: 40, height: 40, borderRadius: 12, background: warning ? T.dangerLight : (primary ? T.accentLight : "#F1F5F9"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={warning ? T.danger : (primary ? T.accent : T.muted)} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: warning ? T.danger : T.text, margin: 0 }}>{loading ? "Memproses..." : label}</p>
        <p style={{ fontSize: 12, color: warning ? T.danger : T.faint, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{description}</p>
      </div>
      <ChevronRight size={16} color={warning ? T.danger : T.faint} style={{ marginLeft: "auto", flexShrink: 0 }} />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [generationData, setGenerationData] = useState<GenerationRow[]>([]);
  const [evaluationCandidates, setEvaluationCandidates] = useState<{ employee: Employee; decimal: number; label: string }[]>([]);
  const [branchData, setBranchData] = useState<{ name: string; karyawan: number }[]>([]);
  const [gradeData, setGradeData] = useState<{ name: string; label?: string; karyawan: number }[]>([]);
  const [evaluationPage, setEvaluationPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // STATS AKSI BAWAH
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportBranch, setExportBranch] = useState("Semua Cabang");
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // STATE AUTO-BACKUP
  const [hasBackedUpToday, setHasBackedUpToday] = useState(true); // Default true agar tidak berkedip merah saat load

  // STATE TOAST NOTIFICATION
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); 
  };

  // ─── FUNGSI HELPER WAKTU ─────────────────────────────────────────────────────
  function parseIntervalToDecimal(interval: string | number | null | undefined) {
    if (interval == null) return 0;
    if (typeof interval === "number") return interval;
    const s = interval.toString();
    const yearsMatch = s.match(/(\d+)\s+years?/i);
    const monsMatch = s.match(/(\d+)\s+mons?/i) || s.match(/(\d+)\s+months?/i);
    const years = yearsMatch ? Number(yearsMatch[1]) : 0;
    const mons = monsMatch ? Number(monsMatch[1]) : 0;
    return Math.round((years + mons / 12) * 100) / 100;
  }

  function formatIntervalLabel(interval: string | number | null | undefined) {
    if (interval == null) return "0 bln";
    if (typeof interval === "number") {
      const years = Math.floor(interval);
      const months = Math.round((interval - years) * 12);
      if (years === 0) return `${months} bln`;
      if (months === 0) return `${years} thn`;
      return `${years} thn ${months} bln`;
    }
    const s = interval.toString();
    const yearsMatch = s.match(/(\d+)\s+years?/i);
    const monsMatch = s.match(/(\d+)\s+mons?/i) || s.match(/(\d+)\s+months?/i);
    const years = yearsMatch ? Number(yearsMatch[1]) : 0;
    const mons = monsMatch ? Number(monsMatch[1]) : 0;
    if (years === 0 && mons === 0) return "0 bln";
    if (years === 0) return `${mons} bln`;
    if (mons === 0) return `${years} thn`;
    return `${years} thn ${mons} bln`;
  }

  // ─── FUNGSI UTAMA LOAD DATA ───────────────────────────────────────────────────
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const employees = await getEmployees();
      const totalLaki = employees.filter((e) => {
        const g = (e.gender ?? (e as any).jenis_kelamin ?? "").toString().toLowerCase();
        return g.startsWith("l") || g.startsWith("m") || g.includes("male");
      }).length;
      const totalPerempuan = employees.filter((e) => {
        const g = (e.gender ?? (e as any).jenis_kelamin ?? "").toString().toLowerCase();
        return g.startsWith("p") || g.includes("female") || g.includes("wanita");
      }).length;

      const generationCounts = employees.reduce<Record<string, number>>((acc, emp) => {
        const gen = getGeneration((emp as any).birth_date ?? (emp as any).tanggal_lahir);
        acc[gen] = (acc[gen] ?? 0) + 1;
        return acc;
      }, {});
      const generationRows = GEN_ORDER.map((name) => ({ name, count: generationCounts[name] ?? 0 })).filter(r => r.count > 0);

      const candidates = employees
        .map((emp) => {
          const raw = (emp as any).umur_penempatan ?? (emp as any).umurPenempatan ?? null;
          const decimal = parseIntervalToDecimal(raw);
          const label = formatIntervalLabel(raw);
          return { employee: emp, decimal, label };
        })
        .filter(({ decimal }) => decimal >= 3 && decimal <= 5)
        .sort((a, b) => b.decimal - a.decimal);

      const branchCounts = employees.reduce<Record<string, number>>((acc, emp) => {
        const branch = (emp as any).branch_name ?? (emp as any).cabang ?? "Unknown";
        acc[branch] = (acc[branch] ?? 0) + 1;
        return acc;
      }, {});
      const branchRows = Object.entries(branchCounts).map(([name, karyawan]) => ({ name, karyawan }));

      const gradeCounts = employees.reduce<Record<string, number>>((acc, emp) => {
        const g = (emp as any).grade ?? (emp as any).golongan ?? null;
        const key = g === null || g === undefined ? "-" : String(g);
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});
      const gradeRows = Object.entries(gradeCounts)
        .map(([name, karyawan]) => ({ name, label: `Grade ${name}`, karyawan }))
        .sort((a, b) => (Number(a.name) || 0) - (Number(b.name) || 0));

      setSummary({ totalKaryawan: employees.length, totalLaki, totalPerempuan, lastUpdated: new Date().toLocaleString("id-ID") });
      setGenerationData(generationRows);
      setEvaluationCandidates(candidates);
      setBranchData(branchRows);
      setGradeData(gradeRows);
    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
      showToast("Gagal mengambil data dari database.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    await fetchDashboardData();
    showToast("Dashboard berhasil diperbarui!", "success");
  };

  // ─── FUNGSI EXPORT EXCEL ──────────────────────────────────────────────────────
  const openExportModal = () => {
    setExportBranch("Semua Cabang"); 
    setShowExportModal(true);
  };

  const processExport = async () => {
    setIsExporting(true);
    setShowExportModal(false);
    showToast("Sedang menyiapkan file Excel...", "info"); 

    try {
      const allEmployees = await getEmployees();
      const dataToExport = exportBranch === "Semua Cabang" 
        ? allEmployees 
        : allEmployees.filter(emp => emp.branch_name === exportBranch);

      const labelCabang = exportBranch === "Semua Cabang" ? "ALL" : exportBranch;
      
      await exportKaryawanToExcel(dataToExport, labelCabang, "position_name", "asc");
      showToast(`Berhasil mengekspor data cabang ${labelCabang} ke Excel!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal mengekspor data ke Excel.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // ─── FUNGSI BACKUP JSON DI DASHBOARD ───
  const handleBackup = async (isAuto: boolean = false) => {
    setIsBackingUp(true);
    showToast(isAuto ? "Melakukan Auto Backup Harian..." : "Sedang membuat file Backup JSON...", "info");

    try {
      const allEmployees = await getEmployees();
      const backupPayload = {
        exportedAt: new Date().toISOString(),
        totalRecords: allEmployees.length,
        data: allEmployees 
      };

      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const fileNameDate = new Date().toISOString().split("T")[0]; // Format nama file tetep standar
      a.download = `Backup_Database_Karyawan_${fileNameDate}.json`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // ✅ PERBAIKAN: Gunakan format lokal Indonesia untuk pengecekan hari
      const localDateStr = new Date().toLocaleDateString("id-ID");
      localStorage.setItem("lastBackupDate", localDateStr);
      setHasBackedUpToday(true);

      showToast(isAuto ? "Auto Backup Berhasil Diunduh!" : "Berhasil mendownload Backup JSON!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal melakukan backup data.", "error");
    } finally {
      setIsBackingUp(false);
    }
  };

  // ─── STRATEGI B: AUTO-BACKUP PERTAMA KALI DIBUKA HARI INI ───
  useEffect(() => {
    // ✅ PERBAIKAN: Cek tanggal menggunakan format lokal Indonesia (contoh: "15/6/2026")
    const todayDateStr = new Date().toLocaleDateString("id-ID");
    const lastBackup = localStorage.getItem("lastBackupDate");

    if (lastBackup !== todayDateStr) {
      setHasBackedUpToday(false);
      
      const timer = setTimeout(() => {
        handleBackup(true); 
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setHasBackedUpToday(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── FUNGSI RESTORE JSON ANTI-DUPLIKAT ────────────────────────────────────────
  const handleRestore = () => {
    const input = document.createElement("input"); 
    input.type = "file"; 
    input.accept = ".json";
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; 
      if (!file) return;

      const reader = new FileReader(); 
      reader.onload = async (ev) => { 
        try { 
          const parsed = JSON.parse(ev.target?.result as string); 
          const restoreData = Array.isArray(parsed) ? parsed : parsed.data;

          if (!restoreData || !Array.isArray(restoreData)) {
            showToast("Format file JSON tidak sesuai standar.", "error");
            return;
          }

          setIsRestoring(true);
          showToast("Memproses restore data ke database...", "info");

          const existingEmployees = await getEmployees();
          const existingNpks = new Set(existingEmployees.map(emp => emp.npk));

          let successCount = 0;
          let skipCount = 0;

          for (const emp of restoreData) {
            if (!emp.npk || existingNpks.has(emp.npk)) {
              skipCount++;
              continue;
            }

            const { id, created_at, updated_at, ...payload } = emp;

            try {
              await createEmployee(payload as unknown as CreateEmployeePayload);
              successCount++;
            } catch (err) {
              console.error("Gagal menginput:", emp.full_name, err);
            }
          }

          showToast(`Restore selesai! ${successCount} masuk, ${skipCount} duplikat dilewati.`, "success");
          await fetchDashboardData();

        } catch (error) { 
          showToast("File JSON rusak atau tidak bisa dibaca.", "error"); 
          console.error(error);
        } finally {
          setIsRestoring(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const branchOptionsList = ["Semua Cabang", ...branchData.map(b => b.name).sort()];

  return (
    <div className="page-content" style={{ fontFamily: T.font, display: "flex", minHeight: "100vh", background: T.bg, overflowX: "auto" }}>
      <Sidebar activePath="/dashboard" />

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: toast.type === "success" ? T.success : toast.type === "error" ? T.danger : T.accent, color: "#fff", padding: "14px 20px", borderRadius: 10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 12, animation: "slideUp 0.3s ease-out" }}>
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <AlertTriangle size={18} />}
          {toast.type === "info" && <RefreshCw size={18} />}
          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: T.font }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", marginLeft: 8, padding: 0 }}><X size={16} /></button>
        </div>
      )}
      
      {/* ── KEYFRAMES ANIMASI ── */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
      `}</style>

      {/* ── MODAL EXPORT EXCEL ── */}
      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 360, borderRadius: 16, background: T.surface, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: 0 }}>Export Excel Karyawan</h3>
              <button onClick={() => setShowExportModal(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                <X size={18} color={T.muted} />
              </button>
            </div>
            
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.muted, marginBottom: 8 }}>
              Pilih Cabang yang akan di-export:
            </label>
            <div style={{ position: "relative", marginBottom: 24 }}>
              <select
                value={exportBranch}
                onChange={(e) => setExportBranch(e.target.value)}
                style={{
                  appearance: "none", width: "100%", height: 44, boxSizing: "border-box", background: T.bg,
                  border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 32px 0 14px", fontSize: 14,
                  color: T.text, cursor: "pointer", outline: "none", fontFamily: T.font
                }}
              >
                {branchOptionsList.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown size={14} color={T.faint} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowExportModal(false)} style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: "none", cursor: "pointer", fontSize: 13, color: T.muted, fontFamily: T.font }}>Batal</button>
              <button onClick={processExport} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#10B981", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: T.font, display: "flex", alignItems: "center", gap: 8 }}>
                <Download size={14} /> Export File
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: T.faint, margin: "4px 0 0", fontWeight: 500 }}>HCIS Core System</p>
          </div>
          {summary && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F1F5F9", padding: "6px 12px", borderRadius: 20 }}>
              <button onClick={handleRefresh} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }} title="Segarkan Data">
                <RefreshCw size={14} color={T.muted} />
              </button>
              <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Diperbarui: {summary.lastUpdated}</span>
            </div>
          )}
        </header>

        {/* Content Main Container */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* STRATEGI C: BANNER PERINGATAN BACKUP JIKA BELUM BACKUP */}
          {!hasBackedUpToday && !loading && (
            <div style={{ background: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <AlertTriangle size={18} color={T.warningText} />
              <span style={{ fontSize: 13, color: T.warningText, fontWeight: 500 }}>
                Perhatian: Anda belum melakukan backup database hari ini. Sistem sedang mencoba melakukan auto-backup, atau Anda dapat menekan tombol Backup Data secara manual.
              </span>
            </div>
          )}

          {loading ? <LoadingState /> : (
            <>
              {/* Row 1: Hero Total Karyawan + Gender Donut */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "stretch" }}>
                <div style={{
                  background: T.text, borderRadius: T.radius, padding: "28px 24px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", boxSizing: "border-box", boxShadow: T.shadow
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Karyawan</span>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={16} color="#fff" />
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <p style={{ fontSize: 56, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {summary!.totalKaryawan.toLocaleString("id-ID")}
                    </p>
                    <p style={{ fontSize: 13, color: "#94A3B8", margin: "10px 0 0", fontWeight: 500 }}>karyawan aktif terdaftar</p>
                  </div>
                </div>

                <Card style={{ height: "100%", justifyContent: "center" }}>
                  <SectionLabel>Komposisi Jenis Kelamin</SectionLabel>
                  <GenderDonut laki={summary!.totalLaki} perempuan={summary!.totalPerempuan} />
                </Card>
              </div>

              {/* Row 2: Evaluasi Cabang + Grade Chart */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, alignItems: "stretch" }}>
                <Card style={{ height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                    <SectionLabel>Evaluasi Cabang</SectionLabel>
                    {/* Badge total kandidat diubah menjadi merah tegas */}
                    <span style={{ fontSize: 11, background: "rgba(220, 38, 38, 0.1)", color: "#DC2626", padding: "4px 10px", borderRadius: 99, fontWeight: 600 }}>
                      {evaluationCandidates.length} Kandidat
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: T.faint, margin: "0 0 16px", lineHeight: 1.5, fontWeight: 400 }}>
                    Daftar penempatan karyawan masa kerja 3–5 tahun di cabang saat ini.
                  </p>
                  
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    {evaluationCandidates.length === 0 ? (
                      <p style={{ fontSize: 13, color: T.muted }}>Tidak ada kandidat evaluasi saat ini.</p>
                    ) : (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {evaluationCandidates
                            .slice((evaluationPage - 1) * 5, evaluationPage * 5)
                            .map(({ employee, label, decimal }) => {
                              const emp = employee as any;
                              
                              // ─── LOGIKA WARNA UMUR PENEMPATAN BARU ───
                              let badgeColor = T.accent; // Default Biru (< 4 Tahun)
                              let badgeBg = T.accentLight;

                              if (decimal >= 4.91) { 
                                // >= 4.91 (4 Thn 11 Bln ke atas) -> MERAH TEGAS (Kritis)
                                badgeColor = "#DC2626"; // Merah kuat
                                badgeBg = "rgba(220, 38, 38, 0.12)"; 
                              } else if (decimal >= 4.0) { 
                                // >= 4.0 (4 Thn s/d < 4 Thn 11 Bln) -> KUNING TERANG (Warning)
                                badgeColor = "#CA8A04"; // Kuning pekat (agar teks tetap mudah dibaca)
                                badgeBg = "rgba(250, 204, 21, 0.25)"; // Latar belakang kuning terang
                              }
                              // ─────────────────────────────────────────

                              return (
                                <div key={emp.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "#F8FAFC", border: `1px solid ${T.border}` }}>
                                  <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: T.text }}>{emp.full_name ?? emp.fullName ?? emp.nama}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                      <MapPin size={11} color={T.faint} />
                                      <span style={{ fontSize: 12, color: T.faint }}>{(emp.branch_name ?? emp.branch ?? "")} • {(emp.position_name ?? emp.jabatan ?? "")}</span>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: badgeBg, padding: "6px 12px", borderRadius: 99 }}>
                                    <Clock size={11} color={badgeColor} />
                                    <span style={{ fontSize: 11, color: badgeColor, fontWeight: 600 }}>{label}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: `1px dashed ${T.border}` }}>
                          <button onClick={() => setEvaluationPage((page) => Math.max(1, page - 1))} disabled={evaluationPage === 1} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.border}`, background: evaluationPage === 1 ? "#F1F5F9" : T.surface, color: evaluationPage === 1 ? T.faint : T.text, cursor: evaluationPage === 1 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }}>
                            Sebelumnya
                          </button>
                          <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>
                            Halaman {evaluationPage} dari {Math.max(1, Math.ceil(evaluationCandidates.length / 5))}
                          </span>
                          <button onClick={() => setEvaluationPage((page) => Math.min(Math.ceil(evaluationCandidates.length / 5), page + 1))} disabled={evaluationPage >= Math.ceil(evaluationCandidates.length / 5)} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.border}`, background: evaluationPage >= Math.ceil(evaluationCandidates.length / 5) ? "#F1F5F9" : T.surface, color: evaluationPage >= Math.ceil(evaluationCandidates.length / 5) ? T.faint : T.text, cursor: evaluationPage >= Math.ceil(evaluationCandidates.length / 5) ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }}>
                            Berikutnya
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Card style={{ height: "100%" }}>
                  <SectionLabel>Distribusi Grade</SectionLabel>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%", minHeight: 240, marginTop: 10 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeData.length ? gradeData : MOCK_GRADE} barSize={26} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.faint, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `G${v}`} />
                        <YAxis tick={{ fontSize: 11, fill: T.faint, fontWeight: 500 }} axisLine={false} tickLine={false} width={35} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: T.accentLight }} />
                        <Bar dataKey="karyawan" fill={T.indigo} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Row 3: Karyawan per Cabang + Sebaran Generasi */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>
                <Card style={{ height: "100%", justifyContent: "space-between" }}>
                  <SectionLabel>Karyawan per Cabang</SectionLabel>
                  <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <BranchCompact data={branchData.length ? branchData : MOCK_BRANCH} />
                  </div>
                </Card>

                <Card style={{ height: "100%", justifyContent: "center" }}>
                  <SectionLabel>Sebaran Generasi</SectionLabel>
                  <div style={{ display: "flex", alignItems: "center", gap: 32, height: "100%" }}>
                    <PieChart width={120} height={120} style={{ flexShrink: 0 }}>
                      <Pie data={generationData} cx={55} cy={55} innerRadius={36} outerRadius={54} paddingAngle={3} dataKey="count" startAngle={90} endAngle={-270} strokeWidth={0}>
                        {generationData.map((d, i) => <Cell key={i} fill={GEN_COLORS[d.name] ?? T.faint} />)}
                      </Pie>
                    </PieChart>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      {generationData.map((row) => (
                        <div key={row.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GEN_COLORS[row.name] ?? T.faint, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{row.name}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{row.count} Karyawan</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Row 4: Quick Actions */}
              <Card>
                <SectionLabel>Quick Actions System</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                  <ActionButton 
                    icon={Download} 
                    label="Export Excel" 
                    description="Unduh database data karyawan .xlsx" 
                    onClick={openExportModal} 
                    primary 
                    loading={isExporting} 
                  />
                  
                  {/* STRATEGI C: TOMBOL BACKUP MENDAPAT PROP WARNING JIKA BELUM BACKUP */}
                  <ActionButton 
                    icon={DatabaseBackup} 
                    label="Backup Data" 
                    description={hasBackedUpToday ? "Database sudah dicadangkan hari ini" : "PENTING: Segera backup data hari ini!"} 
                    onClick={() => handleBackup(false)} 
                    loading={isBackingUp}
                    warning={!hasBackedUpToday}
                  />
                  
                  <ActionButton 
                    icon={Upload} 
                    label="Restore Data" 
                    description="Pulihkan basis data dari file JSON" 
                    onClick={handleRestore} 
                    loading={isRestoring}
                  />
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Loading State Shimmer ────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {[160, 160].map((h, i) => <Shimmer key={i} height={h} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
        {[300, 300].map((h, i) => <Shimmer key={i} height={h} />)}
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

function Shimmer({ height }: { height: number }) {
  return (
    <div style={{ height, borderRadius: 16, background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s ease infinite" }} />
  );
}