"use client";
import { Card, CardContent } from "../../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Trophy } from "lucide-react";

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
  {
    id: 2,
    name: "Bộ loa JBL cao cấp",
    currentBid: "9,500,000 VND",
    bidCount: 15,
    winner: "Người Mua ABC",
    endTime: "Đã kết thúc",
    status: "ended",
  },
];

export function ProfileAuctions() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="participating">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="participating">Đang Tham Gia</TabsTrigger>
          <TabsTrigger value="won">Đã Thắng</TabsTrigger>
          <TabsTrigger value="selling">Đang Bán</TabsTrigger>
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
                        {auction.status === "ended"
                          ? `Người thắng: ${auction.winner}`
                          : `Giá hiện tại: ${auction.currentBid}`}
                      </p>
                    </div>

                    <Badge variant={auction.status === "active" ? "default" : "secondary"}>
                      {auction.status === "active" ? "Đang diễn ra" : "Đã kết thúc"}
                    </Badge>
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

                  {auction.status === "ended" && (
                    <Button className="w-full">Xem Giao Dịch Hoàn Tất</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
