import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";


const EmptyState = ({ query = "", title }) => {
  const { user } = useGlobalContext();
  const handlePressNavigate = () => {
    const route = user?.isAdmin ? 'adminHome' : 'userHome';
    router.push({ pathname: route });
  };

  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      {title === 0 ? (
        <Text className="text-xl text-center font-semibold text-white mt-2">
          No hostels match the search for '{query}'
        </Text>
      ) : (
        <View className="items-center">
          <Text className="text-white font-bold text-3xl">No Hostels Saved Yet</Text>
          <Text className="text-gray-400 text-sm">
            Start saving your favorite hostels to see them here!
          </Text>
        </View>
      )}

      <CustomButton
        title="Back to Explore"
        handlePress={handlePressNavigate}
        containerStyles="w-full my-5"
        textStyle="px-5"
      />
    </View>
  );
};

export default EmptyState;