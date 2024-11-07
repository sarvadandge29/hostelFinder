import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const UpdateHostel = () => {
  const { title, fees, description, amenities, image1, image2, image3, image4 } = useLocalSearchParams();
  return (
    <GestureHandlerRootView className="flex-1">
        <SafeAreaView className="bg-primary flex-1">
            
        </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default UpdateHostel