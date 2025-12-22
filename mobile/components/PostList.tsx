import { useAuthStore } from '@/store/useAuthStore'
import { usePostStore } from '@/store/usePostStore'
import { Post, User } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import PostCard from './PostCard'

const PostList = () => {
    const {getCurrUser,user,token} = useAuthStore()
    const {fetchAllPosts,toogleLike,posts,isFetching} = usePostStore()
    useEffect(() => {
        getCurrUser()
    },[])
    useEffect(() => {
        if(user){
            fetchAllPosts(token)
        }
    },[user])
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const selectedPost = selectedPostId ? posts?.find((p: Post) => p._id === selectedPostId) : null;


    if(isFetching){
        return <View className='p-8 items-center'>
            <ActivityIndicator size='large' color='#1DA1F2'/>
            <Text className='text-gray-500 mt-2'>Loading Posts....</Text>
        </View>
    }
    if(posts?.length === 0){
        return <View className='p-8 items-center'>
            <Text className='text-gray-500'>No Posts Found</Text>
        </View>
    }

    const handleLike = (postId:string) => {
        if(user){
            toogleLike(token as string,postId,user._id)
        }
    }
    const deletePost = (postId:string) => {}
    const checkIsLiked = (likes:string[],user:User) => {
        return likes.includes(user._id)
    }
    

    return (
        <>
            {user && posts?.map((post:Post) => (
                <PostCard 
                    key={post._id}
                    post={post}
                    onlike={handleLike}
                    onDelete={deletePost}
                    onComment={(post: Post) => setSelectedPostId(post._id)}
                    currentUser={user}
                    isLiked={checkIsLiked(post.likes, user)}
                />
            ) )}
        </>
    )
}

export default PostList