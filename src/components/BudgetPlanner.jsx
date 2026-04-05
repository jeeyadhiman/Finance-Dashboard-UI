import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./Transactioncontext.jsx";
import { useBudgets } from "./BudgetContext.jsx";
import BudgetOnboarding from "./Budgetonboarding.jsx";
import "./BudgetPlanner.css";

const CATEGORY_META = {
  Food:          { emoji:"🍔", color:"#facc15" },
  Shopping:      { emoji:"🛍️", color:"#818cf8" },
  Transport:     { emoji:"🚗", color:"#22d3ee" },
  Health:        { emoji:"💊", color:"#4ade80" },
  Entertainment: { emoji:"🎬", color:"#fb923c" },
  Utilities:     { emoji:"⚡", color:"#c084fc" },
  Rent:          { emoji:"🏠", color:"#f87171" },
};

const MICROCOPY_OVER = {
  Food:"You're feeding emotions, not hunger 🫂", Shopping:"Retail therapy is real, but costly 💸",
  Transport:"Are you flying business class? ✈️",  Health:"Investing in yourself is fine — just track it 🌿",
  Entertainment:"Too much fun? Balance is key 🎭", Utilities:"Lights on 24/7? Check those bills 💡",
  Rent:"Home is expensive, but necessary 🏡",
};
const MICROCOPY_OK = {
  Food:"Eating smart, spending smarter 🥗",  Shopping:"Controlled the urge — legend 🏆",
  Transport:"Commuting like a budget ninja 🥷", Health:"Healthy body, healthy wallet 💪",
  Entertainment:"Fun on a budget — respect 🎉", Utilities:"Energy efficient and wallet wise ⚡",
  Rent:"Home sweet (affordable) home 🏠",
};

function generateHeatmapData() {
  const today = new Date("2026-04-04");
  const days  = [];
  for (let d = 1; d <= 30; d++) {
    const date   = new Date(2026, 3, d);
    const isPast = date <= today;
    days.push({ day: d, amt: isPast ? Math.floor(Math.random()*4500)+100 : null });
  }
  return { days, firstDow: new Date(2026,3,1).getDay() };
}
const HEATMAP = generateHeatmapData();

function heatColor(amt) {
  if (amt===null) return "var(--bg3)";
  if (amt<500)   return "#14532d";
  if (amt<1500)  return "#16a34a";
  if (amt<3000)  return "#facc15";
  return "#ef4444";
}

const ACHIEVEMENTS = [
  { id:"streak5",   icon:"🔥", title:"5-Day Streak",    desc:"No overspending for 5 days",   unlocked:true  },
  { id:"save10k",   icon:"💰", title:"₹10K Saved",      desc:"Saved ₹10,000 this month",     unlocked:true  },
  { id:"budgetpro", icon:"🏆", title:"Budget Pro",      desc:"5 categories within budget",   unlocked:true  },
  { id:"nomood",    icon:"🧘", title:"No Impulse Week", desc:"Zero impulse buys for 7 days", unlocked:false },
  { id:"zeroday",   icon:"⭐", title:"Zero Spend Day",  desc:"Spent nothing for a full day", unlocked:false },
  { id:"master",    icon:"👑", title:"Budget Master",   desc:"All categories within budget", unlocked:false },
];

const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");

function BudgetRow({ cat, onEdit, animIdx, isAdmin }) {
  const diff = cat.spent - cat.budget;
  const over = diff > 0;
  const pct  = Math.min((cat.spent/cat.budget)*100, 100);

  return (
    <div className="br-row" style={{ "--accent":cat.color, animationDelay:`${animIdx*0.06}s` }}>
      <div className="br-left">
        <span className="br-emoji">{cat.emoji}</span>
        <div className="br-info">
          <span className="br-label">{cat.label}</span>
          <span className="br-micro" style={{ color:over?"#f87171":"#4ade80" }}>
            {over ? (MICROCOPY_OVER[cat.id]||"Over budget!") : (MICROCOPY_OK[cat.id]||"Within budget ✓")}
          </span>
        </div>
      </div>
      <div className="br-center">
        <div className="br-bar-track">
          <div className="br-bar-fill" style={{ width:`${pct}%`, background:over?"#ef4444":cat.color }}/>
        </div>
        <div className="br-amounts">
          <span className="br-spent">{fmt(cat.spent)}</span>
          <span className="br-slash">/</span>
          <span className="br-budget">{fmt(cat.budget)}</span>
        </div>
      </div>
      <div className="br-right">
        <span className={`br-diff${over?" over":" under"}`}>{over?"+":"-"}{fmt(diff)}</span>
        <span className={`br-badge${over?" over":" ok"}`}>{over?"⚠️ Over":"✅ OK"}</span>
        {isAdmin && (
          <button className="br-edit-btn" onClick={()=>onEdit(cat)}>Edit</button>
        )}
      </div>
    </div>
  );
}

export default function BudgetPlanner({ role = "admin" }) {
  const { transactions, loadSampleData, clearAllData } = useTransactions();
  const { budgets, onboardingDone, updateOneBudget, resetBudgets } = useBudgets();
  const navigate = useNavigate();
  const isAdmin  = role === "admin";

  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  useEffect(() => {
    const t = setTimeout(()=>setVisible(true), 80);
    return ()=>clearTimeout(t);
  }, []);

  if (!onboardingDone) return <BudgetOnboarding />;

  const expenseByCategory = transactions
    .filter(t => t.type==="expense")
    .reduce((acc,t) => { acc[t.cat]=(acc[t.cat]||0)+t.amt; return acc; }, {});

  const cats = Object.keys(budgets)
    .filter(key => key !== "Income")
    .map(key => ({
      id:     key,
      label:  key,
      emoji:  CATEGORY_META[key]?.emoji || "💼",
      color:  CATEGORY_META[key]?.color || "#888",
      budget: budgets[key],
      spent:  expenseByCategory[key] || 0,
    }));

  const totalBudget = cats.reduce((s,c)=>s+c.budget, 0);
  const totalSpent  = cats.reduce((s,c)=>s+c.spent, 0);
  const overCount   = cats.filter(c=>c.spent>c.budget).length;
  const okCount     = cats.length - overCount;
  const hasTransactions = transactions.length > 0;

  const openEdit = (cat) => { setEditing(cat); setEditVal(cat.budget); };
  const saveEdit = () => {
    if (!editVal||isNaN(editVal)||Number(editVal)<=0) return;
    updateOneBudget(editing.id, editVal);
    setEditing(null);
  };

  return (
    <div className={`budget${visible?" bp-visible":""}`}>

      {/* Edit Modal — admin only */}
      {editing && isAdmin && (
        <div className="bp-overlay" onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
          <div className="bp-modal">
            <div className="bp-modal-title">Edit Budget — {editing.emoji} {editing.label}</div>
            <label className="bp-flbl">Monthly Budget (₹)</label>
            <input
              className="bp-finput" type="number" autoFocus
              value={editVal} onChange={e=>setEditVal(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&saveEdit()}
            />
            <div className="bp-mactions">
              <button className="bp-mcancel" onClick={()=>setEditing(null)}>Cancel</button>
              <button className="bp-msave" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bp-header bp-fade" style={{ "--d":"0s" }}>
        <div>
          <p className="bp-welcome">Welcome back 👋</p>
          <h1 className="bp-h1">Budget Planner</h1>
          <p className="bp-sub">Track, control, and crush your monthly targets</p>
        </div>
        <div className="bp-header-right">
          {overCount === 0 && hasTransactions && (
            <div className="bp-streak-pill">🔥 All categories on track!</div>
          )}

          {/* Viewer badge */}
          {!isAdmin && (
            <div style={{
              padding:"6px 14px", borderRadius:"20px",
              background:"rgba(148,163,184,0.08)", border:"1px solid rgba(148,163,184,0.2)",
              fontSize:"11.5px", fontWeight:600, color:"#94a3b8",
            }}>👁️ Viewer Mode — Read Only</div>
          )}

          {isAdmin && (
            <button onClick={resetBudgets} style={{
              padding:"6px 14px", borderRadius:"8px",
              border:"1px solid rgba(34,197,94,0.25)", background:"rgba(34,197,94,0.06)",
              color:"#22c55e", fontFamily:"inherit", fontSize:"11.5px", fontWeight:600, cursor:"pointer",
            }}>⚙️ Reset Budgets</button>
          )}

          {isAdmin && (
            hasTransactions ? (
              <button onClick={clearAllData} style={{
                padding:"6px 14px", borderRadius:"8px", border:"1px solid rgba(239,68,68,0.3)",
                background:"rgba(239,68,68,0.08)", color:"#f87171",
                fontFamily:"inherit", fontSize:"11.5px", fontWeight:600, cursor:"pointer",
              }}>🗑 Clear Data</button>
            ) : (
              <button onClick={loadSampleData} style={{
                padding:"6px 14px", borderRadius:"8px", border:"1px solid rgba(34,197,94,0.3)",
                background:"rgba(34,197,94,0.08)", color:"#22c55e",
                fontFamily:"inherit", fontSize:"11.5px", fontWeight:600, cursor:"pointer",
              }}>✨ Load Sample Data</button>
            )
          )}

          <div className="bp-status-pill"><div className="bp-dot"/>April 2026</div>
        </div>
      </div>

      {/* No transactions banner — admin only */}
      {!hasTransactions && isAdmin && (
        <div style={{
          background:"rgba(34,197,94,0.05)", border:"1px solid rgba(34,197,94,0.15)",
          borderRadius:"12px", padding:"14px 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px",
        }}>
          <div>
            <div style={{ fontSize:"13px", fontWeight:600, color:"#e5e5e5", marginBottom:"2px" }}>
              Budgets are set! Now add transactions to track spending.
            </div>
            <div style={{ fontSize:"12px", color:"#525252" }}>
              Your budget limits are ready — bars will fill up as you add expenses.
            </div>
          </div>
          <button onClick={()=>navigate("/transactions")} style={{
            padding:"8px 18px", borderRadius:"8px", border:"none",
            background:"#22c55e", color:"#050505",
            fontFamily:"inherit", fontSize:"12.5px", fontWeight:700, cursor:"pointer",
            whiteSpace:"nowrap", flexShrink:0,
          }}>+ Add Transaction</button>
        </div>
      )}

      {/* Summary Strip */}
      <div className="bp-summary bp-fade" style={{ "--d":"0.08s" }}>
        <div className="bp-sum-item">
          <span className="bp-sum-label">Total Budget</span>
          <span className="bp-sum-val neutral">{fmt(totalBudget)}</span>
        </div>
        <div className="bp-sum-div"/>
        <div className="bp-sum-item">
          <span className="bp-sum-label">Total Spent</span>
          <span className="bp-sum-val" style={{ color:totalSpent>totalBudget?"#f87171":"#4ade80" }}>{fmt(totalSpent)}</span>
        </div>
        <div className="bp-sum-div"/>
        <div className="bp-sum-item">
          <span className="bp-sum-label">Remaining</span>
          <span className="bp-sum-val" style={{ color:totalBudget-totalSpent>=0?"#4ade80":"#f87171" }}>
            {totalBudget-totalSpent>=0?"":"-"}{fmt(totalBudget-totalSpent)}
          </span>
        </div>
        <div className="bp-sum-div"/>
        <div className="bp-sum-item">
          <span className="bp-sum-label">Categories OK</span>
          <span className="bp-sum-val" style={{ color:"#4ade80" }}>{okCount} / {cats.length}</span>
        </div>
        <div className="bp-sum-div"/>
        <div className="bp-sum-item">
          <span className="bp-sum-label">Over Budget</span>
          <span className="bp-sum-val" style={{ color:overCount>0?"#f87171":"#4ade80" }}>
            {overCount} categor{overCount===1?"y":"ies"}
          </span>
        </div>
      </div>

      {/* Budget vs Actual */}
      <div className="bp-card bp-fade" style={{ "--d":"0.14s" }}>
        <div className="bp-card-header">
          <div>
            <div className="bp-card-title">Budget vs Actual</div>
            <div className="bp-card-sub">
              {isAdmin
                ? "Set your targets, track your reality — click Edit on any row to change a limit"
                : "Viewing budget limits — switch to Admin to make changes"}
            </div>
          </div>
        </div>
        <div className="bp-rows">
          {cats.map((cat,i) => (
            <BudgetRow key={cat.id} cat={cat} onEdit={openEdit} animIdx={i} isAdmin={isAdmin} />
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bp-bottom-grid bp-fade" style={{ "--d":"0.22s" }}>

        {/* Heatmap */}
        <div className="bp-card">
          <div className="bp-card-header">
            <div>
              <div className="bp-card-title">Monthly Spending Heatmap</div>
              <div className="bp-card-sub">Daily intensity — April 2026</div>
            </div>
            <div className="bp-heatmap-legend">
              {["#14532d","#16a34a","#facc15","#ef4444"].map(c=><span key={c} style={{ background:c }}/>)}
              <span className="bp-legend-label">Low → High</span>
            </div>
          </div>
          <div className="bp-heatmap">
            <div className="bp-heatmap-dow">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><span key={d}>{d}</span>)}
            </div>
            <div className="bp-heatmap-grid">
              {Array.from({length:HEATMAP.firstDow}).map((_,i)=>(
                <div key={`off-${i}`} className="bp-hm-cell empty"/>
              ))}
              {HEATMAP.days.map(({day,amt})=>(
                <div key={day} className={`bp-hm-cell${amt===null?" future":""}`}
                  style={{ background:heatColor(amt) }}
                  onMouseEnter={e=>{ if(amt===null)return; const r=e.currentTarget.getBoundingClientRect(); setTooltip({day,amt,x:r.left+r.width/2,y:r.top-8}); }}
                  onMouseLeave={()=>setTooltip(null)}
                >
                  <span className="bp-hm-day">{day}</span>
                </div>
              ))}
            </div>
          </div>
          {tooltip&&(
            <div className="bp-hm-tooltip" style={{ left:tooltip.x, top:tooltip.y }}>
              Apr {tooltip.day} — {fmt(tooltip.amt)}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bp-card">
          <div className="bp-card-header">
            <div>
              <div className="bp-card-title">Achievements</div>
              <div className="bp-card-sub">{ACHIEVEMENTS.filter(a=>a.unlocked).length} of {ACHIEVEMENTS.length} unlocked</div>
            </div>
          </div>
          <div className="bp-achievements">
            {ACHIEVEMENTS.map((ach,i)=>(
              <div key={ach.id} className={`bp-ach-card${ach.unlocked?" unlocked":" locked"}`}
                style={{ animationDelay:`${0.28+i*0.07}s` }}>
                <div className="bp-ach-icon">{ach.icon}</div>
                <div className="bp-ach-info">
                  <div className="bp-ach-title">{ach.title}</div>
                  <div className="bp-ach-desc">{ach.desc}</div>
                </div>
                {ach.unlocked ? <div className="bp-ach-check">✓</div> : <div className="bp-ach-lock">🔒</div>}
              </div>
            ))}
          </div>
          <div className="bp-xp-wrap">
            <div className="bp-xp-label">
              <span>Level 3 — Budget Warrior</span>
              <span>720 / 1000 XP</span>
            </div>
            <div className="bp-xp-track">
              <div className="bp-xp-fill" style={{ width:"72%" }}/>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}