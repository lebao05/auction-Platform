import { ProductCard } from "../components/ProductCard";
const allProducts = [
  {
    id: 1,
    name: "iPhone 11",
    currentBid: 10000000,
    image: "/modern-smartphone.png",
    endsIn: "2d 5h",
    bids: 24,
    seller: {
      name: "Tech Store",
      rating: 4.8,
    },
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
    seller: {
      name: "Laptop World",
      rating: 4.9,
    },
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
    seller: {
      name: "Luxury Watches",
      rating: 5.0,
    },
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
    seller: {
      name: "Sneaker Palace",
      rating: 4.7,
    },
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
    seller: {
      name: "Camera Pro",
      rating: 4.9,
    },
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
    seller: {
      name: "Luxury Watches",
      rating: 5.0,
    },
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
    seller: {
      name: "Tech Store",
      rating: 4.8,
    },
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
    seller: {
      name: "Audio World",
      rating: 4.6,
    },
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
    seller: {
      name: "Luxury Store",
      rating: 5.0,
    },
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
    seller: {
      name: "Gaming Hub",
      rating: 4.7,
    },
    category: "Electronics",
    buyNowPrice: 10500000,
    postedDate: "4 hours ago",
    isNew: true,
  },
];

const getProductsEndingSoon = () => {
  return allProducts.slice(0, 5);
};

const getProductsMostBids = () => {
  return [...allProducts].sort((a, b) => b.bids - a.bids).slice(0, 5);
};

const getProductsHighestPrice = () => {
  return [...allProducts]
    .sort((a, b) => b.currentBid - a.currentBid)
    .slice(0, 5);
};

export function FeaturedProducts() {
  return (
    <div className="space-y-16">
      {/* Top 5 Ending Soon */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Ending Soon</h2>
          <p className="text-muted-foreground">
            Don't miss these auctions ending in 24 hours
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getProductsEndingSoon().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Top 5 Most Bids */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Most Active Auctions</h2>
          <p className="text-muted-foreground">
            Trending items with the most bidding activity
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getProductsMostBids().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Top 5 Highest Price */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Premium Items</h2>
          <p className="text-muted-foreground">
            High-value auctions with the best features
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getProductsHighestPrice().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
