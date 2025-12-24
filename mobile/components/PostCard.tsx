import { Post, User } from '@/types/types';
import { formatDate, formatNumber } from '@/utils/formatter';
import { AntDesign, Feather } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

interface PostCardProps{ 
    post:Post;
    isLiked:boolean;    
    onDelete: (postId:string) => void;
    onlike: (postId:string) => void;
    onComment: (post:Post) => void;
    currentUser:User;
}

const PostCard = ({post,onDelete,onlike,isLiked,currentUser,onComment}:PostCardProps) => {
    const isOwnPost = currentUser._id === post.user._id;
    const handleDeletePost = () => {
        Alert.alert("Delete Post","Are you sure you want to delete this post?",[
            {
                text:"Cancel",
                style:"cancel"
            },
            {
                text:"Delete",
                style:"destructive",
                onPress: () => onDelete(post._id)
            }
        ])
    }
    return (
        <View className='bg-white border-gray-50 border'>
            <View className='flex-row p-4'>
                <Image source={{uri:post.user.profilePic}} className='w-12 h-12 rounded-full mr-3'/>
                <View className='flex-1'>
                    <View className='flex-row items-center justify-between mb-1'>
                        <View className='flex-row items-center'>
                            <Text className=' font-bold text-gray-900 mr-1'>@{post.user.fullName || post.user.username}</Text>
                            <Text className='text-gray-500 ml-1'>
                                {formatDate(post.createdAt)}
                            </Text>
                        </View>
                        {isOwnPost && (
                            <TouchableOpacity onPress={handleDeletePost}>
                                <Feather name='trash' size={14} color='#657786' />
                            </TouchableOpacity>
                        )}
                    </View>
                    {post.content && (
                        <Text className='text-gray-500 text-base leading-5 mb-3'>{post.content}</Text>
                    )}
                    {post.image && (
                        <Image source={{uri:post.image}}
                            className='w-full h-48 rounded-2xl mb-3'
                            resizeMode='cover'
                        />
                    )}
                    <View className="flex-row justify-between max-w-xs">
                        <TouchableOpacity className="flex-row items-center" onPress={() => onComment(post)}>
                            <Feather name="message-circle" size={18} color="#657786" />
                            <Text className="text-gray-500 text-sm ml-2">
                                {formatNumber(post.comments?.length || 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center">
                            <Feather name="repeat" size={18} color="#657786" />
                            <Text className="text-gray-500 text-sm ml-2">0</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center" onPress={() => onlike(post._id)}>
                            {isLiked ? (
                                <AntDesign name="heart" size={18} color="#E0245E" />
                            ) : (
                                <Feather name="heart" size={18} color="#657786" />
                            )}

                            <Text className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                                {formatNumber(post.likes?.length || 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Feather name="share" size={18} color="#657786" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PostCard