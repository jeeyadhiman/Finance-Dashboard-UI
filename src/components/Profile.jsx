import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

/* ── Static data ───────────────────────────────── */
const USER = {
  name: "Jeeya Dhiman",
  email: "jeeya@gmail.com",
  phone: "+91 98765 43210",
  currency: "INR",
  avatar: "JD",
  bio: "Finance enthusiast. Building wealth one rupee at a time. 🚀",
  location: "Mumbai, India",
  joinDate: "January 2025",
  level: 3,
  xp: 720,
  xpNext: 1000,
  streak: 5,
};

const STATS = [
  { label: "Total Saved",     value: "₹84,000",  icon: "💰", color: "#4ade80" },
  { label: "Transactions",    value: "18",        icon: "📋", color: "#22d3ee" },
  { label: "Budgets Set",     value: "7",         icon: "🎯", color: "#818cf8" },
  { label: "Months Active",   value: "4",         icon: "📅", color: "#fb923c" },
];

const ACHIEVEMENTS = [
  { icon: "🔥", title: "5-Day Streak",    unlocked: true  },
  { icon: "💰", title: "₹10K Saved",      unlocked: true  },
  { icon: "🏆", title: "Budget Pro",      unlocked: true  },
  { icon: "🧘", title: "No Impulse Week", unlocked: false },
  { icon: "⭐", title: "Zero Spend Day",  unlocked: false },
  { icon: "👑", title: "Budget Master",   unlocked: false },
];

const RECENT_TX = [
  { desc: "Monthly Salary",    cat: "Income",   amt: 62000, type: "income",  date: "01 Apr" },
  { desc: "Freelance Project", cat: "Income",   amt: 15000, type: "income",  date: "08 Apr" },
  { desc: "House Rent",        cat: "Rent",     amt: 18000, type: "expense", date: "02 Apr" },
  { desc: "Grocery Store",     cat: "Food",     amt: 2100,  type: "expense", date: "10 Apr" },
  { desc: "Myntra Order",      cat: "Shopping", amt: 3200,  type: "expense", date: "14 Apr" },
];

const SPENDING_BREAKDOWN = [
  { cat: "Rent",          pct: 47.2, color: "#f87171" },
  { cat: "Shopping",      pct: 14.7, color: "#818cf8" },
  { cat: "Food",          pct: 7.5,  color: "#facc15" },
  { cat: "Health",        pct: 7.1,  color: "#4ade80" },
  { cat: "Utilities",     pct: 7.0,  color: "#c084fc" },
  { cat: "Entertainment", pct: 4.6,  color: "#fb923c" },
];

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

export default function Profile() {
  const navigate    = useNavigate();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div className={`profile${visible ? " pf-visible" : ""}`}>

      {/* ── Cover + Avatar ── */}
      <div className="pf-cover pf-fade" style={{ "--d": "0s" }}>
        <div className="pf-cover-bg" />
        <div className="pf-cover-content">
          <div className="pf-avatar-wrap">
            <div className="pf-avatar">{USER.avatar}</div>
            <div className="pf-avatar-ring" />
          </div>
          <div className="pf-cover-info">
            <div className="pf-cover-name">{USER.name}</div>
            <div className="pf-cover-email">{USER.email}</div>
            <div className="pf-cover-meta">
              <span>📍 {USER.location}</span>
              <span>·</span>
              <span>🗓 Joined {USER.joinDate}</span>
              <span>·</span>
              <span>🔥 {USER.streak}-day streak</span>
            </div>
            <p className="pf-cover-bio">{USER.bio}</p>
          </div>
          <div className="pf-cover-actions">
            <button className="pf-edit-btn" onClick={() => navigate("/settings")}>
              ✏️ Edit Profile
            </button>
            <div className="pf-level-pill">
              <span>⚡ Level {USER.level}</span>
              <div className="pf-xp-mini-track">
                <div className="pf-xp-mini-fill" style={{ width: `${(USER.xp / USER.xpNext) * 100}%` }} />
              </div>
              <span className="pf-xp-text">{USER.xp}/{USER.xpNext} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="pf-stats-row pf-fade" style={{ "--d": "0.1s" }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="pf-stat-card" style={{ animationDelay: `${0.1 + i * 0.06}s`, "--c": s.color }}>
            <span className="pf-stat-icon">{s.icon}</span>
            <span className="pf-stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="pf-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="pf-tabs pf-fade" style={{ "--d": "0.18s" }}>
        {["overview","transactions","achievements"].map(t => (
          <button
            key={t}
            className={`pf-tab${activeTab === t ? " active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="pf-tab-content pf-fade" style={{ "--d": "0.24s" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="pf-overview">

            {/* Account info card */}
            <div className="pf-info-card">
              <div className="pf-info-title">Account Details</div>
              <div className="pf-info-grid">
                {[
                  { label: "Full Name",    value: USER.name },
                  { label: "Email",        value: USER.email },
                  { label: "Phone",        value: USER.phone },
                  { label: "Location",     value: USER.location },
                  { label: "Currency",     value: "Indian Rupee (₹ INR)" },
                  { label: "Member Since", value: USER.joinDate },
                ].map(row => (
                  <div key={row.label} className="pf-info-row">
                    <span className="pf-info-label">{row.label}</span>
                    <span className="pf-info-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spending breakdown */}
            <div className="pf-info-card">
              <div className="pf-info-title">Spending Breakdown</div>
              <div className="pf-spending-list">
                {SPENDING_BREAKDOWN.map(item => (
                  <div key={item.cat} className="pf-spend-row">
                    <div className="pf-spend-left">
                      <div className="pf-spend-dot" style={{ background: item.color }} />
                      <span className="pf-spend-cat">{item.cat}</span>
                    </div>
                    <div className="pf-spend-bar-wrap">
                      <div className="pf-spend-bar-track">
                        <div className="pf-spend-bar-fill"
                          style={{ width: `${item.pct}%`, background: item.color }} />
                      </div>
                    </div>
                    <span className="pf-spend-pct">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="pf-info-card">
            <div className="pf-info-title">Recent Transactions</div>
            <div className="pf-tx-list">
              <div className="pf-tx-head">
                <span>Date</span><span>Description</span><span>Category</span><span>Amount</span>
              </div>
              {RECENT_TX.map((tx, i) => (
                <div key={i} className="pf-tx-row" style={{ animationDelay: `${i * 0.06}s` }}>
                  <span className="pf-tx-date">{tx.date}</span>
                  <span className="pf-tx-desc">{tx.desc}</span>
                  <span className="pf-tx-cat">{tx.cat}</span>
                  <span className={`pf-tx-amt ${tx.type}`}>
                    {tx.type === "income" ? "+" : "-"}{fmt(tx.amt)}
                  </span>
                </div>
              ))}
            </div>
            <button className="pf-view-all-btn" onClick={() => navigate("/transactions")}>
              View all transactions →
            </button>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="pf-ach-grid-wrap">
            <div className="pf-info-card" style={{ flex: 1 }}>
              <div className="pf-info-title">Badges & Achievements</div>
              <div className="pf-ach-grid">
                {ACHIEVEMENTS.map((ach, i) => (
                  <div
                    key={ach.title}
                    className={`pf-ach-badge${ach.unlocked ? " unlocked" : " locked"}`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="pf-ach-badge-icon">{ach.icon}</div>
                    <div className="pf-ach-badge-title">{ach.title}</div>
                    {!ach.unlocked && <div className="pf-ach-badge-lock">🔒</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="pf-info-card pf-xp-card">
              <div className="pf-info-title">Progress</div>
              <div className="pf-level-display">
                <div className="pf-level-circle">
                  <span className="pf-level-num">{USER.level}</span>
                  <span className="pf-level-lbl">LEVEL</span>
                </div>
                <div className="pf-level-info">
                  <div className="pf-level-title">Budget Warrior</div>
                  <div className="pf-level-desc">{USER.xp} / {USER.xpNext} XP to Level {USER.level + 1}</div>
                  <div className="pf-xp-track">
                    <div className="pf-xp-fill" style={{ width: `${(USER.xp / USER.xpNext) * 100}%` }} />
                  </div>
                  <div className="pf-level-hint">
                    Unlock "No Impulse Week" to earn +150 XP 🎯
                  </div>
                </div>
              </div>

              <div className="pf-streak-display">
                <span className="pf-streak-fire">🔥</span>
                <div>
                  <div className="pf-streak-num">{USER.streak} days</div>
                  <div className="pf-streak-lbl">Current no-overspend streak</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}