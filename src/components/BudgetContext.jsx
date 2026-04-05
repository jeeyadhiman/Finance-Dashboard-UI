import { createContext, useContext, useState } from "react";

const DEFAULT_BUDGETS = {
  Food: 5000, Shopping: 4000, Transport: 2000,
  Health: 3000, Entertainment: 2000, Utilities: 3000, Rent: 20000,
};

const LS_BUDGETS     = "finflow_budgets";
const LS_ONBOARDING  = "finflow_onboarding";

function loadFromLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [budgets, setBudgets]           = useState(() => loadFromLS(LS_BUDGETS, null));
  const [onboardingDone, setOnboarding] = useState(() => loadFromLS(LS_ONBOARDING, false));

  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    setOnboarding(true);
    localStorage.setItem(LS_BUDGETS, JSON.stringify(newBudgets));
    localStorage.setItem(LS_ONBOARDING, JSON.stringify(true));
  };

  const updateOneBudget = (category, amount) => {
    setBudgets(prev => {
      const updated = { ...prev, [category]: Number(amount) };
      localStorage.setItem(LS_BUDGETS, JSON.stringify(updated));
      return updated;
    });
  };

  const resetBudgets = () => {
    setBudgets(null);
    setOnboarding(false);
    localStorage.removeItem(LS_BUDGETS);
    localStorage.removeItem(LS_ONBOARDING);
  };

  return (
    <BudgetContext.Provider value={{
      budgets: budgets || DEFAULT_BUDGETS,
      onboardingDone,
      saveBudgets,
      updateOneBudget,
      resetBudgets,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudgets must be used inside <BudgetProvider>");
  return ctx;
}