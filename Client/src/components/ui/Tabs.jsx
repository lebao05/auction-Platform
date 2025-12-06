import { createContext, useContext, useState } from "react";

// Context for Tabs
const TabsContext = createContext();

export function Tabs({ defaultValue, onValueChange, children, className }) {
  const [selected, setSelected] = useState(defaultValue || null);

  const handleChange = (val) => {
    setSelected(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ selected, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List
export function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}

// Tabs Trigger (Tab Button)
export function TabsTrigger({ value, children, className }) {
  const { selected, onChange } = useContext(TabsContext);
  const isActive = selected === value;

  return (
    <button
      onClick={() => onChange(value)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive
          ? "bg-blue-500 text-white shadow"
          : "bg-white text-gray-700 hover:bg-gray-100"
        } ${className}`}
    >
      {children}
    </button>
  );
}

// Tabs Content (Panel)
export function TabsContent({ value, children }) {
  const { selected } = useContext(TabsContext);
  return selected === value ? <div>{children}</div> : null;
}
