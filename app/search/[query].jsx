import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import useAppwrite from "../../lib/useAppwrite";
import { searchHostel, searchUser } from "../../lib/appwrite";

import EmptyState from "../../components/EmptyState";
import HostelCard from "../../components/HostelCard";
import UserCard from "../../components/UserCard";
import SearchInput from "../../components/SearchInput";

const Search = () => {
  const { query, category, route } = useLocalSearchParams();
  const { data: results, refetch } = useAppwrite(() => {
    return category === "User" ? searchUser(query) : searchHostel(query);
  });

  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query]);

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={results}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) =>
            category === "User" ? <UserCard user={item} /> : <HostelCard data={item} />
          }
          ListHeaderComponent={() => (
            <>
              <View className="flex my-6 px-4">
                <Text className="font-medium text-gray-100 text-sm">
                  Search Results
                </Text>
                <Text className="text-2xl font-semibold text-white mt-1">
                  {query}
                </Text>

                <View className="mt-6 mb-8">
                  <SearchInput initialQuery={query} refetch={refetch} />
                </View>
              </View>
            </>
          )}
          ListEmptyComponent={() => <EmptyState query={query} category={category}/>}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Search;
