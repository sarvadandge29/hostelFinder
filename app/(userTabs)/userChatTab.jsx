import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { databaseId, databases, getAllUsers, messagesCollectionId } from '../../lib/appwrite'
import SearchInput from '../../components/SearchInput'
import useAppwrite from '../../lib/useAppwrite'
import ChatList from '../../components/ChatList'

const ChatTab = () => {
    const { data: users, refetch } = useAppwrite(getAllUsers);
    const [refreshing, setRefreshing] = useState(false);

    const onRefreshing = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="bg-primary flex-1 pt-5">
                <View className="my-6 px-4 space-y-6">
                    <SearchInput searchCategory="User" searchItem="chat" />
                </View>
                <FlatList
                    data={users.filter((user) => user.isAdmin === true)}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <ChatList user1={item} />
                    )}
                    refreshing={refreshing}
                    onRefresh={onRefreshing}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default ChatTab