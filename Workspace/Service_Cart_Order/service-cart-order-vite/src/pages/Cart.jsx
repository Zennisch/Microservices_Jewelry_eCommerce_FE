import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {useCartOrder} from 'container/CartOrderContext';
import {useAuth} from 'container/AuthContext';

const Cart = () => {
    const navigate = useNavigate();
    const {cartItems, cartSummary, isLoading, updateCartItemQuantity, removeFromCart, clearCart} = useCartOrder();

    const {isAuthenticated, user} = useAuth();
    const [removingItems, setRemovingItems] = useState([]);
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    // Kiểm tra xác thực khi trang tải lên
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/account/login', {state: {from: '/cart'}});
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity >= 1) {
            updateCartItemQuantity(cartItemId, newQuantity);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        setRemovingItems((prev) => [...prev, cartItemId]);
        await removeFromCart(cartItemId);
        setRemovingItems((prev) => prev.filter((id) => id !== cartItemId));
    };

    const handleClearCart = async () => {
        setShowConfirmClear(false);
        await clearCart();
    };

    const handleProceedToCheckout = () => {
        navigate('/cart/checkout');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Hiệu ứng cho các mục trong giỏ hàng
    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
        exit: {opacity: 0, x: -100, transition: {duration: 0.3}},
    };

    return (
        <div className="bg-[#faf7f2] min-h-screen py-16">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex text-sm">
                        <Link to="/" className="text-amber-800 hover:text-amber-600 transition">
                            Trang chủ
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-amber-600 font-medium">Giỏ hàng</span>
                    </nav>
                </div>

                <h1 className="text-3xl font-serif font-medium text-gray-800 mb-8 text-center">Giỏ hàng của bạn</h1>

                {isLoading ? (
                    // Loading state
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    // Empty cart state
                    <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 text-amber-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-gray-600 mb-8">
                            Hãy tiếp tục mua sắm và thêm các sản phẩm yêu thích vào giỏ hàng của bạn.
                        </p>
                        <Link
                            to="/catalog"
                            className="inline-block px-6 py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    // Cart with items
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart items - Left side */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-700">
                                                <th className="py-4 px-6 text-left">Sản phẩm</th>
                                                <th className="py-4 px-4 text-center">Số lượng</th>
                                                <th className="py-4 px-4 text-right">Giá</th>
                                                <th className="py-4 px-4 text-right">Tổng</th>
                                                <th className="py-4 px-4 text-center">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {cartItems.map((item, index) => (
                                                    <motion.tr
                                                        key={item.cartItemId}
                                                        custom={index}
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className={`border-t border-gray-200 ${
                                                            removingItems.includes(item.cartItemId) ? 'opacity-60' : ''
                                                        }`}
                                                    >
                                                        {/* Product info */}
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center">
                                                                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                                    {item.imageUrl ? (
                                                                        <img
                                                                            src={item.imageUrl}
                                                                            alt={item.productName}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '/images/default-product.png';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                            <i className="fas fa-image text-2xl"></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <Link
                                                                        to={`/catalog/product/${item.productId}`}
                                                                        className="text-gray-800 hover:text-amber-600 font-medium line-clamp-2 transition-colors"
                                                                    >
                                                                        {item.productName}
                                                                    </Link>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        Mã SP: {item.productId}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Quantity */}
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center justify-center border border-gray-300 rounded-md overflow-hidden">
                                                                <button
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                                                    onClick={() =>
                                                                        handleQuantityChange(item.cartItemId, item.quantity - 1)
                                                                    }
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="px-4 py-1 text-center w-12">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                                                    onClick={() =>
                                                                        handleQuantityChange(item.cartItemId, item.quantity + 1)
                                                                    }
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>

                                                        {/* Price */}
                                                        <td className="py-4 px-4 text-right font-medium">
                                                            {formatPrice(item.price)}
                                                        </td>

                                                        {/* Total */}
                                                        <td className="py-4 px-4 text-right font-medium">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </td>

                                                        {/* Remove button */}
                                                        <td className="py-4 px-4 text-center">
                                                            <button
                                                                onClick={() => handleRemoveItem(item.cartItemId)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                                disabled={removingItems.includes(item.cartItemId)}
                                                            >
                                                                {removingItems.includes(item.cartItemId) ? (
                                                                    <span className="inline-block w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></span>
                                                                ) : (
                                                                    <i className="fas fa-times"></i>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cart actions */}
                                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                                    <button
                                        onClick={() => setShowConfirmClear(true)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Xóa giỏ hàng
                                    </button>

                                    <Link
                                        to="/catalog"
                                        className="px-4 py-2 border border-amber-600 text-amber-600 rounded-md hover:bg-amber-50 transition-colors"
                                    >
                                        Tiếp tục mua sắm
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Order summary - Right side */}
                        <div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-serif font-medium text-gray-800 mb-4 pb-4 border-b border-gray-200">
                                    Tóm tắt đơn hàng
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính ({cartSummary.totalItems} sản phẩm)</span>
                                        <span className="font-medium text-gray-800">{formatPrice(cartSummary.subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phí vận chuyển</span>
                                        {cartSummary.shippingFee > 0 ? (
                                            <span className="font-medium text-gray-800">
                                                {formatPrice(cartSummary.shippingFee)}
                                            </span>
                                        ) : (
                                            <span className="font-medium text-green-600">Miễn phí</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thuế (10%)</span>
                                        <span className="font-medium text-gray-800">{formatPrice(cartSummary.tax)}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3 mt-4">
                                        <div className="flex justify-between">
                                            <span className="font-serif font-medium text-gray-800">Tổng tiền</span>
                                            <span className="font-serif font-semibold text-xl text-amber-800">
                                                {formatPrice(cartSummary.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout button */}
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center"
                                >
                                    <span>Tiến hành thanh toán</span>
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </motion.button>

                                {/* Benefits */}
                                <div className="mt-8 space-y-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <i className="fas fa-shield-alt text-amber-600 mr-3"></i>
                                        <span>Bảo mật thanh toán</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-exchange-alt text-amber-600 mr-3"></i>
                                        <span>Đổi trả trong 30 ngày</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-truck text-amber-600 mr-3"></i>
                                        <span>Giao hàng toàn quốc</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gift card / Voucher */}
                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h3 className="font-medium text-gray-800 mb-3">Mã giảm giá</h3>
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã giảm giá"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-md hover:bg-gray-300 transition-colors">
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm clear cart modal */}
            {showConfirmClear && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <motion.div
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-xl font-medium text-gray-800 mb-4">Xác nhận xóa giỏ hàng</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowConfirmClear(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleClearCart}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Cart;
