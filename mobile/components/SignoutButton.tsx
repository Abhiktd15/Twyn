import { useAuthStore } from '@/store/useAuthStore'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'

const SignoutButton = () => {
    const {logout} = useAuthStore()
    const handleSignout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: logout
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