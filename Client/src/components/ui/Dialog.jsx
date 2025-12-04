// ----------------------
// ALL IMPORTS MUST BE FIRST
// ----------------------
import React from "react";
import ReactDOM from "react-dom";

// ----------------------
// DIALOG COMPONENTS
// ----------------------
export function Dialog({ open, onOpenChange, children }) {
    if (!open) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => onOpenChange(false)}  // close when clicking overlay
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}  // prevent click inside from closing
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

export function DialogTrigger({ children, onClick }) {
    return React.cloneElement(children, { onClick });
}

export function DialogContent({ children, className }) {
    return <div className={className}>{children}</div>;
}

export function DialogHeader({ children, className }) {
    return <div className={`mb-4 ${className || ""}`}>{children}</div>;
}

export function DialogTitle({ children, className }) {
    return <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>;
}
