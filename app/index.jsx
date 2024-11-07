import { View, Text, SafeAreaView, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import {  Redirect, router } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { images } from '../constants';
import CustomButton from "../components/CustomButton";

import { useGlobalContext } from '../context/GlobalProvider';


const Welcome = () => {
  const { isLoading, isLoggedIn, user } = useGlobalContext();


  if (!isLoading && isLoggedIn){
    if (user?.isAdmin) {
      return <Redirect href="/adminHome" />
    }else{
      return <Redirect href="/userHome" />
    }
  } 

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full h-full px-4 items-center justify-center">
          {isLoading? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator
                size="large" 
                color="#ffffff"
              />
              <Text className="text-sm font-regular text-gray-100 mt-3 text-center">
                Loading...
              </Text>
            </View>
          ) : (
            <>
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
                  className="w-[136px] h-[15px] absolute -bottom-2 -right-14 mb-1 mr-1"
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
            </>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Welcome;