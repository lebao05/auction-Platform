import axios from "../configs/axios"


export async function getAllSystemSettingsApi() {
    const response = await axios.get("/system-setting");
    return response.data;
}

export async function updateSystemSettingApi({ systemKey, systemValue }) {
    const response = await axios.put("/system-setting", {
        systemKey, systemValue
    })
    return response.data;
}