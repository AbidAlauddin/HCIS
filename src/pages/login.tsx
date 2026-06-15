import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";

const GridIcon = ({ size = 14, color = "white" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1" fill={color} />
    <rect x="8" y="1" width="5" height="5" rx="1" fill={color} opacity="0.5" />
    <rect x="1" y="8" width="5" height="5" rx="1" fill={color} opacity="0.5" />
    <rect x="8" y="8" width="5" height="5" rx="1" fill={color} />
  </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("sb-session")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      const message = (error.message ?? "Terjadi kesalahan saat login.").toLowerCase();
      if (message.includes("invalid login credentials") || message.includes("invalid password") || message.includes("invalid login")) {
        setError("Email atau password salah.");
      } else if (message.includes("user not found") || message.includes("user does not exist") || message.includes("no user")) {
        setError("Akun tidak ditemukan.");
      } else {
        setError(error.message ?? "Terjadi kesalahan saat login.");
      }
      return;
    }

    if (data?.session) {
      localStorage.setItem("sb-session", JSON.stringify(data.session));
    } else if (data?.user) {
      localStorage.setItem("sb-session", JSON.stringify(data.user));
    } else {
      localStorage.setItem("sb-session", JSON.stringify({ email }));
    }

    navigate("/dashboard");
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "#fff",
    border: "1px solid #e4e4e7",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#111",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#FAFAFA",
        display: "flex",
      }}
    >
      {/* ── Left Panel (desktop only) ── */}
      <div
        style={{
          display: "none",
          width: "420px",
          flexShrink: 0,
          background: "#111111",
          padding: "64px 56px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="left-panel"
      >
        {/* Top: logo + copy */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "64px" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GridIcon size={14} color="white" />
            </div>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em" }}>HCIS Portal</span>
          </div>

          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#60a5fa", fontWeight: 500, marginBottom: 20 }}>
            Talent Mapping System
          </p>
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Kelola talenta<br />dengan presisi.
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
            Platform terpadu untuk manajemen data karyawan, talent pool, dan laporan cabang.
          </p>
        </div>

        {/* Bottom: stats */}
        <div>
          <div style={{ height: 1, background: "#27272a", marginBottom: 28 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[{ value: "10K+", label: "Data Karyawan" }, { value: "99.9%", label: "Uptime" }].map(({ value, label }) => (
              <div key={label}>
                <p style={{ color: "#fff", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</p>
                <p style={{ color: "#71717a", fontSize: 12, marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GridIcon size={12} color="white" />
            </div>
            <span style={{ color: "#111", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em" }}>HCIS Portal</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#111", fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
              Masuk
            </h2>
            <p style={{ color: "#71717a", fontSize: 14, marginTop: 8 }}>
              Selamat datang kembali — masukkan kredensial Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Email field */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="name@company.com"
                autoComplete="email"
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
                style={inputBase}
              />
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label htmlFor="password" style={{ fontSize: 11, fontWeight: 500, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Password
                </label>
                <button type="button" style={{ fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Lupa password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
                  style={{ ...inputBase, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", padding: "12px 16px", fontSize: 13, color: "#ef4444" }}>
                {error}
              </div>
            )}

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                id="remember"
                type="checkbox"
                style={{ width: 14, height: 14, accentColor: "#3b82f6", cursor: "pointer" }}
              />
              <label htmlFor="remember" style={{ fontSize: 13, color: "#71717a", cursor: "pointer", userSelect: "none" }}>
                Ingat saya selama 30 hari
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                borderRadius: 12,
                background: loading ? "#d4d4d8" : "#111111",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                padding: "13px 16px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#27272a"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#111111"; }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.25" />
                    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Memproses...
                </>
              ) : "Masuk"}
            </button>
          </form>

          {/* Footer */}
          <p style={{ marginTop: 32, textAlign: "center", fontSize: 12, color: "#a1a1aa" }}>
            Belum punya akun?{" "}
            <span style={{ color: "#52525b", fontWeight: 500 }}>Hubungi tim HR untuk aktivasi.</span>
          </p>
        </div>
      </div>

      {/* Responsive styles injected */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (min-width: 1024px) {
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}