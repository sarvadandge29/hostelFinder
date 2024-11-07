import React from 'react'
import { Stack } from 'expo-router'

const CommonLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="updateHostel" options={{ headerShown: false }} />
            <Stack.Screen name="allUsers" options={{ headerShown: false }} />
            <Stack.Screen name="userDetails" options={{ headerShown: false }} />
            <Stack.Screen name="details" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
        </Stack>
    )
}

export default CommonLayout