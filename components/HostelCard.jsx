import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '../constants';
import { useGlobalContext } from '../context/GlobalProvider';
import { isHostelSaved, unsaveHostel, saveHostel } from '../lib/appwrite';

const HostelCard = ({ data, route, onRefresh }) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  if (!data) {
    return <Text>No hostel data available.</Text>;
  }

  const { title, thumbnail, fees, description, amenities, image1, image2, image3, image4, mapLink } = data;

  useEffect(() => {
    checkIfSaved();
  }, []);

  const handlePress = () => {
    router.push({
      pathname: 'details',
      params: { title, thumbnail, fees, description, amenities, image1, image2, image3, image4, mapLink },
    });
  };

  const checkIfSaved = async () => {
    const saved = await isHostelSaved(user.accountId, data.hostelId);
    setIsSaved(saved);
  };

  const handleSaveUnsave = async () => {
    if (isSaved) {
      await unsaveHostel(user.accountId, data.hostelId);
      setIsSaved(false);
    } else {
      await saveHostel(user.accountId, data.hostelId);
      setIsSaved(true);
    }
    if (onRefresh) onRefresh();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handlePress} className="flex flex-col items-center px-4">
        <View className="w-full h-60 rounded-xl mt-1 relative flex justify-center items-center">
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
      <View className="flex flex-row gap-3 items-start mt-1 mx-3">
        <Text className="font-semibold text-lg text-white" numberOfLines={1}>
          {title}
        </Text>
        {route !== 'profile' && (
          <TouchableOpacity
            className="flex justify-center items-end flex-1"
            onPress={handleSaveUnsave}
          >
            <Image source={isSaved ? icons.unsave : icons.bookmark} className="w-5 h-5 mr-2" resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HostelCard;