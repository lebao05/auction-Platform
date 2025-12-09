import axios from "../configs/axios";

export async function createProductApi({
    name,
    buyNowPrice,
    startPrice,
    stepPrice,
    allowAll,
    description,
    hours,
    categoryId,
    images,
    mainIndex,
    isAutoRenewal
}) {
    const formData = new FormData();

    formData.append("Name", name);
    formData.append("BuyNowPrice", buyNowPrice ?? "");
    formData.append("StartPrice", startPrice);
    formData.append("StepPrice", stepPrice);
    formData.append("AllowAll", allowAll);
    formData.append("Description", description);
    formData.append("Hours", hours);
    formData.append("CategoryId", categoryId ?? "");
    formData.append("MainIndex", mainIndex);
    formData.append("IsAutoRenewal", isAutoRenewal);

    for (let i = 0; i < images.length; i++) {
        formData.append("Images", images[i]);
    }
    const response = await axios.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data;
}

export async function getProductsForSellerApi() {
    const response = await axios.get("/product/seller");
    return response.data;
}

export async function getProductDetailsApi({ productId }) {
    const response = await axios.get(`/product/${productId}`);
    return response.data;
}

export async function placeBidApi({ productId, maxBidAmount }) {
    const response = await axios.post(`/product/place/${productId}`, { maxBidAmount });
    return response.data;
}