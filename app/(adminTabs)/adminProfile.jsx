import React, { useState } from "react";
import { View, TouchableOpacity, FlatList, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { signOut } from "../../lib/appwrite";
import InfoBox from "../../components/InfoBox";
import CustomButton from "../../components/CustomButton";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setUser(null);
    router.replace("/sign-in");
  };

  const routeToAllUser = () =>{
    router.push("/allUsers");
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View>
                <InfoBox
                  title={user?.name}
                  subtitle={user?.email}
                  containerStyles={"mt-5"}
                  titleStyles={"text-lg"}
                  subtitleStyles={"text-sm"}
                />
              </View>
              <CustomButton 
              title="See All Users"
              containerStyles="mt-3 px-5"
              handlePress={routeToAllUser} />
            </View>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;
