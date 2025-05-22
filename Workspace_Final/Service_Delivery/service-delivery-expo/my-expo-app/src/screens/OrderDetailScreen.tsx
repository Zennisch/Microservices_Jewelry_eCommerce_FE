import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDelivery } from '../contexts/DeliveryContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import { ORDER_STATUS } from '../utils/constants';
import DeliveryStatus from '../components/DeliveryStatus';
import { RefreshControl } from 'react-native';
import { useCallback } from 'react';

type OrderDetailRouteParams = {
  OrderDetail: {
    orderId: number;
  };
};

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<OrderDetailRouteParams, 'OrderDetail'>>();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const { getOrderById, activeOrder, loading, updateOrderStatus, refreshOrders } = useDelivery();
  const [order, setOrder] = useState(activeOrder);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!order && orderId) {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        Alert.alert('Error', 'Order not found');
        navigation.goBack();
      }
    }
  }, [orderId, getOrderById]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      if (!order) return;

      // Confirm before updating
      Alert.alert(
        'Update Order Status',
        `Are you sure you want to mark this order as ${newStatus.replace('_', ' ')}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Update',
            onPress: async () => {
              await updateOrderStatus(order.id, newStatus);

              if (newStatus === ORDER_STATUS.DELIVERED) {
                // Navigate to proof upload screen
                navigation.navigate('DeliveryProof' as never, { orderId: order.id } as never);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    // Refresh order data
    refreshOrders().finally(() => {
      setRefreshing(false);

      // Update local order state
      if (orderId) {
        const refreshedOrder = getOrderById(orderId);
        if (refreshedOrder) {
          setOrder(refreshedOrder);
        }
      }
    });
  }, [orderId, refreshOrders, getOrderById]);

  const openMaps = () => {
    if (!order?.address) return;

    const address = encodeURIComponent(order.address);

    if (Platform.OS === 'ios') {
      Linking.openURL(`maps:?q=${address}`);
    } else {
      Linking.openURL(`geo:0,0?q=${address}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const calculateTotal = () => {
    const subtotal =
      order?.orderDetails.reduce((sum, item) => {
        return sum + parseFloat(item.price.toString()) * item.quantity;
      }, 0) || 0;
    const tax = subtotal * 0.1;
    const shippingCost = 30000;
    return subtotal + tax + shippingCost;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN')}`;
  };

  if (loading || !order) {
    return <Loading fullScreen message="Loading order details..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#D97706']}
          tintColor="#D97706"
        />
      }>
      <View className="p-4">
        {/* Order Header Information */}
        <Card className="mb-4">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-lg font-bold">Order #{order.id}</Text>
              <Text className="text-sm text-gray-600">Created: {formatDate(order.createdAt)}</Text>
            </View>
            <Badge text={order.status} />
          </View>

          <Card className="mb-4">
            <Text className="mb-2 text-lg font-bold">Delivery Status</Text>
            <DeliveryStatus currentStatus={order.status} />
          </Card>

          <View className="mt-4">
            <Text className="font-medium text-gray-700">Customer Information</Text>
            <Text className="mt-1 text-gray-800">{order.user?.name || 'N/A'}</Text>
          </View>

          <TouchableOpacity onPress={openMaps} className="mt-4 flex-row items-start">
            <View className="mt-1">
              <Ionicons name="location" size={18} color="#D97706" />
            </View>
            <View className="ml-2 flex-1">
              <Text className="font-medium text-gray-700">Delivery Address</Text>
              <Text className="text-gray-800">{order.address}</Text>
              <Text className="mt-1 text-sm text-amber-600">Open in Maps</Text>
            </View>
          </TouchableOpacity>

          <View className="mt-4">
            <Text className="font-medium text-gray-700">Payment Information</Text>
            <View className="mt-1 flex-row">
              <View className="mr-4">
                <Text className="text-sm text-gray-500">Method</Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name={order.paymentMethod === 'COD' ? 'cash-outline' : 'card-outline'}
                    size={16}
                    color="#65A30D"
                  />
                  <Text className="ml-1">{order.paymentMethod}</Text>
                </View>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Status</Text>
                <Text
                  className={order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}>
                  {order.paymentStatus}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Order Items */}
        <Card className="mb-4">
          <Text className="mb-2 text-lg font-bold">Order Items</Text>

          {order.orderDetails.map((item) => (
            <View key={item.id} className="flex-row items-center border-b border-gray-100 py-2">
              {item.product?.imageSet?.[0]?.imageUrl ? (
                <Image
                  source={{ uri: item.product.imageSet[0].imageUrl }}
                  className="h-16 w-16 rounded"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex h-16 w-16 items-center justify-center rounded bg-gray-200">
                  <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                </View>
              )}

              <View className="ml-3 flex-1">
                <Text className="font-medium">
                  {item.product?.name || `Product #${item.productId}`}
                </Text>
                <Text className="text-gray-500">
                  Qty: {item.quantity} x {formatCurrency(parseFloat(item.price.toString()))}
                </Text>
              </View>

              <Text className="font-semibold">
                {formatCurrency(item.quantity * parseFloat(item.price.toString()))}
              </Text>
            </View>
          ))}

          <View className="mt-4 border-t border-gray-200 pt-2">
            <View className="mb-1 flex-row justify-between">
              <Text className="text-gray-500">Subtotal</Text>
              <Text>{formatCurrency(calculateTotal())}</Text>
            </View>

            <View className="mb-1 flex-row justify-between">
              <Text className="text-gray-500">Shipping</Text>
              <Text>{formatCurrency(30000)}</Text> {/* Replace with actual shipping cost */}
            </View>

            <View className="mt-2 flex-row justify-between border-t border-gray-200 pt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-amber-600">{formatCurrency(calculateTotal())}</Text>
            </View>
          </View>
        </Card>

        {/* Delivery Actions */}
        <Card className="mb-4">
          <Text className="mb-4 text-lg font-bold">Delivery Actions</Text>

          {order.status === ORDER_STATUS.ASSIGNED_TO_DELIVERER && (
            <Button
              title="Start Delivery"
              onPress={() => handleUpdateStatus(ORDER_STATUS.OUT_FOR_DELIVERY)}
              loading={loading}
              className="mb-3"
            />
          )}

          {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
            <View>
              <Button
                title="Mark as Delivered"
                variant="success"
                onPress={() => handleUpdateStatus(ORDER_STATUS.DELIVERED)}
                loading={loading}
                className="mb-3"
              />

              <Button
                title="Mark as Failed"
                variant="danger"
                onPress={() => handleUpdateStatus(ORDER_STATUS.FAILED)}
                loading={loading}
              />
            </View>
          )}

          {order.status === ORDER_STATUS.DELIVERED && !order.deliveryProof && (
            <Button
              title="Upload Delivery Proof"
              onPress={() =>
                navigation.navigate('DeliveryProof' as never, { orderId: order.id } as never)
              }
              loading={loading}
            />
          )}

          {/* Show proof if available */}
          {order.deliveryProof && (
            <View className="mt-2">
              <Text className="mb-2 font-medium">Delivery Proof</Text>
              <Image
                source={{ uri: order.deliveryProof.imageUrl }}
                className="h-40 w-full rounded"
                resizeMode="cover"
              />
              {order.deliveryProof.notes && (
                <Text className="mt-2 text-gray-700">Note: {order.deliveryProof.notes}</Text>
              )}
            </View>
          )}

          {/* Inactive states */}
          {(order.status === ORDER_STATUS.FAILED ||
            order.status === ORDER_STATUS.DELIVERY_CONFIRMED ||
            order.status === ORDER_STATUS.CANCELED) && (
            <View className="items-center py-2">
              <Text className="text-center text-gray-500">
                No actions available for this order status
              </Text>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

export default OrderDetailScreen;
