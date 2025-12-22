import { useAuthStore } from '@/store/useAuthStore';
import { usePostStore } from '@/store/usePostStore';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert } from "react-native";

export const useCreatePost = () => {
    const [content,setContent] = useState("")
    const {createPost } = usePostStore()
    const {token } = useAuthStore()
    const [selectedImage,setSelectedImage] = useState<string|null>(null)

    const handleImagePicker = async (useCamera:boolean = false)=> {
        const permissionResult = useCamera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permissionResult.status !== "granted"){
            const source = useCamera ? "camera":"photo library"
            Alert.alert("Permission needed",`Please grant permission to access your ${source}`)
            return
        }

        const pickerOptions = {
            allowEditing :true,
            aspectRatio : [16,9] as [number,number],
            quality:0.8
        }

        const result = useCamera ? 
            await ImagePicker.launchCameraAsync(pickerOptions) : 
            await ImagePicker.launchImageLibraryAsync({
                ...pickerOptions,
                mediaTypes: ["images"]
            })
        if(!result.canceled){
            setSelectedImage(result.assets[0].uri)
        }
    }
    
    const CreatePost = async () => {
        if(!content.trim()&& !selectedImage){
            Alert.alert("Empty Post","Please write something or add an image before posting !!")
        }

        const postData: {content:string ; imageUri?:string} = {
            content : content.trim()
        }
        if(selectedImage){
            postData.imageUri = selectedImage
        }

        const formData = new FormData()
        if(postData.content) {
            formData.append("content",postData.content)
        }
        if(postData.imageUri) {
            const uriParts = postData.imageUri.split('.')
            const fileType = uriParts[uriParts.length - 1].toLowerCase();
            const mimeTypeMap: Record<string, string> = {
                png: "image/png",
                gif: "image/gif",
                webp: "image/webp",
                };
            const mimeType = mimeTypeMap[fileType] || "image/jpeg";
            formData.append("image",{
                uri: postData.imageUri,
                name: `image.${fileType}`,
                type: mimeType
            }as any)
        }  

        return formData ;
    }
    return {
        content,
        setContent,
        selectedImage,
        setSelectedImage,
        pickImageFromGallery: () => handleImagePicker(false),
        takePhoto: () => handleImagePicker(true),
        removeImage: () => setSelectedImage(null),
        CreatePost,
    };
}