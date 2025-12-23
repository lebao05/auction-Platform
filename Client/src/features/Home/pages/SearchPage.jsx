import { useState } from "react";
import SearchFilters from "../components/SearchFilters";
import { useSearchProducts } from "../../../hooks/useSearchProducts";
import { ProductCard } from "../components/ProductCard";
import { Loader2, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useWatchList } from "../../../contexts/WatchListContext";
export default function SearchPage() {
  const { products,
    loading,
    error,
    hasMore,
    loadMore,
    setSearchFilter } = useSearchProducts();
  const { likedProducts, addToWatchList, deleteFromWatchList } = useWatchList();
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Thanh lọc & Tìm kiếm */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <SearchFilters setSearchFilter={setSearchFilter} />
        </div>
      </div>

      <div className="mx-auto lg:w-[68%] xl:w-[60%] px-4 py-8">
        {/* Tiêu đề & Trạng thái */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {loading && products.length === 0 ? "Đang tìm..." : `Kết quả tìm kiếm`}
          </h2>
        </div>

        {/* Lưới sản phẩm */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1  gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                likedProducts={likedProducts || []}
                addToWatchList={addToWatchList}
                deleteFromWatchList={deleteFromWatchList}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <Search className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
            </div>
          )
        )}

        {/* Nút Load More */}
        <div className="mt-12 flex flex-col items-center gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải thêm...
            </div>
          )}

          {/* Container bọc nút Load More */}
          <div className="mt-12 mb-20 flex justify-center w-full">
            {loading ? (
              /* Trạng thái đang tải thêm */
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Đang tải thêm sản phẩm...</p>
              </div>
            ) : (
              /* Nút Xem thêm khi có dữ liệu mới */
              hasMore && (
                <button
                  onClick={loadMore}
                  className="
                  cursor-pointer
                  group relative px-10 py-3 
                  border-2 border-slate-900 
                  text-slate-900 font-bold uppercase tracking-wider text-sm
                  overflow-hidden transition-all duration-300
                  hover:bg-slate-900 hover:text-white
                  active:scale-95 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]
                  hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
                "
                >
                  Xem thêm kết quả
                </button>
              )
            )}

            {/* Thông báo khi đã hết sản phẩm */}
            {!hasMore && products.length > 0 && !loading && (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="h-px w-20 bg-slate-200" />
                <p className="text-sm italic">Bạn đã xem hết danh sách sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
