import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/Tabs";
import { Badge } from "../../../components/ui/Badge";
import { Star, ThumbsUp } from "lucide-react";

const buyerRatings = [
  {
    id: 1,
    seller: "Shop Điện Tử Uy Tín",
    rating: 5,
    comment: "Sản phẩm chất lượng",
    date: "2024-10-15",
    type: "positive",
  },
  {
    id: 2,
    seller: "Cửa Hàng Hàng Cũ",
    rating: 4,
    comment: "Hàng tốt nhưng đóng gói lỏng",
    date: "2024-10-10",
    type: "positive",
  },
];

const sellerRatings = [
  {
    id: 1,
    buyer: "Người Dùng ABC",
    rating: 5,
    comment: "Giao dịch suôn sẻ",
    date: "2024-10-12",
    type: "positive",
  },
];

export function ProfileRatings() {
  const [activeTab, setActiveTab] = useState("buyer");

  const positiveCount = buyerRatings.filter(
    (r) => r.type === "positive"
  ).length;
  const averageRating = (
    buyerRatings.reduce((sum, r) => sum + r.rating, 0) / buyerRatings.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tổng Quan Đánh Giá</CardTitle>
          <CardDescription>
            Điểm đánh giá và phản hồi từ giao dịch của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="text-4xl font-bold">{averageRating}</div>
              <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
            </div>
            <p className="text-sm text-muted-foreground">Điểm trung bình</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="text-4xl font-bold text-green-500">
                {positiveCount}
              </div>
              <ThumbsUp className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">Đánh giá tích cực</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold text-red-500">0</div>
            <p className="text-sm text-muted-foreground">Đánh giá tiêu cực</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="buyer">
        <TabsList className="grid grid-cols-2 gap-2 mb-4">
          <TabsTrigger value="buyer" onClick={() => setActiveTab("buyer")}>
            Là Người Mua
          </TabsTrigger>
          <TabsTrigger value="seller" onClick={() => setActiveTab("seller")}>
            Là Người Bán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buyer" activeTab={activeTab} className="space-y-4">
          {buyerRatings.map((r) => (
            <Card key={r.id}>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>{r.seller}</div>
                  <Badge
                    variant={r.type === "positive" ? "default" : "destructive"}
                  >
                    {r.type === "positive" ? "+1" : "-1"}
                  </Badge>
                </div>
                <p>{r.comment}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.date).toLocaleDateString("vi-VN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="seller" activeTab={activeTab} className="space-y-4">
          {sellerRatings.map((r) => (
            <Card key={r.id}>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>{r.buyer}</div>
                  <Badge
                    variant={r.type === "positive" ? "default" : "destructive"}
                  >
                    {r.type === "positive" ? "+1" : "-1"}
                  </Badge>
                </div>
                <p>{r.comment}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.date).toLocaleDateString("vi-VN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
