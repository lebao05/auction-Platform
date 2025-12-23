import { useCategory } from "../../../hooks/useCategory";
import { CategoryBrowser } from "../components/CategoryBrowser";
import { FeaturedProducts } from "../components/FeaturedProducts";
import MarketplaceUI from "../components/MarketplaceUi";

export default function HomePage() {
  const { categories, loading, error } = useCategory();

  return (
    <main className="bg-background overflow-hidden">
      <div className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 py-8 flex justify-center text-3xl font-bold text-white">
        Giá tốt, gần bạn, chơi nhanh!
      </div>
      <div className="mx-auto max-w-7xl px-4 mb-15 flex flex-col">

        {/* Header / Top UI */}
        <MarketplaceUI categories={categories} />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">

          {/* Sidebar */}
          <aside className="hidden lg:block border-r pr-2 overflow-y-auto min-h-0">
            <CategoryBrowser rawCategories={categories} loading={loading} error={error} />
          </aside>

          {/* Products – ONLY THIS SCROLLS */}
          <section className="lg:col-span-3 overflow-y-auto min-h-0">
            <FeaturedProducts />
          </section>

        </div>
      </div>
    </main>
  );
}
