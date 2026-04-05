import { useState } from "react";
import EmptyState from "./Emptystate.jsx";
import { useTransactions } from "./Transactioncontext.jsx";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

const CAT_STYLE = {
  Income:        { background:"rgba(34,197,94,0.12)",  color:"#4ade80", border:"1px solid rgba(34,197,94,0.2)" },
  Food:          { background:"rgba(234,179,8,0.12)",  color:"#facc15", border:"1px solid rgba(234,179,8,0.2)" },
  Shopping:      { background:"rgba(168,85,247,0.12)", color:"#c084fc", border:"1px solid rgba(168,85,247,0.2)" },
  Entertainment: { background:"rgba(249,115,22,0.12)", color:"#fb923c", border:"1px solid rgba(249,115,22,0.2)" },
  Health:        { background:"rgba(6,182,212,0.12)",  color:"#22d3ee", border:"1px solid rgba(6,182,212,0.2)" },
  Utilities:     { background:"rgba(139,92,246,0.12)", color:"#a78bfa", border:"1px solid rgba(139,92,246,0.2)" },
  Transport:     { background:"rgba(99,102,241,0.12)", color:"#818cf8", border:"1px solid rgba(99,102,241,0.2)" },
  Rent:          { background:"rgba(239,68,68,0.12)",  color:"#f87171", border:"1px solid rgba(239,68,68,0.2)" },
};

const TYPE_STYLE = {
  income:  { background:"rgba(34,197,94,0.1)",  color:"#4ade80", border:"1px solid rgba(34,197,94,0.18)" },
  expense: { background:"rgba(239,68,68,0.1)",  color:"#f87171", border:"1px solid rgba(239,68,68,0.18)" },
};

const CATEGORIES = ["Food","Rent","Transport","Entertainment","Health","Utilities","Shopping","Income"];
const PER_PAGE   = 9;
const fmtDate    = (d) => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const fmtAmt     = (n) => "₹" + n.toLocaleString("en-IN");
const BLANK      = { date: new Date().toISOString().split("T")[0], desc:"", cat:"Food", type:"expense", amt:"" };

/* ── Modal OUTSIDE main component — fixes input glitch ── */
function TxModal({ form, setForm, editId, onSave, onClose }) {
  return (
    <div className="tx-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tx-modal">
        <div className="tx-modal-title">{editId ? "Edit Transaction" : "Add Transaction"}</div>
        <div className="tx-fgrid">
          <div className="tx-frow">
            <label className="tx-flbl">Date</label>
            <input className="tx-finput" type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}/>
          </div>
          <div className="tx-frow">
            <label className="tx-flbl">Type</label>
            <select className="tx-finput" value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="tx-frow">
          <label className="tx-flbl">Description</label>
          <input className="tx-finput" type="text" placeholder="e.g. Grocery run"
            value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}/>
        </div>
        <div className="tx-fgrid">
          <div className="tx-frow">
            <label className="tx-flbl">Amount (₹)</label>
            <input className="tx-finput" type="number" placeholder="0" min="0"
              value={form.amt}
              onChange={e => setForm(f => ({ ...f, amt: e.target.value }))}/>
          </div>
          <div className="tx-frow">
            <label className="tx-flbl">Category</label>
            <select className="tx-finput" value={form.cat}
              onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="tx-mactions">
          <button className="tx-mcancel" onClick={onClose}>Cancel</button>
          <button className="tx-msave"   onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Transactions({ role = "admin" }) {
  const {
    transactions: data,
    addTransaction, editTransaction, deleteTransaction,
    loadSampleData, clearAllData,
  } = useTransactions();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [catF,   setCatF]   = useState("");
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [toast,  setToast]  = useState(null);

  const isAdmin = role === "admin";

  const filtered = data.filter(t => {
    if (filter === "income"  && t.type !== "income")  return false;
    if (filter === "expense" && t.type !== "expense") return false;
    if (catF   && t.cat !== catF) return false;
    if (search && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const resetPage  = () => setPage(1);

  const showToast  = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const openAdd    = () => { setForm(BLANK); setEditId(null); setModal(true); };
  const openEdit   = (t) => { setForm({ date:t.date, desc:t.desc, cat:t.cat, type:t.type, amt:t.amt }); setEditId(t.id); setModal(true); };
  const closeModal = () => setModal(false);

  const handleSave = () => {
    if (!form.desc.trim() || !form.amt || Number(form.amt) <= 0) {
      showToast("⚠ Fill all fields correctly"); return;
    }
    if (editId) {
      editTransaction(editId, form);
      showToast("✓ Transaction updated");
    } else {
      addTransaction(form);
      showToast("✓ Transaction added");
    }
    setModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    deleteTransaction(id);
    showToast("✓ Deleted");
  };

  /* ── Empty state ── */
  if (data.length === 0) return (
    <div className="transactions">
      {toast && <div className="tx-toast">{toast}</div>}
      {modal && (
        <TxModal form={form} setForm={setForm} editId={editId}
          onSave={handleSave} onClose={closeModal}/>
      )}

      <div className="tx-header">
        <div>
          <p className="tx-welcome">Welcome back 👋</p>
          <h1 className="tx-h1">Transactions</h1>
          <p className="tx-sub">Browse, filter and manage your transactions</p>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          {isAdmin && (
            <button onClick={loadSampleData} style={{
              padding:"7px 16px", borderRadius:"8px", border:"1px solid rgba(34,197,94,0.3)",
              background:"rgba(34,197,94,0.08)", color:"#22c55e",
              fontFamily:"inherit", fontSize:"12px", fontWeight:600, cursor:"pointer",
            }}>✨ Load Sample Data</button>
          )}
        </div>
      </div>

      <div className="tx-table-card" style={{ justifyContent:"center" }}>
        <EmptyState
          icon="💸" title="No transactions yet"
          desc="Start tracking your money — add your first income or expense, or load sample data to preview."
          size="lg"
        />
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", paddingBottom:"32px" }}>
          {isAdmin && (
            <button onClick={openAdd} style={{
              padding:"10px 22px", borderRadius:"8px", border:"none",
              background:"#22c55e", color:"#050505",
              fontFamily:"inherit", fontSize:"13px", fontWeight:700, cursor:"pointer",
            }}>+ Add Transaction</button>
          )}
          {isAdmin && (
            <button onClick={loadSampleData} style={{
              padding:"10px 22px", borderRadius:"8px",
              border:"1px solid rgba(34,197,94,0.3)", background:"rgba(34,197,94,0.08)",
              color:"#22c55e", fontFamily:"inherit", fontSize:"13px", fontWeight:600, cursor:"pointer",
            }}>✨ Load Sample Data</button>
          )}
        </div>
      </div>
    </div>
  );

  /* ── Normal view ── */
  return (
    <>
      {toast && <div className="tx-toast">{toast}</div>}
      {modal && (
        <TxModal form={form} setForm={setForm} editId={editId}
          onSave={handleSave} onClose={closeModal}/>
      )}

      <div className="transactions">
        <div className="tx-header">
          <div>
            <p className="tx-welcome">Welcome back 👋</p>
            <h1 className="tx-h1">Transactions</h1>
            <p className="tx-sub">Browse, filter and manage your transactions</p>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            {isAdmin && (
              <button onClick={clearAllData} style={{
                padding:"6px 14px", borderRadius:"8px", border:"1px solid rgba(239,68,68,0.3)",
                background:"rgba(239,68,68,0.08)", color:"#f87171",
                fontFamily:"inherit", fontSize:"11.5px", fontWeight:600, cursor:"pointer",
              }}>🗑 Clear Data</button>
            )}
          </div>
        </div>

        <div className="tx-controls">
          <span className="tx-ctrl-title">All Transactions</span>
          <div className="tx-search-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="tx-search-input" placeholder="Search..." value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}/>
          </div>
          <div className="tx-filters">
            {["all","income","expense"].map(f => (
              <button key={f} className={`tx-filter-btn${filter===f?" active":""}`}
                onClick={() => { setFilter(f); resetPage(); }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <select className="tx-cat-select" value={catF}
            onChange={e => { setCatF(e.target.value); resetPage(); }}>
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {isAdmin && <button className="tx-add-btn" onClick={openAdd}>+ Add</button>}
        </div>

        <div className="tx-table-card">
          <div className={`tx-thead${isAdmin ? "" : " no-act"}`}>
            <span>Date</span><span>Description</span><span>Category</span>
            <span>Type</span><span>Amount</span>{isAdmin && <span>Actions</span>}
          </div>

          <div className="tx-rows-wrap">
            {paged.length === 0 ? (
              <EmptyState
                icon="🔍" title="No results found"
                desc={search ? `No transactions match "${search}".` : "No transactions match the selected filters."}
                action={{ label:"Clear filters", onClick:() => { setSearch(""); setFilter("all"); setCatF(""); resetPage(); } }}
                size="md"
              />
            ) : paged.map(t => (
              <div key={t.id} className={`tx-row${isAdmin ? "" : " no-act"}`}>
                <span className="tx-date">{fmtDate(t.date)}</span>
                <span className="tx-desc">{t.desc}</span>
                <span><span className="tx-pill" style={CAT_STYLE[t.cat] || CAT_STYLE.Income}>{t.cat}</span></span>
                <span><span className="tx-pill" style={TYPE_STYLE[t.type] || TYPE_STYLE.expense}>{t.type}</span></span>
                <span className={`tx-amt ${t.type === "income" ? "plus" : "minus"}`}>
                  {t.type === "income" ? "+" : "-"}{fmtAmt(t.amt)}
                </span>
                {isAdmin && (
                  <span className="tx-actions">
                    <button className="tx-edit-btn" onClick={() => openEdit(t)}>Edit</button>
                    <button className="tx-del-btn"  onClick={() => handleDelete(t.id)}>Del</button>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="tx-footer">
            <span className="tx-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <div className="tx-pagination">
              <button className="tx-pg-btn" disabled={safePage===1}
                onClick={() => setPage(p => Math.max(1, p-1))}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                <button key={n} className={`tx-pg-btn${n===safePage?" active":""}`}
                  onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="tx-pg-btn" disabled={safePage===totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p+1))}>›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}