import axios from "../configs/axios";

export async function getUserProfileApi() {
    const response = await axios.get("/user/profile");
    return response.data;
}

export async function updateUserProfileApi({ fullName, dateOfBirth, phoneNumber, address, email }) {
    console.log("Updating user profile with data:", { fullName, dateOfBirth, phoneNumber, address, email });
    const response = await axios.put("/user", { fullName, dateOfBirth, phoneNumber, address, email });
    return response.data;
}