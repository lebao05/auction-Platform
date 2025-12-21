"use client";

import { useEffect, useState, useCallback } from "react";
import { addToBlackListApi, deleteFromBlackListApi, getProductDetailsApi, placeBidApi } from "../services/product.service";

export function useProductDetails(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bidLoading, setBidLoading] = useState(false);
    const [bidError, setBidError] = useState(null);
    const [biddingHistories, setBiddingHistories] = useState([]);
    const [comments, setComments] = useState([]);
    const [blackList, setBlackList] = useState([]);
    const fetchProduct = useCallback(async () => {
        if (!productId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getProductDetailsApi({ productId });
            setProduct(data);
            setBiddingHistories(data.biddingHistories);
            setBlackList(data.blackList);
            setComments(data.comments);
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
                const data = await getProductDetailsApi({ productId });
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
    const addToBlacklist = useCallback(
        async ({ bidderId, productId }) => {
            try {
                const result = await addToBlackListApi({ bidderId, productId });
                const data = await getProductDetailsApi({ productId });
                setBiddingHistories(data.biddingHistories);
                setBlackList(data.blackList);
            } catch (err) {
                console.error("Failed to add to blacklist:", err);
                throw err;
            }
        },
        [fetchProduct]
    );

    // Remove from blacklist
    const removeFromBlacklist = useCallback(
        async ({ blacklistId }) => {
            try {
                const result = await deleteFromBlackListApi({ blacklistId });
                const data = await getProductDetailsApi({ productId });
                setBiddingHistories(data.biddingHistories);
                setBlackList(data.blackList);
            } catch (err) {
                console.error("Failed to remove from blacklist:", err);
                throw err;
            }
        },
        [fetchProduct]
    );
    return {
        product,
        loading,
        error,
        refresh: fetchProduct,
        placeBid,
        addToBlacklist,
        removeFromBlacklist,
        comments,
        blackList,
        biddingHistories,
    };
}
