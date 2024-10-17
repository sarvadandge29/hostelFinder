import React ,{ useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, keyboardType, textStyle, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className={textStyle}>{title}</Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focused:border-secondary items-center flex-row">
                <TextInput
                    className="flex-1 text-white font-semibold text-base"
                    value={value}
                    placeholder={placeholder} // Fixed here
                    placeholderTextColor="#7b7b8b"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && !showPassword}
                    keyboardType={keyboardType}
                />
                {title === 'Password' && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image 
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;
