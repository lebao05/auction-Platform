import { Edit2, Trash2, TrendingUp, Clock } from "lucide-react"
import { Button } from "../../../components/ui/Button"

export default function ProductCard({ product, onEdit, onDelete }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)

  const getTimeRemaining = (endDate) => {
    const now = new Date()
    const diff = new Date(endDate).getTime() - now.getTime()
    if (diff <= 0) return "Đã kết thúc"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} ngày ${hours} giờ`
    return `${hours} giờ`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-all hover:shadow-lg">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Status Badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${product.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {product.status === "active" ? "Đang diễn ra" : "Đã kết thúc"}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{product.category}</p>

        {/* Price Box */}
        <div className="bg-gray-100 rounded p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Giá hiện tại</p>
          <p className="text-lg font-bold text-blue-600">{product.bids == 0 ? "Không có lượt ra giá" : formatPrice(product.currentPrice)}</p>
          <p className="text-xs text-gray-400 mt-1">
            Khởi: {formatPrice(product.startPrice)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-100 rounded p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <p className="text-xs text-gray-500">Ra giá</p>
            </div>
            <p className="font-bold text-gray-900">{product.bids}</p>
          </div>

          <div className="bg-gray-100 rounded p-3">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <p className="text-xs text-gray-500">Thời gian</p>
            </div>
            <p
              className={`font-bold text-sm ${product.status === "active" ? "text-green-600" : "text-gray-500"
                }`}
            >
              {getTimeRemaining(product.endDate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Button xem chi tiết */}
          <button
            onClick={() => onEdit(product)}
            className="
      flex-1 flex items-center justify-center gap-2
      text-blue-600 bg-blue-50
      hover:bg-blue-100 hover:text-blue-700
      font-medium text-sm
      py-2 rounded-md
      cursor-pointer transition-all
    "
          >
            <Edit2 className="w-4 h-4" />
            Xem chi tiết
          </button>

          {/* Button Xóa – warning style */}
          <button
            onClick={() => onDelete(product.id)}
            className="
      flex-1 flex items-center justify-center gap-2
      text-white bg-red-600
      hover:bg-red-700
      font-medium text-sm
      py-2 rounded-md
      cursor-pointer transition-all shadow-sm
    "
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}
