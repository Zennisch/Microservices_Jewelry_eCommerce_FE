import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  title,
  className = '',
}) => {
  const cardContent = (
    <View className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && (
        <Text className="text-lg font-semibold mb-2">{title}</Text>
      )}
      {children}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }
  
  return cardContent;
};

export default Card;