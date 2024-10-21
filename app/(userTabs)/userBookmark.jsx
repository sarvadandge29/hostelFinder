import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { getAllHostels, getSavedHostels } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import useAppwrite from '../../lib/useAppwrite';
import { useFocusEffect } from 'expo-router';
import SearchInput from '../../components/SearchInput';
import HostelCard from '../../components/HostelCard';
import EmptyState from '../../components/EmptyState';

const getHostelDetailsByIds = async (hostelIds) => {
  const allHostels = await getAllHostels();
  return allHostels.filter(hostel => hostelIds.includes(hostel.hostelId));
};

const Bookmark = () => {

  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: savedHostels, refetch } = useAppwrite(() => getSavedHostels(user.accountId));

  const [hostelDetails, setHostelDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchHostelDetails = async () => {
        const hostelIds = savedHostels.map(item => item.hostelId);
        const details = await getHostelDetailsByIds(hostelIds);
        setHostelDetails(details);
      };

      fetchHostelDetails();

      return () => { };
    }, [savedHostels])
  );

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-primary">
        <FlatList
          data={hostelDetails}
          keyExtractor={(item) => item.hostelId}
          renderItem={({ item }) => (
            <HostelCard
              data={item}
              onRefresh={onRefreshing}
              route="profile"
            />
          )}
          ListHeaderComponent={() => (
            <View className="mt-10 mb-2 px-4 space-y-6">
              <View className="justify-between items-start flex-row my-6">
                <Text className="text-2xl font-bold text-white px-2">Saved Hostels</Text>
              </View>
              <SearchInput searchCategory="Hostel"/>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <EmptyState category="Hostel" route ="bookmark"/>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={onRefreshing}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Bookmark