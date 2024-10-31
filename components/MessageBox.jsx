import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'

const MessageBox = ({ item }) => {
  const createdAt = item.createdAt;
  const messageDate = new Date(createdAt);
  const formattedDateTime = formatDate(messageDate);

  return (
    <SafeAreaView className="bg-[#2d2d44] rounded-lg p-4 flex-row items-center mb-4">
      <View className="items-center justify-center">
        <Image
          source={{ uri: item.senderAvatar }}
          className="w-10 h-10 rounded-full mr-4"
          resizeMode='contain'
        />
      </View>
      <View>
        <Text className="text-secondary-200">{item.senderName} </Text>
        <Text className="text-white">{item.Body} </Text>
        <Text className="text-white">{formattedDateTime} </Text>
      </View>
    </SafeAreaView>
  );
};

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}


export default MessageBox