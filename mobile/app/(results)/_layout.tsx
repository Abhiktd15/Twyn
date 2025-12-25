import { Stack } from 'expo-router';
import React from 'react';

const ResultsLayout = () => {
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
        >
            <Stack.Screen name="index"  options={{ title:"About"}} />
            <Stack.Screen name="searchresult"  options={{ title:"Search"}} />
        </Stack> 
    )
}

export default ResultsLayout