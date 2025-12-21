import { CategoryBrowser } from "../components/CategoryBrowser";
import { FeaturedProducts } from "../components/FeaturedProducts";
import MarketplaceUI from "../components/MarketplaceUi";

export default function HomePage() {
  return (
    <main className="bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 flex flex-col">

        {/* Header / Top UI */}
        <MarketplaceUI />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">

          {/* Sidebar */}
          <aside className="hidden lg:block border-r pr-2 overflow-y-auto min-h-0">
            <CategoryBrowser />
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
