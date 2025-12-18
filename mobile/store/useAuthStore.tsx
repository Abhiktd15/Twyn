
import {create} from 'zustand'
import AsyncStorage  from '@react-native-async-storage/async-storage'
import { API_BASE_URL } from '@/constants/constants';
import axios from 'axios';
import { router } from 'expo-router';

export type User = {
    username?:string;
    email?:string;
    password?:string;
    profileImage?:string;
    createdAt?:string;
}

type StoreState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    register: (signupData: User) => Promise<{success: boolean; error?: string}>;
    login: (logindata:User) => Promise<{success:boolean;error?:string}>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<StoreState>((set) => ({
    user: null,
    token:null,
    isLoading:false,
    isCheckingAuth:false,

    register: async (signupData: User) => {
        set({isLoading:true})
        try {
            // API call to register user
            const response = await axios.post(`${API_BASE_URL}/user/new`, signupData);
            if (response.status !== 201) {
                throw new Error(response.data.message || 'Registration failed');
            }
            await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            await AsyncStorage.setItem("token", response.data.token);

            set({user: response.data.user, token: response.data.token, isLoading:false});
            return {success:true}
        } catch (error:any) {
            set({isLoading:false})
            return {
                success:false,
                error: error.message
            }
            
        }
    },
    login: async (loginData:User) => {
        set({isLoading:true})
        try {
            const response = await axios.post(`${API_BASE_URL}/user/login`,loginData);
            if (response.status !== 200) {
                throw new Error(response.data.message || 'Login failed');
            }
            await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            await AsyncStorage.setItem("token", response.data.token);
            set({user: response.data.user, token: response.data.token, isLoading:false});
            return {success:true}
        } catch (error:any) {
            set({isLoading:false})
            console.log("Error during login:", error);
            set({user: null, token: null});
            return {success:false, error:error.message}
        }
    },
    checkAuth: async () => {
        try {
            const user = await AsyncStorage.getItem("user");
            const token = await AsyncStorage.getItem("token");
            if(user && token){
                set({user: JSON.parse(user), token})
            }
        } catch (error:any) {
            console.log("Error checking auth:", error);
            set({user: null, token: null})
        }
    },
    logout: async () => {
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            router.replace("/(auth)");
            set({user: null, token: null});
        } catch (error) {
            console.log("Error during logout:", error);
        }
    }
}))