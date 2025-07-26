import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDelivery } from '../contexts/DeliveryContext';
import { Ionicons } from '@expo/vector-icons';
import OrderCard from '../components/OrderCard';
import Loading from '../components/ui/Loading';
import { Order } from '../types/Order';

const OrdersScreen: React.FC = () => {
  const navigation = useNavigation();
  const { orders, loading, refreshing, loadOrders, refreshOrders, setActiveOrder } = useDelivery();
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const handleRefresh = useCallback(() => {
    refreshOrders();
  }, [refreshOrders]);
  
  const handleOrderPress = (order: Order) => {
    setActiveOrder(order);
    navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
  };
  
  const filterOrders = (status: string) => {
    return orders.filter(order => order.status === status);
  };
  
  const inProgressOrders = orders.filter(
    order => ['ASSIGNED_TO_DELIVERER', 'OUT_FOR_DELIVERY'].includes(order.status)
  );
  
  const deliveredOrders = orders.filter(
    order => ['DELIVERED', 'DELIVERY_CONFIRMED'].includes(order.status)
  );
  
  const failedOrders = filterOrders('FAILED');

  // Render header with counts
  const renderHeader = () => (
    <View className="mb-4">
      <Text className="text-xl font-bold mb-2">Your Delivery Tasks</Text>
      
      <View className="flex-row justify-between">
        <View className="bg-white rounded-lg p-3 flex-1 mr-2 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 text-xs">Active</Text>
            <View className="bg-amber-100 rounded-full p-1">
              <Ionicons name="bicycle" size={14} color="#D97706" />
            </View>
          </View>
          <Text className="text-xl font-bold">{inProgressOrders.length}</Text>
        </View>
        
        <View className="bg-white rounded-lg p-3 flex-1 mx-1 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 text-xs">Delivered</Text>
            <View className="bg-green-100 rounded-full p-1">
              <Ionicons name="checkmark-circle" size={14} color="#059669" />
            </View>
          </View>
          <Text className="text-xl font-bold">{deliveredOrders.length}</Text>
        </View>
        
        <View className="bg-white rounded-lg p-3 flex-1 ml-2 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 text-xs">Failed</Text>
            <View className="bg-red-100 rounded-full p-1">
              <Ionicons name="close-circle" size={14} color="#DC2626" />
            </View>
          </View>
          <Text className="text-xl font-bold">{failedOrders.length}</Text>
        </View>
      </View>
    </View>
  );
  
  if (loading && !refreshing) {
    return <Loading fullScreen message="Loading your orders..." />;
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} onPress={handleOrderPress} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#D97706']}
            tintColor="#D97706"
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              No orders assigned to you yet.{'\n'}Pull down to refresh.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;