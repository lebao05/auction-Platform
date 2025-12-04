"use client"

import { Package, CheckCircle2, XCircle } from "lucide-react"

export default function ProductSidebar({
  activeCount,
  endedCount,
  selectedFilter,
  onFilterChange,
}) {
  const menuItems = [
    {
      id: "all",
      label: "Tất cả sản phẩm",
      icon: Package,
      count: activeCount + endedCount,
      color: "text-gray-600",
    },
    {
      id: "active",
      label: "Sản phẩm đang bán",
      icon: CheckCircle2,
      count: activeCount,
      color: "text-green-600",
    },
    {
      id: "ended",
      label: "Đã kết thúc",
      icon: XCircle,
      count: endedCount,
      color: "text-red-600",
    },
  ]

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Bộ lọc</h2>

        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = selectedFilter === item.id

            return (
              <button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  isActive
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-blue-600" : item.color
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <div
                  className={`text-2xl font-bold ${
                    isActive ? "text-blue-700" : item.color
                  }`}
                >
                  {item.count}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
