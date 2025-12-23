export function Button({ children, variant = "default", className = "", ...props }) {
  const base = "flex cursor-pointer items-center justify-center px-4 py-2 rounded-md font-semibold transition-all";
  var colors =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-blue-500 text-white hover:bg-blue-600";
  return (
    <button className={`${base} ${variant === "customize" ? "" : colors} ${className}`} {...props}>
      {children}
    </button>
  );
}
