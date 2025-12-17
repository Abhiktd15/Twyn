import SafeScreen from "@/components/SafeScreen";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments()

  // const {user,token,checkAuth} = useAuthStore();

  // console.log("Auth State - User:", user, "Token:", token);
  // useEffect(() => {
  //   checkAuth();
  // }, []);
  
  // const user = true
  // useEffect(() => {
  //   const inAuthScreen = segments[0] === "(auth)";
  //   // const isSignedIn = user && token;
  //   const isSignedIn = true; // --- IGNORE ---

  //   if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
  //   else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
  // }, [user, segments]);
  return <SafeAreaProvider>
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)"/>
        <Stack.Screen name="(tabs)"/>
      </Stack>
    </SafeScreen>
    <StatusBar style="dark"/>
  </SafeAreaProvider>
}
