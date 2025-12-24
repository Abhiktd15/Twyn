import { useAuthStore } from '@/store/useAuthStore'
import { usePostStore } from '@/store/usePostStore'
import { Post, User } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import CommentsModal from './CommentsModal'
import PostCard from './PostCard'

interface PostListProps {
    username?:  string | null;
}

const PostList = ({username} : PostListProps) => {
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

    if(isFetching && (!posts || posts.length === 0)){
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

    let filteredPosts = posts
    
    // if there is user name filter the post with username as the username 
    if(username){
        filteredPosts = posts?.filter((post:Post) => post.user.username === username)
    }

    return (
        <View className='pb-16'>
            {user && filteredPosts?.map((post:Post) => (
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
            <CommentsModal selectedPost={selectedPost} onClose={() => setSelectedPostId(null)} />

        </View>
    )
}

export default PostList