import EditProfileModal from '@/components/EditProfileModal'
import PostList from '@/components/PostList'
import SignoutButton from '@/components/SignoutButton'
import { useAuthStore } from '@/store/useAuthStore'
import { usePostStore } from '@/store/usePostStore'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const Profile = () => {
  const {user,token,getCurrUser,isUpdating,updateProfile} = useAuthStore()
  const {userPost,fetchUsersPost,isLoading} = usePostStore()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName:"",  
    bio: "",
    location: "",
  });

  useEffect(() => {
    fetchUsersPost(token,user?.username as string)
  },[])
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  const openEditModal = () => {
    if (user) {
      setFormData({
        fullName:user.fullName || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
    setIsEditModalVisible(true);
  };
  const closeEditModal = () => {
    setIsEditModalVisible(false)
  }

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    await updateProfile(token,formData)
  }
  
  return (
    <View className='flex-1  bg-white'>
      {/* Header  */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <View>
          <Text className="text-xl font-bold text-gray-900">
            @{user?.username}
          </Text>
          <Text className="text-gray-500 text-sm">{userPost?.length} Posts</Text>
        </View>
        <SignoutButton/>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              getCurrUser()
              fetchUsersPost(token,user?.username as string);
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              user.bannerImg ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <TouchableOpacity
              className="border border-gray-300 px-6 py-2 rounded-full"
              onPress={openEditModal}
            >
              <Text className="font-semibold text-gray-900">Edit profile</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {user?.fullName || user?.username}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="text-gray-500 mb-2">@{user?.username}</Text>
            <Text className="text-gray-900 mb-3">{user?.bio}</Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{user?.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(user?.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">{user?.following?.length}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">{user?.followers?.length}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostList username={user?.username} />
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />
    </View>
  )
}

export default Profile