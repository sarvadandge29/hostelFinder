import { router, useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";

const ChatList = ({ user1 }) => {
  const { user } = useGlobalContext();
  const { name, avatar} = user1;
  const userId = user1.$id;

  const handlePress = () => {
    router.push({
      pathname: 'chat',
      params: { name, avatar, userId },
    });
  };

  

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="bg-[#2d2d44] rounded-lg p-4 flex-row items-center mb-4">
        <Image
          source={{ uri: user1.avatar }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">{user1.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;
