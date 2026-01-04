"use client"

import { ChevronDown } from "lucide-react";
import { useWatchList } from "../../../contexts/WatchListContext";
import { ProductCard } from "../../Home/components/ProductCard"

export function RelatedProducts({
  products,
  loadMoreRelated,
  hasMoreRelated,
  isLoading
}) {
  const { likedProducts, deleteFromWatchList, addToWatchList } = useWatchList();
  console.log(products);
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Đề xuất</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToWatchList={addToWatchList}
            likedProducts={likedProducts}
            deleteFromWatchList={deleteFromWatchList}
          />
        ))}
      </div>

      {/* Show button only if there are more products to load */}
      {hasMoreRelated && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMoreRelated}
            disabled={isLoading}
            className="group relative flex cursor-pointer items-center gap-2 px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 active:scale-95 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>Xem thêm sản phẩm</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}