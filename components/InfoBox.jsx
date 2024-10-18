import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyles, titleStyles, subtitleStyles }) => {
    return (
        <View className={containerStyles}>
            <Text className={`${titleStyles} text-white text-center font-semibold`}>{title}</Text>
            <Text className={`${subtitleStyles} text-white text-center font-semibold`}>{subtitle}</Text>
        </View>
    )
}

export default InfoBox