import { View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'
import {  Redirect, router } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { images } from '../constants';
import CustomButton from "../components/CustomButton";

import { useGlobalContext } from '../context/GlobalProvider';


const Welcome = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full h-full px-4 items-center justify-center">
          <Image
            source={images.logo}
            className="w-[260px] h-[84px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Find Your{"\n"}
              Hostel with{" "}
              <Text className="text-secondary-200">Us</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />

          </View>

          <Text className="text-sm font-regular text-gray-100 mt-7 text-center">
            Find the perfect hostel or PG tailored to your preferences
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Welcome

