import axios from "../configs/axios";

export async function loginApi(email, password) {
    const response = await axios.post("/auth/login", { email, password });
    return response.data;
}


export async function registerApi({ fullname, email, password, address, recaptchaToken }) {

    const response = await axios.post("/auth/register", {
        fullname, email, password, address
        , recaptchaToken
    });
    return response.data;
}

export async function triggerRestoringPasswordApi({ email }) {
    await axios.post("/auth/forgot-password", {
        email,
    });
}

export async function resetPasswordApi({ email, otp, newPassword }) {
    await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
    });
}