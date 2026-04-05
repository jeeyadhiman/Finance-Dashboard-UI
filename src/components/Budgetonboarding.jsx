import { useState } from "react";
import { useBudgets } from "./BudgetContext.jsx";
import { useRole } from "./RoleContext.jsx";
import "./Budgetonboarding.css";

const CATEGORIES = [
  { id:"Rent",          label:"Rent / Housing",  emoji:"🏠", color:"#f87171", suggested:15000, desc:"Monthly rent or EMI" },
  { id:"Food",          label:"Food",             emoji:"🍔", color:"#facc15", suggested:5000,  desc:"Groceries, dining, delivery" },
  { id:"Transport",     label:"Transport",        emoji:"🚗", color:"#22d3ee", suggested:2000,  desc:"Fuel, cab, metro" },
  { id:"Health",        label:"Health",           emoji:"💊", color:"#4ade80", suggested:3000,  desc:"Medicine, gym, doctor" },
  { id:"Entertainment", label:"Entertainment",    emoji:"🎬", color:"#fb923c", suggested:2000,  desc:"Movies, subscriptions, outings" },
  { id:"Shopping",      label:"Shopping",         emoji:"🛍️", color:"#818cf8", suggested:4000,  desc:"Clothes, gadgets, online orders" },
  { id:"Utilities",     label:"Utilities",        emoji:"⚡", color:"#c084fc", suggested:3000,  desc:"Electricity, gas, internet" },
];

export default function BudgetOnboarding() {
  const { saveBudgets } = useBudgets();
  const { role } = useRole();
  const isAdmin = role === "admin";

  const [values, setValues] = useState(() =>
    Object.fromEntries(CATEGORIES.map(c => [c.id, c.suggested]))
  );
  const [step, setStep] = useState(0);

  const total = Object.values(values).reduce((s, v) => s + (Number(v) || 0), 0);

  const handleChange = (id, val) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const handleUseSuggested = () => {
    setValues(Object.fromEntries(CATEGORIES.map(c => [c.id, c.suggested])));
  };

  // Admin: saves custom values. Viewer: saves suggested values directly.
  const handleSave = () => {
    const parsed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, Math.max(0, Number(v) || 0)])
    );
    saveBudgets(parsed);
  };

  const handleViewerContinue = () => {
    const suggested = Object.fromEntries(CATEGORIES.map(c => [c.id, c.suggested]));
    saveBudgets(suggested);
  };

  /* ── Step 0: Welcome ── */
  if (step === 0) return (
    <div className="bo-wrap">
      <div className="bo-card bo-welcome-card">
        <div className="bo-welcome-emoji">🎯</div>
        <h1 className="bo-welcome-title">Set Your Monthly Budget</h1>
        <p className="bo-welcome-desc">
          Before we start tracking, let's set spending limits for each category.
          This helps FinFlow tell you when you're overspending.
        </p>
        <div className="bo-welcome-steps">
          <div className="bo-step"><span className="bo-step-num">1</span><span>Set limits for each category</span></div>
          <div className="bo-step"><span className="bo-step-num">2</span><span>Add your transactions</span></div>
          <div className="bo-step"><span className="bo-step-num">3</span><span>Track spending vs budget live</span></div>
        </div>
        <div className="bo-welcome-actions">
          {isAdmin ? (
            <>
              <button className="bo-btn-primary" onClick={() => setStep(1)}>
                Let's Set Up My Budget →
              </button>
              <button className="bo-btn-ghost" onClick={handleSave}>
                Skip, use suggested values
              </button>
            </>
          ) : (
            <div style={{
              width: "100%",
              padding: "14px 16px", borderRadius: "10px",
              background: "rgba(148,163,184,0.08)",
              border: "1px solid rgba(148,163,184,0.2)",
              fontSize: "12.5px", color: "#94a3b8",
              textAlign: "center", lineHeight: 1.7,
            }}>
              👁️ You're in <strong style={{ color: "#cbd5e1" }}>Viewer mode</strong> — budgets can only be configured by an Admin.
              <br />
              <button className="bo-btn-primary" style={{ marginTop: "12px", width: "100%" }} onClick={handleViewerContinue}>
                Continue with suggested values →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ── Step 1: Set budgets (admin only) ── */
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      overflowY: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "24px",
      boxSizing: "border-box",
    }}>
      <div className="bo-card bo-form-card">

        <div className="bo-form-header">
          <div>
            <h2 className="bo-form-title">Monthly Budget Setup</h2>
            <p className="bo-form-sub">Set how much you want to spend in each category</p>
          </div>
          <div className="bo-total-pill">
            <span className="bo-total-label">Total Budget</span>
            <span className="bo-total-val">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <button className="bo-suggest-btn" onClick={handleUseSuggested}>
          ✨ Use suggested values
        </button>

        <div className="bo-cat-list">
          {CATEGORIES.map((cat, i) => {
            const val = values[cat.id];
            const pct = Math.min(((Number(val)||0) / 20000) * 100, 100);
            return (
              <div key={cat.id} className="bo-cat-row" style={{ animationDelay:`${i*0.05}s` }}>
                <div className="bo-cat-left">
                  <div className="bo-cat-emoji" style={{ background: cat.color + "20" }}>
                    {cat.emoji}
                  </div>
                  <div className="bo-cat-info">
                    <span className="bo-cat-label">{cat.label}</span>
                    <span className="bo-cat-desc">{cat.desc}</span>
                  </div>
                </div>
                <div className="bo-cat-right">
                  <div className="bo-input-wrap">
                    <span className="bo-rupee">₹</span>
                    <input
                      className="bo-input"
                      type="number"
                      min="0"
                      value={val}
                      onChange={e => handleChange(cat.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="bo-mini-bar-track">
                    <div className="bo-mini-bar-fill" style={{ width:`${pct}%`, background: cat.color }}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bo-form-footer">
          <div className="bo-footer-note">
            💡 You can always edit these later in Budget Planner
          </div>
          <button
            className="bo-btn-primary"
            onClick={handleSave}
            disabled={total === 0}
          >
            Save & Start Tracking →
          </button>
        </div>

      </div>
    </div>
  );
}