"use client";
import { Card, CardContent } from "../../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Trophy, CheckCircle2, Truck } from "lucide-react";

// ... existing arrays (participatingAuctions, wonAuctions) ...

const participatingAuctions = [
  {
    id: 1,
    name: "Đồng hồ Rolex cơ",
    currentBid: "8,500,000 VND",
    myBid: "8,500,000 VND",
    bidCount: 12,
    endTime: "3 giờ",
    status: "leading",
  },
  {
    id: 2,
    name: "Vàng 9999 100g",
    currentBid: "15,000,000 VND",
    myBid: "14,500,000 VND",
    bidCount: 8,
    endTime: "1 ngày",
    status: "outbid",
  },
];

const wonAuctions = [
  {
    id: 1,
    name: "Camera Canon EOS R5",
    winPrice: "45,000,000 VND",
    status: "pending_payment",
    winDate: "2024-10-15",
  },
  {
    id: 2,
    name: "Lens Sony 70-200mm",
    winPrice: "12,000,000 VND",
    status: "completed",
    winDate: "2024-09-20",
  },
];

const sellingAuctions = [
  {
    id: 1,
    name: "Laptop Gaming ASUS",
    currentBid: "18,000,000 VND",
    bidCount: 5,
    endTime: "2 ngày",
    status: "active",
  },
];

// NEW DATA FOR SOLD TAB
const soldAuctions = [
  {
    id: 101,
    name: "Bộ loa JBL cao cấp",
    finalPrice: "9,500,000 VND",
    buyer: "Người Mua ABC",
    soldDate: "2024-10-10",
    status: "completed", // Giao dịch thành công
  },
  {
    id: 102,
    name: "iPhone 13 Pro Max",
    finalPrice: "15,200,000 VND",
    buyer: "Trần Thị B",
    soldDate: "2024-10-05",
    status: "shipped", // Đang giao hàng
  }
];

export function ProfileAuctions() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="participating">
        {/* Updated grid-cols-3 to grid-cols-4 */}
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participating">Đang Tham Gia</TabsTrigger>
          <TabsTrigger value="won">Đã Thắng</TabsTrigger>
          <TabsTrigger value="selling">Đang Bán</TabsTrigger>
          <TabsTrigger value="sold">Đã Bán</TabsTrigger>
        </TabsList>

        {/* Participating */}
        <TabsContent value="participating" className="space-y-4">
          {participatingAuctions.map((auction) => (
            <Card key={auction.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{auction.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Giá hiện tại: {auction.currentBid}
                      </p>
                    </div>
                    <Badge variant={auction.status === "leading" ? "default" : "secondary"}>
                      {auction.status === "leading" ? "✓ Dẫn đầu" : "✗ Bị vượt"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Lượt đấu giá</p>
                      <p className="font-semibold">{auction.bidCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Giá của bạn</p>
                      <p className="font-semibold">{auction.myBid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Kết thúc</p>
                      <p className="font-semibold">{auction.endTime}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">Đặt Giá Cao Hơn</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Won */}
        <TabsContent value="won" className="space-y-4">
          {wonAuctions.map((auction) => (
            <Card key={auction.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        {auction.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Giá thắng: {auction.winPrice}
                      </p>
                    </div>
                    <Badge variant={auction.status === "completed" ? "default" : "secondary"}>
                      {auction.status === "completed" ? "Hoàn tất" : "Chờ thanh toán"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ngày thắng: {new Date(auction.winDate).toLocaleDateString("vi-VN")}
                  </p>
                  <Button variant="outline" className="w-full">Xem Chi Tiết Đơn Hàng</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Selling */}
        <TabsContent value="selling" className="space-y-4">
          {sellingAuctions.map((auction) => (
            <Card key={auction.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{auction.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Giá hiện tại: {auction.currentBid}
                      </p>
                    </div>
                    <Badge variant="default">Đang diễn ra</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Lượt đấu giá</p>
                      <p className="font-semibold">{auction.bidCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Giá</p>
                      <p className="font-semibold">{auction.currentBid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Kết thúc</p>
                      <p className="font-semibold">{auction.endTime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* NEW TAB CONTENT: Sold */}
        <TabsContent value="sold" className="space-y-4">
          {soldAuctions.map((auction) => (
            <Card key={auction.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                         {auction.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Đã bán với giá: <span className="text-green-600 font-medium">{auction.finalPrice}</span>
                      </p>
                    </div>
                    <Badge variant={auction.status === "completed" ? "default" : "secondary"}>
                      {auction.status === "completed" ? (
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Hoàn tất</span>
                      ) : (
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3"/> Đang giao</span>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-md">
                     <div>
                        <p className="text-xs text-muted-foreground">Người mua</p>
                        <p className="font-medium">{auction.buyer}</p>
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground">Ngày bán</p>
                        <p className="font-medium">{auction.soldDate}</p>
                     </div>
                  </div>

                  <Button variant="outline" className="w-full">Xem Chi Tiết Giao Dịch</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

      </Tabs>
    </div>
  );
}