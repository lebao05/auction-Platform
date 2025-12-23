import { ProductCard } from "../components/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/Tabs";
import { useTopSoonProducts } from "../../../hooks/useTopSoonProducts";
import { useTopCountProducts } from "../../../hooks/useTopCountProducts";
import { useTopValueProducts } from "../../../hooks/useTopValueProducts";
import { useWatchList } from "../../../contexts/WatchListContext";
import Spinner from "../../../components/ui/Spinner";

export function FeaturedProducts() {
  const { addToWatchList, deleteFromWatchList, likedProducts } = useWatchList();
  const endingSoon = useTopSoonProducts();
  const mostBids = useTopCountProducts();
  const highestPrice = useTopValueProducts();

  const renderGrid = (hook) => (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hook.products.map((product, index) => (
          <ProductCard key={index} product={product}
            addToWatchList={addToWatchList} deleteFromWatchList={deleteFromWatchList}
            likedProducts={likedProducts} />
        ))}
      </div>

      {hook.hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={hook.loadMore}
            disabled={hook.loading}
            className="
              px-6 py-2 rounded-lg border border-gray-300
              transition-all duration-200 ease-in-out
              cursor-pointer

              bg-white
              hover:bg-gray-200
              active:scale-95

              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:bg-transparent
              disabled:hover:text-inherit
            "
          >
            {hook.loading ? (
              <Spinner />
            ) : (
              "Xem thêm"
            )}
          </button>

        </div>
      )}
    </>
  );

  return (
    <div className="space-y-16">
      <Tabs defaultValue="endingSoon">
        <TabsList className="flex gap-4 mb-6">
          <TabsTrigger value="endingSoon">Sắp kết thúc</TabsTrigger>
          <TabsTrigger value="mostBids">Ra giá nhiều nhất</TabsTrigger>
          <TabsTrigger value="highestPrice">Giá trị cao</TabsTrigger>
        </TabsList>

        <TabsContent value="endingSoon">
          {renderGrid(endingSoon)}
        </TabsContent>

        <TabsContent value="mostBids">
          {renderGrid(mostBids)}
        </TabsContent>

        <TabsContent value="highestPrice">
          {renderGrid(highestPrice)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
