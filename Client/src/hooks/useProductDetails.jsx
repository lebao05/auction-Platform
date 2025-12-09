"use client";

import { useEffect, useState, useCallback } from "react";
import { getProductDetailsApi, placeBidApi } from "../services/product.service";

export function useProductDetails(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bidLoading, setBidLoading] = useState(false);
    const [bidError, setBidError] = useState(null);

    const fetchProduct = useCallback(async () => {
        if (!productId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getProductDetailsApi({ productId });
            setProduct(data);
        } catch (err) {
            console.error("Failed to load product details:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const placeBid = useCallback(
        async (maxBidAmount) => {
            setBidLoading(true);
            setBidError(null);
            try {
                const result = await placeBidApi({ productId, maxBidAmount });
                await fetchProduct();
                return result;
            } catch (err) {
                console.error("Failed to place bid:", err);
                setBidError(err);
                throw err;
            } finally {
                setBidLoading(false);
            }
        },
        [productId, fetchProduct]
    );

    return {
        product,
        loading,
        error,
        refresh: fetchProduct,

        // placeBid extras
        placeBid,
        bidLoading,
        bidError,
    };
}
