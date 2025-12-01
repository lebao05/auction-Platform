"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Link } from "react-router-dom"
export function CompletedView({ productId, auctionEnded, isWinner, isSeller }) {
  if (!auctionEnded) {
    return null
  }

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Sản phẩm đã kết thúc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isWinner && (
          <div>
            <p className="text-foreground mb-3">Bạn là người thắng cuộc! Hãy hoàn tất đơn hàng</p>
            <Link href={`/order/${productId}`}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Hoàn tất đơn hàng
              </Button>
            </Link>
          </div>
        )}

        {isSeller && (
          <div>
            <p className="text-foreground mb-3">Đợi người thắng cuộc hoàn tất thanh toán</p>
            <Link href={`/order/${productId}`}>
              <Button className="w-full bg-transparent" variant="outline">
                Xem chi tiết đơn hàng
              </Button>
            </Link>
          </div>
        )}

        {!isWinner && !isSeller && (
          <div>
            <p className="text-muted-foreground text-sm">Phiên đấu giá này đã kết thúc.</p>
            <p className="text-muted-foreground text-sm">Xem các phiên đấu giá khác đang diễn ra</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
