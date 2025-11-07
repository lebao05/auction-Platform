export function Badge({ children, variant = "default", className = "" }) {
  const base = "inline-block px-2 py-1 text-xs font-semibold rounded-full";
  const colors =
    variant === "default"
      ? "bg-blue-500 text-white"
      : "bg-gray-200 text-gray-800";

  return <span className={`${base} ${colors} ${className}`}>{children}</span>;
}
