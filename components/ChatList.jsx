import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";
import { databaseId, databases, messagesCollectionId } from "../lib/appwrite";
import { Query } from "react-native-appwrite";

const ChatList = ({ user1 }) => {
  const { user } = useGlobalContext();
  const { name, avatar } = user1;
  const userId = user1.$id;
  const [latestMessage, setLatestMessage] = useState("");

  const getRoomId = (firstUserId, secondUserId) => {
    const sortedIds = [firstUserId, secondUserId].sort();
    const roomId = sortedIds.join('-');
    return roomId;
  }

  const roomId = getRoomId(userId, user.$id);

  useEffect(() => {
    getLatestMessageByRoomId(roomId);
  }, [roomId])

  const getLatestMessageByRoomId = async (roomId) => {
    const response = await databases.listDocuments(
      databaseId,
      messagesCollectionId,
      [
        Query.equal("roomId", roomId),
        Query.limit(1),
        Query.orderDesc("createdAt")
      ]
    );
    if (response.documents.length > 0) {
      setLatestMessage(response.documents[0]);
    } else {
      setLatestMessage("No messages yet");
    }
  }

  const createdAt = latestMessage.createdAt;
  const messageDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDiff = currentDate - messageDate;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeAgo;
  if (days > 0) {
    timeAgo = `${days} day${days > 1 ? '' : ''} ago`;
  } else if (hours > 0) {
    timeAgo = `${hours} hour${hours > 1 ? '' : ''} ago`;
  } else if (minutes > 0) {
    timeAgo = `${minutes} minute${minutes > 1 ? '' : ''} ago`;
  } else if (seconds > 0) {
    timeAgo = `${seconds} second${seconds > 1 ? '' : ''} ago`;
  } else {
    timeAgo = "just now";
  }
  
  let lastMessage;
  if (!latestMessage.Body) {
    lastMessage = "No Message Yet";
    timeAgo=""
  }else{
    lastMessage = latestMessage.Body
  }

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
          <Text className="text-sm text-white opacity-80">{lastMessage}</Text>
          <Text className="text-sm text-white opacity-80">{timeAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;