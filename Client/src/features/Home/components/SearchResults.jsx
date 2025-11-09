import { ProductCard } from "./ProductCard";
import { SortDropdown } from "./SortDropdown";

export function SearchResults({ products, totalResults, onSort, sortBy }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Found {totalResults} products
          </p>
        </div>
        <SortDropdown onSort={onSort} sortBy={sortBy} />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
