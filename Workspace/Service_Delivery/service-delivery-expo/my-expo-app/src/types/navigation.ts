import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Order } from './Order';

// Define main navigation param list
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  OrderDetail: { orderId: number };
  DeliveryProof: { orderId: number };
};

// Define bottom tab navigation param list
export type MainTabParamList = {
  Orders: undefined;
  Profile: undefined;
};

// Navigation prop types
export type OrderDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OrderDetail'
>;

export type DeliveryProofNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DeliveryProof'
>;

// Route prop types
export type OrderDetailRouteProp = RouteProp<
  RootStackParamList,
  'OrderDetail'
>;

export type DeliveryProofRouteProp = RouteProp<
  RootStackParamList,
  'DeliveryProof'
>;