"use client";

export default function AppButton({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
}) {
    const base =
        "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary:
            "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
        outline:
            "border border-border bg-background hover:bg-accent text-foreground focus:ring-border",
        danger:
            "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
        >
            {children}
        </button>
    );
}
