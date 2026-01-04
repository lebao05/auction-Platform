"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Link, useNavigate } from "react-router-dom"
import { PartyPopper, PackageCheck, Gavel, ArrowRight, Store, AlertTriangle } from "lucide-react"
// File: CompletedView.jsx (hoặc nơi bạn định nghĩa component này)

export function CompletedView({ productId, auctionEnded, isWinner, isSeller, topBidding }) {
  if (!auctionEnded) return null
  const navigate = useNavigate();
  const hasWinner = topBidding !== null
  const isSuccessParticipant = (isWinner || isSeller) && hasWinner

  // Trường hợp Seller nhưng không có ai đấu giá
  const isSellerNoBid = isSeller && !hasWinner

  const containerStyles = isSuccessParticipant
    ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-emerald-100/20"
    : isSellerNoBid
      ? "border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5" // Màu cảnh báo cho seller
      : "border-slate-200 bg-slate-50/50 dark:bg-slate-900/50"

  const titleStyles = isSuccessParticipant
    ? "text-emerald-700 dark:text-emerald-400"
    : isSellerNoBid ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"

  return (
    <Card className={`overflow-hidden border-2 shadow-sm transition-all ${containerStyles}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {isWinner && <PartyPopper className="h-5 w-5 text-emerald-600" />}
          {isSeller && hasWinner && !isWinner && <Store className="h-5 w-5 text-emerald-600" />}
          {isSellerNoBid && <AlertTriangle className="h-5 w-5 text-amber-600" />}
          {!isSuccessParticipant && !isSellerNoBid && <Gavel className="h-5 w-5 text-slate-500" />}

          <CardTitle className={`text-lg font-bold ${titleStyles}`}>
            {isWinner && "Chúc mừng! Bạn đã chiến thắng"}
            {isSeller && hasWinner && !isWinner && "Phiên đấu giá thành công"}
            {isSellerNoBid && "Phiên đấu giá đã kết thúc"}
            {!isSuccessParticipant && !isSellerNoBid && "Phiên đấu giá đã kết thúc"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* CASE: SELLER BUT NO BIDS */}
        {isSellerNoBid && (
          <div className="space-y-4">
            <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
              Rất tiếc, phiên đấu giá này đã kết thúc mà <strong>không có người tham gia đặt giá</strong>.
              Bạn có thể đăng lại sản phẩm hoặc kiểm tra lại giá khởi điểm.
            </p>
            <div className="flex gap-3">
              <Link to="/product/manage" className="flex-1">
                <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-100">
                  Quản lý kho
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* WINNER VIEW */}
        {isWinner && hasWinner && (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Bạn là người đặt giá cao nhất. Hãy hoàn tất thủ tục thanh toán để nhận sản phẩm.
            </p>
            <Link to={`/order/${productId}`} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <PackageCheck className="mr-2 h-4 w-4" /> Hoàn tất đơn hàng ngay
              </Button>
            </Link>
          </div>
        )}

        {/* SELLER SUCCESS VIEW */}
        {isSeller && hasWinner && !isWinner && (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Chúc mừng! Sản phẩm của bạn đã được chốt đơn. Đang chờ người mua thanh toán.
            </p>
            <Link to={`/order/${productId}`} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Xem chi tiết đơn hàng
              </Button>
            </Link>
          </div>
        )}

        {/* REGULAR VIEWER VIEW (Hoặc người đấu giá nhưng thua) */}
        {!isSuccessParticipant && !isSellerNoBid && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-200/50 p-3 dark:bg-slate-800">
              <p className="text-slate-500 text-sm">
                {hasWinner
                  ? "Rất tiếc, bạn đã bỏ lỡ sản phẩm này. Hãy theo dõi các phiên đấu giá khác."
                  : "Phiên đấu giá kết thúc mà không có người mua."}
              </p>
            </div>
            <Link to="/auctions" className="group flex items-center justify-center text-sm font-medium text-primary hover:underline">
              Khám phá phiên đấu giá khác
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}