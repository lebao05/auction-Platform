import { useState, useEffect } from "react";
import { searchProductsApi } from "../services/product.service";

const PAGE_SIZE = 8;

export function useSearchProducts() {
    const [products, setProducts] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Sửa lỗi: useState trả về mảng [value, setter]
    const [searchFilters, setSearchFilter] = useState({
        keyword: "",
        categoryId: "",
        sortBy: ""
    });

    // Reset khi bất kỳ filter nào thay đổi
    useEffect(() => {
        setProducts([]);
        setPageIndex(1);
        setHasMore(true);
    }, [searchFilters.keyword, searchFilters.categoryId, searchFilters.sortBy]);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            // Chỉ dừng nếu không còn dữ liệu VÀ không phải là trang 1
            if (!hasMore && pageIndex !== 1) return;

            setLoading(true);
            setError(null);

            try {
                const data = await searchProductsApi({
                    searchTerm: searchFilters.keyword, // Dùng searchFilters thay vì filters
                    categoryId: searchFilters.categoryId,
                    sortBy: searchFilters.sortBy,
                    pageIndex: pageIndex
                });

                if (!cancelled) {
                    if (pageIndex === 1) {
                        setProducts(data);
                    } else {
                        setProducts(prev => [...prev, ...data]);
                    }
                    // Kiểm tra nếu số lượng trả về ít hơn PAGE_SIZE thì hết dữ liệu
                    setHasMore(data.length === PAGE_SIZE);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, [pageIndex, searchFilters.keyword, searchFilters.categoryId, searchFilters.sortBy]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPageIndex(prev => prev + 1);
        }
    };

    return {
        products,
        loading,
        error,
        hasMore,
        loadMore,
        setSearchFilter // Export hàm này để component gọi
    };
}