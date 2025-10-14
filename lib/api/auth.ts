import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const authApi = axios.create({
    baseURL: 'https://auth.biznects.info/api/',
})

authApi.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default authApi
