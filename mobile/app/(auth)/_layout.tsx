import { Redirect, Stack } from "expo-router";
import '../../global.css';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    return token;
}
const getUser = async () => {
    const user = await AsyncStorage.getItem('user')
    return user
}

export default function AuthLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getUser();
                const token = await getToken();
                const authenticated = user !== null && token !== null;
                setIsAuth(authenticated);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if(isAuth){
        return <Redirect href={"/(tabs)"}/>
    }

    return <Stack screenOptions={{ headerShown: false }} />; 
}