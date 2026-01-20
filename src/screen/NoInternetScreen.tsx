import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoInternetScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Image
          source={require('../../assets/ChefiePieMascotLogo.png')}
          className="w-40 h-40 mb-8"
          resizeMode="contain"
        />

        <Text className="text-2xl font-bold text-darkBrown mb-4 text-center">
          No Internet Connection
        </Text>

        <Text className="text-base text-lightBrown text-center mb-8">
          Please check your internet connection and try again.
        </Text>

        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="#FF914D" />
          <Text className="ml-3 text-lightBrown">
            Waiting for connection...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
