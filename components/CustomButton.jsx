import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ title, handlePress, containerStyles, textStyle, isLoading}) => {
  
  return (
    <TouchableOpacity 
        onPress = {handlePress}
        activeOpacity={0.7}
        className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""}`}
        disabled = {isLoading}
    >
      <Text className = {`text-primary font-semibold text-lg ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;