import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchFilters } from "../components/SearchFilters";
import { SearchResults } from "../components/SearchResults";
import { Pagination } from "../components/Pagination";

const allProducts = [
  {
    id: 1,
    name: "iPhone 11",
    currentBid: 10000000,
    image: "/modern-smartphone.png",
    endsIn: "2d 5h",
    bids: 24,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
    buyNowPrice: 12000000,
    postedDate: "2 days ago",
  },
  {
    id: 2,
    name: 'Apple MacBook Pro 16"',
    currentBid: 28000000,
    image: "/silver-macbook-on-desk.png",
    endsIn: "1d 12h",
    bids: 18,
    seller: { name: "Laptop World", rating: 4.9 },
    category: "Electronics",
    buyNowPrice: 32000000,
    postedDate: "1 day ago",
  },
  {
    id: 3,
    name: "Rolex Submariner Watch",
    currentBid: 15000000,
    image: "/rolex-watch.jpg",
    endsIn: "3d 1h",
    bids: 32,
    seller: { name: "Luxury Watches", rating: 5.0 },
    category: "Fashion",
    buyNowPrice: 18000000,
    postedDate: "3 days ago",
  },
  {
    id: 4,
    name: "Nike Air Force 1 Limited",
    currentBid: 3500000,
    image: "/athletic-shoes.png",
    endsIn: "18h 30m",
    bids: 45,
    seller: { name: "Sneaker Palace", rating: 4.7 },
    category: "Fashion",
    buyNowPrice: 4500000,
    postedDate: "12 hours ago",
    isNew: true,
  },
  {
    id: 5,
    name: "Canon EOS R5 Camera",
    currentBid: 35000000,
    image: "/professional-camera.png",
    endsIn: "2d 3h",
    bids: 12,
    seller: { name: "Camera Pro", rating: 4.9 },
    category: "Electronics",
    buyNowPrice: 40000000,
    postedDate: "5 hours ago",
    isNew: true,
  },
  {
    id: 6,
    name: "Omega Seamaster",
    currentBid: 12000000,
    image: "/luxury-watch.jpg",
    endsIn: "4d 2h",
    bids: 28,
    seller: { name: "Luxury Watches", rating: 5.0 },
    category: "Fashion",
    buyNowPrice: 14000000,
    postedDate: "1 day ago",
  },
  {
    id: 7,
    name: "AirPods Pro Max",
    currentBid: 7500000,
    image: "/diverse-people-listening-headphones.png",
    endsIn: "6h 20m",
    bids: 38,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
    buyNowPrice: 8500000,
    postedDate: "3 hours ago",
    isNew: true,
  },
  {
    id: 8,
    name: "Sony WH-1000XM5",
    currentBid: 5500000,
    image: "/wireless-headphones.png",
    endsIn: "12h 45m",
    bids: 42,
    seller: { name: "Audio World", rating: 4.6 },
    category: "Electronics",
    buyNowPrice: 6500000,
    postedDate: "8 hours ago",
  },
  {
    id: 9,
    name: "Louis Vuitton Bag",
    currentBid: 18000000,
    image: "/luxury-bag.png",
    endsIn: "5d 6h",
    bids: 22,
    seller: { name: "Luxury Store", rating: 5.0 },
    category: "Fashion",
    buyNowPrice: 22000000,
    postedDate: "2 days ago",
  },
  {
    id: 10,
    name: "PlayStation 5",
    currentBid: 9000000,
    image: "/modern-gaming-console.png",
    endsIn: "8h 15m",
    bids: 35,
    seller: { name: "Gaming Hub", rating: 4.7 },
    category: "Electronics",
    buyNowPrice: 10500000,
    postedDate: "4 hours ago",
    isNew: true,
  },
  {
    id: 11,
    name: "Dell XPS 15 Laptop",
    currentBid: 22000000,
    image: "/silver-macbook-on-desk.png",
    endsIn: "3d 8h",
    bids: 15,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
    buyNowPrice: 26000000,
    postedDate: "18 hours ago",
  },
  {
    id: 12,
    name: 'Samsung 65" QLED TV',
    currentBid: 18000000,
    image: "/professional-camera.png",
    endsIn: "5d 2h",
    bids: 20,
    seller: { name: "Electronics World", rating: 4.9 },
    category: "Electronics",
    buyNowPrice: 21000000,
    postedDate: "2 days ago",
  },
  {
    id: 13,
    name: "Google Pixel 8 Pro",
    currentBid: 16000000,
    image: "/modern-smartphone.png",
    endsIn: "1d 6h",
    bids: 28,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
    buyNowPrice: 19000000,
    postedDate: "12 hours ago",
    isNew: true,
  },
  {
    id: 14,
    name: "DJI Air 3S Drone",
    currentBid: 24000000,
    image: "/professional-camera.png",
    endsIn: "2d 10h",
    bids: 18,
    seller: { name: "Drone Pro", rating: 4.7 },
    category: "Electronics",
    buyNowPrice: 28000000,
    postedDate: "1 day ago",
  },
  {
    id: 15,
    name: "Apple Watch Series 9",
    currentBid: 8000000,
    image: "/luxury-watch.jpg",
    endsIn: "4h 30m",
    bids: 32,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
    buyNowPrice: 9500000,
    postedDate: "6 hours ago",
    isNew: true,
  },
  {
    id: 16,
    name: "Nikon Z9 Professional Camera",
    currentBid: 42000000,
    image: "/professional-camera.png",
    endsIn: "7d 1h",
    bids: 8,
    seller: { name: "Camera Pro", rating: 5.0 },
    category: "Electronics",
    buyNowPrice: 48000000,
    postedDate: "4 days ago",
  },
  {
    id: 17,
    name: "Microsoft Surface Pro 10",
    currentBid: 20000000,
    image: "/silver-macbook-on-desk.png",
    endsIn: "2d 15h",
    bids: 16,
    seller: { name: "Laptop World", rating: 4.9 },
    category: "Electronics",
    buyNowPrice: 24000000,
    postedDate: "20 hours ago",
  },
  {
    id: 18,
    name: "Samsung Galaxy Watch 6",
    currentBid: 6500000,
    image: "/luxury-watch.jpg",
    endsIn: "3d 4h",
    bids: 25,
    seller: { name: "Tech Store", rating: 4.8 },
    category: "Electronics",
    buyNowPrice: 7500000,
    postedDate: "14 hours ago",
    isNew: true,
  },
  {
    id: 19,
    name: 'iPad Pro 12.9" M2',
    currentBid: 19000000,
    image: "/silver-macbook-on-desk.png",
    endsIn: "1d 20h",
    bids: 22,
    seller: { name: "Tablet World", rating: 4.7 },
    category: "Electronics",
    buyNowPrice: 23000000,
    postedDate: "5 hours ago",
    isNew: true,
  },
  {
    id: 20,
    name: "GoPro Hero 12 Black",
    currentBid: 11500000,
    image: "/professional-camera.png",
    endsIn: "6h 45m",
    bids: 29,
    seller: { name: "Camera Pro", rating: 4.9 },
    category: "Electronics",
    buyNowPrice: 13500000,
    postedDate: "3 hours ago",
  },
];

const ITEMS_PER_PAGE = 8;

export default function SearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    priceRange: [0, 50000000],
    category: "",
    timeRange: "all",
  });

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      product.currentBid >= filters.priceRange[0] &&
      product.currentBid <= filters.priceRange[1];

    const matchesCategory =
      !filters.category ||
      product.category.toLowerCase() === filters.category.toLowerCase();

    const getHoursUntilEnd = (endsIn) => {
      const parts = endsIn.split(" ");
      let hours = 0;
      for (let i = 0; i < parts.length; i += 2) {
        const value = parseInt(parts[i]);
        const unit = parts[i + 1];
        if (unit.includes("d")) hours += value * 24;
        else if (unit.includes("h")) hours += value;
      }
      return hours;
    };

    let matchesTime = true;
    if (filters.timeRange === "24h")
      matchesTime = getHoursUntilEnd(product.endsIn) <= 24;
    else if (filters.timeRange === "48h")
      matchesTime = getHoursUntilEnd(product.endsIn) <= 48;
    else if (filters.timeRange === "7d")
      matchesTime = getHoursUntilEnd(product.endsIn) <= 168;

    return matchesSearch && matchesPrice && matchesCategory && matchesTime;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.currentBid - b.currentBid;
      case "price-high":
        return b.currentBid - a.currentBid;
      case "most-bids":
        return b.bids - a.bids;
      case "ending-soon": {
        const getMinutes = (endsIn) => {
          const parts = endsIn.split(" ");
          let minutes = 0;
          for (let i = 0; i < parts.length; i += 2) {
            const value = parseInt(parts[i]);
            const unit = parts[i + 1];
            if (unit.includes("d")) minutes += value * 24 * 60;
            else if (unit.includes("h")) minutes += value * 60;
            else if (unit.includes("m")) minutes += value;
          }
          return minutes;
        };
        return getMinutes(a.endsIn) - getMinutes(b.endsIn);
      }
      case "newest":
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-background">
      <SearchBar />
      <div className="mx-auto max-w-7xl px-4 py-6 border-b">
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={setSearchQuery}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <SearchResults
          products={paginatedProducts}
          totalResults={sortedProducts.length}
          onSort={setSortBy}
          sortBy={sortBy}
        />
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
