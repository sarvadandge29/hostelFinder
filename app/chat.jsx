import { View, Text, StatusBar, Image, TouchableOpacity,SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { databaseId, databases, messagesCollectionId } from '../lib/appwrite'
import { router, useLocalSearchParams } from 'expo-router'
import { icons } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider';
import { ID, Query } from 'react-native-appwrite'
import { GiftedChat } from 'react-native-gifted-chat';

const Chat = () => {
    const { user } = useGlobalContext();
    const { name: nameParam, avatar, userId } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
  
    const getRoomId = (firstUserId, secondUserId) => {
      const sortedIds = [firstUserId, secondUserId].sort();
      const roomId = sortedIds.join('-');
      return roomId;
    };
  
    const roomId = getRoomId(userId, user.$id);
  
    useEffect(() => {
      const fetchMessages = async () => {
        await getMessagesByRoomId(roomId);
      };
      fetchMessages();
    }, [roomId]);
  
    const getMessagesByRoomId = async (roomId) => {
      const response = await databases.listDocuments(
        databaseId,
        messagesCollectionId,
        [Query.equal("roomId", roomId)]
      );
      const formattedMessages = response.documents.map((doc) => ({
        _id: doc.$id,
        text: doc.Body,
        createdAt: doc.createdAt,
        user: {
          _id: doc.senderName === user.name? user.$id : userId,
          name: doc.senderName,
          avatar: doc.senderAvatar,
        },
      }));
      setMessages(formattedMessages);
    };
  
    const handleRefresh = async () => {
      setRefreshing(true);
      await getMessagesByRoomId(roomId);
      setRefreshing(false);
    };
  
    const handlePress = () => {
      const route = user?.isAdmin? 'adminChatTab' : 'userChatTab';
      router.push({ pathname: route });
    };
  
    const onSend = async (newMessages) => {
      const newMessage = newMessages[0];
      try {
        const response = await databases.createDocument(
          databaseId,
          messagesCollectionId,
          ID.unique(),
          {
            Body: newMessage.text,
            roomId: roomId,
            senderName: user.name,
            createdAt: new Date().toISOString(),
            senderAvatar: user.avatar,
          }
        );
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };
  
    return (
      <GestureHandlerRootView className="flex-1">
        <SafeAreaView className="flex-1 bg-primary">
          <View className="flex-row px-2 pt-10">
            <TouchableOpacity onPress={handlePress}>
              <Image
                source={icons.arrow_back}
                className="w-9 h-9 mt-1"
                resizeMode='contain'
              />
            </TouchableOpacity>
            <Image
              source={{ uri: avatar }}
              className="w-10 h-10 rounded-full mr-4"
            />
            <Text className="text-white text-2xl pt-1">{nameParam}</Text>
          </View>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
              _id: user.$id,
              name: user.name,
              avatar: user.avatar,
            }}
            placeholder="Type a message"
            alwaysShowSend
          />
          <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  };
  
  export default Chat;