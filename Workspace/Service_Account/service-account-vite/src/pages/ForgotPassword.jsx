import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from 'container/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const {requestPasswordReset} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Add more detailed logging
            console.log('Sending password reset request for email:', email);
            const response = await requestPasswordReset(email);
            console.log('Password reset response:', response);
            setSuccess(true);
        } catch (err) {
            console.error('Password reset error:', err);
            // More detailed error handling
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                setError(err.response.data?.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
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
                        <h2 className="text-3xl font-serif font-medium mb-2">Quên Mật Khẩu</h2>
                        <p className="text-sm text-amber-50/90">
                            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                        </p>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="md:w-1/2 py-12 px-6 md:px-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-2">Quên Mật Khẩu</h1>
                        <p className="text-gray-600">Nhập email để đặt lại mật khẩu của bạn</p>
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
                                    <p className="font-medium">Email đã được gửi!</p>
                                    <p className="text-sm">Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn để đặt lại mật khẩu.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                        Đang gửi...
                                    </div>
                                ) : (
                                    'Gửi Liên Kết Đặt Lại Mật Khẩu'
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

export default ForgotPassword;