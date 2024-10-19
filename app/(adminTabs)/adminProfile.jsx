import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getSavedHostels, signOut, getAllHostels, unsaveHostel } from "../../lib/appwrite"
import useAppwrite from "../../lib/useAppwrite";
import HostelCard from "../../components/HostelCard";
import InfoBox from "../../components/InfoBox";
import { useFocusEffect } from '@react-navigation/native';

const getHostelDetailsByIds = async (hostelIds) => {
  const allHostels = await getAllHostels();
  return allHostels.filter(hostel => hostelIds.includes(hostel.hostelId));
};

const Profile = () => {
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

      return () => {};
    }, [savedHostels])
  );

  const logout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setUser(null);
    router.replace('/sign-in');
  };

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUnsave = async (hostelId) => {
    await unsaveHostel(user.accountId, hostelId);
    await refetch();
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
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
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View>
                <InfoBox
                  title={user?.name}
                  subtitle={user?.email}
                  containerStyles={"mt-5"}
                  titleStyles={"text-lg"}
                  subtitleStyles={"text-sm"}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white font-bold text-3xl">No Hostels Saved Yet</Text>
              <Text className="text-gray-400 text-sm">Start saving your favorite hostels to see them here!</Text>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={onRefreshing}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;