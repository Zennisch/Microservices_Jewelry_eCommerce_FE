export interface OrderDetail {
  id: number;
  productId: number;
  orderId: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageSet?: Array<{ imageUrl: string }>;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
}

export interface DeliveryProof {
  id: number;
  orderId: number;
  delivererId: number;
  imageUrl: string;
  notes?: string;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  address: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  delivererId?: number;
  user?: User;
  orderDetails: OrderDetail[];
  deliveryProof?: DeliveryProof;
}