import React from "react";
import ReactDOM from "react-dom";

// Root AlertDialog component
export function AlertDialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)} // close on overlay click
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// Content wrapper
export function AlertDialogContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

// Title
export function AlertDialogTitle({ children, className }) {
  return <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>;
}

// Description
export function AlertDialogDescription({ children, className }) {
  return <p className={`text-sm text-gray-600 mt-2 ${className || ""}`}>{children}</p>;
}

// Cancel button
export function AlertDialogCancel({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 ${className || ""}`}
    >
      {children}
    </button>
  );
}

// Action/Confirm button
export function AlertDialogAction({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 ${className || ""}`}
    >
      {children}
    </button>
  );
}
