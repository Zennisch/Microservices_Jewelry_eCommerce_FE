import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/Button';

interface CameraComponentProps {
  onCapture: (uri: string) => void;
  onCancel: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onCancel }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const cameraRef = useRef<Camera>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };
  
  const toggleCameraType = () => {
    setType(current => (
      current === CameraType.back ? CameraType.front : CameraType.back
    ));
  };
  
  const toggleFlash = () => {
    setFlash(current => 
      current === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };
  
  const retakePicture = () => {
    setCapturedImage(null);
  };
  
  const confirmPicture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };
  
  if (hasCameraPermission === null) {
    return <View className="flex-1 bg-black" />;
  }
  
  if (hasCameraPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-center mx-4">
          We need camera permission to take delivery proof photos.
        </Text>
        <Button 
          title="Cancel" 
          onPress={onCancel} 
          className="mt-4"
        />
      </View>
    );
  }
  
  if (capturedImage) {
    return (
      <View className="flex-1">
        <Image 
          source={{ uri: capturedImage }} 
          className="flex-1"
          resizeMode="cover"
        />
        
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-6 bg-black bg-opacity-50">
          <Button 
            title="Retake" 
            variant="secondary" 
            onPress={retakePicture}
            className="flex-1 mr-2"
          />
          <Button 
            title="Use Photo" 
            onPress={confirmPicture}
            className="flex-1 ml-2"
          />
        </View>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        type={type}
        flashMode={flash}
        className="flex-1"
        ratio="16:9"
      >
        <View className="flex-1 justify-between">
          <View className="flex-row justify-end p-4">
            <TouchableOpacity
              className="bg-black bg-opacity-50 rounded-full p-2 mr-2"
              onPress={toggleFlash}
            >
              <Ionicons 
                name={flash === Camera.Constants.FlashMode.on ? "flash" : "flash-off"} 
                size={24} 
                color="white"
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-black bg-opacity-50 rounded-full p-2"
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between items-center p-6 bg-black bg-opacity-50">
            <TouchableOpacity
              onPress={onCancel}
              className="p-2"
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={takePicture}
              className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center"
            >
              <View className="bg-white rounded-full border-2 border-black w-14 h-14" />
            </TouchableOpacity>
            
            <View className="w-10" />
          </View>
        </View>
      </Camera>
    </View>
  );
};

export default CameraComponent;