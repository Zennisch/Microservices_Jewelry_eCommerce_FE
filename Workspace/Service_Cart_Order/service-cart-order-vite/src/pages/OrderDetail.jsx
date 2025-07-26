import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartOrder } from 'container/CartOrderContext';
import { useAuth } from 'container/AuthContext';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getOrderById, cancelOrder, isLoading } = useCartOrder();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelingOrder, setCancelingOrder] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await getOrderById(parseInt(orderId));
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, []);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
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

    // Format payment status
    const getPaymentStatusText = (status, method) => {
        if (status === 'PAID') {
            return method === 'MOMO_QR' ? 'Đã thanh toán qua MOMO' : 'Đã thanh toán';
        }
        if (method === 'COD') return 'Thanh toán khi nhận hàng';
        if (method === 'MOMO_QR') return 'Chờ thanh toán qua MOMO';
        return 'Chưa thanh toán';
    };

    // Get payment method text
    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'COD':
                return 'Thanh toán khi nhận hàng';
            case 'MOMO_QR':
                return 'MOMO QR';
            case 'BANK_TRANSFER':
                return 'Chuyển khoản ngân hàng';
            default:
                return method;
        }
    };

    // Format order status
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
                return 'Đang chờ xử lý';
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

    // Handle order cancellation
    const handleCancelOrder = async () => {
        try {
            setCancelingOrder(true);
            await cancelOrder(order.id);
            alert('Đơn hàng đã được hủy thành công');
            // Refresh order data
            const updatedOrder = await getOrderById(parseInt(orderId));
            setOrder(updatedOrder);
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setCancelingOrder(false);
        }
    };

    // Check if order can be canceled
    const canCancelOrder = () => {
        if (!order) return false;
        return ['PENDING', 'PROCESSING'].includes(order.status);
    };

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-[#faf7f2] min-h-screen py-16 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-red-500 text-5xl mb-4">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <h2 className="text-2xl font-medium text-gray-700 mb-2">Không tìm thấy đơn hàng</h2>
                    <p className="text-gray-600 mb-6">Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập</p>
                    <Link
                        to="/cart/orders"
                        className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                    >
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate subtotal
    const subtotal = order.orderDetails?.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
    }, 0) || 0;
    
    // Shipping fee is fixed for now
    const shippingFee = 30000;
    
    // Calculate tax (10%)
    const tax = subtotal * 0.1;
    
    // Total amount
    const totalAmount = subtotal + tax + shippingFee;

    return (
        <div className="bg-[#faf7f2] min-h-screen py-10 px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <button onClick={() => navigate('/cart/orders')} className="text-gray-600 hover:text-amber-600">
                            <i className="fas fa-arrow-left mr-2"></i>
                            Quay lại đơn hàng của tôi
                        </button>
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mt-2">Chi tiết đơn hàng #{order.id}</h1>
                    </div>
                    
                    {canCancelOrder() && (
                        <button
                            onClick={() => setShowConfirmModal(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Hủy đơn hàng
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="p-6 border-b">
                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">Thông tin đơn hàng</h2>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex gap-2">
                                        <span className="text-gray-500">Mã đơn hàng:</span>
                                        <span className="font-medium">#{order.id}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-500">Ngày đặt:</span>
                                        <span>{formatDate(order.created_at)}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-500">Trạng thái:</span>
                                        <span className={`px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                                            {getOrderStatusText(order.status)}
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-500">Thanh toán:</span>
                                        <span>{getPaymentStatusText(order.payment_status, order.payment_method)}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-500">Phương thức:</span>
                                        <span>{getPaymentMethodText(order.payment_method)}</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">Địa chỉ giao hàng</h2>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {order.address}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-3">Trạng thái giao hàng</h2>
                                {order.deliverer ? (
                                    <>
                                        <p className="text-gray-700 mb-1">
                                            <span className="font-medium">Người giao hàng:</span>{' '}
                                            {order.deliverer?.name || 'Chưa xác định'}
                                        </p>
                                        {order.deliveryProof && (
                                            <p className="text-green-600">
                                                <i className="fas fa-check-circle mr-2"></i>
                                                Đã xác nhận giao thành công
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-500">Chưa có thông tin giao hàng</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Sản phẩm đã đặt</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-gray-600">
                                        <th className="py-3 px-4">Sản phẩm</th>
                                        <th className="py-3 px-4">Đơn giá</th>
                                        <th className="py-3 px-4">Số lượng</th>
                                        <th className="py-3 px-4 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.orderDetails && order.orderDetails.length > 0 ? (
                                        order.orderDetails.map((item) => (
                                            <tr key={item.id} className="text-gray-700">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center">
                                                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                            {item.product?.imageSet && item.product.imageSet[0]?.image_url ? (
                                                                <img
                                                                    src={item.product.imageSet[0].image_url}
                                                                    alt={item.product?.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <i className="fas fa-image"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="font-medium">{item.product?.name || 'Sản phẩm'}</h3>
                                                            <p className="text-gray-500 text-sm">Mã SP: {item.product_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">{formatPrice(item.price)}</td>
                                                <td className="py-4 px-4">{item.quantity}</td>
                                                <td className="py-4 px-4 text-right">
                                                    {formatPrice(item.price * item.quantity)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                                                Không có thông tin sản phẩm
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Tạm tính:</span>
                                <span className="text-gray-800">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Thuế (10%):</span>
                                <span className="text-gray-800">{formatPrice(tax)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Phí vận chuyển:</span>
                                <span className="text-gray-800">{formatPrice(shippingFee)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-100">
                                <span className="text-gray-800">Tổng cộng:</span>
                                <span className="text-amber-800">{formatPrice(totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <Link
                        to="/cart/orders"
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <i className="fas fa-list mr-2"></i>
                        Danh sách đơn hàng
                    </Link>
                    <Link
                        to="/catalog"
                        className="px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                    >
                        <i className="fas fa-shopping-bag mr-2"></i>
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>

            {/* Cancel Order Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                    >
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Xác nhận hủy đơn hàng</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn hủy đơn hàng #{order.id}? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={cancelingOrder}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                disabled={cancelingOrder}
                            >
                                {cancelingOrder ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                        Đang xử lý
                                    </>
                                ) : (
                                    'Xác nhận hủy'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;