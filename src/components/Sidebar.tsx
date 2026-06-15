import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import LogoutModal from "./logoutModal"; // Import modal baru

const T = {
  sidebar: "#111111",
  text: "#FFFFFF",
  muted: "#71717A",
  accent: "#3B82F6",
  accentLight: "rgba(59,130,246,0.08)",
  border: "#27272a",
  radius: "14px",
  font: "'Inter', system-ui, -apple-system, sans-serif",
};

const GridIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
    <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5" />
    <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
    <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
  </svg>
);

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 9,
        background: active ? "rgba(255,255,255,0.08)" : "none",
        cursor: onClick ? "pointer" : "default",
        border: "none",
        width: "100%",
        textAlign: "left",
      }}
    >
      <Icon size={15} color={active ? "#fff" : "#71717a"} />
      <span style={{ fontSize: 13, color: active ? "#fff" : "#71717a", fontWeight: active ? 500 : 400 }}>
        {label}
      </span>
    </button>
  );
}

export default function Sidebar({ activePath }: { activePath: string }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State untuk modal logout

  const closeMobileSidebar = () => setMobileOpen(false);

  // Trigger untuk membuka modal (bukan langsung logout)
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    if (mobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #27272a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GridIcon />
          </div>
          <div>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, letterSpacing: "0.02em" }}>
              HCIS Portal
            </p>
            <p style={{ color: "#71717a", fontSize: 10, margin: 0 }}>Talent Mapping</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "20px 12px", overflowY: "auto" }}>
        <p
          style={{
            fontSize: 10,
            color: "#52525b",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Menu
        </p>
        <NavItem icon={LayoutDashboard} label="Dashboard" active={activePath === "/dashboard"} onClick={() => { navigate("/dashboard"); closeMobileSidebar(); }} />
        <NavItem icon={Users} label="Employee" active={activePath === "/employees"} onClick={() => { navigate("/employees"); closeMobileSidebar(); }} />
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid #27272a" }}>
        <button
          onClick={handleLogoutClick} // Panggil fungsi pembuka modal
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "9px 12px",
            borderRadius: 9,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#71717a",
            fontSize: 13,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1c1c1e";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#71717a";
          }}
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="sidebar-mobile-trigger"
        type="button"
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 95,
          width: 42,
          height: 42,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(17,17,17,0.88)",
          color: "#fff",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      <aside
        style={{
          width: 220,
          background: T.sidebar,
          display: "flex",
          flexDirection: "column",
          padding: "28px 0",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 2,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        className="sidebar-desktop"
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="sidebar-mobile-backdrop"
            onClick={closeMobileSidebar}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 90,
            }}
          />
          <aside
            className="sidebar-mobile-panel"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 260,
              background: T.sidebar,
              zIndex: 95,
              display: "flex",
              flexDirection: "column",
              padding: "28px 0",
              boxShadow: "12px 0 40px rgba(0,0,0,0.25)",
              transform: mobileOpen ? "translateX(0)" : "translateX(-120%)",
              transition: "transform 0.25s ease",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0 20px 18px",
                borderBottom: "1px solid #27272a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GridIcon />
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, letterSpacing: "0.02em" }}>
                    HCIS Portal
                  </p>
                  <p style={{ color: "#71717a", fontSize: 10, margin: 0 }}>Talent Mapping</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMobileSidebar}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "none",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Tutup menu"
              >
                <X size={18} color="#fff" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Render komponen LogoutModal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />

      <style>{`
        .sidebar-mobile-trigger { display: none; }
        .page-content { padding-left: 220px; padding-top: 0; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-trigger { display: flex !important; }
          .page-content { padding-left: 64px !important; padding-top: 72px !important; }
        }
      `}</style>
    </>
  );
}