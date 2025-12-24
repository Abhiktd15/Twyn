import PostComposer from '@/components/PostComposer'
import PostList from '@/components/PostList'
import SignoutButton from '@/components/SignoutButton'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

const index = () => {
    return (
        <View className='mt-2'>
            {/* Header */}
            <View className='flex flex-row items-center justify-between gap-2 p-4 bg-gray-900 border-b border-gray-200'>
                <Ionicons name='logo-xing' size={30} color='#1DA1F2' />
                <Text className='text-2xl font-bold text-white'>Home</Text>
                <SignoutButton/>
            </View>
            {/* Post Composer Component */}
            <ScrollView showsVerticalScrollIndicator={false} className=''>
                <PostComposer/>
                <PostList/>
            </ScrollView>
        </View>
    )
}

export default index