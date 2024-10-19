import { View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { icons } from '../constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');
    const inputRef = useRef(null);

    const handleSearch = () => {
        if (!query) {
            Alert.alert('Missing query', "Please input something to search results across the database");
            inputRef.current?.focus();
            return;
        }

        if (pathname.startsWith('/search')) {
            router.setParams({ query });
        } else {
            router.push(`/search/${query}`);
        }
    };

    const clearQuery = () => {
        setQuery('');
        inputRef.current?.focus(); 
    };

    return (
        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl flex-row items-center space-x-4">
            <TextInput
                ref={inputRef}
                className="text-base text-white flex-1 font-regular"
                value={query}
                placeholder="Search a Hostel"
                placeholderTextColor="#CDCDE0"
                onChangeText={(e) => setQuery(e)}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                accessibilityLabel="Search input"
            />
            <TouchableOpacity onPress={handleSearch}>
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode='contain'
                    accessibilityLabel="Search"
                />
            </TouchableOpacity>
            {query.length > 0  && (
                <TouchableOpacity onPress={clearQuery}>
                    <Image
                        source={icons.clear}
                        className="w-7 h-7"
                        resizeMode='contain'
                        accessibilityLabel="Clear search"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchInput;
