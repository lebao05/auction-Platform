"use client";

import { useState, useRef, useEffect, createContext, useContext } from "react";
// Context to share open state
const DropdownContext = createContext();

// DropdownMenu: wrapper for the whole dropdown
export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

// DropdownMenuTrigger: clickable element that opens/closes menu
export function DropdownMenuTrigger({ children }) {
  const { toggle } = useContext(DropdownContext);
  return (
    <div onClick={toggle} className="cursor-pointer inline-block">
      {children}
    </div>
  );
}

// DropdownMenuContent: the dropdown panel itself
export function DropdownMenuContent({
  children,
  align = "left",
  className = "",
}) {
  const { isOpen } = useContext(DropdownContext);
  const contentRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        const { setIsOpen } = contentRef.current.dataset;
        if (setIsOpen) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const alignment = align === "end" ? "right-0" : "left-0";

  return (
    <div
      ref={contentRef}
      className={`absolute mt-1 w-48 bg-white border rounded-md shadow-lg z-10 ${alignment} ${className}`}
    >
      {children}
    </div>
  );
}

// DropdownMenuItem: individual item
export function DropdownMenuItem({ children, onClick, className = "" }) {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    setIsOpen(false); // close dropdown after click
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}
