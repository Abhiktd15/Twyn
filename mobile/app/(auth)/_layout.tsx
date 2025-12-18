import { useAuthStore } from "@/store/useAuthStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import '../../global.css';

export default function AuthLayout() {
    const router = useRouter();
    const segments = useSegments()

    const {user,token,checkAuth} = useAuthStore();

    // console.log("Auth State - User:", user, "Token:", token);
    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const inAuthScreen = segments[0] === "(auth)";
        const isSignedIn = user && token;

        if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
        else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
    }, [user, token, segments]);
    
    return <Stack screenOptions={{ headerShown: false }} />; 
}