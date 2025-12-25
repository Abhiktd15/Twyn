
import { View, Text, ActivityIndicator, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useAuthStore } from '@/store/useAuthStore'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import PostList from '@/components/PostList'
import { usePostStore } from '@/store/usePostStore'

const SearchResult = () => {
  const { username } = useLocalSearchParams<{ username: string }>()
  const { targetUser, getTargettedUserProfile, isLoading:profileLoading, token ,user} = useAuthStore()
  const { userPost, fetchUsersPost, isLoading: postsLoading,toogleFollow } = usePostStore()

  useEffect(() => {
    if (username) {
      getTargettedUserProfile(username)
      fetchUsersPost(token, username)
    }
  }, [username])

  if ( targetUser === null) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    )
  }

  const handleToogleFollow = async () => {
    await toogleFollow(token as string,targetUser?._id)
    await getTargettedUserProfile(username)
  }

  const isAlreadyFollowed = targetUser?.followers?.includes(user?._id)

  return (
    <View className='flex-1  bg-white'>
      {/* Header  */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <View>
          <Text className="text-xl font-bold text-gray-900">
            @{targetUser?.username}
          </Text>
          <Text className="text-gray-500 text-sm">{userPost?.length} Posts</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={profileLoading || postsLoading}
            onRefresh={() => {
                if(username){
                    getTargettedUserProfile(username)
                    fetchUsersPost(token, username)
                }
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              targetUser?.bannerImg ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: targetUser?.profilePic }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {/* This is where a follow/unfollow button would go */}
            {isAlreadyFollowed ? (
                <TouchableOpacity onPress={handleToogleFollow} className='px-4 py-3 border border-gray-100 rounded-full bg-green-200 flex-row'>
                  <Text>Following</Text> 
                  <Feather name="check" size={20} color="#1DA1F2" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleToogleFollow} className='px-4 py-3 border border-gray-100 rounded-full'>
                <Text>Follow</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {targetUser?.fullName || targetUser?.username}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="text-gray-500 mb-2">@{targetUser?.username}</Text>
            <Text className="text-gray-900 mb-3">{targetUser?.bio}</Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{targetUser?.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(targetUser?.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">{targetUser?.following?.length}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">{targetUser?.followers?.length}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostList username={targetUser?.username} />
      </ScrollView>
    </View>
  )
}


export default SearchResult
