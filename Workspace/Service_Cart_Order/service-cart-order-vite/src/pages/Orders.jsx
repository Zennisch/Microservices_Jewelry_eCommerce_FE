import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartOrder } from 'container/CartOrderContext';
import { useAuth } from 'container/AuthContext';

const Orders = () => {
    const { orders, fetchOrders, isLoading } = useCartOrder();
    const { isAuthenticated } = useAuth();
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price || 0);
    };

    // Get payment status text
    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'PAID':
                return 'Đã thanh toán';
            case 'PENDING':
                return 'Chờ thanh toán';
            case 'CANCELED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    // Get order status text
    const getOrderStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xử lý';
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'READY_FOR_DELIVERY':
                return 'Sẵn sàng giao hàng';
            case 'ASSIGNED_TO_DELIVERER':
                return 'Đã giao cho đơn vị vận chuyển';
            case 'OUT_FOR_DELIVERY':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao hàng';
            case 'DELIVERY_CONFIRMED':
                return 'Đã nhận hàng';
            case 'FAILED':
                return 'Giao hàng thất bại';
            case 'CANCELED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-blue-100 text-blue-800';
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800';
            case 'READY_FOR_DELIVERY':
                return 'bg-indigo-100 text-indigo-800';
            case 'ASSIGNED_TO_DELIVERER':
            case 'OUT_FOR_DELIVERY':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
            case 'DELIVERY_CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'FAILED':
            case 'CANCELED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get payment status color
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case 'date-asc':
                return new Date(a.created_at) - new Date(b.created_at);
            case 'date-desc':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return new Date(b.created_at) - new Date(a.created_at);
        }
    });

    // Calculate total for an order
    const calculateOrderTotal = (order) => {
        if (!order.orderDetails || !order.orderDetails.length) return 0;
        
        const subtotal = order.orderDetails.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
        );
        const tax = subtotal * 0.1;
        const shipping = 30000;
        
        return subtotal + tax + shipping;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f2] min-h-screen py-10 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-serif font-medium text-gray-800 mb-6">Đơn hàng của tôi</h1>

                <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="all">Tất cả đơn hàng</option>
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="PROCESSING">Đang xử lý</option>
                            <option value="READY_FOR_DELIVERY">Sẵn sàng giao hàng</option>
                            <option value="OUT_FOR_DELIVERY">Đang giao hàng</option>
                            <option value="DELIVERED">Đã giao hàng</option>
                            <option value="CANCELED">Đã hủy</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="date-desc">Mới nhất</option>
                            <option value="date-asc">Cũ nhất</option>
                            <option value="status">Trạng thái</option>
                        </select>
                    </div>

                    <Link to="/catalog" className="text-amber-600 hover:text-amber-700 flex items-center">
                        <i className="fas fa-shopping-bag mr-2"></i>
                        Tiếp tục mua sắm
                    </Link>
                </div>

                {sortedOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 text-5xl mb-4">
                            <i className="fas fa-shopping-basket"></i>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-700 mb-2">Bạn chưa có đơn hàng nào</h2>
                        <p className="text-gray-600 mb-6">Hãy khám phá các sản phẩm và đặt hàng ngay</p>
                        <Link
                            to="/catalog"
                            className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                        >
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="p-4 md:p-6 border-b">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div>
                                            <p className="text-gray-500 text-sm">Mã đơn hàng</p>
                                            <p className="font-medium">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Ngày đặt</p>
                                            <p>{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Trạng thái</p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {getOrderStatusText(order.status)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Thanh toán</p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                                    order.payment_status
                                                )}`}
                                            >
                                                {getPaymentStatusText(order.payment_status)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Tổng tiền</p>
                                            <p className="font-medium text-amber-800">
                                                {formatPrice(calculateOrderTotal(order))}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 border-b">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Địa chỉ giao hàng</p>
                                            <p className="text-gray-700">{order.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">
                                                Sản phẩm ({order.orderDetails?.length || 0})
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {order.orderDetails?.slice(0, 3).map((detail) => (
                                                    <div
                                                        key={detail.id}
                                                        className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden"
                                                    >
                                                        {detail.product?.imageSet && detail.product.imageSet[0]?.image_url ? (
                                                            <img
                                                                src={detail.product.imageSet[0].image_url}
                                                                alt={detail.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <i className="fas fa-image"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.orderDetails?.length > 3 && (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">+{order.orderDetails.length - 3}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 flex justify-end">
                                    <Link
                                        to={`/cart/orders/${order.id}`}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;