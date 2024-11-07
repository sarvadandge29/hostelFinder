import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { updateUser, deleteUser, deleteUserById } from "../../lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";

const UserDetails = () => {
  const navigation = useNavigation();
  const { name: nameParam, PhoneNumber: PhoneNumberParam, email: emailParam, isAdmin: isAdminParam, userId } = useLocalSearchParams();

  const [name, setName] = useState(nameParam);
  const [PhoneNumber, setphoneNumber] = useState(PhoneNumberParam);
  const [email, setEmail] = useState(emailParam);
  const [isAdmin, setIsAdmin] = useState(!!isAdminParam);  

  const handleUpdate = async () => {
    try {
      await updateUser(userId, { name, PhoneNumber, email, isAdmin:!!isAdmin });
      Alert.alert("Success", "User updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update user. Please try again.");
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteUserById( name ); 
              const route = isAdmin ? 'adminHome' : 'userHome';
              router.push({ pathname: route });
            } catch (error) {
              console.error("Error deleting user:", error.message);
              Alert.alert("Deletion Failed", "Could not delete the user. Please try again.");
            }
          },
        },
      ]
    );
  };
  

  return (
    <View className="flex-1 bg-primary px-4 py-6">
      <Text className="text-lg font-bold text-white mb-4">Edit User</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="bg-white p-4 mb-4"
      />

      <TextInput
        value={PhoneNumber}
        onChangeText={setphoneNumber}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        className="bg-white p-4 mb-4"
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        className="bg-white p-4 mb-4"
      />

      <View className="mb-4">
        <Text className="text-white mb-2">Is Admin?</Text>
        <Button
          title={isAdmin ? "Yes (Click to Toggle)" : "No (Click to Toggle)"}
          onPress={() => setIsAdmin(prev => !prev)}
        />
      </View>

      <Button title="Update" onPress={handleUpdate} color="#4CAF50" />
      <Button title="Delete" onPress={handleDelete} color="#F44336" style={{ marginTop: 20 }} />
    </View>
  );
};

export default UserDetails;
