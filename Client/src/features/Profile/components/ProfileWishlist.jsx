"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Heart } from "lucide-react";

const wishlistItems = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    currentBid: "15,000,000 VND",
    endTime: "2 ngày",
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-og-image-202409?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1727113715311",
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    currentBid: "25,000,000 VND",
    endTime: "5 ngày",
    image:
      "https://tse1.explicit.bing.net/th/id/OIP.C-nhxYGA7YvDWYOx0XybegHaFb?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];

export function ProfileWishlist() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Yêu Thích</CardTitle>
          <CardDescription>Các sản phẩm bạn đang quan tâm</CardDescription>
        </CardHeader>
        <CardContent>
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="mb-4 h-40 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Giá hiện tại: {item.currentBid}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kết thúc trong: {item.endTime}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" size="sm">
                      Xem Chi Tiết
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Bạn chưa có sản phẩm yêu thích nào
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
