import { useState } from "react"
import { Plus } from "lucide-react"

// đổi lại import theo React thuần
import { Button } from "../../../components/ui/Button"
import ProductCard from "../components/ProductCard"
import ProductSidebar from "../components/ProductSidebar"

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "Điện tử",
        startPrice: 15000000,
        buyNowPrice: 18000000,
        stepPrice: 500000,
        description: "Điện thoại iPhone 13 Pro đen, như mới, đầy đủ box",
        images: ["/modern-smartphone.png"],
        status: "active",
        bids: 12,
        currentPrice: 16500000,
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
    },
    {
        id: 2,
        name: 'MacBook Pro 14"',
        category: "Điện tử",
        startPrice: 30000000,
        buyNowPrice: 35000000,
        stepPrice: 1000000,
        description: "MacBook Pro 14 inch M1 Max, Silver, tình trạng tốt",
        images: ["/silver-macbook-on-desk.png"],
        status: "active",
        bids: 8,
        currentPrice: 31500000,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
    }, {
        id: 4,
        name: 'MacBook Pro 14"',
        category: "Điện tử",
        startPrice: 30000000,
        buyNowPrice: 35000000,
        stepPrice: 1000000,
        description: "MacBook Pro 14 inch M1 Max, Silver, tình trạng tốt",
        images: ["/silver-macbook-on-desk.png"],
        status: "active",
        bids: 8,
        currentPrice: 31500000,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
    }, {
        id: 5,
        name: 'MacBook Pro 14"',
        category: "Điện tử",
        startPrice: 30000000,
        buyNowPrice: 35000000,
        stepPrice: 1000000,
        description: "MacBook Pro 14 inch M1 Max, Silver, tình trạng tốt",
        images: ["/silver-macbook-on-desk.png"],
        status: "active",
        bids: 8,
        currentPrice: 31500000,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
    },
    {
        id: 3,
        name: "Đồng hồ Rolex",
        category: "Thời trang",
        startPrice: 50000000,
        buyNowPrice: 60000000,
        stepPrice: 2000000,
        description: "Rolex Submariner chính hãng, bảo hành còn",
        images: ["/wrist-watch-close-up.png"],
        status: "ended",
        bids: 25,
        currentPrice: 58000000,
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
    },
]

export default function SellerProductsPage() {
    const [products, setProducts] = useState(MOCK_PRODUCTS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState("all")

    const handleAddProduct = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleDeleteProduct = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            setProducts(products.filter((p) => p.id !== id))
        }
    }

    const handleSaveProduct = (product) => {
        if (editingProduct) {
            setProducts(
                products.map((p) =>
                    p.id === editingProduct.id
                        ? { ...product, id: editingProduct.id, createdDate: editingProduct.createdDate }
                        : p
                )
            )
        } else {
            setProducts([
                ...products,
                {
                    ...product,
                    id: Math.max(...products.map((p) => p.id), 0) + 1,
                    createdDate: new Date(),
                },
            ])
        }
        setIsModalOpen(false)
        setEditingProduct(null)
    }

    const activeProducts = products.filter((p) => p.status === "active")
    const endedProducts = products.filter((p) => p.status === "ended")

    const filteredProducts =
        selectedFilter === "active"
            ? activeProducts
            : selectedFilter === "ended"
                ? endedProducts
                : products

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

                        <Button
                            onClick={handleAddProduct}
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4" />
                            Đăng sản phẩm
                        </Button>
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
    )
}
