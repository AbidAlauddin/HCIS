import { useState } from "react";
import { LogOut, DatabaseBackup, X, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { getEmployees } from "../services/employeeService";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const T = {
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#475569",
  faint: "#94A3B8",
  danger: "#EF4444",
  dangerLight: "rgba(239,68,68,0.08)",
  warningBg: "#FFFBEB",
  warningBorder: "#FDE68A",
  warningText: "#D97706",
  success: "#10B981", 
  accent: "#3B82F6",  
  font: "'Inter', system-ui, -apple-system, sans-serif",
};

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); 
  };

  const handleBackupBeforeLogout = async () => {
    setIsBackingUp(true);
    showToast("Sedang menyiapkan file Backup JSON...", "info");

    try {
      const allEmployees = await getEmployees();
      const backupPayload = {
        exportedAt: new Date().toISOString(),
        totalRecords: allEmployees.length,
        data: allEmployees,
      };

      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Backup_Sesi_Keluar_${new Date().toISOString().split("T")[0]}.json`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Catat juga di memori agar dashboard tidak auto-backup lagi setelah kita login
      localStorage.setItem("lastBackupDate", new Date().toLocaleDateString("id-ID"));

      showToast("Berhasil mendownload Backup JSON!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal melakukan pencadangan data.", "error");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    
    // Dihapus: localStorage.clear() -> Jangan gunakan ini agar memori backup tidak hilang
    // Benar: Hanya hapus token sesi saja
    localStorage.removeItem("sb-session");
    sessionStorage.clear();

    showToast("Berhasil keluar. Mengalihkan...", "success");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  // Agar Toast bisa selalu muncul, kita render Toast di luar blok kondisi isOpen
  return (
    <>
      {/* ── TOAST NOTIFICATION RENDERED OUTSIDE ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999999, background: toast.type === "success" ? T.success : toast.type === "error" ? T.danger : T.accent, color: "#fff", padding: "14px 20px", borderRadius: 10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 12, animation: "slideUp 0.3s ease-out" }}>
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <AlertTriangle size={18} />}
          {toast.type === "info" && <RefreshCw size={18} />}
          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: T.font }}>{toast.message}</span>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      {/* ── MODAL RENDER ── */}
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: T.font }}>
          <div style={{ width: "100%", maxWidth: 420, borderRadius: 16, background: T.surface, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "relative" }}>
            
            {!isLoggingOut && (
              <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                <X size={18} color={T.faint} />
              </button>
            )}

            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.dangerLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LogOut size={20} color={T.danger} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 4px" }}>Konfirmasi Keluar</h3>
                <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.5 }}>Apakah Anda yakin ingin mengakhiri sesi dan keluar dari aplikasi?</p>
              </div>
            </div>

            <div style={{ background: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, marginBottom: 24 }}>
              <AlertTriangle size={16} color={T.warningText} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: T.warningText, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                <strong>Pengingat Penting:</strong> Pastikan data hari ini sudah dicadangkan untuk menghindari kehilangan riwayat.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={handleBackupBeforeLogout} disabled={isBackingUp || isLoggingOut} style={{ width: "100%", height: 40, borderRadius: 10, border: `1px solid ${T.border}`, background: "#F8FAFC", color: T.text, fontSize: 13, fontWeight: 600, cursor: (isBackingUp || isLoggingOut) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <DatabaseBackup size={15} color={T.muted} />
                {isBackingUp ? "Mengunduh Berkas..." : "Amankan & Backup Data Sekarang"}
              </button>
              
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={onClose} disabled={isLoggingOut} style={{ flex: 1, height: 40, borderRadius: 10, border: `1px solid ${T.border}`, background: "none", cursor: isLoggingOut ? "not-allowed" : "pointer", fontSize: 13, color: T.muted, fontWeight: 500, opacity: isLoggingOut ? 0.5 : 1 }}>
                  Batal
                </button>
                <button onClick={handleConfirmLogout} disabled={isLoggingOut} style={{ flex: 1, height: 40, borderRadius: 10, border: "none", background: T.danger, color: "#fff", cursor: isLoggingOut ? "wait" : "pointer", fontSize: 13, fontWeight: 600, opacity: isLoggingOut ? 0.7 : 1 }}>
                  {isLoggingOut ? "Keluar..." : "Ya, Keluar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}