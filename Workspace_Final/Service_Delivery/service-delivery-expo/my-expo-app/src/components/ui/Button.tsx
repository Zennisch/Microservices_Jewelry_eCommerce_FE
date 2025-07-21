import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}) => {
  const getButtonStyle = () => {
    const baseStyle = 'py-2 px-4 rounded-md flex-row justify-center items-center';
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} bg-amber-600 ${disabled ? 'opacity-50' : ''}`;
      case 'secondary':
        return `${baseStyle} bg-gray-500 ${disabled ? 'opacity-50' : ''}`;
      case 'danger':
        return `${baseStyle} bg-red-600 ${disabled ? 'opacity-50' : ''}`;
      case 'success':
        return `${baseStyle} bg-green-600 ${disabled ? 'opacity-50' : ''}`;
      case 'outline':
        return `${baseStyle} border border-amber-600 ${disabled ? 'opacity-50' : ''}`;
      default:
        return `${baseStyle} bg-amber-600 ${disabled ? 'opacity-50' : ''}`;
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return 'text-amber-600 font-semibold';
      default:
        return 'text-white font-semibold';
    }
  };
  
  return (
    <TouchableOpacity
      className={`${getButtonStyle()} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#D97706' : 'white'} />
      ) : (
        <Text className={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;