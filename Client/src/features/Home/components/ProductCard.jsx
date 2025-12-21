import { Heart, Clock, Users, Zap } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { formatTime } from "../../../utils/DateTimeExtension";
import { useNavigate } from "react-router-dom";

export function ProductCard({ product, addToWatchList, deleteFromWatchList, likedProducts }) {
  const navigate = useNavigate();
  const isLiked = likedProducts.some(lp => lp.productId == product.id
    && (lp.isDeleted == undefined || lp.isDeleted == false)
  )
  return (
    <div
      className="group cursor-pointer rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition"
      onClick={() => {
        navigate(`/product/${product.id}`)
      }}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={product.mainImageUrl || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              isLiked
                ? deleteFromWatchList({ productId: product.id })
                : addToWatchList({ productId: product.id })

            }
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
            <Heart className="h-4 w-4 text-red-800 fill-red-500" />
          </button>
        </div>
        <Badge className="absolute top-3 left-3 bg-primary">
          {product.categoryName}
        </Badge>
        {product.isNew && (
          <Badge className="absolute bottom-3 left-3 bg-green-500 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            New
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold line-clamp-2 text-foreground group-hover:text-primary transition">
          {product.name}
        </h3>

        {/* <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Current bid</span>
            <span className="text-lg font-bold text-primary">
              {(product.currentBid / 1_000_000).toFixed(1)}M đ
            </span>
          </div>
          {product.buyNowPrice && (
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Buy now</span>
              <span className="text-sm font-semibold text-accent">
                {(product.buyNowPrice).toFixed(1)}M đ
              </span>
            </div>
          )}
        </div> */}

        <div className="flex flex-col justify-between text-xs text-muted-foreground">
          <span>Posted: {formatTime(product.startDate)}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(product.endDate)}
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Lượt đấu giá: {product.biddingCount}</span>
        </div>

        <div className="flex items-center gap-1 text-sm pt-1">
          <span className="text-yellow-500">★</span>
          <span className="text-muted-foreground">{product.sellerName}</span>
        </div>
      </div>
    </div>
  );
}
