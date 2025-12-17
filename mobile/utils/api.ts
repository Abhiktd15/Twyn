import { getToken } from '@/hooks/useAuth';
import { User } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios ,{AxiosInstance} from 'axios';

export const API_BASE_URL = 'http://localhost:3000/api';

const createAPIClient = (getToken:() => Promise<string | null>):AxiosInstance => {
    const apiClient = axios.create({
        baseURL: API_BASE_URL
    });

    apiClient.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return apiClient;
}

export const useApiClient = (): AxiosInstance => {
    return createAPIClient(getToken);
};

export const userApi = {
    getProfile: async (api:AxiosInstance,username:string) => api.get(`/user/profile/${username}`),
    getCurrentUser: async (api:AxiosInstance) => api.get('/user/me'),
    updateProfile: async (api:AxiosInstance,data:Partial<User>) => api.put('/user/profile',data),
    followUser: async (api:AxiosInstance,targetUserId:string) => api.post(`/user/follow/${targetUserId}`),
}

export const checkAuth = async () => {
    try {
        const user = await  AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        if(user && token){
            return {user: JSON.parse(user), token};
        }
    } catch (error:any) {
        console.log("Error checking auth:", error);
        return {user: null, token: null}
    }
}