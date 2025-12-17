// import  from '@/assets//login.'
// import COLORS from '@/constants/colors'
// import { useAuthStore } from '@/store/authStore'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import axios from 'axios'
import { API_BASE_URL } from '@/utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
    const [signupData,setsignupData] = React.useState({
        email_or_username:'',
        password:''
    })
    const [showPassword,setShowPassword] = React.useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/user/login`,signupData)
            await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            await AsyncStorage.setItem("token", response.data.token);
            router.replace('/(tabs)');
        } catch (error:any) {
            console.log("Login Error:", error.response?.data || error.message);
            Alert.alert("Login Failed", "Something went wrong. Please try again.");
        }
        setIsLoading(false);
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >   
            <View className='flex-1 justify-center  bg-black px-5'>
                <View className='p-6'>
                    {/* Header */}
                    <View>
                        <View className=' flex flex-row items-center justify-center gap-2 mb-6'>
                            <Text className='text-3xl font-bold text-white'>Twyn</Text>      
                            <Ionicons name="logo-xing" size={40} color="#1DA1F2"/>
                        </View>
                    </View>
                    {/* Form fields  */}
                    <View className='mt-6 space-y-4'>
                        {/* Username */}
                        <View className='mb-5'>
                            <Text className='font-medium text-sm text-white '>Email or Username</Text>
                            <View className='mt-2 bg-white  border rounded-xl border-gray-500 flex flex-row items-center  px-4 py-3'>
                                <Ionicons name='person-outline' size={20} />
                                <TextInput 
                                    placeholder='johndoe'
                                    placeholderTextColor={"gray"}
                                    keyboardType='default'
                                    autoCapitalize='none'
                                    value={signupData.email_or_username}
                                    className='font-medium text-lg flex-1 h-full  ml-4 mb-2 text-black '
                                    onChangeText={(text) => setsignupData({...signupData,email_or_username:text})}
                                />
                            </View>
                        </View>
                        {/* Password */}
                        <View className='mb-5'>
                            <Text className='font-medium text-sm text-white '>Password</Text>
                            <View className='mt-2 border bg-white rounded-xl border-gray-500 flex flex-row items-center px-4 py-3'>
                                <Ionicons name='lock-closed-outline'  size={20} />
                                <TextInput 
                                    placeholder='*******'
                                    placeholderTextColor={"gray"}
                                    secureTextEntry={!showPassword}
                                    value={signupData.password}
                                    className='font-medium text-lg flex-1 h-full ml-4 mb-2 text-black '
                                    onChangeText={(text) => setsignupData({...signupData,password:text})}
                                />
                                {/* eye icon */}
                                <TouchableOpacity className='ml-auto' onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons 
                                        name={!showPassword ? 'eye-off-outline' : 'eye-outline'} 
                                        size={20} 
                                        color={"black"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* Login Button */}
                    <TouchableOpacity onPress={handleLogin} className='border border-gray-500 flex items-center justify-center elevation-sm bg-white rounded-xl h-14 mt-4 '>
                        {isLoading ?
                            <ActivityIndicator size="small" color={"black"} />
                        :
                            <Text className='text-black text-center text-base font-semibold'>Log In</Text>
                        }     
                    </TouchableOpacity>
                    {/* Footer */}
                    <View className='mt-6 flex flex-row items-center justify-center mr-5' >
                        <Text className='text-gray-300' >Already have an account?</Text>
                        <Link href='/(auth)/signup' asChild>
                            <TouchableOpacity>
                                <Text className='text-blue-400 '> Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login