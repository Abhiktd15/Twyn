import { View, Text } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import SignoutButton from '@/components/SignoutButton'

const index = () => {
    return (
        <View className='mt-2'>
            {/* Header */}
            <View className='flex flex-row items-center justify-between gap-2 p-4 border-b border-gray-200'>
                <Ionicons name='logo-xing' size={30} color='#1DA1F2' />
                <Text className='text-2xl font-bold text-black'>Home</Text>
                <SignoutButton/>
            </View>
        </View>
    )
}

export default index