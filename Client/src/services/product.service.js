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

export async function addToBlackListApi({ bidderId, productId }) {
    console.log(bidderId, productId);
    const response = await axios.post("/product/blacklist", { bidderId, productId });
    return response.data;
}

export async function deleteFromBlackListApi({ blacklistId }) {
    console.log(blacklistId);
    const response = await axios.delete(`/product/blacklist/${blacklistId}`);
    return response.data;
}
export async function addDescriptionApi({ productId, description }) {
    const response = await axios.put("/product/description", {
        productId,
        description
    });
    return response.data;
}

export async function addToWatchListApi({ productId }) {
    const response = await axios.post(`/product/watchlist/${productId}`);
    return response.data;
}


export async function deleteFromWatchListApi({ productId }) {
    const response = await axios.delete(`/product/watchlist/${productId}`);
    return response.data;
}

export async function getAllLikedProductsApi() {
    const response = await axios.get("/product/watchlist");
    return response.data;
}

export async function getTopSoonProcutsApi({ pageIndex }) {
    const response = await axios.get(`/product/top-soon?pageIndex=${pageIndex}`);
    return response.data;
}
export async function getTopCountProcutsApi({ pageIndex }) {
    const response = await axios.get(`/product/top-count?pageIndex=${pageIndex}`);
    return response.data;
}
export async function getTopValueProcutsApi({ pageIndex }) {
    const response = await axios.get(`/product/top-value?pageIndex=${pageIndex}`);
    return response.data;
}
export async function searchProductsApi({
    searchTerm,
    categoryId,
    pageIndex = 1,
    sortBy = ""
}) {
    const response = await axios.get("/product/search", {
        params: {
            searchTerm: searchTerm,
            categoryId: categoryId || undefined,
            pageIndex: pageIndex,
            sortBy: sortBy || undefined
        }
    });
    return response.data;
}

export async function addCommentApi({ productId, parentId, content }) {
    const response = await axios.post("/product/comment", { ProductId: productId, ParentId: parentId, Content: content });
    return response.data;
}
export async function editCommentApi({ commentId, content }) {
    const response = await axios.put("/product/comment", { CommentId: commentId, Content: content });
    return response.data;
}