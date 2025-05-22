import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDelivery } from '../contexts/DeliveryContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import CameraComponent from '../components/CameraComponent';

type DeliveryProofRouteParams = {
  DeliveryProof: {
    orderId: number;
  };
};

const DeliveryProofScreen: React.FC = () => {
  const route = useRoute<RouteProp<DeliveryProofRouteParams, 'DeliveryProof'>>();
  const navigation = useNavigation();
  const { orderId } = route.params;
  
  const { getOrderById, uploadDeliveryProof, loading } = useDelivery();
  
  const [notes, setNotes] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  
  // Get order data
  const order = getOrderById(orderId);
  
  // Handle image capture
  const handleCapture = (uri: string) => {
    setImageUri(uri);
    setShowCamera(false);
  };
  
  // Handle camera cancel
  const handleCameraCancel = () => {
    setShowCamera(false);
  };
  
  // Submit proof
  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please take a photo as proof of delivery');
      return;
    }
    
    try {
      const success = await uploadDeliveryProof(orderId, imageUri, notes);
      
      if (success) {
        Alert.alert(
          'Success', 
          'Delivery proof submitted successfully',
          [{ text: 'OK', onPress: () => navigation.navigate('Main' as never) }]
        );
      }
    } catch (error) {
      console.error('Failed to upload delivery proof:', error);
      Alert.alert('Error', 'Failed to upload delivery proof. Please try again.');
    }
  };
  
  // If camera is active, show camera component
  if (showCamera) {
    return <CameraComponent onCapture={handleCapture} onCancel={handleCameraCancel} />;
  }
  
  if (!order) {
    return <Loading fullScreen message="Loading order details..." />;
  }
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-100">
        <View className="p-4">
          <Card className="mb-4">
            <Text className="text-lg font-bold mb-4">Upload Delivery Proof</Text>
            <Text className="text-gray-700 mb-2">
              Please take a photo as proof of delivery for Order #{order.id}
            </Text>
            
            {imageUri ? (
              <View className="mb-4">
                <Image 
                  source={{ uri: imageUri }} 
                  className="w-full h-60 rounded-lg" 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  onPress={() => setShowCamera(true)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowCamera(true)}
                className="h-60 bg-gray-200 rounded-lg items-center justify-center mb-4"
              >
                <Ionicons name="camera" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">Tap to take photo</Text>
              </TouchableOpacity>
            )}
            
            <Text className="text-gray-700 mb-2">Delivery Notes (optional):</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder="Add any notes about the delivery"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
            
            <Button 
              title="Submit Delivery Proof" 
              onPress={handleSubmit} 
              disabled={!imageUri || loading}
              loading={loading}
            />
          </Card>
          
          <Card>
            <Text className="text-lg font-bold mb-2">Delivery Information</Text>
            
            <View className="mb-3">
              <Text className="text-gray-500 text-sm">Customer</Text>
              <Text className="font-medium">{order.user?.name || 'N/A'}</Text>
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-500 text-sm">Address</Text>
              <Text className="font-medium">{order.address}</Text>
            </View>
            
            <View>
              <Text className="text-gray-500 text-sm">Payment Method</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons 
                  name={order.paymentMethod === 'COD' ? 'cash-outline' : 'card-outline'} 
                  size={16} 
                  color="#65A30D"
                />
                <Text className="ml-1 font-medium">{order.paymentMethod}</Text>
                <Text className={`ml-2 ${
                  order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  ({order.paymentStatus})
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DeliveryProofScreen;