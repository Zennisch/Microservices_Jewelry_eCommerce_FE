import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import ChatBot from './Chatbot';
import {useAuth} from '../contexts/AuthContext';
import {useCartOrder} from '../contexts/CartOrderContext'; // Import CartOrder context
import NavigationManager from './NavigationManager';

const Header = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Use CartOrder context to get real cart items count
    const {totalItems, resetCart} = useCartOrder();

    const {user, isAuthenticated, loading, logout} = useAuth();

    const authHref = '/account';
    const userHref = '/user';

    // Scroll effect handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async (e: any) => {
        e.preventDefault();
        try {
            await logout();
            resetCart();
            console.log('Đăng xuất thành công');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const handleImageError = (e) => {
        e.currentTarget.src = '/images/account-default.jpg';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (showDropdown && !event.target.closest('.nav-item')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
                ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-gradient-to-r from-white to-gray-50 py-4'}`}
            >
                <div className="container mx-auto px-4 lg:px-6">
                    {/* Top header with branding and user actions */}
                    <div className="flex justify-between items-center">
                        {/* Left section with chat bot */}
                        <div className="w-1/4 flex justify-start">
                            <button
                                className="text-gray-700 hover:text-amber-600 transition-colors flex items-center group"
                                title="Trợ giúp & Tư vấn"
                                onClick={() => setShowChatbot(!showChatbot)}
                            >
                                <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-amber-50 flex items-center justify-center transition-colors">
                                    <i className="fas fa-gem text-sm group-hover:text-amber-600"></i>
                                </span>
                                <span className="ml-2 hidden md:inline font-medium text-sm">Tư vấn</span>
                            </button>
                        </div>

                        {/* Center logo section */}
                        <div className="w-1/2 flex justify-center">
                            <Link to="/" className="flex items-center gap-2 group py-1">
                                <div className="w-10 h-10 flex items-center justify-center relative">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <defs>
                                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#D4AF37" />
                                                <stop offset="50%" stopColor="#F9F295" />
                                                <stop offset="100%" stopColor="#D4AF37" />
                                            </linearGradient>
                                        </defs>
                                        <polygon points="50,0 95,25 95,75 50,100 5,75 5,25" fill="url(#goldGradient)" />
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
                                <div className="text-gray-800 text-xl font-serif tracking-wider group-hover:text-amber-700 transition-colors">
                                    <span className="font-bold">TINH</span> <span className="font-light">TÚ</span>
                                </div>
                            </Link>
                        </div>

                        {/* Right section with user actions */}
                        <div className="w-1/4 flex justify-end items-center space-x-5">
                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-amber-600 transition-colors hidden md:flex items-center"
                            >
                                <span className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-50 flex items-center justify-center transition-colors">
                                    <i className="fas fa-phone-alt text-xs"></i>
                                </span>
                            </Link>

                            <Link
                                to="/cart"
                                className="text-gray-700 hover:text-amber-600 transition-colors flex items-center relative"
                            >
                                <span className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-50 flex items-center justify-center transition-colors">
                                    <i className="fas fa-shopping-bag text-sm"></i>
                                </span>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : isAuthenticated && user ? (
                                <div className="nav-item relative">
                                    <div
                                        className="flex items-center cursor-pointer text-gray-700 hover:text-amber-600 transition-colors"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 hover:border-amber-300 transition-colors">
                                            <img
                                                src={user.avatarUrl || '/default-avatar.png'}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <i
                                            className={`fa-solid ${
                                                showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'
                                            } ml-2 text-xs transition-transform`}
                                        ></i>
                                    </div>
                                    {showDropdown && (
                                        <div className="dropdown-menu absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20 animate-fadeIn border border-gray-100">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.role?.name ? 'Người Dùng' : 'Khách Hàng'}</p>
                                            </div>
                                            <a
                                                href={`${userHref}/profile`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                                            >
                                                <i className="fas fa-user-circle mr-2 text-amber-600"></i>Hồ Sơ
                                            </a>
                                            <a
                                                href={`/cart/orders`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                                            >
                                                <i className="fas fa-history mr-2 text-amber-600"></i>Lịch Sử Mua Hàng
                                            </a>
                                            <a
                                                href={`${userHref}/appointment`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                                            >
                                                <i className="fas fa-calendar-alt mr-2 text-amber-600"></i>Đặt Lịch Hẹn
                                            </a>
                                            <a
                                                href={`${userHref}/settings`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                                            >
                                                <i className="fas fa-cog mr-2 text-amber-600"></i>Cài Đặt
                                            </a>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <a
                                                href="#"
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <i className="fas fa-sign-out-alt mr-2"></i>Đăng Xuất
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <a
                                        href={`${authHref}/login`}
                                        className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm border border-transparent hover:border-amber-200 px-4 py-1.5 rounded-full hover:bg-amber-50"
                                    >
                                        <i className="fas fa-user-circle mr-1.5"></i> Đăng Nhập
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <NavigationManager scrolled={scrolled} />
                </div>
            </header>

            <div className={`${scrolled ? 'h-20' : 'h-24'} md:${scrolled ? 'h-24' : 'h-30'} transition-all duration-300`}></div>

            {showChatbot && <ChatBot onClose={() => setShowChatbot(false)} />}
        </>
    );
};

export default Header;
