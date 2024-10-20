import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from '../../context/GlobalProvider';
import { addHostel } from '../../lib/appwrite';
import UploadBox from '../../components/UploadBox';
import FormField from '../../components/FormField';
import * as DocumentPicker from "expo-document-picker";
import { router } from 'expo-router';

const create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    amenities: '',
    fees: 0,
    description: '',
    ownerNumber: '',
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    video: null,
  })

  const openPicker = async (selectType, imageIndex) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/*'] : ['video/mp4', 'video/gif'],
    });

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({ ...form, [`image${imageIndex}`]: result.assets[0] });
      }
      if (selectType === 'video') {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      Alert.alert('Document picking canceled.');
    }
    
  };

  const submit = async () => {
    if (!form.title || !form.amenities || !form.description || !form.ownerNumber || !form.fees || !form.image1
      || !form.image2 || !form.image3 || !form.image4
    ) {
      return Alert.alert("Error", "Please fill all fields");
    }
  
    setUploading(true);
    try {
      // Convert fees to float
      const feesAsFloat = parseFloat(form.fees);
      if (isNaN(feesAsFloat)) {
        throw new Error("Fees must be a valid number.");
      }
  
      // Validate owner number
      if (form.ownerNumber.length !== 10 ) {
        throw new Error("Owner number must be a valid 10-digit number.");
      }
  
    
      await addHostel({ 
        ...form, 
        userId: user.$id, 
        fees: feesAsFloat, 
      });
      Alert.alert('Success', 'Hostel added successfully');
      router.push('/adminHome');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({
        title: '',
        amenities: '',
        fees: '',
        description: '',
        ownerNumber: '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });
      setUploading(false);
    }
  };  

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-primary px-4 py-6">
        <ScrollView>
        <FormField
            title="Hostel Name"
            textStyle="text-base text-gray-100 font-medium ml-1"
            value={form.title}
            placeholder="Enter hostel name"
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
          />

          <UploadBox
            title="Upload Image 1"
            file={form.image1}
            openPicker={() => openPicker('image', 1)}
            selectType="image"
          />
          <UploadBox
            title="Upload Image 2"
            file={form.image2}
            openPicker={() => openPicker('image', 2)}
            selectType="image"
          />
          <UploadBox
            title="Upload Image 3"
            file={form.image3}
            openPicker={() => openPicker('image', 3)}
            selectType="image"
          />
          <UploadBox
            title="Upload Image 4"
            file={form.image4}
            openPicker={() => openPicker('image', 4)}
            selectType="image"
          />


          <FormField
            title="Amenities"
            textStyle="text-base text-gray-100 font-medium ml-1"
            value={form.amenities}
            placeholder="Enter amenities providing"
            handleChangeText={(e) => setForm({ ...form, amenities: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Description"
            textStyle="text-base text-gray-100 font-medium ml-1"
            value={form.description}
            placeholder="Enter description"
            handleChangeText={(e) => setForm({ ...form, description: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Fees"
            textStyle="text-base text-gray-100 font-medium ml-1"
            value={form.fees}
            placeholder="Enter fees per year"
            handleChangeText={(e) => setForm({ ...form, fees: e })}
            otherStyles="mt-10"
            keyboardType="phone-pad"
          />

          <FormField
            title="Owner Phone Number"
            textStyle="text-base text-gray-100 font-medium ml-1"
            value={form.ownerNumber}
            placeholder="Enter 10 digit phone number"
            handleChangeText={(e) => setForm({ ...form, ownerNumber: e })}
            otherStyles="mt-10"
            keyboardType="phone-pad"
          />

          <CustomButton
            title="Submit"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default create;