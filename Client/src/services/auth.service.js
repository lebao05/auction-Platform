import axios from "../configs/axios";

export async function loginApi(email, password) {
    const response = await axios.post("/auth/login", { email, password });
    return response.data;
}


export async function registerApi({ fullname, email, password, address }) {
    const response = await axios.post("/auth/register", { fullname, email, password, address });
    return response.data;
} 
