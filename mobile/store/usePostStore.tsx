
// type StoreState = {
//     user: User | null;
//     isLoading: boolean;
//     isCheckingAuth: boolean;
//     register: (signupData: User) => Promise<{success: boolean; error?: string}>;
//     login: (logindata:User) => Promise<{success:boolean;error?:string}>;
//     checkAuth: () => Promise<void>;
//     logout: () => Promise<void>;
// }

import { API_BASE_URL } from "@/constants/constants";
import axios from "axios";
import { Alert } from "react-native";
import { create } from "zustand";

// {
    //             "_id": "69440cd943653e9d3c37b13b",
    //             "content": "This is not an encryption algorithm, but a password hash.\n\nThe specific algorithm being used is PBKDF2 (Password-Based Key Derivation Function 2).\n\nThis is a one-way hashing function, which means you can't \"decrypt\" it to get the original password. It's used to securely store passwords. When you try to log in, the system takes the password you just typed, runs it through the same process, and checks if the result matches this stored hash.\n\nBreaking Down the String\nThis string format is standard (used by frameworks like Django) because it contains all the information needed to verify the password:\n\nalgorithm$iterations$salt$hash\n\n",
    //     token: string | null;
//             "image": "",
//             "user": {
//                 "_id": "6942cc4e75bd15b2720e975c",
//                 "username": "Abhiktd15",
//                 "profilePic": "https://img.freepik.com/premium-vector/business-man-avatar-profile_1133257-2431.jpg?semt=ais_hybrid&w=740&q=80"
//             },
//             "likes": [],
//             "comments": [],
//             "createdAt": "2025-12-18T14:16:57.134Z",
//             "updatedAt": "2025-12-18T14:16:57.134Z",
//             "__v": 0
//         }

type Post = {
    _id: string;
    content: string;
    image: string;
    user: {
        _id: string;
        username: string;
        profilePic: string;
    };
    likes: string[];
    comments: string[];
    createdAt: string;
    updatedAt: string;
}
type postData  = {
    content?: string;
    image?:{
        uri:string;
        name:string;
        type:string;
    };
}

type StoreState = {
    posts:Post | null;
    userPost:Post | null;
    isLoading: boolean;
    createPost: (postData:postData,token:string) => Promise<{success: boolean; error?: string}>;
    fetchAllPosts : (token:string) => Promise<{success: boolean; error?: string}>;
}

export const usePostStore = create<StoreState>((set) => ({
    posts:null,
    userPost:null,
    isLoading:false,

    createPost: async (postData:postData,token:string) => {
        set({isLoading:true})
        try {
            
            const response = await fetch(`${API_BASE_URL}/post`,{
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
                body: postData as unknown as BodyInit,
            })
            

            if (response.status!== 201) {
                Alert.alert("Post creation failed","Something went wrong")
                throw new Error( 'Post creation failed');
            }
            set({isLoading:false})
            return {success:true}
        } catch (error:any) {
            set({isLoading:false})   
            return { 
                success:true,
                error: error.message
            }
        }
    },

    fetchAllPosts: async (token:string) => {
        set({isLoading:true})
        try {
            const response = await axios.get(`${API_BASE_URL}/post`,{
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if(response.status !== 200){
                throw new Error(response.data.message || 'Fetching the post failed !! ');
            }
            set({posts:response.data.posts,isLoading:false})
            return {success:true}
        } catch (error:any) {
            set({isLoading:false})
            return { 
                success:true,
                error: error.message
            }
        }
    }
}))

// export const useAuthStore = create<StoreState>((set) => ({
//     user: null,
//     token:null,
//     isLoading:false,
//     isCheckingAuth:false,

//     register: async (signupData: User) => {
//         set({isLoading:true})
//         try {
//             // API call to register user
//             const response = await axios.post(`${API_BASE_URL}/user/new`, signupData);
//             if (response.status !== 201) {
//                 throw new Error(response.data.message || 'Registration failed');
//             }
//             await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
//             await AsyncStorage.setItem("token", response.data.token);

//             set({user: response.data.user, token: response.data.token, isLoading:false});
//             return {success:true}
//         } catch (error:any) {
//             set({isLoading:false})
//             return {
//                 success:false,
//                 error: error.message
//             }
            
//         }
//     },
//     login: async (loginData:User) => {
//         set({isLoading:true})
//         try {
//             const response = await axios.post(`${API_BASE_URL}/user/login`,loginData);
//             if (response.status !== 200) {
//                 throw new Error(response.data.message || 'Login failed');
//             }
//             await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
//             await AsyncStorage.setItem("token", response.data.token);
//             set({user: response.data.user, token: response.data.token, isLoading:false});
//             return {success:true}
//         } catch (error:any) {
//             set({isLoading:false})
//             console.log("Error during login:", error);
//             set({user: null, token: null});
//             return {success:false, error:error.message}
//         }
//     },
//     checkAuth: async () => {
//         try {
//             const user = await AsyncStorage.getItem("user");
//             const token = await AsyncStorage.getItem("token");
//             if(user && token){
//                 set({user: JSON.parse(user), token})
//             }
//         } catch (error:any) {
//             console.log("Error checking auth:", error);
//             set({user: null, token: null})
//         }
//     },
//     logout: async () => {
//         try {
//             await AsyncStorage.removeItem("user");
//             await AsyncStorage.removeItem("token");
//             router.replace("/(auth)");
//             set({user: null, token: null});
//         } catch (error) {
//             console.log("Error during logout:", error);
//         }
//     }
// }))