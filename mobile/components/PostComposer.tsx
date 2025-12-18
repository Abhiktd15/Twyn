import { useCreatePost } from '@/hooks/useCreatePost'
import React from 'react'
import { Image, TextInput, View } from 'react-native'

const PostComposer = () => {
    const {
        content,
        setContent,
        selectedImage,
        isCreating,
        pickImageFromGallery,
        takePhoto,
        createPost,
        removeImage
    } = useCreatePost()
    
    return (
        <View className='p-4 bg-white border-b border-gray-200'>
            <View className='flex flex-row'>
                {/* <Image source={{uri:user?.profilePic}} alt='User Image' className='w-12 h-12 rounded-full mr-3 bg-gray-200'/> */}
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
        </View>
    )
}

export default PostComposer