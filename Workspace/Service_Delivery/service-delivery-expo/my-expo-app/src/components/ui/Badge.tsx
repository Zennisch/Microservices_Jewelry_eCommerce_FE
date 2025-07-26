import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'pending' | 'processing' | 'ready' | 'assigned' | 'out' | 'delivered' | 'confirmed' | 'failed' | 'canceled';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant,
  className = '',
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'ready': return 'bg-purple-500';
      case 'assigned': return 'bg-indigo-500';
      case 'out': return 'bg-teal-500';
      case 'delivered': return 'bg-green-500';
      case 'confirmed': return 'bg-emerald-600';
      case 'failed': return 'bg-red-600';
      case 'canceled': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };
  
  const getBadgeVariant = () => {
    const status = text.toUpperCase();
    
    if (status === 'PENDING') return 'pending';
    if (status === 'PROCESSING') return 'processing';
    if (status === 'READY_FOR_DELIVERY') return 'ready';
    if (status === 'ASSIGNED_TO_DELIVERER') return 'assigned';
    if (status === 'OUT_FOR_DELIVERY') return 'out';
    if (status === 'DELIVERED') return 'delivered';
    if (status === 'DELIVERY_CONFIRMED') return 'confirmed';
    if (status === 'FAILED') return 'failed';
    if (status === 'CANCELED') return 'canceled';
    
    return undefined;
  };
  
  const variantToUse = variant || getBadgeVariant();
  
  return (
    <View className={`rounded-full px-2 py-1 ${getVariantStyle()} ${className}`}>
      <Text className="text-white text-xs font-medium text-center">{text}</Text>
    </View>
  );
};

export default Badge;