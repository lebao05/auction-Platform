import { useState, useEffect } from "react";
import {
    Heart,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    UserX,
    Trash2,
    ArrowLeft,
    Gavel,
    AlertTriangle,
    Clock,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import thêm cái này
import { Button } from "../../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Card } from "../../../components/ui/Card";
import { BidHistory } from "../components/BidHistory";
import { RelatedProducts } from "../components/RelatedProducts";
import { CompletedView } from "../components/CompletedView";
import { Badge } from "../../../components/ui/Badge";
// import { PlaceBidModal } from "../components/PlaceBidModal"; // Có thể bỏ nếu muốn bid trực tiếp trên trang
import { useProductDetails } from "../../../hooks/useProductDetails";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import Unknow from "../../../utils/Unknow";
import { useWatchList } from "../../../contexts/WatchListContext";
import { convertUTCToLocal, formatDateTimeFull, formatTime } from "../../../utils/DateTimeExtension";
import Spinner from "../../../components/ui/Spinner";
import ProductQnA from "../components/ProductQnA";

// Helper để format tiền tệ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component đếm ngược thời gian đơn giản
const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = convertUTCToLocal(endDate);
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft("Đã kết thúc");
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endDate]);

    return <span className="font-mono font-bold text-red-600">{timeLeft}</span>;
};
const snapToStep = (value, base, step) => {
    const diff = value - base;
    const steps = Math.ceil(diff / step);
    return base + steps * step;
};
export default function ProductPage() {
    const { productId } = useParams();
    const {
        product,
        loading,
        error,
        addToBlacklist,
        removeFromBlacklist,
        biddingHistories,
        // biddingHistories, // Đã có trong product object
        blackList,
        addDescription,
        addComment,
        placeBid, editComment,
        relatedProducts,
        hasMoreRelated,
        loadMoreRelated
    } = useProductDetails(productId);
    const navigate = useNavigate();
    const [showFullDesc, setShowFullDesc] = useState(false);
    const { user } = useAuth();
    const { likedProducts, deleteFromWatchList, addToWatchList } = useWatchList();
    const isLiked = product ? likedProducts.some(lp => lp.productId === product.id && !lp.isDeleted) : false;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // State cho việc Bid
    const [bidAmount, setBidAmount] = useState(0);
    const [showBuyNowConfirm, setShowBuyNowConfirm] = useState(false);
    const [pendingBid, setPendingBid] = useState(null);
    
    // State cho description
    const [extraDescription, setExtraDescription] = useState("");
    const [savingDesc, setSavingDesc] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    
    // Set giá trị mặc định cho ô Bid khi load xong product
    useEffect(() => {
        if (product) {
            const highestBid = product.yourAutoBidding || product.topBidding?.bidAmount || product.startPrice;
            setBidAmount(highestBid);
        }
    }, [product]);
    
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (loading || !product) return <Spinner />;
    
    const images = product.images?.map(img => img.imageUrl) ?? [];
    const auctionEnded = convertUTCToLocal(product.endDate) < new Date();
    const isSeller = user?.userId === product.sellerId;
    const canBid = user && !blackList.some(bl => bl.bidderId === user.id) && user.id !== product.sellerId && !auctionEnded;
    
    // Check xem user hiện tại có phải top bidder không
    const isTopBidder = user && product.topBidding && product.topBidding.userId === user.userId;
    const prevImage = () => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const nextImage = () => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    
    if( product == null ) return;
    const handleRemoveFromBlacklist = async ({ blacklistId }) => {
        try {
            await removeFromBlacklist({ blacklistId });
            toast.success("Xóa thành công!");
        } catch (err) {
            toast.error("Thao tác thất bại!");
        }
    };

    const handleAddToBlackList = async ({ bidderId }) => {
        try {
            await addToBlacklist({ productId, bidderId });
            toast.success("Từ chối ra giá thành công!");
        } catch (err) {
            toast.error("Thao tác thất bại!");
        }
    };
    console.log(product.comments);
    // --- LOGIC BIDDING ---
    const handleBidSubmit = () => {
        if (!user) {
            toast.info("Vui lòng đăng nhập để đấu giá");
            navigate("/login");
            return;
        }

        const currentHighest = product.topBidding?.bidAmount || product.startPrice;
        if (bidAmount < currentHighest) {
            toast.error(`Giá đấu phải lớn hơn hoặc bằng ${formatCurrency(currentHighest)}`);
            return;
        }

        // Logic kiểm tra Buy Now Price
        if (product.buyNowPrice && bidAmount >= product.buyNowPrice) {
            setPendingBid(bidAmount);
            setShowBuyNowConfirm(true);
            return;
        }

        // Nếu không vượt quá Buy Now, gọi hàm bid luôn (Giả sử bạn có hàm call API)
        executeBid(bidAmount);
    };

    const confirmBuyNow = () => {
        if (pendingBid) {
            executeBid(pendingBid);
            setShowBuyNowConfirm(false);
            setPendingBid(null);
        }
    };

    const executeBid = async (amount) => {
        try {
            // Giả sử hàm placeBid từ hook nhận vào { amount, productId }
            await placeBid(amount);
            console.log("Placing bid:", amount);
            toast.success("Đặt giá thành công!");
            // Refresh data logic here
        } catch (error) {
            toast.error("Lỗi khi đặt giá: " + error.message);
        }
    };

    // Logic thêm mô tả
    const handleAddDescription = async () => {
        if (extraDescription === `<p><br></p>` || !extraDescription.trim()) {
            toast.warning("Mô tả không được trống");
            return;
        }
        try {
            setSavingDesc(true);
            const now = new Date();
            await addDescription({
                description: `<br/><div class="my-4 p-3 bg-gray-50 border-l-4 border-blue-500 rounded-r">
                    <p class="text-xs text-gray-500 font-semibold flex items-center gap-1">
                        <span>✏️ Cập nhật lúc:</span>
                        <span>${formatDateTimeFull(now)}</span>
                    </p>
                    <div class="mt-1">${extraDescription}</div>
                </div>`
            });
            setExtraDescription("");
            setShowEditor(false);
            toast.success("Đã thêm mô tả bổ sung");
        } catch (err) {
            toast.error("Thêm mô tả thất bại");
        } finally {
            setSavingDesc(false);
        }
    };

    return (
        <main className="bg-background min-h-screen pb-12 pt-6">
            {/* Back Button */}
            <div className="container mx-auto px-4 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </button>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Banner khi kết thúc */}
                {auctionEnded && (
                    <div className="mb-6">
                        <CompletedView
                            productId={productId}
                            auctionEnded={auctionEnded}
                            isWinner={isTopBidder}
                            isSeller={isSeller}
                            topBidding={product.topBidding}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ---------------- LEFT COLUMN: IMAGES (7 cols) ---------------- */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="relative aspect-[4/3] w-full bg-muted rounded-xl overflow-hidden border border-border shadow-sm group">
                            {/* Bọc ảnh bằng AnimatePresence để xử lý hiệu ứng khi component biến mất/xuất hiện */}
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex} // Key cực kỳ quan trọng để Framer Motion nhận biết ảnh đã đổi
                                    src={images[currentImageIndex] || Unknow}
                                    alt="Product Main"
                                    initial={{ opacity: 0, x: 10 }} // Bắt đầu: mờ và hơi lệch phải
                                    animate={{ opacity: 1, x: 0 }}  // Hiện lên: rõ nét và về vị trí cũ
                                    exit={{ opacity: 0, x: -10 }}   // Thoát ra: mờ dần và lệch trái
                                    transition={{ duration: 0.3 }}   // Thời gian chuyển (0.3 giây)
                                    className="absolute inset-0 object-cover w-full h-full"
                                />
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Wishlist Button - Thêm z-10 để không bị ảnh đè lên khi animation */}
                            <button
                                onClick={() => isLiked ? deleteFromWatchList({ productId: product.id }) : addToWatchList({ productId: product.id })}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-all"
                            >
                                <Heart className={`h-6 w-6 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                            </button>
                        </div>

                        {/* Thumbnails (Giữ nguyên hoặc thêm motion cho đẹp) */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`Thumb ${index}`} className="object-cover w-full h-full" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* ---------------- RIGHT COLUMN: INFO & BIDDING (5 cols) ---------------- */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Header Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    {product.categoryName || "Uncategorized"}
                                </Badge>
                                {product.isAutoRenewal && <Badge variant="outline" className="text-green-600 border-green-200">Tự động gia hạn</Badge>}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                        </div>

                        {/* --- MAIN BIDDING CARD --- */}
                        <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
                            <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-gray-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Giá cao nhất hiện tại</p>
                                        <div className="text-4xl font-extrabold text-primary">
                                            {product.topBidding ? formatCurrency(product.topBidding.bidAmount) : formatCurrency(product.startPrice)}
                                        </div>
                                        {/* Status Indicators */}
                                        <div className="mt-2 flex items-center gap-2 text-sm">
                                            {product.biddingCount > 0 ? (
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <Gavel className="w-4 h-4" /> {product.biddingCount} lượt đấu giá
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 italic">Chưa có lượt đấu giá nào</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                                            <Clock className="w-4 h-4" /> Thời gian còn lại
                                        </p>
                                        <div className="text-xl mt-1">
                                            <CountdownTimer endDate={product.endDate} />
                                        </div>
                                    </div>
                                </div>

                                {/* Top Bidder Info */}
                                {product.topBidding && (
                                    <div className={`p-3 rounded-lg flex items-center justify-between ${isTopBidder ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isTopBidder ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-700'}`}>
                                                {product.topBidding.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Người giữ giá</p>
                                                <p className={`text-sm font-semibold ${isTopBidder ? 'text-green-700' : 'text-gray-800'}`}>
                                                    {isTopBidder ? "Bạn đang dẫn đầu!" : product.topBidding.fullName}
                                                </p>
                                            </div>
                                        </div>
                                        {isTopBidder && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                    </div>
                                )}

                                {/* Your Bid Info */}
                                {product.yourRecentBidding && !isTopBidder && (
                                    <div className="mt-2 p-2 rounded bg-red-50 border border-red-100 flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-500" />
                                        <p className="text-sm text-red-700">
                                            Bạn đã bị vượt mặt! Giá của bạn: <span className="font-semibold">{formatCurrency(product.yourRecentBidding)}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ACTION AREA */}
                            <div className="p-6 bg-white">
                                {!auctionEnded && canBid ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500">Bước giá:</span>
                                                <span className="font-medium text-gray-900">+{formatCurrency(product.stepPrice)}</span>
                                            </div>
                                            {product.buyNowPrice && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-gray-500">Mua ngay:</span>
                                                    <span className="font-bold text-orange-600">{formatCurrency(product.buyNowPrice)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {
                                                product.yourAutoBidding &&
                                                <label className="text-sm font-medium text-gray-700">Giá tự động của bạn (VND): {formatCurrency(product.yourAutoBidding)}</label>
                                            }
                                            <br />
                                            <label className="text-sm font-medium text-gray-700">Đặt giá của bạn (VND)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={bidAmount}
                                                    onChange={(e) => {
                                                        const raw = Number(e.target.value);
                                                        const base = product.yourAutoBidding || product.topBidding?.bidAmount || product.startPrice;
                                                        const snapped = snapToStep(raw, base, product.stepPrice);
                                                        setBidAmount(snapped);
                                                    }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-semibold"
                                                    min={(product.topBidding?.bidAmount || product.startPrice) + product.stepPrice}
                                                />
                                                <Button
                                                    onClick={handleBidSubmit}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-6 font-bold text-lg"
                                                >
                                                    Đấu giá
                                                </Button>
                                            </div>
                                            {/* Quick Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setBidAmount((product.topBidding?.bidAmount || product.startPrice) + product.stepPrice)}
                                                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition"
                                                >
                                                    Giá tối thiểu
                                                </button>
                                                <button
                                                    onClick={() => setBidAmount((product.topBidding?.bidAmount || product.startPrice) + product.stepPrice * 2)}
                                                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition"
                                                >
                                                    +2 Bước giá
                                                </button>
                                                {product.buyNowPrice && (
                                                    <button
                                                        onClick={() => setBidAmount(product.buyNowPrice)}
                                                        className="text-xs px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded transition font-medium"
                                                    >
                                                        Đặt giá Mua ngay
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        {auctionEnded ? (
                                            <p className="text-gray-500 font-medium">Phiên đấu giá đã kết thúc</p>
                                        ) : !user ? (
                                            <p className="text-gray-500">Vui lòng <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/login')}>đăng nhập</span> để đấu giá</p>
                                        ) : isSeller ? (
                                            <p className="text-gray-500">Bạn là người bán sản phẩm này</p>
                                        ) : (
                                            <p className="text-red-500 font-medium flex items-center justify-center gap-2">
                                                <UserX className="w-4 h-4" /> Bạn không thể tham gia đấu giá này
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Seller Card */}
                        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img
                                    src={product.selleravatar || Unknow}
                                    alt="Seller"
                                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Người bán</p>
                                <h3 className="font-bold text-gray-900">{product.sellerFullName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                                    <span className="text-xs text-gray-400"> (128 đánh giá)</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-gray-300">
                                <MessageCircle className="w-4 h-4 mr-1" /> Chat
                            </Button>
                        </Card>

                        {/* Mobile Description (Shown below on mobile) */}
                        <div className="lg:hidden mt-8">
                            <DescriptionSection
                                description={product.description}
                                showFullDesc={showFullDesc}
                                setShowFullDesc={setShowFullDesc}
                                isSeller={isSeller}
                                showEditor={showEditor}
                                setShowEditor={setShowEditor}
                                extraDescription={extraDescription}
                                setExtraDescription={setExtraDescription}
                                handleAddDescription={handleAddDescription}
                                savingDesc={savingDesc}
                            />
                        </div>
                    </div>
                </div>

                {/* ---------------- TABS: HISTORY, Q&A, BLACKLIST ---------------- */}
                <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <Tabs defaultValue="bids" className="w-full">
                        <div className="border-b border-gray-200 px-6 pt-4">
                            <TabsList className="bg-transparent gap-6 p-0 h-auto">
                                <TabsTrigger value="bids" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-gray-500 data-[state=active]:text-primary text-base">
                                    Lịch sử đấu giá
                                </TabsTrigger>
                                <TabsTrigger value="qna" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-gray-500 data-[state=active]:text-primary text-base">
                                    Hỏi đáp & Bình luận
                                </TabsTrigger>
                                {isSeller && (
                                    <TabsTrigger value="blacklist" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none px-0 pb-3 text-gray-500 data-[state=active]:text-red-600 text-base">
                                        Danh sách chặn
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        <div className="p-6 bg-gray-50 min-h-[300px]">
                            <TabsContent value="bids" className="mt-0">
                                <BidHistory bids={biddingHistories || []} handleAddToBlackList={handleAddToBlackList} isSeller={isSeller} />
                            </TabsContent>

                            <TabsContent value="qna" className="mt-0">
                                <ProductQnA comments={product.comments || []} productId={product.id}
                                    addComment={addComment} editComment={editComment} user={user} />
                            </TabsContent>

                            {isSeller && (
                                <TabsContent value="blacklist" className="mt-0">
                                    <BlackListSection blackList={blackList} onRemove={handleRemoveFromBlacklist} />
                                </TabsContent>
                            )}
                        </div>
                    </Tabs>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
                    <RelatedProducts categoryId={product.categoryId} currentProductId={product.id}
                        products={relatedProducts}
                        hasMoreRelated={hasMoreRelated}
                        loadMoreRelated={loadMoreRelated} />
                </div>
            </div>

            {/* --- MODAL XÁC NHẬN MUA NGAY --- */}
            {showBuyNowConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-orange-600 mb-4">
                            <AlertTriangle className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Xác nhận Mua ngay?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Bạn đã đặt mức giá <span className="font-bold text-gray-900">{formatCurrency(pendingBid)}</span>.
                            <br />
                            Mức giá này cao hơn hoặc bằng giá <strong>Mua ngay</strong> ({formatCurrency(product.buyNowPrice)}).
                            <br /><br />
                            Hành động này sẽ kết thúc phiên đấu giá ngay lập tức và bạn sẽ là người chiến thắng.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowBuyNowConfirm(false)}>Hủy bỏ</Button>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={confirmBuyNow}>
                                Xác nhận Mua ngay
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {loading && <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-[999]"><Spinner /></div>}
        </main>
    );
}

// Sub-component cho phần Description để gọn code
const DescriptionSection = ({
    description, showFullDesc, setShowFullDesc,
    isSeller, showEditor, setShowEditor,
    extraDescription, setExtraDescription, handleAddDescription, savingDesc
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-primary pl-3">Mô tả sản phẩm</h3>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className={`prose prose-sm md:prose-base max-w-none transition-all duration-300 overflow-hidden ${showFullDesc ? "" : "max-h-[300px] relative"}`}>
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                    {!showFullDesc && description?.length > 300 && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                    )}
                </div>
                {description?.length > 300 && (
                    <div className="text-center mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                            {showFullDesc ? "Thu gọn nội dung" : "Xem tất cả nội dung"}
                            {showFullDesc ? <ChevronLeft className="w-4 h-4 ml-1 rotate-90" /> : <ChevronRight className="w-4 h-4 ml-1 rotate-90" />}
                        </Button>
                    </div>
                )}
            </div>

            {isSeller && (
                <div className="mt-6 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-700">Cập nhật thông tin bổ sung</h4>
                        <Button variant="outline" size="sm" onClick={() => setShowEditor(!showEditor)}>
                            {showEditor ? "Hủy" : "Thêm mô tả"}
                        </Button>
                    </div>

                    {showEditor && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <ReactQuill theme="snow" value={extraDescription} onChange={setExtraDescription} className="bg-white" />
                            <div className="p-3 bg-gray-50 flex justify-end">
                                <Button size="sm" disabled={savingDesc} onClick={handleAddDescription}>
                                    {savingDesc ? "Đang lưu..." : "Lưu bổ sung"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Sub-component cho Blacklist
const BlackListSection = ({ blackList, onRemove }) => {
    if (!blackList || blackList.length === 0) {
        return <div className="text-center py-10 text-gray-400">Danh sách chặn trống.</div>;
    }
    return (
        <div className="space-y-3">
            {blackList.map((u) => (
                <div key={u.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <UserX className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{u.bidderName}</p>
                            <p className="text-xs text-gray-500">Bị chặn: {formatDateTimeFull(u.createdAt)}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => onRemove({ blacklistId: u.id })}>
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            ))}
        </div>
    );
};