"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Link } from "react-router-dom"
import { PartyPopper, PackageCheck, Gavel, ArrowRight, Store } from "lucide-react"

export function CompletedView({ productId, auctionEnded, isWinner, isSeller }) {
  if (!auctionEnded) return null

  // Unified theme for both success participants (Winner/Seller)
  const isSuccessParticipant = isWinner || isSeller
  
  const containerStyles = isSuccessParticipant
    ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-emerald-100/20" 
    : "border-slate-200 bg-slate-50/50 dark:bg-slate-900/50"

  const titleStyles = isSuccessParticipant
    ? "text-emerald-700 dark:text-emerald-400"
    : "text-slate-700 dark:text-slate-300"

  const iconStyles = isSuccessParticipant ? "text-emerald-600" : "text-slate-500"

  return (
    <Card className={`overflow-hidden border-2 shadow-sm transition-all ${containerStyles}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {isWinner && <PartyPopper className={`h-5 w-5 ${iconStyles}`} />}
          {isSeller && !isWinner && <Store className={`h-5 w-5 ${iconStyles}`} />}
          {!isSuccessParticipant && <Gavel className={`h-5 w-5 ${iconStyles}`} />}
          
          <CardTitle className={`text-lg font-bold ${titleStyles}`}>
            {isWinner && "Chúc mừng! Bạn đã chiến thắng"}
            {isSeller && !isWinner && "Phiên đấu giá thành công"}
            {!isSuccessParticipant && "Phiên đấu giá đã kết thúc"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* WINNER VIEW */}
        {isWinner && (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Bạn là người đặt giá cao nhất. Hãy hoàn tất thủ tục thanh toán để nhận sản phẩm.
            </p>
            <Link to={`/order/${productId}`} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-[0.98]">
                <PackageCheck className="mr-2 h-4 w-4" />
                Hoàn tất đơn hàng ngay
              </Button>
            </Link>
          </div>
        )}

        {/* SELLER VIEW */}
        {isSeller && !isWinner && (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Chúc mừng! Sản phẩm của bạn đã được chốt đơn. Đang chờ người mua thanh toán.
            </p>
            <Link to={`/order/${productId}`} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-[0.98]">
                Xem chi tiết đơn hàng
              </Button>
            </Link>
          </div>
        )}

        {/* REGULAR VIEWER VIEW */}
        {!isSuccessParticipant && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-200/50 p-3 dark:bg-slate-800">
              <p className="text-slate-500 text-sm">
                Rất tiếc, bạn đã bỏ lỡ sản phẩm này. Hãy theo dõi các phiên đấu giá khác.
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