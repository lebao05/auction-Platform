import { CategoryBrowser } from "../components/CategoryBrowser";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { SearchBar } from "../components/SearchBar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <SearchBar />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="hidden lg:block">
            <CategoryBrowser />
          </aside>
          <div className="lg:col-span-3">
            <FeaturedProducts />
          </div>
        </div>
      </div>
    </main>
  );
}
