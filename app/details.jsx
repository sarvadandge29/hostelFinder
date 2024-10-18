import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';

import { icons, images } from "../constants";
import MessageButton from '../components/MessageButton';
import { getAllHostels, deleteHostel } from "../lib/appwrite"; // Add the delete function if needed
import useAppwrite from "../lib/useAppwrite";
import { useGlobalContext } from '../context/GlobalProvider';

const DetailsScreen = () => {
  const { refetch } = useAppwrite(getAllHostels);
  const { title, fees, description, amenities, image1, image2, image3, image4 } = useLocalSearchParams();
  const { user } = useGlobalContext();

  const handlePress = () => {
    const route = user?.isAdmin ? 'adminHome' : 'userHome';
    router.push({ pathname: route });
  };

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this hostel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => deleteHostel(title) },
      ],
    );
  };

  const handleUpdate = () => {
    router.push({ pathname: 'updateHostel', params: { title, fees, description, amenities, image1, image2, image3, image4 } });
  };

  const imageUris = [image1, image2, image3, image4].filter(Boolean);

  const data = [
    { id: '1', key: 'header' },
    { id: '2', key: 'title', title },
    { id: '3', key: 'images', images: imageUris },
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
            data={item.images}
            renderItem={({ item: imageUri, index }) => (
              <TouchableOpacity onPress={() => handleImagePress(index)}>
                <Image
                  source={{ uri: imageUri }}
                  className="w-40 h-40 mr-2 rounded-xl"
                  resizeMode="cover"
                />
              </TouchableOpacity>
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

        <View className="absolute bottom-0 left-0 right-0 bg-primary p-4">
          {user?.isAdmin ? (
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={handleUpdate}
                className="bg-green-500 p-4 flex-1 mr-2 rounded-lg items-center flex-row justify-center"
              >
                <Text className="text-white font-bold">Update</Text>

                <Image
                  source={icons.updateIcon}
                  className="w-6 h-6 mx-2"
                  resizeMode='contain'
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-500 p-4 flex-1 ml-2 rounded-lg items-center flex-row justify-center">
                <Text className="text-white font-bold">Delete</Text>
                <Image
                  source={icons.deleteIcon}
                  className="w-6 h-6 mx-2"
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row justify-between">
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
          )}
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>

            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={{ position: 'absolute', top: 30, right: 20, zIndex: 1 }}>
                <Text style={{ color: 'white', fontSize: 24 }}>✕</Text>
              </View>
            </TouchableWithoutFeedback>

            <ImageViewer
              imageUrls={imageUris.map((uri) => ({ url: uri }))}
              index={selectedImageIndex}
              enableSwipeDown={true}
              onSwipeDown={() => setModalVisible(false)}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DetailsScreen;