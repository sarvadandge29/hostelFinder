import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { icons } from '../constants';

const UploadBox = ({ title, file, openPicker, selectType }) => {
  return (
    <View className="mt-7 space-y-2">
      <Text className="text-base text-gray-100 font-medium">{title}</Text>
      <TouchableOpacity onPress={() => openPicker(selectType)}>
        {file ? (
          selectType === 'image' ? (
            <Image
              source={{ uri: file.uri }}
              resizeMode="contain"
              className="w-full h-64 rounded-2xl"
            />
          ) : (
            <Video
              source={{ uri: file.uri }}
              className="w-full h-64 rounded-2xl"
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              isLooping
            />
          )
        ) : (
          <View
            className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center flex-row space-x-2"
          >
            <Image
              source={icons.upload}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="text-sm text-gray-100 font-medium">
              Choose a file
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadBox;
