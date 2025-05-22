import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { DeliveryProvider } from './src/contexts/DeliveryContext';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <DeliveryProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </DeliveryProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}