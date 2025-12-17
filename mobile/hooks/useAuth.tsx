import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export const getToken = async () : Promise<string | null> => {
    // Logic to retrieve the token from secure storage or AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (token) {
        return token;
    }
    return null;    
}

export const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem('token');
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return !!token && !!user;
};

export const useAuth = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            setIsAuth(!!token && !!user);
            setIsLoading(false);
        };
        
        checkAuth();
    }, []);

    return { isAuth, isLoading };
};