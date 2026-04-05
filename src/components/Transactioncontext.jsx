import { createContext, useContext, useState } from "react";

const LS_KEY = "finflow_transactions";

const SAMPLE = [
  { id:"s1",  date:"2026-04-01", desc:"Monthly Rent",        cat:"Rent",          type:"expense", amt:15000 },
  { id:"s2",  date:"2026-04-01", desc:"Salary Credit",       cat:"Income",        type:"income",  amt:55000 },
  { id:"s3",  date:"2026-04-02", desc:"Grocery Store",       cat:"Food",          type:"expense", amt:2200  },
  { id:"s4",  date:"2026-04-02", desc:"Uber Ride",           cat:"Transport",     type:"expense", amt:340   },
  { id:"s5",  date:"2026-04-03", desc:"Netflix Subscription",cat:"Entertainment", type:"expense", amt:649   },
  { id:"s6",  date:"2026-04-03", desc:"Pharmacy",            cat:"Health",        type:"expense", amt:850   },
  { id:"s7",  date:"2026-04-04", desc:"Amazon Order",        cat:"Shopping",      type:"expense", amt:3200  },
  { id:"s8",  date:"2026-04-04", desc:"Electricity Bill",    cat:"Utilities",     type:"expense", amt:1800  },
  { id:"s9",  date:"2026-04-05", desc:"Freelance Payment",   cat:"Income",        type:"income",  amt:12000 },
  { id:"s10", date:"2026-04-05", desc:"Swiggy Order",        cat:"Food",          type:"expense", amt:480   },
  { id:"s11", date:"2026-04-06", desc:"Gym Membership",      cat:"Health",        type:"expense", amt:1500  },
  { id:"s12", date:"2026-04-06", desc:"Metro Card Recharge", cat:"Transport",     type:"expense", amt:500   },
  { id:"s13", date:"2026-04-07", desc:"Clothes Shopping",    cat:"Shopping",      type:"expense", amt:2800  },
  { id:"s14", date:"2026-04-07", desc:"Restaurant Dinner",   cat:"Food",          type:"expense", amt:1200  },
  { id:"s15", date:"2026-04-08", desc:"Internet Bill",       cat:"Utilities",     type:"expense", amt:999   },
  { id:"s16", date:"2026-04-08", desc:"Movie Tickets",       cat:"Entertainment", type:"expense", amt:600   },
  { id:"s17", date:"2026-04-09", desc:"Dividend Income",     cat:"Income",        type:"income",  amt:3500  },
  { id:"s18", date:"2026-04-09", desc:"Petrol",              cat:"Transport",     type:"expense", amt:1200  },
  { id:"s19", date:"2026-04-10", desc:"Doctor Visit",        cat:"Health",        type:"expense", amt:700   },
  { id:"s20", date:"2026-04-10", desc:"Zomato Delivery",     cat:"Food",          type:"expense", amt:380   },
];

function loadFromLS() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

function saveToLS(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

let _id = Date.now();
const uid = () => `t${++_id}`;

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(loadFromLS);

  const setAndSave = (updater) => {
    setTransactions(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToLS(next);
      return next;
    });
  };

  const addTransaction = (form) => {
    const t = { ...form, id: uid(), amt: Number(form.amt) };
    setAndSave(prev => [t, ...prev]);
  };

  const editTransaction = (id, form) => {
    setAndSave(prev => prev.map(t => t.id === id ? { ...t, ...form, amt: Number(form.amt) } : t));
  };

  const deleteTransaction = (id) => {
    setAndSave(prev => prev.filter(t => t.id !== id));
  };

  const loadSampleData = () => {
    setAndSave(SAMPLE);
  };

  const clearAllData = () => {
    setAndSave([]);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      loadSampleData,
      clearAllData,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be inside <TransactionProvider>");
  return ctx;
}