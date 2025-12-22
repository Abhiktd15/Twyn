import { useCreatePost } from '@/hooks/useCreatePost'
import { useAuthStore } from '@/store/useAuthStore'
import { usePostStore } from '@/store/usePostStore'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const PostComposer = () => {
    const {
        content,
        setContent,
        selectedImage,
        pickImageFromGallery,
        takePhoto,
        CreatePost,
        setSelectedImage,
        removeImage
    } = useCreatePost()

    const {user,token} = useAuthStore()
    const {isLoading,createPost} = usePostStore()
    const submitPost = async () => {
        const formData = await CreatePost()

        await createPost(formData,token as string)
        setContent("")
        setSelectedImage(null)
    }
    return (
        <View className='p-4 bg-white border-b border-gray-200'>
            <View className='flex flex-row'>
                <Image source={{uri:user?.profilePic}} alt='User Image' className='w-12 h-12 rounded-full mr-3 bg-gray-200'/>
                <View className='flex-1'>
                    <TextInput
                        className='text-gray-900 text-lg'
                        placeholder="What's happening?"
                        placeholderTextColor={"#657786"}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        maxLength={280}
                    />
                </View>
            </View>

            {/* show selected image  */}
            {selectedImage && (
                <View className='mt-3 ml-14'>
                    <View className='relative'>
                        <Image source={{uri:selectedImage}} className='w-full h-48 rounded-2xl'/>
                        <TouchableOpacity className='absolute top-2 right-2 w-8 h-8 bg-black/60  rounded-full items-center justify-center  ' onPress={removeImage}>
                            <Feather name='x' size={14} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View className='flex-row justify-between items-center mt-3'>
                <View className='flex-row'>
                    <TouchableOpacity className='mr-4' onPress={pickImageFromGallery}>
                        <Feather name='image' size={20} color={"#1DA1F2"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePhoto}>
                        <Feather name='camera' size={20} color={"#1DA1F2"} />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                    {content.length > 0 && (
                        <Text
                        className={`text-sm mr-3 ${content.length > 260 ? "text-red-500" : "text-gray-500"}`}
                        >
                        {280 - content.length}
                        </Text>
                    )}

                    <TouchableOpacity
                        className={`px-6 py-2 rounded-full flex-row items-center gap-2 ${
                        content.trim() || selectedImage ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onPress={submitPost}
                        disabled={isLoading || !(content.trim() || selectedImage)}
                    >
                        {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                        ) : (
                        <>
                            <Text
                                className={`font-semibold ${
                                content.trim() || selectedImage ? "text-white" : "text-gray-500"
                                }`}
                            >
                                Post
                            </Text>
                        </>
                        
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            
        </View>
    )
}

export default PostComposer