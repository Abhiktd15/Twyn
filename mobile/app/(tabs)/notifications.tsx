import NoNotificationsFound from '@/components/NoNotificationsFound'
import NotificationCard from '@/components/NotificationCard'
import { useAuthStore } from '@/store/useAuthStore'
import { Notification, useNotificationStore } from '@/store/useNotificationStore'

import { Feather } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Notifications = () => {
  const {notifications,isLoading,fetchNotifications,error,isRefetching,deleteNotification} = useNotificationStore()
  const {token} = useAuthStore()
  const inset = useSafeAreaInsets()
  useEffect(() => {
    fetchNotifications(token)
  },[token])

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-gray-500 mb-4">Failed to load notifications</Text>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => fetchNotifications(token)}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View> 
    );
  }

  return (
    <View className="flex-1 bg-white" >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="#657786" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + inset.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => fetchNotifications(token)} tintColor={"#1DA1F2"} />
        }
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size="large" color="#1DA1F2" />
            <Text className="text-gray-500 mt-4">Loading notifications...</Text>
          </View>
        ) : notifications?.length === 0 ? (
          <NoNotificationsFound />
        ) : (
          notifications?.map((notification: Notification) => (
            <NotificationCard key={notification._id}
              notification={notification}
              onDelete={deleteNotification}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Notifications