// Full React JS version (no Next.js)
import { useState } from "react";
import { Heart, Share, MessageCircle, Clock } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Card } from "../../../components/ui/Card";
import { BidHistory } from "../components/BidHistory";
import { RelatedProducts } from "../components/RelatedProducts";
import { CompletedView } from "../components/CompletedView";

export default function ProductPage({ id }) {
    const [quantity, setQuantity] = useState(1);
    const [bids, setBids] = useState([
        { timestamp: "27/10/2025 10:43", bidder: "****Khoa", amount: 6000000 },
        { timestamp: "27/10/2025 9:43", bidder: "****Kha", amount: 5900000 },
        { timestamp: "27/10/2025 8:43", bidder: "****Tuấn", amount: 5800000 },
        { timestamp: "27/10/2025 7:43", bidder: "****Khánh", amount: 5700000 },
    ]);

    const auctionEnded = true;
    const isWinner = true;
    const isSeller = false;

    return (
        <main className="bg-background min-h-screen py-8">
            <div className="mx-auto max-w-7xl px-4">
                {auctionEnded && (
                    <CompletedView productId={id} auctionEnded={auctionEnded} isWinner={isWinner} isSeller={isSeller} />
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative h-96 lg:h-[500px] w-full bg-muted rounded-lg overflow-hidden">
                            <img src="/iphone-11-premium.jpg" alt="iPhone 11" className="object-cover w-full h-full" />
                            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/80 hover:bg-background">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative h-24 bg-muted rounded-lg cursor-pointer hover:opacity-75 transition overflow-hidden">
                                    <img
                                        src={`/iphone-detail-.jpg?height=100&width=100&query=iphone detail ${i}`}
                                        alt={`Product image ${i}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
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

                            <Button size="lg" className="w-full">Place Bid</Button>
                            <Button variant="outline" size="lg" className="w-full bg-transparent">Buy Now - 12M đ</Button>
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
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="bids">Bid History</TabsTrigger>
                            <TabsTrigger value="qna">Q&A</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-6 space-y-4">
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
                        </TabsContent>

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
        </main>
    );
}