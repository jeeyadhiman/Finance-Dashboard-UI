import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, ArcElement, Filler, Tooltip,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./Transactioncontext.jsx";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip);

const CAT_COLORS = {
  Food: "#39ff14", Shopping: "#ffd600", Transport: "#ff4d4d",
  Health: "#b388ff", Entertainment: "#fb923c", Utilities: "#00bcd4",
  Rent: "#ff6b6b", Income: "#00e5ff",
};

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0f2412", borderColor: "#152e17", borderWidth: 1,
      titleColor: "#a5d6a7", bodyColor: "#e8f5e9",
      callbacks: { label: (ctx) => " ₹" + ctx.parsed.y.toLocaleString() },
    },
  },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#5a8a5c", font: { size: 11, family: "Space Grotesk" } } },
    y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#5a8a5c", font: { size: 11, family: "Space Grotesk" }, callback: (v) => "₹" + v / 1000 + "k" } },
  },
};

const donutOptions = {
  responsive: true, maintainAspectRatio: false, cutout: "68%",
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0f2412", borderColor: "#152e17", borderWidth: 1,
      titleColor: "#a5d6a7", bodyColor: "#e8f5e9",
      callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` },
    },
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactions, loadSampleData, clearAllData } = useTransactions();
  const hasData = transactions.length > 0;

  // ── Computed stats ──
  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amt, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amt, 0);
  const totalBalance  = totalIncome - totalExpenses;

  const expByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => { acc[t.cat] = (acc[t.cat] || 0) + t.amt; return acc; }, {});

  const totalExp = Object.values(expByCategory).reduce((s, v) => s + v, 0) || 1;
  const categoryData = Object.entries(expByCategory)
    .sort((a, b) => b[1] - a[1]).slice(0, 7)
    .map(([name, amt]) => ({ name, pct: Math.round((amt / totalExp) * 1000) / 10, color: CAT_COLORS[name] || "#888" }));

  const donutData = {
    labels: categoryData.map(c => c.name),
    datasets: [{ data: categoryData.map(c => c.pct), backgroundColor: categoryData.map(c => c.color), borderColor: "#0c1f0e", borderWidth: 3, hoverOffset: 6 }],
  };

  const monthlyBalance = (() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(2026, 3 - i, 1);
      const label = d.toLocaleString("en-IN", { month: "short" });
      const bal = transactions
        .filter(t => { const td = new Date(t.date); return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear(); })
        .reduce((s, t) => t.type === "income" ? s + t.amt : s - t.amt, 0);
      months.push({ label, balance: Math.abs(bal) });
    }
    return months;
  })();

  const lineData = {
    labels: monthlyBalance.map(m => m.label),
    datasets: [{
      data: monthlyBalance.map(m => m.balance),
      borderColor: "#39ff14", backgroundColor: "rgba(57,255,20,0.08)",
      borderWidth: 2.5, pointBackgroundColor: "#39ff14", pointBorderColor: "#050d06",
      pointBorderWidth: 2, pointRadius: 5, fill: true, tension: 0.4,
    }],
  };

  const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const STATS = [
    {
      label: "Net Savings", value: fmt(totalBalance),
      change: totalBalance >= 0 ? "Positive balance" : "Negative balance",
      dir: totalBalance >= 0 ? "up" : "down", cls: "blue",
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    },
    {
      label: "Total Income", value: fmt(totalIncome),
      change: `${transactions.filter(t => t.type === "income").length} transactions`,
      dir: "up", cls: "green",
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    },
    {
      label: "Total Expenses", value: fmt(totalExpenses),
      change: `${transactions.filter(t => t.type === "expense").length} transactions`,
      dir: "down", cls: "red",
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>,
    },
  ];

  return (
    <main className="main">
      <div className="topbar">
        <div className="page-title-area">
          <div className="greeting">Welcome back 👋</div>
          <h1>Dashboard</h1>
          <div className="page-sub">Your financial overview at a glance</div>
        </div>
        <div className="topbar-right">
          {/* ── Sample Data Toggle Button — always visible in topbar ── */}
          {!hasData ? (
            <button onClick={loadSampleData} style={{
              padding: "7px 16px", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.3)",
              background: "rgba(34,197,94,0.08)", color: "#22c55e",
              fontFamily: "inherit", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              transition: "all 0.18s",
            }}
              onMouseEnter={e => e.target.style.background = "rgba(34,197,94,0.15)"}
              onMouseLeave={e => e.target.style.background = "rgba(34,197,94,0.08)"}
            >
              ✨ Load Sample Data
            </button>
          ) : (
            <button onClick={clearAllData} style={{
              padding: "7px 16px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)", color: "#f87171",
              fontFamily: "inherit", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              transition: "all 0.18s",
            }}
              onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.15)"}
              onMouseLeave={e => e.target.style.background = "rgba(239,68,68,0.08)"}
            >
              🗑 Clear Data
            </button>
          )}

          <div className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
          </div>
          <div className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
        </div>
      </div>

      <div className="content">
        {!hasData ? (
          /* ── Empty State ── */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", opacity: 0.4 }}>📊</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#a3a3a3" }}>No financial data yet</div>
            <p style={{ fontSize: "13px", color: "#525252", maxWidth: "320px", lineHeight: 1.6 }}>
              Add your first transaction to see your dashboard come alive, or load sample data to preview.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => navigate("/transactions")} style={{
                padding: "10px 22px", borderRadius: "8px", border: "none",
                background: "#22c55e", color: "#050505",
                fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              }}>
                + Add Transaction
              </button>
              <button onClick={loadSampleData} style={{
                padding: "10px 22px", borderRadius: "8px",
                border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)",
                color: "#22c55e", fontFamily: "inherit", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              }}>
                ✨ Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="stat-row">
              {STATS.map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="sc-top">
                    <span className="sc-label">{s.label}</span>
                    <div className={`sc-icon ${s.cls}`}>{s.icon}</div>
                  </div>
                  <div className="sc-value">{s.value}</div>
                  <div className="sc-footer">
                    <span className={`sc-change ${s.dir}`}>{s.dir === "up" ? "↗" : "↘"} {s.change}</span>
                    <span className="sc-change-label">from transactions</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom-row">
              <div className="chart-card">
                <div className="cc-header">
                  <div><div className="cc-title">Balance Trend</div><div className="cc-sub">Last 6 months overview</div></div>
                  <div className="live-badge"><div className="live-dot"/> Live</div>
                </div>
                <div className="chart-wrap"><Line data={lineData} options={lineOptions}/></div>
              </div>

              <div className="donut-card">
                <div className="cc-title">Spending by Category</div>
                <div className="cc-sub">Expense distribution</div>
                {categoryData.length === 0 ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flex:1, color:"#525252", fontSize:"13px" }}>
                    No expense data yet
                  </div>
                ) : (
                  <div className="donut-body">
                    <div className="donut-wrap">
                      <Doughnut data={donutData} options={donutOptions}/>
                      <div className="donut-center">
                        <div className="dc-label">Total</div>
                        <div className="dc-value">{fmt(totalExpenses)}</div>
                      </div>
                    </div>
                    <div className="legend">
                      {categoryData.slice(0, 6).map(c => (
                        <div className="legend-item" key={c.name}>
                          <div className="legend-left">
                            <div className="legend-dot" style={{ background: c.color }}/>
                            <span className="legend-name">{c.name}</span>
                          </div>
                          <span className="legend-pct">{c.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}