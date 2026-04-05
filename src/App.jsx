import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Hero         from "./components/Hero";
import Dashboard    from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights     from "./components/Insights";
import BudgetPlanner from "./components/BudgetPlanner";
import Settings     from "./components/Settings";
import Profile      from "./components/Profile";
import Layout       from "./components/Layout";
import { TransactionProvider } from "./components/Transactioncontext.jsx";
import { BudgetProvider } from "./components/BudgetContext.jsx";
import { RoleProvider, useRole } from "./components/RoleContext.jsx";

/* ── 404 ── */
function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:"100%", gap:16,
      fontFamily:"'Space Grotesk', sans-serif", color:"#a3a3a3",
    }}>
      <div style={{ fontSize:56, lineHeight:1 }}>404</div>
      <div style={{ fontSize:18, fontWeight:700, color:"#e5e5e5" }}>Page not found</div>
      <div style={{ fontSize:13, color:"#525252", marginBottom:8 }}>
        This page doesn't exist or is still under construction
      </div>
      <button onClick={() => navigate("/dashboard")} style={{
        padding:"9px 22px", borderRadius:9, fontSize:13, fontWeight:700,
        cursor:"pointer", border:"none", background:"#22c55e", color:"#050505",
        fontFamily:"inherit",
      }}>← Back to Dashboard</button>
    </div>
  );
}

/* ── Coming Soon ── */
function ComingSoon({ title = "Coming Soon", icon = "🚧" }) {
  const navigate = useNavigate();
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:"100%", gap:14,
      fontFamily:"'Space Grotesk', sans-serif", color:"#a3a3a3",
    }}>
      <div style={{ fontSize:48 }}>{icon}</div>
      <div style={{ fontSize:22, fontWeight:700, color:"#e5e5e5" }}>{title}</div>
      <div style={{ fontSize:13, color:"#525252", maxWidth:320, textAlign:"center", lineHeight:1.6 }}>
        This section is under construction. Check back soon!
      </div>
      <button onClick={() => navigate("/dashboard")} style={{
        marginTop:8, padding:"9px 22px", borderRadius:9, fontSize:13, fontWeight:700,
        cursor:"pointer", border:"1px solid rgba(34,197,94,0.3)",
        background:"rgba(34,197,94,0.08)", color:"#22c55e", fontFamily:"inherit",
      }}>← Back to Dashboard</button>
    </div>
  );
}

/* ── Role-aware wrappers ── */
function TransactionsWithRole() {
  const { role } = useRole();
  return <Transactions role={role} />;
}

function BudgetPlannerWithRole() {
  const { role } = useRole();
  return <BudgetPlanner role={role} />;
}

function App() {
  return (
    <TransactionProvider>
      <BudgetProvider>
        <RoleProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/dashboard"    element={<Layout><Dashboard /></Layout>} />
              <Route path="/transactions" element={<Layout><TransactionsWithRole /></Layout>} />
              <Route path="/insights"     element={<Layout><Insights /></Layout>} />
              <Route path="/budget"       element={<Layout><BudgetPlannerWithRole /></Layout>} />
              <Route path="/settings"     element={<Layout><Settings /></Layout>} />
              <Route path="/profile"      element={<Layout><Profile /></Layout>} />
              <Route path="/portfolio"    element={<Layout><ComingSoon title="Portfolio" icon="📈" /></Layout>} />
              <Route path="*"             element={<Layout><NotFound /></Layout>} />
            </Routes>
          </Router>
        </RoleProvider>
      </BudgetProvider>
    </TransactionProvider>
  );
}

export default App;