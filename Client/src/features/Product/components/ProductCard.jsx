import { Heart, Clock, Users, Zap } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function ProductCard({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    return (
        <div
            className="group cursor-pointer rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition"
            onClick={() => {
                console.log("Go to product:", product.id);
            }}
        >
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-muted">
                <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 hover:bg-background"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Heart className="h-5 w-5" />
                    </Button>
                </div>
                <Badge className="absolute top-3 left-3 bg-primary">
                    {product.category}
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

                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-sm text-muted-foreground">Current bid</span>
                        <span className="text-lg font-bold text-primary">
                            {(product.currentBid / 1_000_000).toFixed(1)}M đ
                        </span>
                    </div>
                    {product.buyNowPrice && (
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-muted-foreground">Mua ngay</span>
                            <span className="text-sm font-semibold text-accent">
                                {(product.buyNowPrice / 1_000_000).toFixed(1)}M đ
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Posted: {product.postedDate}</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {product.endsIn}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{product.bids} bids</span>
                </div>

                <div className="flex items-center gap-1 text-sm pt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{product.seller.rating}</span>
                    <span className="text-muted-foreground">({product.seller.name})</span>
                </div>
            </div>
        </div>
    );
}
