import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons, images } from "../constants";
import MessageButton from '../components/MessageButton';
import { getAllHostels } from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";
import { useGlobalContext } from '../context/GlobalProvider';

const DetailsScreen = () => {
  const { refetch } = useAppwrite(getAllHostels);
  const { title, fees, description, amenities, image1, image2, image3, image4 } = useLocalSearchParams();
  const { currentUser } = useGlobalContext();

  const handlePress = () => {
    const route = currentUser?.isAdmin ? 'adminHome' : 'userHome';
    router.push({ pathname: route });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const data = [
    { id: '1', key: 'header' },
    { id: '2', key: 'title', title },
    { id: '3', key: 'images', images: [image1, image2, image3, image4] },
    { id: '4', key: 'fees', fees },
    { id: '5', key: 'description', description },
    { id: '6', key: 'amenities', amenities },
    { id: '7', key: 'footer' }
  ];

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'header':
        return (
          <TouchableOpacity onPress={handlePress} className="justify-between items-start flex-row mt-0.5">
            <View className="flex-row">
              <Image
                source={icons.arrow_back}
                className="w-6 h-6 mt-1"
                resizeMode='contain'
              />
              <Text className="font-bold text-xl text-secondary ml-2">Home</Text>
            </View>
            <View className="relative items-end">
              <Image
                source={images.logoSmall}
                className="w-6 h-6 mt-1 ml-2 justify-end items-end"
                resizeMode='contain'
              />
            </View>
          </TouchableOpacity>
        );
      case 'title':
        return <Text className="font-bold text-xl text-white mt-3">{item.title}</Text>;
      case 'images':
        return (
          <FlatList
            horizontal
            data={item.images.filter(Boolean)}
            renderItem={({ item: imageUri }) => (
              <Image
                source={{ uri: imageUri }}
                className="w-40 h-40 mr-2 rounded-xl"
                resizeMode="cover"
              />
            )}
            keyExtractor={(imageUri, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
          />
        );
      case 'fees':
        return (
          <View className="flex-row mt-3">
            <Text className="font-bold text-lg text-white">Fees Per Year: </Text>
            <Text className="text-lg text-white">Rs{"." + item.fees + "/-"}</Text>
          </View>
        );
      case 'description':
        return (
          <View className="mt-3">
            <Text className="font-bold text-lg text-white">Description:</Text>
            <Text className="text-lg text-white">{item.description}</Text>
          </View>
        );
      case 'amenities':
        return (
          <View className="mt-3">
            <Text className="font-bold text-lg text-white">Amenities:</Text>
            <Text className="text-lg text-white">{item.amenities}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary flex-1">
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefreshing}
        />
        <View className="absolute bottom-0 left-0 right-0 bg-primary p-4 flex-row justify-between">
          <MessageButton
            propertyName={title}
            title="Get Details"
            via="whatsapp"
          />
          <MessageButton
            propertyName={title}
            title="Get Details"
            via="message"
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DetailsScreen;
