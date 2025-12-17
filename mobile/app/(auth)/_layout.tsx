import { Redirect, Stack } from "expo-router";
import '../../global.css'

export default function AuthLayout() {
    const isSignedIn = true; // --- IGNORE ---
    if(isSignedIn){
        return <Redirect href="/(tabs)"/>
    }
    return <Stack screenOptions={{ headerShown: false }} />; 
}