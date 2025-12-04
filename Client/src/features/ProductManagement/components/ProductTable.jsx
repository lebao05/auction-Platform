"use client"

import { Edit2, Trash2, TrendingUp } from "lucide-react"
import { Button } from "../../button"
export default function ProductTable({ products, onEdit, onDelete }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(price)
    }

    const getTimeRemaining = (endDate) => {
        const now = new Date()
        const diff = endDate.getTime() - now.getTime()

        if (diff <= 0) return "Đã kết thúc"

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) return `${days}d ${hours}h`
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Sản phẩm</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Danh mục</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">Giá hiện tại</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">Ra giá</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">Thời gian còn</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                                        <img
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{product.name}</p>
                                        <p className="text-xs text-slate-400">ID: #{product.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div>
                                    <p className="font-semibold text-white">{formatPrice(product.currentPrice)}</p>
                                    <p className="text-xs text-slate-400">Khởi: {formatPrice(product.startPrice)}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <TrendingUp className="w-4 h-4 text-blue-400" />
                                    <span className="font-medium text-white">{product.bids}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span
                                    className={`text-sm font-medium ${product.status === "active" ? "text-green-400" : "text-slate-400"}`}
                                >
                                    {getTimeRemaining(product.endDate)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(product)}
                                        className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(product.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-slate-700/50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
