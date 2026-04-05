import { createContext, useContext, useState } from "react";

const LS_ROLE = "finflow_role";

function loadRole() {
  try { return localStorage.getItem(LS_ROLE) || "admin"; }
  catch { return "admin"; }
}

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(loadRole);

  const toggleRole = () => {
    setRole(r => {
      const next = r === "admin" ? "viewer" : "admin";
      localStorage.setItem(LS_ROLE, next);
      return next;
    });
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}