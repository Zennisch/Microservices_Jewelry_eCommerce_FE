import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import * as FileSystem from 'expo-file-system';
import { Order } from '../types/Order';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `${API_BASE_URL}/delivery`;

axios.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error setting auth token', error);
  }
  return config;
});

const deliveryService = {
  /**
   * Get all orders assigned to the current deliverer
   */
  getDelivererOrders: async (delivererId: number): Promise<Order[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/deliverers/${delivererId}/orders`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting deliverer orders:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  /**
   * Update order status (OUT_FOR_DELIVERY, DELIVERED, FAILED)
   */
  updateDeliveryStatus: async (orderId: number, status: string): Promise<Order> => {
    try {
      // Lấy ID người dùng từ AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');

      console.log('User data:', userData); // Log the user data

      const user = userData ? JSON.parse(userData) : null;
      const delivererId = user?.id;

      console.log('Deliverer ID:', delivererId); // Log the deliverer ID

      const response = await axios.put(`${BASE_URL}/orders/${orderId}/status`, {
        status,
        delivererId, // Thêm delivererId vào request body
      });

      return response.data.order;
    } catch (error: any) {
      console.error('Error updating delivery status:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  },

  /**
   * Upload delivery proof with image
   */
  uploadDeliveryProof: async (orderId: number, imageUri: string, notes?: string): Promise<any> => {
    try {
      // Lấy ID người dùng từ AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      const user = userData ? JSON.parse(userData) : null;
      const delivererId = user?.id;

      // Create form data
      const formData = new FormData();

      // Add deliverer ID to form data
      if (delivererId) {
        formData.append('delivererId', delivererId.toString());
      }

      // Add the image file
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }

      const fileName = imageUri.split('/').pop() || 'delivery_proof.jpg';

      // @ts-ignore - FormData in React Native has slightly different typing
      formData.append('proof_image', {
        uri: imageUri,
        type: 'image/jpeg', // assuming jpg format, adjust if needed
        name: fileName,
      });

      // Add notes if provided
      if (notes) {
        formData.append('notes', notes);
      }

      const response = await axios.put(`${BASE_URL}/orders/${orderId}/proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading delivery proof:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload proof');
    }
  },
};

export default deliveryService;
