import { View, Text, Linking } from 'react-native';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants';

const MessageButton = ({ propertyName, via }) => {
    const openMessagingApp = () => {
        const message = propertyName
            ? `Hello, I am interested in the property: ${propertyName}`
            : "Hello, I am interested in a property.";

        if (via === 'whatsapp') {

            const whatsappURL = `https://wa.me/+917020840046?text=${encodeURIComponent(message)}`;
            Linking.canOpenURL(whatsappURL)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(whatsappURL);
                    } else {
                        console.log('Unable to open WhatsApp URL');
                    }
                })
                .catch((err) => console.error('An error occurred', err));
        } else if (via === 'message') {
            const smsURL = `sms:+919356281247?body=${encodeURIComponent(message)}`;
            Linking.canOpenURL(smsURL)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(smsURL);
                    } else {
                        console.log('Unable to open SMS URL');
                    }
                })
                .catch((err) => console.error('An error occurred', err));
        }
    };

    const iconSource = via === 'whatsapp' ? icons.whatsappLogo : icons.messageLogo;

    return (
        <View className="flex-1">
            <TouchableOpacity
                onPress={openMessagingApp}
                activeOpacity={0.7}
                className="bg-secondary rounded-2xl min-h-[62px] flex flex-row justify-center items-center mx-1 my-2"
            >
                <Text className={`text-primary font-semibold text-lg`}>Get Detials Via</Text>
                <Image
                    source={iconSource}
                    className="w-6 h-6 ml-1 mb-2 mt-1"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

export default MessageButton;
