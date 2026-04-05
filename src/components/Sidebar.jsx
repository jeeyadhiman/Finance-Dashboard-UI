import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "./RoleContext.jsx";

const NAV_ITEMS = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: "transactions", label: "Transactions",
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  },
  {
    id: "insights", label: "Insights",
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  },
  {
    id: "budget", label: "Budget Planner",
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
];

const SETTINGS_ICON = <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;

const SIGNOUT_ICON = <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;

const PROFILE_ICON = <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const [mini, setMini] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { role, toggleRole } = useRole();
  const isAdmin = role === "admin";

  const navigate   = useNavigate();
  const location   = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goTo = (path) => { navigate(path); onClose(); setProfileOpen(false); };

  return (
    <aside className={`sidebar ${mini ? "mini" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

      {/* TOP LOGO */}
      <div className="sb-top">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" stroke="#0a1406">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0a1406" stroke="none"/>
            <path d="M12 6v2M12 16v2M8.5 9.5l1.5 1.5M14 14l1.5 1.5M6 12h2M16 12h2M8.5 14.5l1.5-1.5M14 10l1.5-1.5" stroke="#0a1406" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="#0a1406"/>
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-name">FinFlow</div>
          <div className="logo-sub">Smart Finance</div>
        </div>
      </div>

      {/* COLLAPSE TOGGLE */}
      <button className="toggle-btn" onClick={() => { setMini(!mini); setProfileOpen(false); }}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke="currentColor" width="14" height="14">
          <path d={mini ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}/>
        </svg>
      </button>

      {/* MENU LABEL */}
      <div className="sb-section">Menu</div>

      {/* NAV ITEMS */}
      <nav>
        {NAV_ITEMS.map((item) => {
          const path = `/${item.id}`;
          const isActive = location.pathname === path;
          return (
            <div key={item.id} className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => goTo(path)} title={item.label}>
              <div className="ni-icon">{item.icon}</div>
              <span className="ni-label">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* ROLE TOGGLE */}
      <div style={{ padding: mini ? "0 10px" : "0 14px", marginTop: "8px" }}>
        <button
          onClick={toggleRole}
          title={`Switch to ${isAdmin ? "Viewer" : "Admin"}`}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 12px", borderRadius: "10px",
            border: `1px solid ${isAdmin ? "rgba(34,197,94,0.25)" : "rgba(148,163,184,0.25)"}`,
            background: isAdmin ? "rgba(34,197,94,0.07)" : "rgba(148,163,184,0.07)",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            justifyContent: mini ? "center" : "flex-start",
          }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isAdmin ? "rgba(34,197,94,0.15)" : "rgba(148,163,184,0.15)",
            fontSize: "14px",
          }}>{isAdmin ? "🛡️" : "👁️"}</div>
          {!mini && (
            <>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: isAdmin ? "#22c55e" : "#94a3b8" }}>
                  {isAdmin ? "Admin" : "Viewer"}
                </div>
                <div style={{ fontSize: "10px", color: "#525252", marginTop: "1px" }}>
                  {isAdmin ? "Full access" : "Read only"}
                </div>
              </div>
              <div style={{
                width: "32px", height: "18px", borderRadius: "9px", flexShrink: 0,
                background: isAdmin ? "#22c55e" : "#333", position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  position: "absolute", top: "3px",
                  left: isAdmin ? "17px" : "3px",
                  width: "12px", height: "12px", borderRadius: "50%", background: "#fff",
                  transition: "left 0.2s",
                }}/>
              </div>
            </>
          )}
        </button>
      </div>

      {/* BOTTOM — profile + settings + signout */}
      <div className="sb-bottom" ref={profileRef}>

        {/* ── MINI MODE: show icon-only buttons ── */}
        {mini ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {/* Profile icon */}
            <div className="nav-item" onClick={() => goTo("/profile")} title="View Profile">
              <div className="ni-icon" style={{ stroke: "#a3a3a3" }}>{PROFILE_ICON}</div>
            </div>
            {/* Settings icon */}
            <div className="nav-item" onClick={() => goTo("/settings")} title="Settings">
              <div className="ni-icon" style={{ stroke: "#a3a3a3" }}>{SETTINGS_ICON}</div>
            </div>
            {/* Sign out icon */}
            <div className="nav-item" onClick={() => { localStorage.clear(); goTo("/"); }} title="Sign Out"
              style={{ color: "#ef4444" }}>
              <div className="ni-icon" style={{ stroke: "#ef4444" }}>{SIGNOUT_ICON}</div>
            </div>
          </div>
        ) : (
          /* ── FULL MODE: avatar + popup menu ── */
          <>
            <div className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="avatar">JD</div>
              <div className="profile-info">
                <div className="pname">Jeeya Dhiman</div>
                <div className="pemail">jeeya@gmail.com</div>
              </div>
            </div>

            {profileOpen && (
              <div className="profile-menu">
                <div className="pm-item" onClick={() => goTo("/profile")}>
                  {PROFILE_ICON}
                  <span>View Profile</span>
                </div>
                <div className="pm-divider"/>
                <div className="pm-item" onClick={() => goTo("/settings")}>
                  {SETTINGS_ICON}
                  <span>Settings</span>
                </div>
                <div className="pm-divider"/>
                <div className="pm-item danger" onClick={() => { localStorage.clear(); goTo("/"); }}>
                  {SIGNOUT_ICON}
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </aside>
  );
}