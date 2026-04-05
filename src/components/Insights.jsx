import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./Transactioncontext.jsx";
import "./Insights.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const EXP_COLORS = ["#818cf8","#4ade80","#22d3ee","#c084fc","#facc15","#f87171","#fb923c","#34d399"];
const INC_COLORS = ["#4ade80","#22d3ee","#818cf8","#fb923c","#facc15"];

function makeBarOpts() {
  return {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#131313", borderColor: "#2a2a2a", borderWidth: 1,
        titleColor: "#a3a3a3", bodyColor: "#e5e5e5",
        callbacks: { label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#525252", font: { size: 11, family: "Space Grotesk" } } },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#525252", font: { size: 11, family: "Space Grotesk" }, callback: (v) => `₹${v >= 1000 ? v/1000+"k" : v}` },
      },
    },
    borderRadius: 8, borderSkipped: false,
  };
}

function StatCard({ card, index }) {
  return (
    <div className="ins-stat-card" style={{ animationDelay:`${index*0.08}s`, "--accent":card.color, "--accent-bg":card.bg }}>
      <div className="ins-sc-top">
        <span className="ins-sc-label">{card.label}</span>
        <div className="ins-sc-icon" style={{ background:card.bg, color:card.color }}>{card.icon}</div>
      </div>
      <div className="ins-sc-value">{card.value}</div>
      <div className="ins-sc-sub">{card.sub}</div>
      <div className="ins-sc-bar">
        <div className="ins-sc-bar-fill" style={{ background:card.color }} />
      </div>
    </div>
  );
}

export default function Insights() {
  const { transactions, loadSampleData, clearAllData } = useTransactions();
  const navigate  = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const hasData = transactions.length > 0;

  /* ── EMPTY STATE ── */
  if (!hasData) return (
    <div className={`insights${visible ? " ins-visible" : ""}`}>
      <div className="ins-header ins-fade" style={{ "--d":"0s" }}>
        <div>
          <p className="ins-welcome">Welcome back 👋</p>
          <h1 className="ins-h1">Insights</h1>
          <p className="ins-sub">Smart observations about your finances</p>
        </div>
        <div className="ins-status-pill">
          <div className="ins-dot"/> No data yet
        </div>
      </div>

      {/* Empty state card */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:"20px", textAlign:"center", padding:"40px 24px",
      }}>
        <div style={{ fontSize:"56px", opacity:0.4 }}>📊</div>
        <div style={{ fontSize:"18px", fontWeight:700, color:"#a3a3a3" }}>No insights yet</div>
        <p style={{ fontSize:"13px", color:"#525252", maxWidth:"320px", lineHeight:1.6 }}>
          Add transactions to unlock smart observations about your spending patterns.
        </p>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => navigate("/transactions")} style={{
            padding:"10px 22px", borderRadius:"8px", border:"none",
            background:"#22c55e", color:"#050505",
            fontFamily:"inherit", fontSize:"13px", fontWeight:700, cursor:"pointer",
          }}>+ Add Transaction</button>
          <button onClick={loadSampleData} style={{
            padding:"10px 22px", borderRadius:"8px",
            border:"1px solid rgba(34,197,94,0.3)", background:"rgba(34,197,94,0.08)",
            color:"#22c55e", fontFamily:"inherit", fontSize:"13px", fontWeight:600, cursor:"pointer",
          }}>✨ Load Sample Data</button>
        </div>
      </div>
    </div>
  );

  /* ── COMPUTED VALUES (only when data exists) ── */
  const expenses = transactions.filter(t => t.type === "expense");
  const incomes  = transactions.filter(t => t.type === "income");

  const totalIncome   = incomes.reduce((s,t) => s+t.amt, 0);
  const totalExpenses = expenses.reduce((s,t) => s+t.amt, 0);
  const netCashFlow   = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? ((netCashFlow/totalIncome)*100).toFixed(1) : "0.0";
  const avgExpense    = expenses.length > 0 ? Math.round(totalExpenses/expenses.length) : 0;
  const biggestTx     = [...transactions].sort((a,b) => b.amt-a.amt)[0];

  const expenseByCategory = expenses.reduce((acc,t) => {
    acc[t.cat] = (acc[t.cat]||0) + t.amt; return acc;
  }, {});
  const incomeBySource = incomes.reduce((acc,t) => {
    acc[t.desc] = (acc[t.desc]||0) + t.amt; return acc;
  }, {});

  const topCat     = Object.entries(expenseByCategory).sort((a,b)=>b[1]-a[1])[0] ?? ["None",0];
  const catDiversity = Object.keys(expenseByCategory).length;

  const STAT_CARDS = [
    {
      label:"Top Spending Category", value:topCat[0],
      sub:`₹${topCat[1].toLocaleString("en-IN")} total spent — your biggest cost area`,
      icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
      color:"#818cf8", bg:"rgba(129,140,248,0.1)",
    },
    {
      label:"Average Expense", value:`₹${avgExpense.toLocaleString("en-IN")}`,
      sub:`Across ${expenses.length} expense transactions`,
      icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      color:"#22d3ee", bg:"rgba(34,211,238,0.1)",
    },
    {
      label:"Savings Rate", value:`${savingsRate}%`,
      sub:Number(savingsRate)>=20 ? "Excellent! You're saving more than 20% of income" : "Try to save at least 20% of your income",
      icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8.5 3.3 1.5 4.5A4 4 0 006 19h1v2h2v-2h4v2h2v-2h1c1.1 0 2-.9 2-2v-1a3 3 0 001.5-2.5c0-.9-.3-1.6-.8-2.2"/><circle cx="9" cy="12" r="1"/><path d="M14 12h1"/></svg>,
      color:"#4ade80", bg:"rgba(74,222,128,0.1)",
    },
    {
      label:"Biggest Transaction", value:biggestTx ? `₹${biggestTx.amt.toLocaleString("en-IN")}` : "—",
      sub:biggestTx ? `"${biggestTx.desc}" — your largest single transaction` : "No transactions yet",
      icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
      color:"#fb923c", bg:"rgba(251,146,60,0.1)",
    },
    {
      label:"Expense Diversity", value:`${catDiversity} ${catDiversity===1?"category":"categories"}`,
      sub:expenses.length>0 ? `~${Math.round(expenses.length/Math.max(catDiversity,1))} transactions per category on average` : "No expenses yet",
      icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>,
      color:"#c084fc", bg:"rgba(192,132,252,0.1)",
    },
    {
      label:"Net Cash Flow", value:`${netCashFlow>=0?"+":"-"}₹${Math.abs(netCashFlow).toLocaleString("en-IN")}`,
      sub:netCashFlow>=0 ? "You're in the green — income exceeds expenses" : "You're spending more than you earn",
      icon:<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
      color:netCashFlow>=0?"#4ade80":"#f87171", bg:netCashFlow>=0?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)",
    },
  ];

  const expLabels = Object.keys(expenseByCategory);
  const expVals   = Object.values(expenseByCategory);
  const incLabels = Object.keys(incomeBySource);
  const incVals   = Object.values(incomeBySource);

  const expBarData = {
    labels: expLabels,
    datasets:[{ data:expVals, backgroundColor:EXP_COLORS.slice(0,expLabels.length), hoverBackgroundColor:EXP_COLORS.slice(0,expLabels.length).map(c=>c+"cc") }],
  };
  const incBarData = {
    labels: incLabels,
    datasets:[{ data:incVals, backgroundColor:INC_COLORS.slice(0,incLabels.length), hoverBackgroundColor:INC_COLORS.slice(0,incLabels.length).map(c=>c+"cc") }],
  };

  /* ── FULL VIEW ── */
  return (
    <div className={`insights${visible?" ins-visible":""}`}>

      <div className="ins-header ins-fade" style={{ "--d":"0s" }}>
        <div>
          <p className="ins-welcome">Welcome back 👋</p>
          <h1 className="ins-h1">Insights</h1>
          <p className="ins-sub">Smart observations about your finances</p>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          {/* Clear data button */}
          <button onClick={clearAllData} style={{
            padding:"6px 14px", borderRadius:"8px", border:"1px solid rgba(239,68,68,0.3)",
            background:"rgba(239,68,68,0.08)", color:"#f87171",
            fontFamily:"inherit", fontSize:"11.5px", fontWeight:600, cursor:"pointer",
          }}>🗑 Clear Data</button>
          <div className="ins-status-pill">
            <div className="ins-dot"/> Live data
          </div>
        </div>
      </div>

      <div className="ins-stat-grid ins-fade" style={{ "--d":"0.1s" }}>
        {STAT_CARDS.map((card,i) => <StatCard key={card.label} card={card} index={i}/>)}
      </div>

      <div className="ins-charts-row ins-fade" style={{ "--d":"0.25s" }}>
        <div className="ins-chart-card">
          <div className="ins-chart-header">
            <div>
              <div className="ins-chart-title">Expenses by Category</div>
              <div className="ins-chart-sub">Where your money goes</div>
            </div>
            <div className="ins-live-badge"><div className="ins-live-dot"/>Updated now</div>
          </div>
          {expLabels.length===0
            ? <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"220px",color:"#525252",fontSize:"13px" }}>No expense data yet</div>
            : <div className="ins-chart-wrap"><Bar data={expBarData} options={makeBarOpts()}/></div>
          }
        </div>

        <div className="ins-chart-card">
          <div className="ins-chart-header">
            <div>
              <div className="ins-chart-title">Income by Source</div>
              <div className="ins-chart-sub">Where your money comes from</div>
            </div>
            <div className="ins-live-badge"><div className="ins-live-dot"/>Updated now</div>
          </div>
          {incLabels.length===0
            ? <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"220px",color:"#525252",fontSize:"13px" }}>No income data yet</div>
            : <div className="ins-chart-wrap"><Bar data={incBarData} options={makeBarOpts()}/></div>
          }
        </div>
      </div>

      <div className="ins-summary ins-fade" style={{ "--d":"0.35s" }}>
        <div className="ins-summary-item">
          <span className="ins-sum-label">Total Income</span>
          <span className="ins-sum-value green">+₹{totalIncome.toLocaleString("en-IN")}</span>
        </div>
        <div className="ins-summary-divider"/>
        <div className="ins-summary-item">
          <span className="ins-sum-label">Total Expenses</span>
          <span className="ins-sum-value red">-₹{totalExpenses.toLocaleString("en-IN")}</span>
        </div>
        <div className="ins-summary-divider"/>
        <div className="ins-summary-item">
          <span className="ins-sum-label">Net Savings</span>
          <span className={`ins-sum-value ${netCashFlow>=0?"green":"red"}`}>
            {netCashFlow>=0?"+":"-"}₹{Math.abs(netCashFlow).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="ins-summary-divider"/>
        <div className="ins-summary-item">
          <span className="ins-sum-label">Savings Rate</span>
          <span className={`ins-sum-value ${Number(savingsRate)>=0?"green":"red"}`}>{savingsRate}%</span>
        </div>
      </div>

    </div>
  );
}