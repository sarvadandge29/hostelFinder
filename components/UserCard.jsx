import { router, useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native";

const UserCard = ({ user }) => {

  const { name, PhoneNumber, email, isAdmin } = user;
  const userId = user.$id;

  const handlePress = () => {
    router.push({
      pathname: 'userDetails',
      params: { name, PhoneNumber, email, isAdmin, userId },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="bg-[#2d2d44] rounded-lg p-4 flex-row items-center mb-4">
        <Image
          source={{ uri: user.avatar }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">{user.name}</Text>
          <Text className="text-sm text-gray-400 mb-1">{user.email}</Text>
          <Text className="text-sm text-[#f0a500]">
            {user.isAdmin ? "Admin" : "User"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
