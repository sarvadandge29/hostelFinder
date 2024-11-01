import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SearchInput from "../components/SearchInput";
import UserCard from "../components/UserCard";
import useAppwrite from "../lib/useAppwrite";
import { getAllUsers } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const AllUsers = () => {
  const { user } = useGlobalContext();
  const userAccountId = user.accountId;
  const { data: users, refetch } = useAppwrite(() => { return getAllUsers(userAccountId) });
  const [refreshing, setRefreshing] = useState(false);


  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-primary px-4 py-6">
        <FlatList
          data={users}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <UserCard user={item} />}
          ListHeaderComponent={() => (
            <View className="py-10">
              <Text className="text-lg font-bold text-white mb-4">
                All Users
              </Text>
              <SearchInput searchCategory="User" />
            </View>
          )}
          refreshing={refreshing}
          onRefresh={onRefreshing}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default AllUsers;