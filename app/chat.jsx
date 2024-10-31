import { View, Text, StatusBar, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native'
import { databaseId, databases, messagesCollectionId } from '../lib/appwrite'
import { router, useLocalSearchParams } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import { FlatList } from 'react-native'
import { useGlobalContext } from '../context/GlobalProvider';
import { ID, Query } from 'react-native-appwrite'
import MessageBox from '../components/MessageBox'

const Chat = () => {
    const { user } = useGlobalContext();
    const [messages, setMessages] = useState([]);
    const { name: nameParam, avatar, userId } = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const [form, setForm] = useState({
        newMessage: "",
    });

    const getRoomId = (firstUserId, secondUserId) => {
        const sortedIds = [firstUserId, secondUserId].sort();
        const roomId = sortedIds.join('-');
        return roomId;
    }

    const roomId = getRoomId(userId, user.$id);
    useEffect(() => {
        getMessagesByRoomId(roomId);
    }, [])

    const getMessagesByRoomId = async (roomId) => {
        const response = await databases.listDocuments(
            databaseId,
            messagesCollectionId,
            [Query.equal("roomId", roomId)]
        );
        setMessages(response.documents);
    }

    const handlePress = () => {
        const route = user?.isAdmin ? 'adminChatTab' : 'userChatTab';
        router.push({ pathname: route });
    };

    const sendMessage = async () => {
        if (form.newMessage.trim()!== "") {
          try {
            const newMessage = {
              Body: form.newMessage,
              roomId: roomId,
              senderName: user.name,
              createdAt: new Date().toISOString(),
              senderAvatar: user.avatar,
              tempKey: Date.now().toString(),
            };
      
            const response = await databases.createDocument(
              databaseId,
              messagesCollectionId,
              ID.unique(),
              newMessage
            );

            newMessage.$id = response.$id;
      
            setMessages([...messages, newMessage]);
            setForm({ newMessage: "" });
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      };

    const onRefreshing = async () => {
        setRefreshing(true);
        setRefreshing(false);
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
                <FlatList
                    className="mt-2"
                    data={messages}
                    keyExtractor={(item) => item.$id || item.tempKey}
                    renderItem={({ item }) => (
                        <MessageBox item={item}/>
                    )}
                    refreshing={refreshing}
                    onRefresh={onRefreshing}
                />
                <View className="absolute bottom-0 left-0 right-0 bg-primary p-4">
                    <View className={`space-y-2 `}>
                        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focused:border-secondary items-center flex-row">
                            <TextInput
                                className="flex-1 text-white font-semibold text-base"
                                placeholder="Type a message"
                                placeholderTextColor="#7b7b8b"
                                value={form.newMessage}
                                onChangeText={(e) => setForm({ ...form, newMessage: e })}
                            />
                            <TouchableOpacity onPress={sendMessage} >
                                <Image
                                    source={icons.sendIcon}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <StatusBar backgroundColor="#161622" style="light" />
            </SafeAreaView>
        </GestureHandlerRootView >
    )
}

export default Chat