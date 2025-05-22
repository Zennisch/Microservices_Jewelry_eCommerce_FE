import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#D97706" />
        <Text className="mt-2 text-gray-600">{message}</Text>
      </View>
    );
  }
  
  return (
    <View className="py-4 flex-row justify-center items-center">
      <ActivityIndicator color="#D97706" />
      <Text className="ml-2 text-gray-600">{message}</Text>
    </View>
  );
};

export default Loading;