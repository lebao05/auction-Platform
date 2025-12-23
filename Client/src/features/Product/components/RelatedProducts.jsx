"use client"

import { ProductCard } from "./ProductCard"

const relatedProducts = [
  {
    id: 2,
    name: "iPhone 12 Pro",
    currentBid: 11500000,
    image: "/iphone-12-pro.jpg",
    endsIn: "4d 2h",
    bids: 19,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
  },
  {
    id: 3,
    name: "iPhone 13 Mini",
    currentBid: 12000000,
    image: "/iphone-13-mini.jpg",
    endsIn: "1d 18h",
    bids: 28,
    seller: { name: "Tech Pro", rating: 4.9 },
    category: "Electronics",
  },
  {
    id: 4,
    name: "Samsung Galaxy S21",
    currentBid: 9500000,
    image: "/samsung-galaxy-s21.png",
    endsIn: "5d 3h",
    bids: 15,
    seller: { name: "Mobile World", rating: 4.7 },
    category: "Electronics",
  },
  {
    id: 5,
    name: "Google Pixel 6 Pro",
    currentBid: 13000000,
    image: "/google-pixel-6-pro.jpg",
    endsIn: "2d 12h",
    bids: 22,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
  },
]

export function RelatedProducts() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Đề xuất</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
