import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, Alert, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { StatusBar } from 'expo-status-bar';

import { createUser } from '../../lib/appwrite';
import { images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
  const { fetchCurrentUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const submit = async () => {
    if (!form.email || !form.name || !form.password || !form.phoneNumber) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    if (!validatePhoneNumber(form.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(
        form.email,
        form.password,
        form.name,
        form.phoneNumber
      );

      await fetchCurrentUser();
      setIsLoggedIn(true);

      router.replace('/userHome');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="w-full justify-center flex-1 px-4 my-6">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[230px] h-[68px]"
            />

            <Text className="text-white text-2xl font-semibold text-semibold">
              Sign Up To Hostel Finder
            </Text>

            <FormField
              title="Name"
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, name: e })}
              otherStyles="mt-7"
              textStyle="text-base text-gray-100 font-medium"
              placeholder="Enter Your Name"
            />

            <FormField
              title="Phone Number"
              value={form.phoneNumber}
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              otherStyles="mt-7"
              keyboardType="phone-pad"
              textStyle="text-base text-gray-100 font-medium"
              placeholder="Enter Your Phone Number 10 digit"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
              textStyle="text-base text-gray-100 font-medium"
              placeholder="Enter Your Email"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              textStyle="text-base text-gray-100 font-medium"
              placeholder="Enter Password"
            />

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            
            <View className="justify-center pt-5 flex-row gap-2">

              <Text className="text-lg font-regular text-gray-100">
                Already have an account?{' '}

                <Link className="text-secondary text-lg font-semibold" href="/sign-in">
                  Login
                </Link>
              </Text>
            </View>
          </View>
          <StatusBar backgroundColor="#161622" style="light" />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignUp;
