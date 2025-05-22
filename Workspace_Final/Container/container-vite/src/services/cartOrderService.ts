import axiosInstance from './axiosConfig';
import {Product} from './catalogService';
import SERVICE_ENDPOINTS from './apiConfig';

const BASE_URL = SERVICE_ENDPOINTS.CART_ORDER;

// Interfaces
export interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string | null;
}

export interface Cart {
    cartId: number;
    items: CartItem[];
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
    productName?: string;
}

export interface DeliveryProof {
    id: number;
    orderId: number;
    delivererId: number;
    imageUrl: string;
    notes?: string;
    createdAt: string;
}

// Update Order interface
export interface Order {
    id: number;
    userId: number;
    address: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    orderDetails: OrderDetail[];
    totalAmount?: number;
    delivererId?: number;
    deliverer?: {
        id: number;
        name: string;
        email: string;
    };
    deliveryProof?: DeliveryProof;
}

export interface OrderDetail {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: Product;
}

export interface ShippingInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    notes?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface CheckoutData {
    userId: number;
    address: string;
    orderDetails: OrderItem[];
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    shippingInfo: ShippingInfo;
}

// Service methods
const cartOrderService = {
    /**
     * Lấy giỏ hàng theo userId
     */
    getCartByUserId: async (userId: number): Promise<Cart> => {
        const response = await axiosInstance.get(`${BASE_URL}/cart/${userId}`);
        return response.data;
    },

    /**
     * Tạo giỏ hàng mới
     */
    createCart: async (userId: number): Promise<{cartId: number}> => {
        const response = await axiosInstance.post(`${BASE_URL}/cart`, {userId});
        return response.data;
    },

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    addToCart: async (cartId: number, productId: number, quantity: number = 1): Promise<CartItem> => {
        const response = await axiosInstance.post(`${BASE_URL}/cart-items`, {
            cartId,
            productId,
            quantity,
        });
        return response.data.cartItem;
    },

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    updateCartItemQuantity: async (cartItemId: number, quantity: number): Promise<CartItem> => {
        const response = await axiosInstance.put(`${BASE_URL}/cart-items/${cartItemId}`, {quantity});
        return response.data.cartItem;
    },

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    removeFromCart: async (cartItemId: number): Promise<void> => {
        await axiosInstance.delete(`${BASE_URL}/cart-items/${cartItemId}`);
    },

    /**
     * Tạo đơn hàng mới
     */
    createOrder: async (checkoutData: CheckoutData): Promise<Order> => {
        const response = await axiosInstance.post(`${BASE_URL}/orders`, checkoutData);
        return response.data.order;
    },

    /**
     * Lấy danh sách đơn hàng theo userId
     */
    getOrdersByUserId: async (userId: number): Promise<Order[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/orders/user/${userId}`);
        return response.data;
    },

    /**
     * Lấy chi tiết đơn hàng theo id
     */
    getOrderById: async (orderId: number): Promise<Order> => {
        const response = await axiosInstance.get(`${BASE_URL}/orders/${orderId}`);
        return response.data;
    },

    /**
     * Hủy đơn hàng
     */
    cancelOrder: async (orderId: number): Promise<void> => {
        await axiosInstance.put(`${BASE_URL}/orders/${orderId}`, {status: 'CANCELED'});
    },

    /**
     * Lấy các phương thức thanh toán
     */
    getPaymentMethods: async (): Promise<PaymentMethod[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/payment/methods`);
        return response.data;
    },

    /**
     * Lấy địa chỉ từ tọa độ
     */
    getAddressFromCoordinates: async (lat: number, lng: number): Promise<any> => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/location?lat=${lat}&lng=${lng}`);
            return response.data;
        } catch (error) {
            console.error('Error getting address from coordinates:', error);
            throw error;
        }
    },

    /**
     * Tính tuyến đường và khoảng cách
     */
    calculateRoute: async (startLat: number, startLng: number, endLat: number, endLng: number): Promise<any> => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/location/distance?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`
            );
            return response.data;
        } catch (error) {
            console.error('Error calculating route:', error);
            throw error;
        }
    },

    /**
     * Lấy thông tin vị trí địa lý (tỉnh/thành phố, quận/huyện, phường/xã)
     */
    getProvinces: async (): Promise<any[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/location/provinces`);
        return response.data;
    },

    getDistricts: async (provinceCode: string): Promise<any[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/location/districts/${provinceCode}`);
        return response.data;
    },

    getWards: async (districtCode: string): Promise<any[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/location/wards/${districtCode}`);
        return response.data;
    },

    /**
     * Tính phí vận chuyển
     */
    calculateShippingFee: async (fromAddress: string, toAddress: string, weight: number): Promise<number> => {
        const response = await axiosInstance.post(`${BASE_URL}/location/shipping-fee`, {
            fromAddress,
            toAddress,
            weight,
        });
        return response.data.fee;
    },

    getDeliverers: async (): Promise<any[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/deliverers`);
        return response.data;
    },

    assignDeliverer: async (orderId: number, delivererId: number): Promise<Order> => {
        const response = await axiosInstance.post(`${BASE_URL}/orders/assign`, {
            orderId,
            delivererId,
        });
        return response.data.order;
    },

    getDelivererOrders: async (delivererId: number): Promise<Order[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/deliverers/${delivererId}/orders`);
        return response.data;
    },

    updateDeliveryStatus: async (orderId: number, status: string): Promise<Order> => {
        const response = await axiosInstance.put(`${BASE_URL}/orders/${orderId}/status`, {status});
        return response.data.order;
    },

    uploadDeliveryProof: async (
        orderId: number,
        proofImage: File,
        notes?: string
    ): Promise<{deliveryProof: DeliveryProof; order: Order}> => {
        const formData = new FormData();
        formData.append('proof_image', proofImage);
        if (notes) formData.append('notes', notes);

        const response = await axiosInstance.post(`${BASE_URL}/orders/${orderId}/proof`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateOrderPaymentStatus: async (orderId: number, paymentStatus: string, transactionId?: string): Promise<Order> => {
        const response = await axiosInstance.put(`${BASE_URL}/orders/${orderId}/payment-status`, {
            paymentStatus,
            transactionId,
        });
        return response.data.order;
    },
};

export default cartOrderService;
