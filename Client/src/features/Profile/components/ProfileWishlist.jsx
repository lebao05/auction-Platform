"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Heart } from "lucide-react";
import { useWatchList } from "../../../contexts/WatchListContext";
import Unknow from "../../../utils/Unknow";
import { useNavigate } from "react-router-dom";

const formatPrice = (v) =>
  v ? v.toLocaleString("vi-VN") + " VND" : "Chưa có bid";

const formatDate = (d) =>
  new Date(d).toLocaleString("vi-VN");

const getRemaining = (endDate) => {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return "Đã kết thúc";
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + " ngày";
};
export function ProfileWishlist() {
  const { likedProducts, deleteFromWatchList, addToWatchList } = useWatchList();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Yêu Thích</CardTitle>
          <CardDescription>
            Các sản phẩm bạn đang quan tâm
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {likedProducts.length > 0 ? (
            likedProducts.map(item => {
              const isLiked = !likedProducts.some(lp => lp.productId == item.productId
                && lp.isDeleted == true
              )
              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-border bg-card p-4"
                >
                  {/* IMAGE */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.mainImageUrl || "/placeholder.svg"}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold">
                      {item.productName}
                    </h3>
                    {!item.highestBid ?
                      <p className="text-sm text-muted-foreground">
                        Giá khởi điểm: {formatPrice(item.startPrice)}
                      </p>
                      :
                      <p className="text-sm text-muted-foreground">
                        Đấu giá cao nhất:{" "}
                        {formatPrice(item.highestBid ?? item.startPrice)}
                      </p>
                    }

                    <p className="text-xs text-muted-foreground">
                      Kết thúc: {formatDate(item.endDate)} (
                      {getRemaining(item.endDate)})
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={item.sellerAvatar || Unknow}
                        className="h-6 w-6 rounded-full"
                        alt={item.sellerName}
                      />
                      <span className="text-sm">
                        Người bán: {item.sellerName}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  {/* ACTIONS */}
                  <div className="flex flex-row gap-2">
                    {/* View detail */}
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="
                      h-8 px-3 rounded-lg border border-border
                      text-sm font-medium
                      bg-background hover:bg-accent
                      transition cursor-pointer
                      hover:bg-gray-300
                    "
                    >
                      Xem chi tiết
                    </button>

                    {/* Like / Unlike */}
                    <button
                      onClick={() =>
                        isLiked
                          ? deleteFromWatchList({ productId: item.productId })
                          : addToWatchList({ productId: item.productId })
                      }
                      className={`
                              h-8 w-8 rounded-lg border border-border
                              flex items-center justify-center
                              transition active:scale-95
                              cursor-pointer
                              ${isLiked
                          ? "bg-red-100 hover:bg-white"
                          : "bg-white hover:bg-red-100"
                        }
                      `}

                    >
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </button>
                  </div>

                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center py-12">
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
