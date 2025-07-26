import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'container/AuthContext';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { resetPassword } = useAuth();

    // Validate password strength
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: 'text-gray-400'
    });

    useEffect(() => {
        if (!token) {
            setError('Token không hợp lệ hoặc đã hết hạn');
        }
    }, [token]);

    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = '';
        let color = 'text-gray-400';

        if (password.length > 0) {
            // Length check
            if (password.length >= 8) score += 1;

            // Complexity checks
            if (/[A-Z]/.test(password)) score += 1;
            if (/[0-9]/.test(password)) score += 1;
            if (/[^A-Za-z0-9]/.test(password)) score += 1;

            // Set message and color based on score
            if (score === 0) {
                message = 'Rất yếu';
                color = 'text-red-500';
            } else if (score === 1) {
                message = 'Yếu';
                color = 'text-red-500';
            } else if (score === 2) {
                message = 'Trung bình';
                color = 'text-yellow-500';
            } else if (score === 3) {
                message = 'Mạnh';
                color = 'text-green-500';
            } else {
                message = 'Rất mạnh';
                color = 'text-green-600';
            }
        }

        setPasswordStrength({ score, message, color });
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Token không hợp lệ hoặc đã hết hạn');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwordStrength.score < 2) {
            setError('Mật khẩu không đủ mạnh. Hãy sử dụng ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt.');
            return;
        }

        setLoading(true);
        try {
            // Add detailed logging to debug the issue
            console.log('Resetting password with token:', token);
            console.log('Password length:', password.length);
            
            // Make sure we're sending the correct payload format
            const response = await resetPassword(token, password, confirmPassword);
            console.log('Reset password response:', response);
            
            setSuccess(true);
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/account/login');
            }, 3000);
        } catch (err) {
            console.error('Reset password error:', err);
            
            // More detailed error handling
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                setError(err.response.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
            } else if (err.request) {
                console.error('No response received:', err.request);
                setError('Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
            } else {
                console.error('Error message:', err.message);
                setError('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-serif text-gray-800 mb-2">Liên Kết Không Hợp Lệ</h2>
                    <p className="text-gray-600 mb-6">Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
                    <Link
                        to="/account/forgot-password"
                        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition font-medium inline-block"
                    >
                        Yêu Cầu Liên Kết Mới
                    </Link>
                </div>
            </div>
        );
    }

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
                        <h2 className="text-3xl font-serif font-medium mb-2">Đặt Lại Mật Khẩu</h2>
                        <p className="text-sm text-amber-50/90">
                            Tạo mật khẩu mới để bảo vệ tài khoản của bạn.
                        </p>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="md:w-1/2 py-12 px-6 md:px-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-2">Đặt Lại Mật Khẩu</h1>
                        <p className="text-gray-600">Tạo mật khẩu mới cho tài khoản của bạn</p>
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

                    {success ? (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="font-medium">Mật khẩu đã được đặt lại thành công!</p>
                                    <p className="text-sm">Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
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
                                            onChange={handlePasswordChange}
                                            placeholder="Nhập mật khẩu mới"
                                            className="flex-1 border-0 py-3 pr-4 bg-white focus:outline-none focus:ring-0"
                                            required
                                            minLength={6}
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
                                {password && (
                                    <div className="mt-1.5 flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${
                                                    passwordStrength.score === 0 ? 'bg-gray-300' :
                                                        passwordStrength.score === 1 ? 'bg-red-500' :
                                                            passwordStrength.score === 2 ? 'bg-yellow-500' :
                                                                passwordStrength.score === 3 ? 'bg-green-500' : 'bg-green-600'
                                                }`}
                                                style={{width: `${25 * passwordStrength.score}%`}}
                                            ></div>
                                        </div>
                                        <span className={`ml-2 text-xs ${passwordStrength.color}`}>
                                            {passwordStrength.message}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu
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
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Xác nhận mật khẩu mới"
                                        className="flex-1 border-0 py-3 pr-4 bg-white focus:outline-none focus:ring-0"
                                        required
                                    />
                                    <div className="pr-3 py-3 cursor-pointer"
                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? (
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
                                    'Đặt Lại Mật Khẩu'
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Đã nhớ mật khẩu?{' '}
                            <Link to="/account/login" className="text-amber-600 font-medium hover:text-amber-800">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;