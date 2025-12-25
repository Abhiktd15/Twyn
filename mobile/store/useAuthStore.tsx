
import {create} from 'zustand'
import AsyncStorage  from '@react-native-async-storage/async-storage'
import { API_BASE_URL } from '@/constants/constants';
import axios from 'axios';
import { router } from 'expo-router';
import { User } from '@/types/types';

type StoreState = {
    user: User | null;
    targetUser:User | null;
    token: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    isUpdating:boolean;
    register: (signupData: User) => Promise<{success: boolean; error?: string}>;
    login: (logindata:User) => Promise<{success:boolean;error?:string}>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    getCurrUser: () => Promise<{success: boolean; error?: string}>;
    updateProfile: (token:string|null,updateData:User) => Promise<{success: boolean; error?: string}>;
    getTargettedUserProfile : (username:string|null) => Promise<{success: boolean; error?: string}>;
}

export const useAuthStore = create<StoreState>((set,get) => ({
    user: null,
    targetUser:null,
    token:null,
    isLoading:false,
    isUpdating:false,
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
        set({isCheckingAuth:true})
        const {getCurrUser} = get()
        try {
            const user = await AsyncStorage.getItem("user");
            const token = await AsyncStorage.getItem("token");
            if(user && token){
                await getCurrUser()
                set({isCheckingAuth:false})
                set({token})
            } else {
                set({user:null,token:null,isCheckingAuth:false})
            }
        } catch (error:any) {
            console.log("Error checking auth:", error);
            set({user: null, token: null, isCheckingAuth:false})
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
    },
    getCurrUser: async () => {
        set({isLoading:true})
        try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }
                const response = await axios.get(`${API_BASE_URL}/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status !== 200) {
                    throw new Error(response.data.message || "Failed to fetch user");
                }
                set({ user: response.data.user ,isLoading:false});
                return { success: true };
            } catch (err:any) {
                set({isLoading:false})
                return { success: false, error:err.message};
            }
        },
    updateProfile: async (token:string|null,updateData:User) => {
        set({isUpdating:true})
        try {
            const response = await fetch(`${API_BASE_URL}/user/profile`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify(updateData)
            })
            if(response.status !== 200){
                throw new Error("Update failed")
            }
            const data = await response.json()
            set({user:data.user,isUpdating:false})
            return {success:true}
        } catch (error:any) {
            set({isUpdating:false})
            console.log("Error during update:", error);
            return { success: false};   
        }
    },
    getTargettedUserProfile : async (username:string|null) => {
        set({isLoading:true})
        try {
            const reponse = await axios.get(`${API_BASE_URL}/user/profile/${username}`)
            if(reponse.status !== 200){
                throw new Error("Fetch failed")
            }
            set({targetUser:reponse.data.user,isLoading:false})
            return {success:true}
        } catch (error:any) {
            set({isLoading:false})
            return { success: false,error:error.message};
        }
    }
}))