import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'

const SignoutButton = () => {
    const handleSignout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        await AsyncStorage.removeItem("user");
                        await AsyncStorage.removeItem("token");
                        router.replace('/(auth)')
                    } catch (error) {
                        console.log("Error during logout:", error);
                    }
                }
            }
        ])
    }
    return (
        <TouchableOpacity onPress={handleSignout}>
            <Feather name='log-out' color={"red"} size={24}/>
        </TouchableOpacity>
    )
}

export default SignoutButton