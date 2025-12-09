import { useState } from "react";
import {
    Heart,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    UserX,
    Trash2
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Card } from "../../../components/ui/Card";
import { BidHistory } from "../components/BidHistory";
import { RelatedProducts } from "../components/RelatedProducts";
import { CompletedView } from "../components/CompletedView";
import { Badge } from "../../../components/ui/Badge";
import { PlaceBidModal } from "../components/PlaceBidModal";
import { BuyNowModal } from "../components/BuyNowModal";
import { useProductDetails } from "../../../hooks/useProductDetails";

import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";


import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ProductPage() {
    const { productId } = useParams();
    const { product, loading, error } = useProductDetails(productId);
    const { user } = useAuth();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showBidModal, setShowBidModal] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);

    const [extraDescription, setExtraDescription] = useState("");
    const [savingDesc, setSavingDesc] = useState(false);
    const [showEditor, setShowEditor] = useState(false);

    // 🔥 Blacklist UI state
    const [blacklist, setBlacklist] = useState([
        { id: 1, name: "john_doe" },
        { id: 2, name: "tester123" },
        { id: 3, name: "annoying_guy99" }
    ]);

    const [newBlacklistUser, setNewBlacklistUser] = useState("");

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!product) return <p>No product found</p>;

    // ================================
    // REAL DATA
    // ================================
    const images = product.images?.map(img => img.imageUrl) ?? [];
    const biddingHistories = product.biddingHistories ?? [];

    const auctionEnded = new Date(product.endDate) < new Date();
    const isSeller = user?.userId === product.sellerId;

    const prevImage = () =>
        setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

    const nextImage = () =>
        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    // ===========================
    // Add Description
    // ===========================
    const handleAddDescription = async () => {

    };

    // ===========================
    // BLACKLIST
    // ===========================
    const addToBlacklist = () => {
        if (!newBlacklistUser.trim()) return;

        setBlacklist(prev => [
            ...prev,
            { id: Date.now(), name: newBlacklistUser }
        ]);

        setNewBlacklistUser("");
    };

    const removeFromBlacklist = id =>
        setBlacklist(prev => prev.filter(u => u.id !== id));

    // ===========================
    // UI
    // ===========================
    return (
        <main className="bg-background min-h-screen py-8">
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

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* ---------------- MAIN IMAGES ---------------- */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative h-96 lg:h-[600px] w-full bg-muted rounded-lg overflow-hidden">
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

                            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/80">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* -------- THUMBNAILS -------- */}
                        <div className="grid grid-cols-6 gap-2">
                            {images.slice(0, 5).map((img, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-muted rounded-lg cursor-pointer overflow-hidden border-2 ${index === currentImageIndex ? "border-primary" : "border-transparent"
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img src={img} alt={`Thumbnail ${index}`} className="object-cover w-full h-20" />
                                </div>
                            ))}

                            {images.length > 5 && (
                                <div
                                    className="relative bg-muted rounded-lg cursor-pointer overflow-hidden flex items-center justify-center border-2 border-transparent"
                                    onClick={() => setCurrentImageIndex(5)}
                                >
                                    <img src={images[5]} className="object-cover w-full h-20 brightness-50" />
                                    <span className="absolute text-white font-bold text-lg">
                                        +{images.length - 5}
                                    </span>
                                </div>
                            )}
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
                                <span className="text-sm text-muted-foreground">Start Price:</span>
                                <span className="font-semibold">{product.startPrice.toLocaleString()} đ</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Step Price:</span>
                                <span className="font-semibold">+{product.stepPrice.toLocaleString()} đ</span>
                            </div>

                            {product.buyNowPrice > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Buy Now Price:</span>
                                    <span className="font-semibold">{product.buyNowPrice.toLocaleString()} đ</span>
                                </div>
                            )}

                            {/* Time */}
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Start:</p>
                                    <p className="font-medium">{new Date(product.startDate).toLocaleString()}</p>
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Ends:</p>
                                    <p className="font-medium">{new Date(product.endDate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">Total Bids:</span>
                                <span className="font-semibold">{product.biddingCount}</span>
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

                            <Button size="lg" className="w-full" onClick={() => setShowBidModal(true)}>
                                Place Bid
                            </Button>

                            <div className="flex flex-wrap gap-2 pt-3">
                                {product.allowAll && <Badge>Public Auction</Badge>}
                                {!product.allowAll && <Badge variant="secondary">Restricted</Badge>}
                                {product.isAutoRenewal && <Badge variant="outline">Auto Renewal</Badge>}
                            </div>
                        </Card>

                        {/* SELLER */}
                        <Card className="p-4 space-y-3">
                            <h3 className="font-semibold">Seller</h3>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-bold">
                                        {product.sellerFullName.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium">{product.sellerFullName}</p>
                                    <p className="text-sm text-muted-foreground">Verified Seller</p>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full">
                                <MessageCircle className="h-4 w-4 mr-2" /> Contact Seller
                            </Button>
                        </Card>
                    </div>

                    {/* ---------------- DESCRIPTION ---------------- */}
                    <div className="mt-12 space-y-6 lg:col-span-2">
                        <h3 className="text-xl font-semibold">Product Details</h3>

                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

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
                            <TabsTrigger value="bids">Bid History</TabsTrigger>
                            <TabsTrigger value="qna">Q&A</TabsTrigger>

                            {isSeller && (
                                <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
                            )}
                        </TabsList>

                        {/* ==== BID HISTORY ==== */}
                        <TabsContent value="bids" className="mt-6">
                            <BidHistory bids={biddingHistories} />
                        </TabsContent>

                        {/* ==== Q&A ==== */}
                        <TabsContent value="qna" className="mt-6">
                            <p>No questions yet.</p>
                        </TabsContent>

                        {/* ==== BLACKLIST (ONLY SELLER) ==== */}
                        {isSeller && (
                            <TabsContent value="blacklist" className="mt-6">
                                <Card className="p-5 space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <UserX className="w-5 h-5 text-red-500" />
                                        Blacklist Management
                                    </h3>

                                    <div className="flex gap-3">
                                        <input
                                            className="flex-1 p-2 border rounded-lg bg-white"
                                            placeholder="Enter username..."
                                            value={newBlacklistUser}
                                            onChange={(e) => setNewBlacklistUser(e.target.value)}
                                        />

                                        <button
                                            onClick={addToBlacklist}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {blacklist.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                No users in blacklist.
                                            </p>
                                        )}

                                        {blacklist.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex justify-between items-center p-2 border rounded-lg bg-muted/30"
                                            >
                                                <p>{u.name}</p>

                                                <button
                                                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                                                    onClick={() => removeFromBlacklist(u.id)}
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
        </main>
    );
}
