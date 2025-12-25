import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const Trendingtopics = [
        { topic : "#ReactNative",tweets : "120K Tweets"},
        { topic : "#JavaScript",tweets : "80K Tweets"},
        { topic : "#MobileDevelopment",tweets : "60K Tweets"},
        { topic : "#Expo",tweets : "40K Tweets"},
        { topic : "#TypeScript",tweets : "30K Tweets"},
    ]

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/searchresult?username=${searchQuery.trim()}`)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View className='px-4 py-3 border-b border-gray-200'>
                <View className='flex flex-row items-center bg-gray-200  rounded-full px-4 py-3 '>
                    <Feather name='search' size={20} color='gray' />
                    <TextInput
                        placeholder='Search Twyn by username...'
                        className='flex-1 ml-3 text-base '
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                </View>
            </View>
                {/* Scroll view comp  */}
            <ScrollView className='flex-1 ' showsVerticalScrollIndicator={false}>
                <View className='p-4'>
                    <Text className='text-xl font-semibold text-gray-900'>
                        Trending For You
                    </Text>
                    {Trendingtopics.map((item,index) => (
                        <TouchableOpacity key={index} className='py-3 border-b border-gray-200 text-black'>
                            <Text className='text-black text-sm'>Trending in Technology</Text>
                            <Text className='text-gray-500 text-lg font-bold'>{item.topic}</Text>
                            <Text className='text-gray-900  text-sm'>{item.tweets}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

export default Search