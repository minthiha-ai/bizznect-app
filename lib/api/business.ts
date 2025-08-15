import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const businessAPI = axios.create({
    baseURL: 'https://business.biznects.info/api/',
})

businessAPI.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default businessAPI
