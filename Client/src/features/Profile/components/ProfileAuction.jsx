"use client";

import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Badge } from "../../../components/ui/Badge";
import { Trophy, CheckCircle2, Gavel, Timer, ShoppingBag, ArrowUpRight, Truck, CreditCard, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileAuctions({ products, isYou, user }) {
  const {
    productsWon = [],
    productsSelling = [],
    productsSold = [],
    productsBidding = []
  } = products || {};

  const formatCurrency = (amount) => {
    if (!amount) return "0đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };
  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const nowUTC = now.getTime();

    // Nếu endDate từ server đã là UTC, ta đưa nó về Epoch ms
    const endUTC = new Date(endDate).getTime() - now.getTimezoneOffset() * 60000;

    const remaining = endUTC - nowUTC;

    if (remaining <= 0) return "Đã kết thúc";

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `Kết thúc sau ${hours} giờ`;
    return "Kết thúc trong ngày";
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={isYou ? "bidding" : "selling"}>
        <TabsList className={`grid w-full ${isYou ? "grid-cols-4" : "grid-cols-3"}`}>
          {isYou && (
            <TabsTrigger value="bidding" className="flex items-center gap-2">
              <Gavel className="w-4 h-4" /> Đang đấu giá
            </TabsTrigger>
          )}
          <TabsTrigger value="won" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Đã thắng
          </TabsTrigger>
          <TabsTrigger value="selling" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Đang bán
          </TabsTrigger>
          <TabsTrigger value="sold" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Đã kết thúc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bidding" className="space-y-4">
          {productsBidding.length > 0 ? productsBidding.map((p) => (
            <AuctionItemCard key={p.id} product={p} type="bidding" isLeading={(user && user.userId == p.winnerId)} formatCurrency={formatCurrency} getTimeRemaining={getTimeRemaining} />
          )) : <EmptyState message="Bạn hiện chưa tham gia đấu giá sản phẩm nào." />}
        </TabsContent>

        <TabsContent value="won" className="space-y-4">
          {productsWon.length > 0 ? productsWon.map((p) => (
            <AuctionItemCard key={p.id} product={p} type="won" formatCurrency={formatCurrency} />
          )) : <EmptyState message="Chưa có sản phẩm nào thắng giải." />}
        </TabsContent>

        <TabsContent value="selling" className="space-y-4">
          {productsSelling.length > 0 ? productsSelling.map((p) => (
            <AuctionItemCard key={p.id} product={p} type="selling" formatCurrency={formatCurrency} getTimeRemaining={getTimeRemaining} />
          )) : <EmptyState message="Không có sản phẩm nào đang được rao bán." />}
        </TabsContent>

        <TabsContent value="sold" className="space-y-4">
          {productsSold.length > 0 ? productsSold.map((p) => (
            <AuctionItemCard key={p.id} product={p} type="sold" formatCurrency={formatCurrency} />
          )) : <EmptyState message="Chưa có lịch sử bán hàng." />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuctionItemCard({ product, type, formatCurrency, getTimeRemaining, isLeading }) {
  // Logic kiểm tra xem có người thắng thực sự hay không
  const hasWinner = product.winnerId || product.winnerName;
  const navigate = useNavigate();
  // Hàm hiển thị Badge trạng thái đơn hàng dựa trên Enum
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 0: return <Badge className="bg-gray-700 text-amber-700 border-amber-200"> Chờ thanh toán</Badge>;
      case 1: return <Badge className="bg-blue-700 text-blue-700 border-blue-200">Đang giao hàng</Badge>;
      case 2: return <Badge className="bg-green-700 text-green-700 border-green-200">  Hoàn thành</Badge>;
      case 3: return <Badge className="bg-red-700 text-red-700 border-red-200">Người bán hủy</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            {product.mainImageUrl ? (
              <img src={product.mainImageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Không có ảnh</div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Danh mục: {product.categoryName || "Khác"}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* Badge trạng thái chính */}
                {type === "bidding" && (
                  <Badge className={isLeading ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                    {isLeading ? "✓ Đang dẫn đầu" : "⚠ Bị vượt giá"}
                  </Badge>
                )}
                {type === "selling" && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Đang đấu giá</Badge>}
                {type === "won" && <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Thắng giải</Badge>}
                {type === "sold" && !hasWinner && <Badge variant="secondary" className="bg-gray-100 text-gray-500">Kết thúc (Không có người mua)</Badge>}

                {/* Chỉ hiển thị Status đơn hàng khi có người thắng (cho tab won và sold) */}
                {(type === "won" || (type === "sold" && hasWinner)) && getOrderStatusBadge(product.orderStatus)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Giá cao nhất</p>
                <p className="font-bold text-blue-600">{formatCurrency(product.highestBid || product.startPrice)}</p>
              </div>

              {/* Chỉ hiện Winner name nếu có người thắng hoặc đang trong phiên đấu giá */}
              {(type === "selling" || (hasWinner && (type === "sold" || type === "won"))) && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {type === "selling" ? "Dẫn đầu" : "Người thắng"}
                  </p>
                  <p className="font-bold text-gray-900 truncate">{product.winnerName || "---"}</p>
                </div>
              )}

              {type === "bidding" && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bạn đã đặt</p>
                  <p className="font-bold text-gray-900">{formatCurrency(product.yourBidding)}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lượt đấu</p>
                <p className="font-bold text-gray-900">{product.biddingCount} lượt</p>
              </div>

              {(type === "selling" || type === "bidding") && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Thời gian</p>
                  <p className="font-bold text-red-500 flex items-center gap-1">
                    <Timer size={14} /> {getTimeRemaining(product.endDate)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => navigate(`/product/${product.id}`)} className="group relative flex-1 h-10 px-4 py-2 text-sm font-medium text-white 
                     bg-indigo-600 cursor-pointer rounded-xl transition-all duration-300 ease-out
                     hover:bg-indigo-500 hover:ring-4 hover:ring-indigo-100 hover:-translate-y-0.5
                     active:scale-95 active:translate-y-0
                     flex items-center justify-center gap-2 overflow-hidden">
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] 
                    group-hover:duration-1000 group-hover:translate-x-[200%] 
                    bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Xem chi tiết</span>
                <ArrowUpRight className="w-4 h-4 relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-100">
      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Gavel className="text-gray-300 w-8 h-8" />
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}