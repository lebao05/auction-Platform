import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

export function OrderSummary({ order }) {
    const getStatusBadge = (status) => {
        const statusMap = {
            payment_pending: { label: "Chờ thanh toán", variant: "secondary" },
            payment_confirmed: { label: "Đã thanh toán", variant: "default" },
            shipped: { label: "Đang giao", variant: "default" },
            delivered: { label: "Đã giao", variant: "default" },
        };
        return statusMap[status] || { label: "Không xác định", variant: "secondary" };
    };

    const badge = getStatusBadge(order.status);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Product */}
                <div>
                    <img
                        src={order.productImage || "/placeholder.svg"}
                        alt={order.productName}
                        className="w-full rounded-lg mb-2"
                    />
                    <p className="text-sm font-medium text-foreground line-clamp-2">{order.productName}</p>
                </div>

                {/* Seller */}
                <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
                    <img
                        src={order.seller.avatar || "/placeholder.svg"}
                        alt={order.seller.name}
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <p className="text-xs text-muted-foreground">Người bán</p>
                        <p className="text-sm font-medium text-foreground">{order.seller.name}</p>
                    </div>
                </div>

                {/* Price */}
                <div className="space-y-2 border-t border-border pt-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giá thắng cuộc</span>
                        <span className="font-medium text-foreground">${order.winningBid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span className="font-medium text-foreground">$0 (TBD)</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-border pt-3 mt-3">
                        <span className="text-foreground">Tổng cộng</span>
                        <span className="text-primary">${order.winningBid.toLocaleString()}</span>
                    </div>
                </div>

                {/* Status */}
                <Badge variant={badge.variant} className="w-full justify-center py-2">
                    {badge.label}
                </Badge>
            </CardContent>
        </Card>
    );
}
