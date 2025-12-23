import { useState } from "react";
import {
    Heart,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    UserX,
    Trash2,
    ArrowLeft
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Card } from "../../../components/ui/Card";
import { BidHistory } from "../components/BidHistory";
import { RelatedProducts } from "../components/RelatedProducts";
import { CompletedView } from "../components/CompletedView";
import { Badge } from "../../../components/ui/Badge";
import { PlaceBidModal } from "../components/PlaceBidModal";
import { useProductDetails } from "../../../hooks/useProductDetails";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import Unknow from "../../../utils/Unknow";
import { useWatchList } from "../../../contexts/WatchListContext";
import { formatDateTimeFull, formatTime } from "../../../utils/DateTimeExtension";
import Spinner from "../../../components/ui/Spinner";
import ProductQnA from "../components/ProductQnA";
export default function ProductPage() {
    const { productId } = useParams();
    const { product, loading, error, addToBlacklist, removeFromBlacklist
        , comments,
        blackList,
        biddingHistories, addDescription
    } = useProductDetails(productId);
    const navigate = useNavigate();
    const [showFullDesc, setShowFullDesc] = useState(false);
    const { user } = useAuth();
    const { likedProducts, deleteFromWatchList, addToWatchList } = useWatchList();
    const isLiked = likedProducts.some(lp => lp.productId == product.id
        && (lp.isDeleted == undefined || lp.isDeleted == false))
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showBidModal, setShowBidModal] = useState(false);

    const [extraDescription, setExtraDescription] = useState("");
    const [savingDesc, setSavingDesc] = useState(false);
    const [showEditor, setShowEditor] = useState(false);

    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!product) return null;
    const images = product.images?.map(img => img.imageUrl) ?? [];

    const auctionEnded = new Date(product.endDate) < new Date();
    const isSeller = user?.userId === product.sellerId;
    const canBid = user && !blackList.some(bl => bl.bidderId == user.id) && user.id != product.sellerId;
    const prevImage = () =>
        setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

    const nextImage = () =>
        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    const handleRemoveFromBlacklist = async ({ blacklistId }) => {
        try {
            await removeFromBlacklist({ blacklistId });
            toast.success("Xóa thành công!");
        }
        catch (err) {
            toast.error("Thao tác thất bại!");
        }
    }
    const handleAddToBlackList = async ({ bidderId }) => {
        try {
            await addToBlacklist({ productId, bidderId });
            toast.success("Từ chối ra giá thành công!");
        }
        catch (err) {
            toast.error("Thao tác thất bại!");
        }
    }

    // ===========================
    // Add Description
    // ===========================
    const handleAddDescription = async () => {
        if (extraDescription === `<p><br></p>`) {
            toast.warning("Mô tả không được trống");
            return;
        }
        console.log(extraDescription);
        try {
            setSavingDesc(true);
            const now = new Date();
            await addDescription({
                description: `<br/><p className="inline-flex items-center gap-1 mb-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            <span>✏️</span>
            <span>${formatDateTimeFull(now)}</span>
        </p>`+ extraDescription
            });
            setExtraDescription("");
            toast.success("Đã thêm mô tả");
        } catch (err) {
            toast.error("Thêm mô tả thất bại");
        } finally {
            setSavingDesc(false);
        }
    };
    return (
        <main className="bg-background min-h-screen lg:w-[80%] mx-auto py-8">
            <button
                onClick={() => navigate("/")}
                className="
                    fixed top-25 cursor-pointer left-4 z-50
                    h-10 w-10 rounded-full
                    bg-white shadow-md
                    flex items-center justify-center
                    hover:bg-gray-100
                    transition
                "
                aria-label="Back to home"
            >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="mx-auto max-w-7xl px-4">
                {/* Auction Ended Banner */}
                {auctionEnded && (
                    <CompletedView
                        productId={productId}
                        auctionEnded={auctionEnded}
                        isWinner={false}
                        isSeller={false}
                    />
                )}

                <div className="grid grid-cols-1  gap-8 lg:grid-cols-3">

                    {/* ---------------- MAIN IMAGES ---------------- */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative h-96 lg:h-[700px] w-full bg-muted rounded-lg overflow-hidden">
                            <img
                                src={images[currentImageIndex]}
                                alt="Product"
                                className="object-cover w-full h-full"
                            />

                            <button
                                onClick={prevImage}
                                className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            <button
                                onClick={() =>
                                    isLiked
                                        ? deleteFromWatchList({ productId: product.id })
                                        : addToWatchList({ productId: product.id })
                                }
                                className={`
                                        absolute top-4 right-4 z-10
                                        h-8 w-8 rounded-lg border border-border
                                        flex items-center justify-center
                                        transition active:scale-95 cursor-pointer
                                        ${isLiked ? "bg-red-100 hover:bg-white" : "bg-white hover:bg-red-100"}
                                    `}
                            >
                                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            </button>
                        </div>

                        {/* -------- THUMBNAILS -------- */}
                        <div className="grid grid-cols-6 gap-2">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-muted rounded-lg cursor-pointer overflow-hidden border-2 ${index === currentImageIndex ? "border-blue-500" : "border-transparent"
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img src={img} alt={`Thumbnail ${index}`} className="object-cover w-full h-20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---------------- RIGHT SIDE INFO ---------------- */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            <p className="text-muted-foreground">{product.categoryName}</p>
                        </div>

                        {/* PRICE BOX */}
                        <Card className="p-6 space-y-5 border-primary/20 bg-card">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Khổi điểm:</span>
                                <span className="font-semibold">{product.startPrice.toLocaleString()} đ</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Bước giá:</span>
                                <span className="font-semibold">+{product.stepPrice.toLocaleString()} đ</span>
                            </div>

                            {product.buyNowPrice > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Giá mua ngay:</span>
                                    <span className="font-semibold">{product.buyNowPrice.toLocaleString()} đ</span>
                                </div>
                            )}

                            {/* Time */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-stat items-center text-l text-muted-foreground">
                                    <span>Bắt đầu:</span>
                                    <span className="font-medium ml-2">{formatTime(product.startDate)}</span>
                                </div>

                                <div className="flex justify-stat items-center text-l text-muted-foreground">
                                    <span>Kết thúc:</span>
                                    <span className="font-medium ml-2">{formatTime(product.endDate)}</span>
                                </div>

                            </div>

                            <div className="flex justify-start items-center">
                                <span className="text-xs text-muted-foreground">Số lượt ra giá:</span>
                                <span className="font-semibold ml-2">{product.biddingCount}</span>
                            </div>

                            {product.topBidding && (
                                <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                                    <p className="text-xs text-muted-foreground">Top Bidder:</p>
                                    <p className="font-semibold">{product.topBidding.fullName}</p>
                                    <p className="text-primary font-bold">
                                        {product.topBidding.bidAmount.toLocaleString()} đ
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowBidModal(true)}
                                className="w-full px-4 py-2 cursor-pointer bg-red-600 text-white font-semibold rounded-lg hover:bg-red-400 transition"
                            >
                                Đấu giá
                            </button>

                            <div className="flex flex-wrap gap-2 pt-3">
                                {product.allowAll && <Badge>Đấu giá tự do</Badge>}
                                {!product.allowAll && <Badge>Giới giạn người chơi</Badge>}
                                {product.isAutoRenewal && <Badge>Tự động gia hạn</Badge>}
                            </div>
                        </Card>

                        {/* SELLER */}
                        <Card className="p-4 space-y-3">
                            <h3 className="font-semibold">Người bán</h3>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <img
                                        src={product.selleravatar || Unknow}
                                        alt="Seller Avatar"
                                        className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium">{product.sellerFullName}</p>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full cursor-pointer" >
                                <MessageCircle className="h-4 w-4 mr-2" /> Nhắn tin
                            </Button>
                        </Card>
                    </div>

                    {/* ---------------- DESCRIPTION ---------------- */}
                    <div className="mt-12 space-y-6 lg:col-span-2">
                        <h3 className="text-xl font-semibold">Mô tả chi tiết</h3>

                        {/* Khung mô tả nổi bật */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="relative">
                                <div
                                    className={`
          prose prose-sm max-w-none transition-all duration-300
          ${(showFullDesc || product.description?.length <= 100) ? "" : "max-h-40 overflow-hidden"}
        `}
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />

                                {/* Fade effect when collapsed */}
                                {!showFullDesc && product.description?.length > 100 && (
                                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent" />
                                )}
                            </div>

                            {product.description?.length > 100 && (
                                <button
                                    className="mt-3 cursor-pointer text-blue-500 text-sm hover:underline"
                                    onClick={() => setShowFullDesc(prev => !prev)}
                                >
                                    {showFullDesc ? "Thu gọn" : "Xem thêm"}
                                </button>
                            )}
                        </div>

                        {/* Chỉ seller mới thấy editor */}
                        {isSeller && (
                            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                                <Button
                                    variant="outline"
                                    className="mb-3 cursor-pointer"
                                    onClick={() => setShowEditor(prev => !prev)}
                                >
                                    {showEditor ? "Ẩn" : "Thêm mô tả"}
                                </Button>

                                {showEditor && (
                                    <>
                                        <ReactQuill
                                            theme="snow"
                                            value={extraDescription}
                                            onChange={setExtraDescription}
                                            className="bg-white"
                                        />

                                        <Button
                                            className="mt-3 cursor-pointer"
                                            disabled={savingDesc}
                                            onClick={handleAddDescription}
                                        >
                                            {savingDesc ? "Saving..." : "Thêm"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* ---------------- BIDS + Q&A ---------------- */}
                <div className="mt-12 space-y-6">
                    <Tabs defaultValue="bids">
                        {/* TABS HEADER */}
                        <TabsList className={`grid w-full ${isSeller ? "grid-cols-3" : "grid-cols-2"}`}>
                            <TabsTrigger value="bids">Lịch sử đấu giá</TabsTrigger>
                            <TabsTrigger value="qna">Q&A</TabsTrigger>

                            {isSeller && (
                                <TabsTrigger value="blacklist">Danh sách chặn</TabsTrigger>
                            )}
                        </TabsList>

                        {/* ==== BID HISTORY ==== */}
                        <TabsContent value="bids" className="mt-6">
                            <BidHistory bids={biddingHistories} handleAddToBlackList={handleAddToBlackList} />
                        </TabsContent>

                        {/* ==== Q&A ==== */}
                        <TabsContent value="qna" className="mt-6">
                            <ProductQnA />
                        </TabsContent>

                        {/* ==== BLACKLIST (ONLY SELLER) ==== */}
                        {isSeller && (
                            <TabsContent value="blacklist" className="mt-6">
                                <Card className="p-5 space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <UserX className="w-5 h-5 text-red-500" />
                                        Blacklist Management
                                    </h3>

                                    <div className="space-y-2">
                                        {blackList.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                No users in blacklist.
                                            </p>
                                        )}

                                        {blackList && blackList.length > 0 && blackList.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex justify-between items-center p-2 border rounded-lg bg-muted/30"
                                            >
                                                <p>{u.bidderName}</p>

                                                <button
                                                    className="p-2 cursor-pointer rounded-full bg-red-500 text-white hover:bg-red-600"
                                                    onClick={() => handleRemoveFromBlacklist({ blacklistId: u.id })}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>



                <div className="mt-12">
                    <RelatedProducts />
                </div>
            </div>

            {/* -------- MODALS -------- */}
            {showBidModal && (
                <PlaceBidModal
                    currentBid={product.currentMaxBidAmount}
                    onClose={() => setShowBidModal(false)}
                    onSubmit={(value) => {
                        console.log("Bid:", value);
                        setShowBidModal(false);
                    }}
                />
            )}
            {loading && <Spinner />}
        </main>
    );
}
