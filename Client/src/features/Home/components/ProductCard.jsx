import { Heart, Clock, Users, Zap, Ban } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { formatTime } from "../../../utils/DateTimeExtension";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export function ProductCard({ product, addToWatchList, deleteFromWatchList, likedProducts }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const endDate = new Date(product.endDate);
  endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());
  // Kiểm tra trạng thái đã kết thúc
  const isEnded = endDate < new Date();

  const isLiked = likedProducts?.some(lp =>
    lp.productId == product.id && (lp.isDeleted == undefined || lp.isDeleted == false)
  );

  return (
    <div
      className={`group relative flex flex-col h-full rounded-lg border transition-all duration-300 overflow-hidden
        ${isEnded
          ? "bg-slate-50 border-slate-200 grayscale-[0.6] opacity-80"
          : "bg-card border-border hover:border-primary hover:shadow-lg cursor-pointer"
        }`}
      onClick={() => {
        // Vẫn cho phép click xem chi tiết ngay cả khi đã kết thúc
        navigate(`/product/${product.id}`);
      }}
    >
      {/* Overlay thông báo Đã kết thúc */}
      {isEnded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600/90 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transform -rotate-12 border-2 border-white">
            Đã kết thúc
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-muted shrink-0">
        <img
          src={product.mainImageUrl || "/placeholder.svg"}
          alt={product.name}
          className={`object-cover w-full h-full transition duration-500 
            ${!isEnded && "group-hover:scale-110"}`}
        />

        {/* Nút yêu thích (Chỉ hoạt động khi chưa kết thúc) */}
        {user && !isEnded && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                isLiked
                  ? deleteFromWatchList({ productId: product.id })
                  : addToWatchList({ productId: product.id });
              }}
              className={`h-9 w-9 rounded-full border flex items-center justify-center transition active:scale-90 shadow-sm
                ${isLiked ? "bg-red-50 border-red-200" : "bg-white/90 border-slate-200 hover:bg-white"}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
            </button>
          </div>
        )}

        {/* Badge Danh mục */}
        {product.categoryName && (
          <Badge className={`absolute top-3 left-3 ${isEnded ? "bg-slate-400" : "bg-primary"}`}>
            {product.categoryName}
          </Badge>
        )}

        {/* Badge Sản phẩm mới */}
        {product.isNew && !isEnded && (
          <Badge className="absolute bottom-3 left-3 bg-green-500 flex items-center gap-1 shadow-md">
            <Zap className="h-3 w-3 fill-current" />
            Mới
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <h3 className={`font-semibold line-clamp-2 transition-colors
          ${isEnded ? "text-slate-500" : "text-foreground group-hover:text-primary"}`}>
          {product.name}
        </h3>

        {/* Thông tin giá */}
        <div className="py-2 border-y border-slate-100/50">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Giá hiện tại</span>
            <span className={`text-lg font-black ${isEnded ? "text-slate-400" : "text-primary"}`}>
              {(product.currentBid / 1_000_000).toFixed(1)}M đ
            </span>
          </div>
        </div>

        {/* Thời gian */}
        <div className={`flex flex-col gap-1 text-xs ${isEnded ? "text-slate-400" : "text-slate-600"}`}>
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className={`h-4 w-4 ${isEnded ? "text-slate-300" : "text-orange-500"}`} />
            {isEnded ? (
              <span>Hết hạn lúc: {formatTime(product.endDate)}</span>
            ) : (
              <span className="text-orange-600">Kết thúc: {formatTime(product.endDate)}</span>
            )}
          </div>
          <div className="pl-5 opacity-70 text-[11px]">Đăng: {formatTime(product.startDate)}</div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-50">
          <div className="flex items-center gap-1 text-xs">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold">{product.biddingCount}</span>
            <span className="text-slate-400">lượt đấu</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-yellow-500 font-bold">★</span>
            <span className="text-slate-500 truncate max-w-[80px]">{product.sellerName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}