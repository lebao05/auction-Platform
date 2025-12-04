import * as React from "react"
import { ChevronDown } from "lucide-react"

// Recursively clone children
const cloneAll = (children, props) =>
    React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(
            child,
            props,
            child.props.children ? cloneAll(child.props.children, props) : child.props.children
        )
    })

export const Select = ({ children, value, onValueChange }) => {
    const [open, setOpen] = React.useState(false)

    const toggle = () => setOpen(!open)

    const selectValue = (val) => {
        onValueChange?.(val)
        setOpen(false)
    }

    return (
        <div className="relative text-white">
            {cloneAll(children, { open, toggle, value, selectValue })}
        </div>
    )
}


export const SelectTrigger = ({ children, open, toggle }) => {
    return (
        <button
            onClick={toggle}
            className="w-full flex justify-between items-center px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
        >
            {children}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
    )
}

export const SelectValue = ({ placeholder, value }) => {
    return <span className="text-sm">{value || placeholder}</span>
}

export const SelectContent = ({ open, children }) => {
    if (!open) return null
    return (
        <div className="absolute left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-20 p-1 max-h-64 overflow-y-auto">
            {children}
        </div>
    )
}

export const SelectItem = ({ children, value, selectValue }) => {
    return (
        <div
            onClick={() => selectValue(value)}
            className="px-3 py-2 cursor-pointer rounded hover:bg-slate-600 text-sm"
        >
            {children}
        </div>
    )
}