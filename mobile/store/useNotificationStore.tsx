
import { API_BASE_URL } from "@/constants/constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Notification {
    _id: string;
    from: {
        username: string;
        profilePic?: string;
    };
    to: string;
    type: "like" | "comment" | "follow";
    post?: {
        _id: string;
        content: string;
        image?: string;
    };
    comment?: {
        _id: string;
        content: string;
    };
    createdAt: string;
}

type StoreState = {
    notifications: Notification[] | null;
    isRefetching: boolean;
    isLoading: boolean;
    error:string | null;
    fetchNotifications : (token:string | null) => Promise<{success: boolean; error?: string}>;
    deleteNotification: (token:string | null,notificationId:string) => Promise<{success: boolean; error?: string}>;
}

export const useNotificationStore = create(
    persist<StoreState>(
        (set,get) => ({
            notifications:[],
            isLoading:false,
            isRefetching:false,
            error:null,
            
            fetchNotifications: async (token:string | null) => {
                set({isLoading:true})
                set({isRefetching:true})
                try {
                    const response = await axios.get(`${API_BASE_URL}/notification`,{
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    })
                    if(response.status !== 200){
                        throw new Error(response.data.message || 'Fetching the post failed !! ');
                    }
                    set({notifications:response.data.notifications,isLoading:false,isRefetching:false,error:null})
                    return {success:true}
                } catch (error:any) {
                    set({isLoading:false,error:error.message,isRefetching:false})
                    return { 
                        success:false,
                        error: error.message
                    }
                }
            },
            deleteNotification: async (token:string | null,notificationId:string) => {
                set({isLoading:true})
                set({isRefetching:true})
                const {fetchNotifications} = get()
                try {
                    const response = await axios.delete(`${API_BASE_URL}/notification/${notificationId}`,{
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    })
                    if(response.status !== 200){
                        console.log("There is some problem with it")
                        throw new Error(response.data.message || 'Deleting the post failed !! ');
                        
                    }
                    await fetchNotifications(token)
                    set({isLoading:false,isRefetching:false,error:null})
                    return {success:true}
                } catch (error:any) {
                    set({isLoading:false,error:error.message,isRefetching:false})
                    return { 
                        success:false,
                        error: error.message
                    }
                }
            },
        }),
        {
            name: 'notification-store', 
            storage: createJSONStorage(() => AsyncStorage), 
        }
    )
)