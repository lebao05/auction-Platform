"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import ProductCard from "../components/ProductCard";
import ProductSidebar from "../components/ProductSidebar";
import { useProduct } from "../../../contexts/ProductMagementContext";

export default function SellerProductsPage() {
    const { products: apiProducts, loadSellerProducts } = useProduct();

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("all");

    useEffect(() => {
        loadSellerProducts();
    }, []);

    useEffect(() => {
        if (!apiProducts) return;
        const normalized = apiProducts.map(normalizeProduct);
        setProducts(normalized);
    }, [apiProducts]);

    const normalizeProduct = (p) => ({
        id: p.id,
        name: p.name,
        category: p.categoryName || "Danh mục",
        startPrice: p.startPrice,
        buyNowPrice: p.buyNowPrice,
        stepPrice: p.stepPrice,
        bids: p.biddingCount,
        currentPrice: p.currentMaxBidAmount,
        endDate: new Date(p.endDate),
        createdDate: new Date(p.startDate),
        images: [p.mainImageUrl],
        status: new Date(p.endDate) > new Date() ? "active" : "ended",
    });
    const handleEditProduct = (product) => {

    };

    const handleDeleteProduct = (id) => {
    };

    const activeProducts = products.filter((p) => p.status === "active");
    const endedProducts = products.filter((p) => p.status === "ended");

    const filteredProducts =
        selectedFilter === "active"
            ? activeProducts
            : selectedFilter === "ended"
                ? endedProducts
                : products;

    return (
        <div className="min-h-screen bg-white">
            <div className="flex gap-6 p-6 pt-16 lg:pt-6">
                <ProductSidebar
                    activeCount={activeProducts.length}
                    endedCount={endedProducts.length}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    theme="light"
                />

                <div className="flex-1 max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Quản lý sản phẩm
                            </h1>
                            <p className="text-gray-600">
                                Quản lý tất cả sản phẩm đấu giá của bạn
                            </p>
                        </div>


                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                    theme="light"
                                />
                            ))
                        ) : (
                            <div className="col-span-full p-12 text-center">
                                <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
