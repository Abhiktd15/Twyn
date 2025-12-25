
import { API_BASE_URL } from "@/constants/constants";
import { Post } from "@/types/types";
import axios from "axios";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';

type postData  = {
    content?: string;
    image?:{
        uri:string;
        name:string;
        type:string;
    };
}

type StoreState = {
    posts: Post[] | null; 
    userPost:Post[] | null;
    isLoading: boolean;
    isFetching:boolean;
    createPost: (postData:FormData,token:string) => Promise<{success: boolean; error?: string}>;
    fetchAllPosts : (token:string | null) => Promise<{success: boolean; error?: string}>;
    toogleLike: (token:string,postId:string,userId:string) => Promise<{success: boolean; error?: string}>;
    createComment: (token:string,postId:string,comment:string) => Promise<{success: boolean; error?: string}>;
    fetchUsersPost: (token:string | null,username:string | null) => Promise<{success: boolean; error?: string}>; 
    deleteComment: (token:string,commentId:string) => Promise<{success: boolean; error?: string}>;

}

export const usePostStore = create(
    persist<StoreState>(
        (set,get) => ({
            posts:null,
            userPost:null,
            isLoading:false,
            isFetching:false,

            createPost: async (postData:FormData,token:string) => {
                set({isLoading:true})
                const { posts } = get();
                try {
                    const response = await fetch(`${API_BASE_URL}/post`,{
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                        body: postData,
                    })
                    
                    const data = await response.json();

                    if (response.status!== 201) {
                        Alert.alert("Post creation failed", data.message || "Something went wrong")
                        throw new Error( 'Post creation failed');
                    }

                    const newPost = data.post;
                    
                    set({ posts: [newPost, ...(posts || [])] });

                    set({isLoading:false})
                    Alert.alert("Success","Post created successfully")
                    return {success:true}
                } catch (error:any) {
                    set({isLoading:false})   
                    return { 
                        success:false,
                        error: error.message
                    }
                }
            },

            fetchAllPosts: async (token:string | null) => {
                set({isFetching:true})
                try {
                    const response = await axios.get(`${API_BASE_URL}/post`)
                    if(response.status !== 200){
                        throw new Error(response.data.message || 'Fetching the post failed !! ');
                    }
                    set({posts:response.data.posts,isFetching:false})
                    return {success:true}
                } catch (error:any) {
                    set({isFetching:false})
                    return { 
                        success:true,
                        error: error.message
                    }
                }
            },

            toogleLike: async (token:string,postId:string,userId:string) => {
                const { posts } = get();

                const updatedPosts = posts?.map(p => {
                    if (p._id === postId) {
                        const isLiked = p.likes.includes(userId);
                        if (isLiked) {
                            return {
                                ...p,
                                likes: p.likes.filter(id => id !== userId)
                            };
                        } else {
                            return {
                                ...p,
                                likes: [...p.likes, userId]
                            };
                        }
                    }
                    return p;
                });
            
                set({ posts: updatedPosts });
                try {
                    const response = await fetch(`${API_BASE_URL}/post/${postId}/like`,{
                        method:"POST",
                        headers:{
                            "Authorization":`Bearer ${token}`
                        },
                    })
                    if(response.status !== 200){
                        set({posts})
                        Alert.alert("Like Failed","Something went wrong")
                        throw new Error("Like Failed")
                    }
                    return {success:true}
                } catch (error:any) {
                    set({posts})
                    return{
                        success:false,
                        error:error?.message
                    }
                }
            },

            createComment: async (token:string,postId:string,comment:string) => {
                set({isLoading:true})
                const {fetchAllPosts} = get()
                try {
                    const response = await fetch(`${API_BASE_URL}/comment/post/${postId}`,{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${token}`
                        },
                        body:JSON.stringify({content:comment})
                    })
                    if(response.status !== 201){
                        Alert.alert("Comment Failed","Something went wrong")
                        throw new Error("Comment Failed")
                    }
                    await fetchAllPosts(token)
                    set({isLoading:false})
                    return {success:true}
                } catch (error:any) {
                    set({isLoading:false})
                    return{
                        success:false,
                        error:error?.message
                    }
                }
            },

            deleteComment: async (token:string,commentId:string) => {
                set({isLoading:true})
                const {fetchAllPosts} = get()
                try {
                    const response = await fetch(`${API_BASE_URL}/comment/${commentId}`,{
                        method:"DELETE",
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    })
                    if(response.status !== 200){
                        Alert.alert("Delete Failed","Something went wrong")
                        throw new Error("Delete Failed")
                    }
                    await fetchAllPosts(token)
                    set({isLoading:false})
                    return {success:true}
                } catch (error:any) {
                    set({isLoading:false})
                    return{
                        success:false,
                        error:error?.message
                    }
                }
            },

            fetchUsersPost: async (token:string | null,username:string | null) => {
                set({isLoading:true})
                try {
                    const response = await fetch(`${API_BASE_URL}/post/user/${username}`,{
                        method:"GET",
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    })
                    if(response.status !== 200){
                        throw new Error("Fetch post failed!")
                    }
                    const data = await response.json()
                    const posts = data.posts
                    set({userPost:posts,isLoading:false})
                    return {success:true}
                } catch (error:any) {
                    return{
                        success:false,
                        error:error?.message
                    }
                }
            }
        }),
        {
            name: 'post-store', 
            storage: createJSONStorage(() => AsyncStorage), 
        }
    )
)