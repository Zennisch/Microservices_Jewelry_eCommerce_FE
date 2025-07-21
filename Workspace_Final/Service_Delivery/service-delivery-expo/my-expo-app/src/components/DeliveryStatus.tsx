import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ORDER_STATUS } from '../utils/constants';

interface DeliveryStatusProps {
  currentStatus: string;
}

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ currentStatus }) => {
  // Define the delivery steps in order
  const deliverySteps = [
    { status: ORDER_STATUS.ASSIGNED_TO_DELIVERER, label: 'Assigned', icon: 'person' },
    { status: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: 'bicycle' },
    { status: ORDER_STATUS.DELIVERED, label: 'Delivered', icon: 'checkmark-circle' },
    { status: ORDER_STATUS.DELIVERY_CONFIRMED, label: 'Confirmed', icon: 'shield-checkmark' },
  ];
  
  // Find current step index
  const currentStepIndex = deliverySteps.findIndex(step => step.status === currentStatus);
  
  // If current status is FAILED or CANCELED, show a different UI
  if (currentStatus === ORDER_STATUS.FAILED || currentStatus === ORDER_STATUS.CANCELED) {
    return (
      <View className="py-4 items-center">
        <Ionicons 
          name={currentStatus === ORDER_STATUS.FAILED ? 'close-circle' : 'ban'} 
          size={32} 
          color={currentStatus === ORDER_STATUS.FAILED ? '#DC2626' : '#6B7280'} 
        />
        <Text className={`mt-2 font-medium ${
          currentStatus === ORDER_STATUS.FAILED ? 'text-red-600' : 'text-gray-500'
        }`}>
          Delivery {currentStatus.toLowerCase()}
        </Text>
      </View>
    );
  }
  
  return (
    <View className="py-4">
      <View className="flex-row justify-between">
        {deliverySteps.map((step, index) => {
          // Determine if this step is active, completed, or upcoming
          const isCompleted = currentStepIndex > index;
          const isActive = currentStepIndex === index;
          const isUpcoming = currentStepIndex < index;
          
          // Choose the appropriate colors based on step status
          const circleColor = isCompleted ? 'bg-green-500' : 
                              isActive ? 'bg-amber-500' : 
                              'bg-gray-300';
          const textColor = isCompleted ? 'text-green-500' : 
                            isActive ? 'text-amber-500' : 
                            'text-gray-400';
          const iconColor = isCompleted || isActive ? 'white' : '#D1D5DB';
          
          return (
            <View 
              key={step.status} 
              className={`items-center w-${100/deliverySteps.length}%`}
            >
              {/* Step indicator */}
              <View className={`w-8 h-8 rounded-full ${circleColor} items-center justify-center`}>
                <Ionicons name={step.icon} size={16} color={iconColor} />
              </View>
              
              {/* Label */}
              <Text className={`text-xs mt-1 ${textColor} text-center`}>
                {step.label}
              </Text>
              
              {/* Connector line */}
              {index < deliverySteps.length - 1 && (
                <View 
                  className={`absolute h-0.5 top-4 left-1/2 right-0 w-full ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  style={{ width: '100%', right: '-50%' }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DeliveryStatus;