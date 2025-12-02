// Full React JS version (no Next.js)
import { useState } from "react";
import { Heart, Share, MessageCircle, Clock, ShieldCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Card } from "../../../components/ui/Card";
import { BidHistory } from "../components/BidHistory";
import { RelatedProducts } from "../components/RelatedProducts";
import { CompletedView } from "../components/CompletedView";
import { Badge } from "../../../components/ui/Badge";
import { PlaceBidModal } from "../components/PlaceBidModal";
import { BuyNowModal } from "../components/BuyNowModal";

export default function ProductPage({ id }) {
    const [quantity, setQuantity] = useState(1);
    const [bids, setBids] = useState([
        { timestamp: "27/10/2025 10:43", bidder: "****Khoa", amount: 6000000 },
        { timestamp: "27/10/2025 9:43", bidder: "****Kha", amount: 5900000 },
        { timestamp: "27/10/2025 8:43", bidder: "****Tuấn", amount: 5800000 },
        { timestamp: "27/10/2025 7:43", bidder: "****Khánh", amount: 5700000 },
        { timestamp: "27/10/2025 7:43", bidder: "****Khánh", amount: 5700000 },

    ]);
    const [showBidModal, setShowBidModal] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const auctionEnded = true;
    const isWinner = true;
    const isSeller = false;
    const images = [
        "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3a42klzf75801@resize_w900_nl.webp",
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcREvLFd80KEuZpwYepwngepCsIsM2-PM4pBXZjTu7cfJEfj4tJwanGlbApkij5mdbR1xuGvJ3v_nEjOFn27ZWyOMMqDUownhH-XPRITfwbRCBspDiFqFMZbCZ8XjpjhbztaxPwm2w&usqp=CAc",
        "https://example.com/image3.jpg",
        "https://example.com/image4.jpg",
        "https://example.com/image5.jpg",
        "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3a42klzf75801@resize_w900_nl.webp",


    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    return (
        <main className="bg-background min-h-screen py-8">
            <div className="mx-auto max-w-7xl px-4">
                {auctionEnded && (
                    <CompletedView productId={id} auctionEnded={auctionEnded} isWinner={isWinner} isSeller={isSeller} />
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative h-96 lg:h-[500px] w-full bg-muted rounded-lg overflow-hidden">
                            <img
                                src={images[currentImageIndex]}
                                alt={`Product Image ${currentImageIndex + 1}`}
                                className="object-cover w-full h-full"
                            />
                            {/* Left Arrow */}
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            {/* Right Arrow */}
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/80 hover:bg-background">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Thumbnails */}
                        {/* Thumbnails */}
                        <div className="grid grid-cols-6 gap-2">
                            {images.slice(0, 5).map((img, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-muted rounded-lg cursor-pointer overflow-hidden border-2 ${index === currentImageIndex ? "border-primary" : "border-transparent"
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-20" />
                                </div>
                            ))}

                            {images.length > 5 && (
                                <div
                                    key="more"
                                    className={`relative bg-muted rounded-lg cursor-pointer overflow-hidden border-2 border-transparent flex items-center justify-center text-white font-bold text-lg`}
                                    onClick={() => setCurrentImageIndex(5)} // optional: click to go to 6th image
                                >
                                    <img
                                        src={images[5]}
                                        alt={`Thumbnail 6`}
                                        className="object-cover w-full h-20 brightness-50"
                                    />
                                    <span className="absolute">+{images.length - 5}</span>
                                </div>
                            )}
                        </div>

                    </div>


                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">iPhone 11</h1>
                            <p className="text-muted-foreground">Electronics → Mobile Phones</p>
                        </div>

                        <Card className="p-6 space-y-4 border-primary/20 bg-card">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                                <p className="text-3xl font-bold text-primary">10.0M đ</p>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground mb-1">Ends in</p>
                                    <p className="text-lg font-semibold flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" /> 2d 5h
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground mb-1">Total Bids</p>
                                    <p className="text-lg font-semibold">24</p>
                                </div>
                            </div>

                            <Button size="lg" className="w-full" onClick={() => setShowBidModal(true)}>Place Bid</Button>
                            <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={() => setShowBuyModal(true)}>Buy Now - 12M đ</Button>
                        </Card>
                        {/* Highest Bidder Info */}
                        <Card className="p-4 bg-yellow-50/50 border-yellow-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-yellow-700 uppercase flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Highest Bidder
                                </span>
                                <Badge variant="secondary" className="bg-white text-xs text-green-700 border-green-200">Leading</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-bold shadow-sm border-2 border-white">
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Le Gia Bao</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span>{4.5}</span>
                                        <span className="text-gray-400">(12 reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 space-y-3">
                            <h3 className="font-semibold">Seller Information</h3>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-bold">TS</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Tech Store</p>
                                    <p className="text-sm text-yellow-500">★ 4.8 (125 reviews)</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full bg-transparent">
                                <MessageCircle className="h-4 w-4 mr-2" /> Contact Seller
                            </Button>
                        </Card>

                        <div className="flex gap-2">
                            <Button variant="ghost" className="flex-1">
                                <Share className="h-4 w-4 mr-2" /> Share
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-12 space-y-6">
                    <div className="prose max-w-none">
                        <h3>Product Details</h3>
                        <p>This is a high-quality iPhone 11 in excellent condition...</p>
                        <ul>
                            <li>Storage: 64GB</li>
                            <li>Color: Black</li>
                            <li>Condition: Like New</li>
                            <li>Battery Health: 95%</li>
                            <li>Includes all original packaging</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 space-y-6">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bids">Bid History</TabsTrigger>
                            <TabsTrigger value="qna">Q&A</TabsTrigger>
                        </TabsList>

                        <TabsContent value="bids" className="mt-6">
                            <BidHistory bids={bids} />
                        </TabsContent>

                        <TabsContent value="qna" className="mt-6">
                            <div className="space-y-4">
                                <Button>Ask Question</Button>
                                <div className="space-y-3">
                                    <div className="border-l-2 border-primary pl-4 py-3">
                                        <p className="font-semibold text-sm">Q: Is it original?</p>
                                        <p className="text-sm text-muted-foreground mt-1">Asked by: Anonymous User</p>
                                        <p className="text-sm mt-2">A: Yes, this is 100% original iPhone 11 purchased from Apple Store</p>
                                        <p className="text-xs text-muted-foreground mt-1">Answered by: Tech Store</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="mt-12">
                    <RelatedProducts />
                </div>
            </div>
            {showBidModal && (
                <PlaceBidModal
                    currentBid={10000000}
                    onClose={() => setShowBidModal(false)}
                    onSubmit={(value) => {
                        console.log("Bid submitted:", value);
                        setShowBidModal(false);
                    }}
                />
            )}{showBuyModal && (
                <BuyNowModal
                    price={12000000}
                    onClose={() => setShowBuyModal(false)}
                    onConfirm={() => {
                        console.log("Buy Now confirmed");
                        setShowBuyModal(false);
                    }}
                />
            )}
        </main>
    );
}