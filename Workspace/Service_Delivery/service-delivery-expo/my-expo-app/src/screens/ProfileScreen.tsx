import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const ProfileScreen: React.FC = () => {
  const { user, logout, loading } = useAuth();
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
          } 
        }
      ]
    );
  };
  
  if (loading || !user) {
    return <Loading fullScreen message="Loading profile..." />;
  }
  
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Card className="items-center py-6 mb-4">
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
              <Ionicons name="person" size={48} color="#9CA3AF" />
            </View>
          )}
          
          <Text className="text-xl font-bold mt-4">{user.name}</Text>
          <Text className="text-gray-600">{user.email}</Text>
          
          <View className="bg-amber-100 rounded-full px-3 py-1 mt-2">
            <Text className="text-amber-800 text-xs font-medium">Deliverer</Text>
          </View>
        </Card>
        
        <Card className="mb-4">
          <Text className="text-lg font-bold mb-4">Contact Information</Text>
          
          <View className="mb-3">
            <Text className="text-gray-500 text-sm">Email</Text>
            <Text className="font-medium">{user.email}</Text>
          </View>
          
          {user.address && (
            <View>
              <Text className="text-gray-500 text-sm">Address</Text>
              <Text className="font-medium">{user.address}</Text>
            </View>
          )}
        </Card>
        
        <Card>
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => Alert.alert('App Info', 'JEC Delivery App\nVersion 1.0.0')}
          >
            <Ionicons name="information-circle-outline" size={24} color="#374151" />
            <Text className="ml-3 text-gray-800 font-medium">About this app</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3 border-t border-gray-100"
            onPress={() => Alert.alert('Help', 'Contact support at support@jec.com')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#374151" />
            <Text className="ml-3 text-gray-800 font-medium">Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3 border-t border-gray-100"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            <Text className="ml-3 text-red-600 font-medium">Logout</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;