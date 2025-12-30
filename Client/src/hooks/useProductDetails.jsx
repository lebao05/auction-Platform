"use client";

import { useEffect, useState, useCallback } from "react";
import { addCommentApi, addDescriptionApi, addToBlackListApi, deleteFromBlackListApi, editCommentApi, getProductDetailsApi, placeBidApi } from "../services/product.service";

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
                setProduct(data);
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

    const addDescription = useCallback(
        async ({ description }) => {
            console.log(description);
            try {
                await addDescriptionApi({ productId, description });
                setProduct(pre => ({ ...pre, description: pre.description + description }));
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        }

    );

    const addComment = useCallback(async ({ parentId, content }) => {
        try {
            const newCommentId = await addCommentApi({ productId, parentId, content });

            // Tạo object comment giả lập dựa trên dữ liệu hiện có
            const newComment = {
                id: newCommentId,
                parentId: parentId || null,
                content: content,
                createdAt: new Date().toISOString(),
                fullName: "Tôi", // Tạm thời set tên hiển thị
                // Thêm các field cần thiết khác tùy thuộc vào structure của bạn
            };
            setComments(prev => [...prev, newComment]);

            // Cập nhật bên trong object product (để đồng bộ dữ liệu tổng thể)
            setProduct(prev => ({
                ...prev,
                comments: [...(prev.comments || []), newComment]
            }));
        } catch (err) {
            console.error("Failed to add comment:", err);
            throw err;
        }
    }, [productId]);

    // --- Cập nhật Edit Comment không fetch lại ---
    const editComment = useCallback(async ({ commentId, content }) => {
        try {
            await editCommentApi({ commentId, content });

            // Duyệt mảng và cập nhật nội dung cho đúng ID
            setComments(prev =>
                prev.map(c => c.id === commentId ? { ...c, content: content } : c)
            );
            setProduct(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    comments: prev.comments.map(c =>
                        c.id === commentId ? { ...c, content: content } : c
                    )
                };
            });
        } catch (err) {
            console.error("Failed to edit comment:", err);
            throw err;
        }
    }, []);
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
        addDescription,
        editComment,
        addComment
    };
}
