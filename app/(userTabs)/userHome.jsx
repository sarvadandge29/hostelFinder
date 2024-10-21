import { View, Text, SafeAreaView, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { useGlobalContext } from '../../context/GlobalProvider';
import useAppwrite from "../../lib/useAppwrite";
import { getAllHostels } from "../../lib/appwrite";
import HostelCard from '../../components/HostelCard';

const Home = () => {
  const { user } = useGlobalContext();
  const { data: hostels, refetch } = useAppwrite(getAllHostels);
  
  const [refreshing, setRefreshing] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const fetchHostels = async () => {
    if (!hasRefreshed) {
      setRefreshing(true);
      await refetch();
      setHasRefreshed(true);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary flex-1">
        <FlatList
          data={hostels}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <HostelCard data={item} onRefresh={onRefreshing}/>
          )}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row my-6">
                <View>
                  <Text className="font-medium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="font-psemibold text-2xl text-white">
                    {user?.name}
                  </Text>
                </View>

                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10 rounded-full"
                    resizeMode='contain'
                  />
                </View>
              </View>

              <SearchInput searchCategory="Hostel"/>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1">
              <EmptyState title="No hostels found" />
            </View>
          )}
          refreshing={refreshing}
          onRefresh={onRefreshing}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
