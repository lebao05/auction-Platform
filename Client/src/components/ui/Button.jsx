export function Button({ children, variant = "default", className = "", ...props }) {
  const base = "flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all";
  const colors =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button className={`${base} ${colors} ${className}`} {...props}>
      {children}
    </button>
  );
}
