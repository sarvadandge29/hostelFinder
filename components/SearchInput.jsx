import { View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React ,{ useState } from 'react';
import { icons } from '../constants'
import { router, usePathname } from 'expo-router';

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '')
    
    return (
        <View className=" borader-2 border-black-200
            w-full h-16 px-4 bg-black-100 rounded-2xl 
            focused:border-secondary items-center
            flex-row spaxe-x-4">
            <TextInput
            className = "text-base mt-0.5 text-white flex-1 font-regular"
            value={query}
            placeholder="Search a Hostel"
            placeholderTextColor="#CDCDE0"
            onChangeText={(e) => setQuery(e)}
            />
            <TouchableOpacity
                onPress={() =>{
                    if(!query){
                        return Alert.alert('Missing query' ,"Please input something to search results across database")
                    }

                    if(pathname.startsWith('/search'))
                        router.setParams({ query})
                    else router.push(`/search/${query}`)
                }}
            >
                <Image
                    source={icons.search}
                    className = "w-5 h-5"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
  );
};

export default SearchInput;
