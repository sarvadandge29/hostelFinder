import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, Alert, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { StatusBar } from 'expo-status-bar';

import { signIn } from '../../lib/appwrite';
import { images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider'; // Import Global Context

const SignIn = () => {
  const { fetchCurrentUser, setIsLoggedIn } = useGlobalContext(); // Use context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      await fetchCurrentUser(); // Fetch user data after sign-in
      setIsLoggedIn(true); // Set user as logged in

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
              Log in to Hostel Finder
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Log In"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-regular">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-lg font-semibold text-secondary"
              >
                Signup
              </Link>
            </View>
          </View>

          <StatusBar backgroundColor="#161622" style="light" />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignIn;