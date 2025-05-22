import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const { login, loading } = useAuth();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in AuthContext with Alert
      console.error('Login error:', error);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <View className="flex-1 justify-center px-8">
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/logo.png')} // Replace with your logo
              className="w-48 h-48"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-amber-600 mt-4">
              Delivery App
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Login to manage and deliver your assigned orders
            </Text>
          </View>
          
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <View className="flex-row border border-gray-300 rounded-lg px-4 py-2 items-center">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>
          
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="flex-row border border-gray-300 rounded-lg px-4 py-2 items-center">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableWithoutFeedback 
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons 
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            className="py-3"
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;