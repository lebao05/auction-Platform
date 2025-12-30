import axios from "../configs/axios";

/* ===========================
   GET ORDER
   =========================== */
export async function getOrderApi({ productId }) {
    const res = await axios.get(`/order/${productId}`);
    return res.data;
}

/* ===========================
   UPDATE PAYMENT PHASE
   multipart/form-data
   =========================== */
export async function updatePaymentPhaseApi({
    productId,
    address,
    phoneNumber,
    paymentImage,
}) {
    const formData = new FormData();
    formData.append("Address", address);
    formData.append("PhoneNumber", phoneNumber);

    if (paymentImage) {
        formData.append("PaymentImage", paymentImage);
    }

    const res = await axios.put(
        `/order/payment/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
}

/* ===========================
   CANCEL ORDER
   =========================== */
export async function cancelOrderApi({ productId }) {
    const res = await axios.delete(`/order/${productId}`);
    return res.data;
}

/* ===========================
   CONFIRM ORDER STATUS
   application/json
   =========================== */
export async function confirmOrderStatusApi({
    productId,
    orderStatus,
}) {
    const res = await axios.put(
        `/order/confirm-status/${productId}`,
        {
            orderStatus,
        }
    );

    return res.data;
}

/* ===========================
   UPDATE SHIPPING PHASE
   multipart/form-data
   =========================== */
export async function updateShippingPhaseApi({
    productId,
    shippingInvoiceImage,
}) {
    const formData = new FormData();
    formData.append("ShippingInvoiceImage", shippingInvoiceImage);
    console.log(productId, shippingInvoiceImage);
    const res = await axios.put(
        `/order/shipping/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
}

/* ===========================
   ADD RATING
   application/json
   =========================== */
export async function addRatingApi({
    productId,
    ratingType,
    comment,
}) {
    const res = await axios.post(
        `/order/rate/${productId}`,
        {
            ratingType,
            comment,
        }
    );

    return res.data;
}

export async function updateRatingApi({
    ratingId,
    comment,
    ratingType,
}) {
    const res = await axios.put(`/order/rate/${ratingId}`, { comment, ratingType });
    return res.data;
}