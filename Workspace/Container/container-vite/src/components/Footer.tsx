import {Link} from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-8 border-t border-gray-200">
            <div className="container mx-auto px-6">
                {/* Newsletter Section */}
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <h3 className="text-2xl font-serif font-medium text-gray-800 mb-2">Nhận Thông Tin Ưu Đãi</h3>
                    <p className="text-gray-600 mb-6">Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi đặc biệt</p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                        />
                        <button
                            className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-300 font-medium">
                            Đăng Ký
                        </button>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 mr-2">
                                <svg viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="footerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#D4AF37"/>
                                            <stop offset="50%" stopColor="#F9F295"/>
                                            <stop offset="100%" stopColor="#D4AF37"/>
                                        </linearGradient>
                                    </defs>
                                    <polygon points="50,0 95,25 95,75 50,100 5,75 5,25"
                                             fill="url(#footerGoldGradient)"/>
                                    <text
                                        x="50"
                                        y="62"
                                        textAnchor="middle"
                                        fill="#1A1A1A"
                                        fontSize="42"
                                        fontWeight="bold"
                                        fontFamily="serif"
                                    >
                                        T
                                    </text>
                                </svg>
                            </div>
                            <div className="text-gray-800 text-xl font-serif tracking-wider">
                                <span className="font-bold">TINH</span> <span className="font-light">TÚ</span>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Kiệt tác trang sức tinh xảo, nâng tầm vẻ đẹp của bạn với những thiết kế độc đáo từ Tinh Tú.
                        </p>
                        <div className="flex space-x-4 mb-6">
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors"
                            >
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors"
                            >
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                    {/* Shopping Column */}
                    <div>
                        <h3 className="text-lg font-serif font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Mua Sắm
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/collections/new"
                                      className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Bộ Sưu Tập Mới
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/nhan"
                                      className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Nhẫn
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/category/day-chuyen"
                                    className="text-gray-600 hover:text-amber-600 transition-colors"
                                >
                                    Dây Chuyền
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/vong-tay"
                                      className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Vòng Tay
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/bong-tai"
                                      className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Bông Tai
                                </Link>
                            </li>
                            <li>
                                <Link to="/promotions" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Khuyến Mãi
                                </Link>
                            </li>
                            <li>
                                <Link to="/gift-cards" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Thẻ Quà Tặng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-lg font-serif font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Hỗ Trợ
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/about-us" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Về Chúng Tôi
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Giải Đáp Thắc Mắc
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Chính Sách Vận Chuyển
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Chính Sách Đổi Trả
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Chính Sách Bảo Mật
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-600 hover:text-amber-600 transition-colors">
                                    Điều Khoản & Điều Kiện
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-lg font-serif font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Liên Hệ
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <i className="fas fa-map-marker-alt text-amber-600 mt-1 mr-3"></i>
                                <p className="text-gray-600">
                                    12 Nguyễn Văn Bảo, Phường 4<br/>
                                    Quận Gò Vấp, TP. Hồ Chí Minh
                                </p>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-phone-alt text-amber-600 mt-1 mr-3"></i>
                                <div className="text-gray-600">
                                    <p>+84 999 222 111</p>
                                    <p className="text-xs text-gray-500 mt-1">6:30 - 21:30 (Thứ 2 - Thứ 7)</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-envelope text-amber-600 mt-1 mr-3"></i>
                                <p className="text-gray-600">tinhtu@iuh.edu.vn</p>
                            </div>
                            <Link
                                to="/contact"
                                className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors group mt-2"
                            >
                                <span className="font-medium">Liên Hệ Với Chúng Tôi</span>
                                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-200 pt-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Phương Thức Thanh Toán</h4>
                            <div className="flex space-x-3">
                                <div className="w-10 h-7 bg-white rounded shadow-sm flex items-center justify-center">
                                    <i className="fab fa-cc-visa text-blue-800"></i>
                                </div>
                                <div className="w-10 h-7 bg-white rounded shadow-sm flex items-center justify-center">
                                    <i className="fab fa-cc-mastercard text-red-500"></i>
                                </div>
                                <div className="w-10 h-7 bg-white rounded shadow-sm flex items-center justify-center">
                                    <i className="fab fa-cc-paypal text-blue-600"></i>
                                </div>
                                <div className="w-10 h-7 bg-white rounded shadow-sm flex items-center justify-center">
                                    <i className="fas fa-money-bill-wave text-green-600"></i>
                                </div>
                                <div className="w-10 h-7 bg-white rounded shadow-sm flex items-center justify-center">
                                    <i className="fas fa-qrcode text-gray-700"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Vận Chuyển Bởi</h4>
                            <div className="flex space-x-3">
                                <div
                                    className="h-7 px-2 bg-white rounded shadow-sm flex items-center justify-center text-xs font-medium text-gray-700">
                                    GHN
                                </div>
                                <div
                                    className="h-7 px-2 bg-white rounded shadow-sm flex items-center justify-center text-xs font-medium text-gray-700">
                                    GHTK
                                </div>
                                <div
                                    className="h-7 px-2 bg-white rounded shadow-sm flex items-center justify-center text-xs font-medium text-gray-700">
                                    Viettel Post
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Tinh Tú Jewelry. Phát Triển Bởi Sinh Viên Đại học Công Nghiệp TP.
                        HCM
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                        Tất cả các hình ảnh sản phẩm và nội dung chỉ dành cho mục đích giáo dục
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
