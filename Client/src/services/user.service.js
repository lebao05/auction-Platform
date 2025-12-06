import axios from "../configs/axios";

export async function getUserProfileApi() {
    const response = await axios.get("/user/profile");
    return response.data;
}

export async function updateUserProfileApi({ fullName, dateOfBirth, phoneNumber, address, email }) {
    const response = await axios.put("/user", { fullName, dateOfBirth, phoneNumber, address, email });
    return response.data;
}

export async function requestSellerApi({ userId }) {
    const response = await axios.post("/user/request-seller", { userId })
    return response.data;
}

export async function getMySellerRequestApi() {
    const response = await axios.get("/user/request-seller");
    return response.data;
}
export async function handleSellerRequestApi(requestId, isAccepted) {
    console.log(requestId);
    const response = await axios.put(
        `/user/request-seller/${requestId}?isAccepted=${isAccepted}`
    );
    return response.data;
}

export async function getSellerRequestsAsAdminApi(searchQuery = "", createdDecsending = true, page = 1) {
    const params = new URLSearchParams();
    if (searchQuery) params.append("query", searchQuery);
    params.append("createdDecsending", createdDecsending);
    params.append("pageNumber", page);

    const response = await axios.get(`/user/request-seller/all?${params.toString()}`);
    return response.data;
}