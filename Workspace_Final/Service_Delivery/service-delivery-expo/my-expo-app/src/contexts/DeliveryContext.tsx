import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import deliveryService from '../services/deliveryService';
import { Order } from '../types/Order';

interface DeliveryContextType {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  loadOrders: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  getOrderById: (orderId: number) => Order | undefined;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
  uploadDeliveryProof: (orderId: number, imageUri: string, notes?: string) => Promise<boolean>;
}

const DeliveryContext = createContext<DeliveryContextType>({
  orders: [],
  activeOrder: null,
  loading: false,
  error: null,
  refreshing: false,
  loadOrders: async () => {},
  refreshOrders: async () => {},
  getOrderById: () => undefined,
  setActiveOrder: () => {},
  updateOrderStatus: async () => {},
  uploadDeliveryProof: async () => false,
});

export const useDelivery = () => useContext(DeliveryContext);

export const DeliveryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load orders on authentication or user change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders();
    }
  }, [isAuthenticated, user]);

  const loadOrders = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const delivererOrders = await deliveryService.getDelivererOrders(parseInt(user.id));
      setOrders(delivererOrders);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Failed to load your assigned orders');
      Alert.alert('Error', 'Failed to load your assigned orders');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setRefreshing(true);
    setError(null);
    
    try {
      const delivererOrders = await deliveryService.getDelivererOrders(parseInt(user.id));
      setOrders(delivererOrders);
      
      // If there's an active order, refresh its data too
      if (activeOrder) {
        const updatedActiveOrder = delivererOrders.find(order => order.id === activeOrder.id);
        if (updatedActiveOrder) {
          setActiveOrder(updatedActiveOrder);
        }
      }
    } catch (err: any) {
      console.error('Failed to refresh orders:', err);
      setError(err.message || 'Failed to refresh your assigned orders');
    } finally {
      setRefreshing(false);
    }
  };

  const getOrderById = (orderId: number) => {
    return orders.find(order => order.id === orderId);
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deliveryService.updateDeliveryStatus(orderId, status);
      
      // Refresh orders list
      await refreshOrders();
      
      // Find and update the active order if needed
      if (activeOrder && activeOrder.id === orderId) {
        const updatedOrder = orders.find(order => order.id === orderId);
        if (updatedOrder) {
          setActiveOrder(updatedOrder);
        }
      }
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      setError(err.message || 'Failed to update order status');
      Alert.alert('Error', 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadDeliveryProof = async (orderId: number, imageUri: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deliveryService.uploadDeliveryProof(orderId, imageUri, notes);
      
      // Refresh orders list
      await refreshOrders();
      
      return true;
    } catch (err: any) {
      console.error('Failed to upload delivery proof:', err);
      setError(err.message || 'Failed to upload delivery proof');
      Alert.alert('Error', 'Failed to upload delivery proof');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeliveryContext.Provider value={{
      orders,
      activeOrder,
      loading,
      error,
      refreshing,
      loadOrders,
      refreshOrders,
      getOrderById,
      setActiveOrder,
      updateOrderStatus,
      uploadDeliveryProof,
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};