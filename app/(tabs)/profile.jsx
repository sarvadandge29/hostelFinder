import { View, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState } from "react";

import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider"

import { getAllHostels, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

import HostelCard from "../../components/HostelCard";
import InfoBox from "../../components/InfoBox";
import MessageButton from "../../components/MessageButton";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: hostel, refetch } = useAppwrite(getAllHostels);

  const [refreshing, setRefreshing] = useState(false);


  const logout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setUser(null);

    router.replace('/sign-in');
  }

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={hostel}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <HostelCard
              data={item}
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
          ListFooterComponent={
            <View className="flex-row">
              <MessageButton via="whatsapp" />
              <MessageButton via="message" />
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefreshing}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;
