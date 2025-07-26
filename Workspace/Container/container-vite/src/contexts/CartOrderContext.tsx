import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import cartOrderService, {CartItem, Cart, Order, ShippingInfo, DeliveryProof} from '../services/cartOrderService';
import {useAuth} from './AuthContext';
import catalogService from '../services/catalogService';

interface CartSummary {
    totalItems: number;
    subtotal: number;
    shippingFee: number;
    tax: number;
    totalAmount: number;
}

interface CartOrderContextType {
    cart: Cart | null;
    cartItems: CartItem[];
    totalItems: number;
    isLoading: boolean;
    error: string | null;
    activeOrder: Order | null;
    shippingInfo: ShippingInfo | null;
    cartSummary: CartSummary;
    orders: Order[];
    // Cart actions
    addToCart: (productId: number, quantity: number) => Promise<void>;
    updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    resetCart: () => void;
    // Checkout actions
    startCheckout: () => void;
    updateShippingInfo: (info: ShippingInfo) => void;
    processOrder: (paymentMethod: string) => Promise<Order>;
    // Order actions
    fetchOrders: () => Promise<void>;
    getOrderById: (orderId: number) => Promise<Order | undefined>;
    cancelOrder: (orderId: number) => Promise<void>;
    // Add delivery management
    assignDeliverer: (orderId: number, delivererId: number) => Promise<void>;
    getDelivererOrders: (delivererId: number) => Promise<Order[]>;
    updateDeliveryStatus: (orderId: number, status: string) => Promise<void>;
    uploadDeliveryProof: (orderId: number, proofImage: File, notes?: string) => Promise<void>;
    updateOrderPaymentStatus: (orderId: number, paymentStatus: string, transactionId?: string) => Promise<Order>;
}

const CartOrderContext = createContext<CartOrderContextType | undefined>(undefined);

export const useCartOrder = () => {
    const context = useContext(CartOrderContext);
    if (context === undefined) {
        throw new Error('useCartOrder phải được sử dụng trong CartOrderProvider');
    }
    return context;
};

interface CartOrderProviderProps {
    children: ReactNode;
}

// Local storage keys
const CART_STORAGE_KEY = 'jec_cart';
const SHIPPING_INFO_KEY = 'jec_shipping_info';

export const CartOrderProvider: React.FC<CartOrderProviderProps> = ({children}) => {
    const {user, isAuthenticated, loading: authLoading} = useAuth();

    // States
    const [cart, setCart] = useState<Cart | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);

    // Cart summary with calculations
    const [cartSummary, setCartSummary] = useState<CartSummary>({
        totalItems: 0,
        subtotal: 0,
        shippingFee: 0,
        tax: 0,
        totalAmount: 0,
    });

    // Load cart from localStorage on init (for guest users)
    useEffect(() => {
        const loadLocalCart = () => {
            try {
                const savedCart = localStorage.getItem(CART_STORAGE_KEY);
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCart(parsedCart);
                    setCartItems(parsedCart.items || []);
                    calculateCartTotals(parsedCart.items || []);
                }

                const savedShippingInfo = localStorage.getItem(SHIPPING_INFO_KEY);
                if (savedShippingInfo) {
                    setShippingInfo(JSON.parse(savedShippingInfo));
                }
            } catch (error) {
                console.error('Error loading cart from local storage:', error);
            }
        };

        // Nếu user đang đăng nhập, lấy giỏ hàng từ server
        if (isAuthenticated && user?.id) {
            fetchUserCart();
        } else if (!authLoading) {
            // Nếu chưa đăng nhập và đã check auth xong, lấy giỏ hàng từ local storage
            loadLocalCart();
        }
    }, [isAuthenticated, user?.id, authLoading]);

    // Calculate totals
    const calculateCartTotals = (items: CartItem[]) => {
        const itemCount = items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        // Simple tax calculation (10%)
        const tax = subtotal * 0.1;
        // Simple shipping calculation (for now, may be replaced with API call)
        const shippingFee = subtotal > 1000000 ? 0 : 30000;

        setTotalItems(itemCount);
        setCartSummary({
            totalItems: itemCount,
            subtotal,
            shippingFee,
            tax,
            totalAmount: subtotal + shippingFee + tax,
        });
    };

    // Fetch user cart from server
    const fetchUserCart = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const userCart = await cartOrderService.getCartByUserId(parseInt(user.id));
            setCart(userCart);
            setCartItems(userCart.items || []);
            calculateCartTotals(userCart.items || []);

            // Store in localStorage in case user logs out
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(userCart));
        } catch (err: any) {
            console.error('Error fetching cart:', err);
            setError(err.response?.data?.message || 'Could not fetch cart');

            // If error is 404 (cart not found), create a new cart
            if (err.response?.status === 404) {
                try {
                    const newCart = await cartOrderService.createCart(parseInt(user.id));
                    setCart({cartId: newCart.cartId, items: []});
                    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({cartId: newCart.cartId, items: []}));
                } catch (createErr: any) {
                    console.error('Error creating new cart:', createErr);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (productId: number, quantity: number = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            // If not authenticated, handle locally
            if (!isAuthenticated || !user?.id) {
                // Fetch product info to display in cart
                const product = await catalogService.getProductById(productId);

                const newItem: CartItem = {
                    cartItemId: Date.now(), // temporary ID
                    productId: product.id,
                    productName: product.name,
                    quantity: quantity,
                    price: product.price,
                    imageUrl: product.productImages?.[0]?.imageUrl || null,
                };

                const updatedItems = [...cartItems];
                const existingItemIndex = updatedItems.findIndex((item) => item.productId === productId);

                if (existingItemIndex > -1) {
                    updatedItems[existingItemIndex].quantity += quantity;
                } else {
                    updatedItems.push(newItem);
                }

                setCartItems(updatedItems);

                // Update local storage
                const tempCart = {cartId: cart?.cartId || -1, items: updatedItems};
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tempCart));
                setCart(tempCart);
                calculateCartTotals(updatedItems);

                return;
            }

            // Add to server cart if authenticated
            if (!cart?.cartId) {
                const newCart = await cartOrderService.createCart(parseInt(user.id));
                setCart({cartId: newCart.cartId, items: []});
            }

            const cartId = cart?.cartId;
            if (!cartId) throw new Error('No cart ID available');

            const newItem = await cartOrderService.addToCart(cartId, productId, quantity);

            // Re-fetch the entire cart to ensure consistency
            await fetchUserCart();
        } catch (err: any) {
            console.error('Error adding to cart:', err);
            setError(err.response?.data?.message || 'Could not add item to cart');
        } finally {
            setIsLoading(false);
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
        setIsLoading(true);
        setError(null);

        try {
            // If not authenticated, handle locally
            if (!isAuthenticated || !user?.id) {
                const updatedItems = cartItems
                    .map((item) => (item.cartItemId === cartItemId ? {...item, quantity: quantity} : item))
                    .filter((item) => item.quantity > 0);

                setCartItems(updatedItems);

                // Update local storage
                const tempCart = {cartId: cart?.cartId || -1, items: updatedItems};
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tempCart));
                setCart(tempCart);
                calculateCartTotals(updatedItems);

                return;
            }

            // Update on server if authenticated
            if (quantity === 0) {
                await cartOrderService.removeFromCart(cartItemId);
            } else {
                await cartOrderService.updateCartItemQuantity(cartItemId, quantity);
            }

            // Re-fetch the entire cart
            await fetchUserCart();
        } catch (err: any) {
            console.error('Error updating cart:', err);
            setError(err.response?.data?.message || 'Could not update item');
        } finally {
            setIsLoading(false);
        }
    };

    // Remove from cart
    const removeFromCart = async (cartItemId: number) => {
        await updateCartItemQuantity(cartItemId, 0);
    };

    // Clear cart
    const clearCart = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!isAuthenticated || !user?.id) {
                setCartItems([]);
                const tempCart = {cartId: cart?.cartId || -1, items: []};
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tempCart));
                setCart(tempCart);
                calculateCartTotals([]);
                return;
            }

            // For authenticated users, remove each item individually
            // (assuming backend doesn't have a clear cart endpoint)
            if (cart?.items) {
                for (const item of cart.items) {
                    await cartOrderService.removeFromCart(item.cartItemId);
                }
            }

            // Re-fetch empty cart
            await fetchUserCart();
        } catch (err: any) {
            console.error('Error clearing cart:', err);
            setError(err.response?.data?.message || 'Could not clear cart');
        } finally {
            setIsLoading(false);
        }
    };

    // Start checkout process
    const startCheckout = () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        // Load shipping info from storage if available
        const savedShippingInfo = localStorage.getItem(SHIPPING_INFO_KEY);
        if (savedShippingInfo) {
            setShippingInfo(JSON.parse(savedShippingInfo));
        }

        // Prepare for checkout process
    };

    const resetCart = () => {
        // Xóa dữ liệu giỏ hàng trong localStorage
        localStorage.removeItem(CART_STORAGE_KEY);

        // Reset các state liên quan đến giỏ hàng
        setCart(null);
        setCartItems([]);
        setTotalItems(0);
        setCartSummary({
            totalItems: 0,
            subtotal: 0,
            shippingFee: 0,
            tax: 0,
            totalAmount: 0,
        });
    };

    // Update shipping information
    const updateShippingInfo = (info: ShippingInfo) => {
        setShippingInfo(info);
        localStorage.setItem(SHIPPING_INFO_KEY, JSON.stringify(info));
    };

    // Process the order
    const processOrder = async (paymentMethod: string): Promise<Order> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('You must be logged in to place an order');
            }

            if (!shippingInfo) {
                throw new Error('Shipping information is required');
            }

            if (cartItems.length === 0) {
                throw new Error('Your cart is empty');
            }

            // Create the full address string
            const fullAddress = `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;

            // Prepare order details
            const orderDetails = cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                productName: item.productName,
            }));

            // Create order data
            const checkoutData = {
                userId: parseInt(user.id),
                address: fullAddress,
                orderDetails: orderDetails,
                status: 'PENDING',
                paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
                paymentMethod: paymentMethod,
                shippingInfo: shippingInfo,
            };

            // Create order
            const createdOrder = await cartOrderService.createOrder(checkoutData);
            setActiveOrder(createdOrder);

            // If payment is successful or COD, clear cart
            await clearCart();

            return createdOrder;
        } catch (err: any) {
            console.error('Error processing order:', err);
            setError(err.response?.data?.message || 'Could not process order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user orders
    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                return;
            }

            const userOrders = await cartOrderService.getOrdersByUserId(parseInt(user.id));
            setOrders(userOrders);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.response?.data?.message || 'Could not fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    // Get order by ID
    const getOrderById = async (orderId: number): Promise<Order | undefined> => {
        setIsLoading(true);
        setError(null);

        try {
            const order = await cartOrderService.getOrderById(orderId);
            return order;
        } catch (err: any) {
            console.error('Error fetching order:', err);
            setError(err.response?.data?.message || 'Could not fetch order');
            return undefined;
        } finally {
            setIsLoading(false);
        }
    };

    // Cancel order
    const cancelOrder = async (orderId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            await cartOrderService.cancelOrder(orderId);
            // Update orders list
            await fetchOrders();
        } catch (err: any) {
            console.error('Error cancelling order:', err);
            setError(err.response?.data?.message || 'Could not cancel order');
        } finally {
            setIsLoading(false);
        }
    };

    const assignDeliverer = async (orderId: number, delivererId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            await cartOrderService.assignDeliverer(orderId, delivererId);
            // Refresh orders list
            await fetchOrders();
        } catch (err: any) {
            console.error('Error assigning deliverer:', err);
            setError(err.response?.data?.message || 'Could not assign deliverer');
        } finally {
            setIsLoading(false);
        }
    };

    // Get orders assigned to a specific deliverer
    const getDelivererOrders = async (delivererId: number): Promise<Order[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const delivererOrders = await cartOrderService.getDelivererOrders(delivererId);
            return delivererOrders;
        } catch (err: any) {
            console.error('Error fetching deliverer orders:', err);
            setError(err.response?.data?.message || 'Could not fetch orders');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Update delivery status
    const updateDeliveryStatus = async (orderId: number, status: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await cartOrderService.updateDeliveryStatus(orderId, status);
            // Refresh orders list
            await fetchOrders();
        } catch (err: any) {
            console.error('Error updating delivery status:', err);
            setError(err.response?.data?.message || 'Could not update status');
        } finally {
            setIsLoading(false);
        }
    };

    // Upload delivery proof
    const uploadDeliveryProof = async (orderId: number, proofImage: File, notes?: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await cartOrderService.uploadDeliveryProof(orderId, proofImage, notes);
            // Refresh orders list
            await fetchOrders();
        } catch (err: any) {
            console.error('Error uploading delivery proof:', err);
            setError(err.response?.data?.message || 'Could not upload proof');
        } finally {
            setIsLoading(false);
        }
    };
    
    const updateOrderPaymentStatus = async (orderId: number, paymentStatus: string, transactionId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
        const updatedOrder = await cartOrderService.updateOrderPaymentStatus(orderId, paymentStatus, transactionId);
        
        // Update the active order if it matches
        if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(updatedOrder);
        }
        
        // If this order is in the orders list, update it there too
        setOrders(orders.map(order => 
            order.id === orderId ? updatedOrder : order
        ));
        
        return updatedOrder;
    } catch (err: any) {
        console.error('Error updating payment status:', err);
        setError(err.response?.data?.message || 'Could not update payment status');
        throw err;
    } finally {
        setIsLoading(false);
    }
};

    return (
        <CartOrderContext.Provider
            value={{
                cart,
                cartItems,
                totalItems,
                isLoading,
                error,
                activeOrder,
                shippingInfo,
                cartSummary,
                orders,
                // Cart actions
                addToCart,
                updateCartItemQuantity,
                removeFromCart,
                clearCart,
                resetCart,
                // Checkout actions
                startCheckout,
                updateShippingInfo,
                processOrder,
                // Order actions
                fetchOrders,
                getOrderById,
                cancelOrder,
                // Add delivery management methods
                assignDeliverer,
                getDelivererOrders,
                updateDeliveryStatus,
                uploadDeliveryProof,
                updateOrderPaymentStatus,
            }}
        >
            {children}
        </CartOrderContext.Provider>
    );
};
