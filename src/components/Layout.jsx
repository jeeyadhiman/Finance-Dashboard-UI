import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "../App.css";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="app">

      {/* Mobile overlay */}
      <div
        className={`sb-mobile-overlay${mobileOpen ? " visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar — receives mobileOpen for class */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="main" style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>

        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <span className="mobile-topbar-logo">💹 FinFlow</span>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
            Menu
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}