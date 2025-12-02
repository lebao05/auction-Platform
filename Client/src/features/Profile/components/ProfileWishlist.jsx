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
  }, {
    id: 3,
    name: 'MacBook Pro 16"',
    currentBid: "25,000,000 VND",
    endTime: "5 ngày",
    image:
      "https://tse1.explicit.bing.net/th/id/OIP.C-nhxYGA7YvDWYOx0XybegHaFb?rs=1&pid=ImgDetMain&o=7&rm=3",
  }, {
    id: 4,
    name: 'MacBook Pro 16"',
    currentBid: "25,000,000 VND",
    endTime: "5 ngày",
    image:
      "https://tse1.explicit.bing.net/th/id/OIP.C-nhxYGA7YvDWYOx0XybegHaFb?rs=1&pid=ImgDetMain&o=7&rm=3",
  }, {
    id: 5,
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

        <CardContent className="space-y-4">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
              >
                {/* Image */}
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Giá hiện tại: {item.currentBid}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kết thúc trong: {item.endTime}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm">Xem Chi Tiết</Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
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