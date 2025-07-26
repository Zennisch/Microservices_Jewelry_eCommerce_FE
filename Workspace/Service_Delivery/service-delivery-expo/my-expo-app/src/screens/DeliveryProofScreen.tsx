import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface CameraComponentProps {
  onCapture: (uri: string) => void;
  onCancel: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onCancel }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to take delivery proof photos.',
          [
            { 
              text: 'OK', 
              onPress: onCancel // Go back if permission denied
            }
          ]
        );
      }
    })();
  }, []);

  // Take picture handler
  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      
      onCapture(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  // Flip camera handler
  const toggleCameraType = () => {
    setType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // Show loading while checking permissions
  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  // Show message if permission denied
  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white mb-4">No access to camera</Text>
        <TouchableOpacity 
          onPress={onCancel} 
          className="bg-amber-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Camera 
        ref={cameraRef} 
        type={type} 
        className="flex-1"
        ratio="16:9"
      >
        <View className="flex-1 bg-transparent flex-row">
          <TouchableOpacity 
            className="absolute top-10 left-5 z-10"
            onPress={onCancel}
          >
            <View className="bg-black bg-opacity-50 rounded-full p-2">
              <Ionicons name="close" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="absolute top-10 right-5 z-10"
            onPress={toggleCameraType}
          >
            <View className="bg-black bg-opacity-50 rounded-full p-2">
              <Ionicons name="camera-reverse" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-center items-center mb-10">
          <TouchableOpacity
            onPress={takePicture}
            className="bg-white rounded-full p-2 m-4"
          >
            <View className="bg-white border-4 border-gray-200 rounded-full h-16 w-16"></View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default CameraComponent;