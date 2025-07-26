import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from 'container/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {login, loading, isAuthenticated} = useAuth();

    useEffect(() => {
        // Kiểm tra URL có param logout=true không
        const params = new URLSearchParams(window.location.search);
        if (params.get('logout') === 'true') {
            localStorage.removeItem('access_token');
        }

        // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang chủ
        if (isAuthenticated) {
            window.location.href = '/';
        }
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
        }
    };

    return (
        <div
            className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Image Section */}
                <div className="md:w-1/2 bg-amber-50 hidden md:block relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent"></div>
                    <img
                        src="/images/account-login.png"
                        alt="Tinh Tú Jewelry Collection"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80';
                        }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h2 className="text-3xl font-serif font-medium mb-2">Chào Mừng Trở Lại</h2>
                        <p className="text-sm text-amber-50/90">
                            Đăng nhập để khám phá bộ sưu tập trang sức độc quyền và trải nghiệm dịch vụ khách hàng cao
                            cấp.
                        </p>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="md:w-1/2 py-12 px-6 md:px-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-2">Đăng Nhập</h1>
                        <p className="text-gray-600">Truy cập tài khoản của bạn</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div
                                className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                                <div className="px-3 py-3">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email của bạn"
                                    className="flex-1 border-0 py-3 pr-4 bg-white focus:outline-none focus:ring-0"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <Link to="/account/forgot-password" className="text-sm text-amber-600 hover:text-amber-800">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div
                                className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                                <div className="px-3 py-3">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    className="flex-1 border-0 py-3 pr-4 bg-white focus:outline-none focus:ring-0"
                                    required
                                />
                                <div className="pr-3 py-3 cursor-pointer"
                                     onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg
                                            className="h-5 w-5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-md hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md transition-colors font-medium disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Đang xử lý...
                                </div>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">hoặc</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link to="/account/register" className="text-amber-600 font-medium hover:text-amber-800">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
