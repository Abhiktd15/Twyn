import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    return token;
}
const getUser = async () => {
    const user = await AsyncStorage.getItem('user')
    return user
}

export default function TabLayout() {
    const insets = useSafeAreaInsets();
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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    if (!isAuth) {
        return <Redirect href="/(auth)" />;
    }

    return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#1DA1F2",
                    tabBarInactiveTintColor: "#657786",
                    tabBarStyle: {
                    backgroundColor: "black",
                    borderTopWidth: 1,
                    borderTopColor: "#E1E8ED",
                    height: 50 + insets.bottom,
                    paddingTop: 8,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                    title: "",
                    tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                    title: "",
                    tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="notifications"
                    options={{
                    title: "",

                    tabBarIcon: ({ color, size }) => <Feather name="bell" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="messages"
                    options={{
                    title: "",

                    tabBarIcon: ({ color, size }) => <Feather name="mail" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                    title: "",
                    tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
                    }}
                />
            </Tabs>

    )
}