import React from 'react';
import { View, Text } from 'react-native';
import { Order } from '../types/Order';
import Badge from './ui/Badge';
import Card from './ui/Card';
import { Ionicons } from '@expo/vector-icons';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  
  // Calculate total amount
  const calculateTotal = () => {
    return order.orderDetails.reduce((sum, item) => {
      return sum + (parseFloat(item.price.toString()) * item.quantity);
    }, 0);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN')}`;
  };
  
  // Status badge variant mapping
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'PROCESSING': return 'processing';
      case 'READY_FOR_DELIVERY': return 'ready';
      case 'ASSIGNED_TO_DELIVERER': return 'assigned';
      case 'OUT_FOR_DELIVERY': return 'out';
      case 'DELIVERED': return 'delivered';
      case 'DELIVERY_CONFIRMED': return 'confirmed';
      case 'FAILED': return 'failed';
      case 'CANCELED': return 'canceled';
      default: return undefined;
    }
  };
  
  return (
    <Card 
      onPress={() => onPress(order)} 
      className="mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-bold">Order #{order.id}</Text>
        <Badge 
          text={order.status} 
          variant={getStatusVariant(order.status)}
        />
      </View>
      
      <View className="mb-2">
        <Text className="text-gray-700 mb-1">
          <Text className="font-semibold">Customer: </Text>
          {order.user?.name || 'Unknown'}
        </Text>
        
        <Text className="text-gray-700 mb-1">
          <Text className="font-semibold">Created: </Text>
          {formatDate(order.createdAt)}
        </Text>
        
        <Text className="text-gray-700 mb-1 flex-row items-center">
          <Text className="font-semibold">Address: </Text>
          <Text numberOfLines={1}>{order.address}</Text>
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
        <Text className="font-semibold">
          {order.orderDetails.reduce((sum, item) => sum + item.quantity, 0)} items
        </Text>
        
        <Text className="font-semibold text-amber-600">
          {formatCurrency(calculateTotal())}
        </Text>
        
        <View className="flex-row items-center">
          <Ionicons name="chevron-forward" size={16} color="#71717A" />
        </View>
      </View>
      
      {order.paymentMethod === 'COD' && (
        <View className="mt-2 flex-row items-center">
          <Ionicons name="cash-outline" size={16} color="#65A30D" />
          <Text className="ml-1 text-xs text-green-600">COD Payment</Text>
        </View>
      )}
    </Card>
  );
};

export default OrderCard;