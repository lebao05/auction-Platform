import { Heart, Clock, Users, Zap, Gavel, DollarSign, CalendarDays } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { formatTime } from "../../../utils/DateTimeExtension";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export function ProductCard({ product, addToWatchList, deleteFromWatchList, likedProducts }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- XỬ LÝ TIMEZONE ---
  const getAdjustedDate = (dateString) => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    // Trừ đi offset để đồng bộ thời gian thực (Local Time vs Server UTC)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
  };

  const adjustedEndDate = getAdjustedDate(product.endDate);
  const adjustedStartDate = getAdjustedDate(product.startDate);
  const isEnded = adjustedEndDate < new Date();

  // --- XỬ LÝ GIÁ ---
  // Logic: Nếu có biddingCount > 0 thì dùng topBidding, ngược lại dùng startPrice
  const hasBids = product.biddingCount > 0;
  const currentDisplayPrice = product.topBidding || product.startPrice;

  const isLiked = likedProducts?.some(lp =>
    lp.productId === product.id && (lp.isDeleted === undefined || lp.isDeleted === false)
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value || 0);
  };

  return (
    <div
      className={`group relative flex flex-col h-full rounded-xl border transition-all duration-300 overflow-hidden
        ${isEnded
          ? "bg-slate-50 border-slate-200 grayscale-[0.4] opacity-90"
          : "bg-card border-border hover:border-primary hover:shadow-xl cursor-pointer"
        }`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Overlay Đã kết thúc */}
      {isEnded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-[1px] w-full h-full flex items-center justify-center">
            <div className="bg-red-600 text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl border-2 border-white transform -rotate-12">
              Đã kết thúc
            </div>
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-52 overflow-hidden bg-muted shrink-0">
        <img
          src={product.mainImageUrl || "/placeholder.svg"}
          alt={product.name}
          className={`object-cover w-full h-full transition duration-700 
            ${!isEnded && "group-hover:scale-110"}`}
        />

        {/* Nút yêu thích */}
        {user && !isEnded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              isLiked
                ? deleteFromWatchList({ productId: product.id })
                : addToWatchList({ productId: product.id });
            }}
            className={`absolute cursor-pointer top-2 right-2 z-20 h-8 w-8 rounded-full border flex items-center justify-center transition active:scale-90
              ${isLiked ? "bg-red-50 border-red-200" : "bg-white/90 border-slate-200 hover:bg-white"}`}
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
          </button>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          <Badge className={`${isEnded ? "bg-slate-500" : "bg-yellow-500"} text-[10px]`}>
            {product.categoryName}
          </Badge>
          {product.isNew && !isEnded && (
            <Badge className="bg-green-500 text-[10px] flex items-center gap-1 shadow-sm">
              <Zap className="h-3 w-3 fill-current" /> MỚI
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-bold text-base line-clamp-2 mb-2 min-h-[3rem] transition-colors
          ${isEnded ? "text-slate-500" : "text-slate-800 group-hover:text-primary"}`}>
          {product.name}
        </h3>

        {/* Price Card */}
        <div className={`mb-4 p-3 rounded-lg border transition-colors
          ${hasBids && !isEnded ? "bg-blue-50/50 border-blue-100" : "bg-slate-50 border-slate-100"}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Gavel className={`h-3.5 w-3.5 ${product.topBidding ? "text-blue-600" : "text-slate-400"}`} />
            <span className="text-[10px] uppercase font-black tracking-tighter text-slate-500">
              {product.topBidding ? "Giá đấu hiện tại" : "Giá khởi điểm"}
            </span>
          </div>
          <div className={`text-xl font-black ${!product.topBidding ? "text-slate-400" : "text-blue-700"}`}>
            {formatCurrency(currentDisplayPrice)}
          </div>
          {product.buyNowPrice && (
            <div className="mt-1 text-[11px] text-slate-400">
              Mua ngay: <span className="font-bold text-orange-600">{formatCurrency(product.buyNowPrice)}</span>
            </div>
          )}
        </div>

        {/* Stats & Info */}
        <div className="mt-auto space-y-3">
          {/* Seller & Bid Count */}
          <div className="flex items-start flex-col justify-between text-[11px] font-medium text-slate-500 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{product.biddingCount} lượt đấu</span>
            </div>

            {/* UPDATED SECTION: Column Layout, Right Aligned */}
            <div className="flex items-center gap-1">
              <span className="truncate">Người đăng: {product.sellerName}</span>
            </div>
          </div>
          {hasBids && product.topBidderName && (
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50/50 py-0.5 px-1 rounded">
              <Gavel className="h-3 w-3" />
              <span className="truncate">
                Cao nhất: <span className="font-bold">{product.topBidderName}</span>
              </span>
            </div>
          )}
          {/* Ngày đăng sản phẩm (New) */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Đăng lúc: {formatTime(product.startDate)}</span>
          </div>

          {/* Thời gian kết thúc */}
          <div className={`flex items-center gap-2 text-[11px] p-2 rounded-md 
            ${isEnded ? "bg-slate-100 text-slate-400" : "bg-orange-50 text-orange-700 border border-orange-100"}`}>
            <Clock className={`h-3.5 w-3.5 ${!isEnded && "animate-pulse"}`} />
            <div className="flex flex-col leading-tight">
              <span className="font-bold uppercase text-[9px]">
                {isEnded ? "Đã kết thúc" : "Kết thúc vào"}
              </span>
              <span>{formatTime(product.endDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}