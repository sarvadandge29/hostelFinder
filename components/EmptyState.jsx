import { router } from "expo-router";
import { View, Text, Image } from "react-native";
import { images } from "../constants";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

const EmptyState = ({ query = "", title, category, route }) => {
  const { user } = useGlobalContext();
  
  const handlePressNavigate = () => {
    const route = user?.isAdmin ? 'adminHome' : 'userHome';
    router.push({ pathname: route });
  };

  const getEmptyMessage = () => {
    if (category === "Hostel" && route === "bookmark") {
      return `No Hostels Saved Yet`;
    } else if (category === "User") {
      return `No match users found for ${query}`;
    }else if (category ==="Hostel") {
      return `No hostels match the search for ${query}`;
    } else {
      return `No ${category} Found`;
    }
  };

  const getEmptyMessageSmall = () => {
    if (route === "bookmark") {
      return `Start saving your favorite ${category} to see them here!`;
    } else if (category === "User") {
      return ``;
    } else if (category === "Hostel") {
      return ``;
    }
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
          {getEmptyMessage()}
        </Text>
      ) : (
        <View className="items-center">
          <Text className="text-white font-bold text-xl">{getEmptyMessage()}</Text>
          <Text className="text-gray-400 text-sm">
            {getEmptyMessageSmall()}
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