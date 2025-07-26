import {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useCartOrder} from 'container/CartOrderContext';

const OrderConfirmation = () => {
    const {orderId} = useParams();
    const {getOrderById} = useCartOrder();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await getOrderById(parseInt(orderId));
                console.log('Fetched order data:', orderData); // Debug log
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
    }, [orderId, getOrderById]);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
            </div>
        );
    }

    // Calculate subtotal from orderDetails if available
    const subtotal =
        order?.orderDetails?.reduce((sum, item) => {
            return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }, 0) || 0;

    // Shipping fee is fixed for now
    const shippingFee = 30000;
    const tax = subtotal * 0.1;

    // Total amount
    const totalAmount = subtotal + tax + shippingFee;

    // Get payment method from order
    const paymentMethod = order?.payment_method || 'COD';

    return (
        <div className="bg-[#faf7f2] min-h-screen py-16">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-3xl text-green-600"></i>
                        </div>
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-2">Cảm ơn bạn đã đặt hàng!</h1>
                        <p className="text-gray-600">
                            Đơn hàng #{orderId} của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn ngay khi đơn hàng được
                            giao cho đơn vị vận chuyển.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-3 border-b border-gray-200">
                            Chi tiết đơn hàng
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Thông tin đơn hàng:</h3>
                                <ul className="text-gray-800 space-y-1">
                                    <li>
                                        <span className="font-medium">Mã đơn hàng:</span> #{orderId}
                                    </li>
                                    <li>
                                        <span className="font-medium">Ngày đặt:</span>{' '}
                                        {formatDate(order?.created_at || new Date())}
                                    </li>
                                    <li>
                                        <span className="font-medium">Trạng thái:</span>{' '}
                                        <span className="text-green-600">{getOrderStatusText(order?.status)}</span>
                                    </li>
                                    <li>
                                        <span className="font-medium">Thanh toán:</span>{' '}
                                        <span>{getPaymentStatusText(order?.payment_status, paymentMethod)}</span>
                                    </li>
                                    <li>
                                        <span className="font-medium">Phương thức:</span>{' '}
                                        <span>{paymentMethod === 'MOMO_QR' ? 'MOMO QR' : 'Thanh toán khi nhận hàng'}</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Địa chỉ giao hàng:</h3>
                                <p className="text-gray-800">{order?.address || 'Không có thông tin'}</p>
                            </div>
                        </div>

                        <h3 className="text-sm font-medium text-gray-600 mb-2">Sản phẩm:</h3>
                        <div className="space-y-3 mb-6">
                            {order?.orderDetails && order.orderDetails.length > 0 ? (
                                order.orderDetails.map((item) => (
                                    <div key={item.id} className="flex items-center border-b border-gray-100 pb-3">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
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
                                        <div className="ml-4 flex-1">
                                            <h4 className="text-gray-800">{item.product?.name || 'Sản phẩm'}</h4>
                                            <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">Không có thông tin sản phẩm</div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
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

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                            <Link
                                to="/cart/orders"
                                className="px-6 py-3 bg-amber-600 text-white font-medium rounded-md inline-block text-center hover:bg-amber-700 transition-colors shadow-md w-full md:w-auto"
                            >
                                Xem đơn hàng của tôi
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                            <Link
                                to="/catalog"
                                className="px-6 py-3 border border-amber-600 text-amber-600 font-medium rounded-md inline-block text-center hover:bg-amber-50 transition-colors w-full md:w-auto"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
