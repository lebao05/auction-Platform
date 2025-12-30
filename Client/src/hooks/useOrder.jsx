import { useState, useEffect } from "react";
import {
    getOrderApi,
    updatePaymentPhaseApi,
    cancelOrderApi,
    confirmOrderStatusApi,
    updateShippingPhaseApi,
    addRatingApi,
    updateRatingApi,
} from "../services/order.service";

export function useOrder() {
    const [productId, setProductId] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ===========================
       FETCH ORDER WHEN productId CHANGES
       =========================== */
    useEffect(() => {
        if (!productId) return;

        let cancelled = false;

        const fetchOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getOrderApi({ productId });
                if (!cancelled) setOrder(data);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchOrder();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    /* ===========================
       ACTIONS (NO NEED productId PARAM)
       =========================== */
    const updatePaymentPhase = async ({
        address,
        phoneNumber,
        paymentImage,
    }) => {
        if (!productId) throw new Error("productId is not set");

        setLoading(true);
        setError(null);

        try {
            const data = await updatePaymentPhaseApi({
                productId,
                address,
                phoneNumber,
                paymentImage,
            });

            await refresh();
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateShippingPhase = async ({ shippingInvoiceImage }) => {
        if (!productId) throw new Error("productId is not set");
        setLoading(true);
        setError(null);

        try {
            const data = await updateShippingPhaseApi({
                productId,
                shippingInvoiceImage,
            });

            await refresh();
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmOrderStatus = async ({ orderStatus }) => {
        if (!productId) throw new Error("productId is not set");

        setLoading(true);
        setError(null);

        try {
            const data = await confirmOrderStatusApi({
                productId,
                orderStatus,
            });

            await refresh();
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async () => {
        if (!productId) throw new Error("productId is not set");

        setLoading(true);
        setError(null);

        try {
            const data = await cancelOrderApi({ productId });
            setOrder((prev) =>
                prev ? { ...prev, status: "CancelledBySeller" } : prev
            );
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addRating = async ({ ratingType, comment }) => {
        if (!productId) throw new Error("productId is not set");

        setLoading(true);
        setError(null);

        try {
            const data = await addRatingApi({
                productId,
                ratingType,
                comment,
            });

            await refresh();
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const updateRating = async ({ ratingId, ratingType, comment }) => {
        if (!ratingId) throw new Error("ratingId is required");

        setLoading(true);
        setError(null);

        try {
            const data = await updateRatingApi({
                ratingId,
                ratingType,
                comment,
            });

            await refresh(); // 🔁 refetch order → updated rating
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    /* ===========================
       REFRESH
       =========================== */
    const refresh = async () => {
        if (!productId) return;
        const data = await getOrderApi({ productId });
        setOrder(data);
    };

    return {
        productId,
        setProductId,

        order,
        loading,
        error,

        // actions
        refresh,
        updatePaymentPhase,
        updateShippingPhase,
        confirmOrderStatus,
        cancelOrder,
        addRating,
        updateRating,
    };
}
