import { useState, useEffect } from "react";
import { getTopValueProcutsApi } from "../services/product.service";

const PAGE_SIZE = 8;

export function useTopValueProducts() {
    const [products, setProducts] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            if (!hasMore) return;

            setLoading(true);
            setError(null);

            try {
                const data = await getTopValueProcutsApi({ pageIndex });

                if (!cancelled) {
                    setProducts(prev => [...prev, ...data]);
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
    }, [pageIndex]); // ✅ CHỈ pageIndex

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
    };
}
