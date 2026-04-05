/* EmptyState.jsx — drop into components/ and import anywhere */
import "./EmptyState.css";

export default function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  desc = "Data will appear here once available.",
  action = null,       // { label: string, onClick: fn }
  size = "md",         // "sm" | "md" | "lg"
}) {
  return (
    <div className={`es-wrap es-${size}`}>
      <div className="es-icon">{icon}</div>
      <div className="es-title">{title}</div>
      {desc && <p className="es-desc">{desc}</p>}
      {action && (
        <button className="es-btn" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}