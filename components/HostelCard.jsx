import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '../constants';

const HostelCard = ({ data }) => {
  const router = useRouter();

  if (!data) {
    return <Text>No hostel data available.</Text>;
  }

  const { title, thumbnail, fees, description, amenities, image1, image2, image3, image4 } = data;

  const handlePress = () => {
    router.push({
      pathname: 'details',
      params: { title, thumbnail, fees, description, amenities, image1, image2, image3, image4 },
    });
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
      <View className="flex flex-row gap-3 items-start mt-1">
        <TouchableOpacity className="flex justify-center items-center flex-row flex-1">
          <View className="flex justify-center flex-1 ml-3">
            <Text className="font-semibold text-lg text-white " numberOfLines={1}>
              {title}
            </Text>
          </View>
          <Image source={icons.menu} className="w-5 h-5 mr-2" resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HostelCard;
