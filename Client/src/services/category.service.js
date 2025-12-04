import axios from "../configs/axios"

export async function getAllCategoryApi() {
    const response = await axios.get("/category");
    return response.data;
}

export async function addCategoryApi({ name, parentId }) {
    const response = await axios.post("/category", { name, parentId });
    return response.data;
}
export async function updateCategoryApi({ name, parentId, id }) {
    const response = await axios.put(`/category/${id}`, { name, parentId });
    return response.data;
}
export async function deleteCategoryApi(id) {
    const response = await axios.delete(`/category/${id}`);
    return response.data;
}