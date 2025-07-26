import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from 'container/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const {register, loading} = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        gender: 'MALE',
        age: 18,
        address: '',
    });

    // Validate password strength
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: 'text-gray-400'
    });

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

        setPasswordStrength({score, message, color});
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === 'password') {
            checkPasswordStrength(value);
        }

        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return;
        }

        // Validate password strength
        if (passwordStrength.score < 2) {
            setError('Mật khẩu không đủ mạnh. Hãy sử dụng ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt.');
            return;
        }

        try {
            const userData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                gender: formData.gender,
                age: formData.age,
                address: formData.address
            };
            
            await register(userData);
            
            // Registration successful
            setSuccess(true);
            
            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/account/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div
            className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-200px)]">
            {success ? (
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-serif text-gray-800 mb-2">Đăng Ký Thành Công!</h2>
                    <p className="text-gray-600 mb-6">Tài khoản của bạn đã được tạo. Đang chuyển hướng đến trang đăng
                        nhập...</p>
                    <div className="flex justify-center">
                        <Link to="/login" className="text-amber-600 hover:text-amber-800 font-medium">
                            Đến trang đăng nhập ngay
                        </Link>
                    </div>
                </div>
            ) : (
                <div
                    className="w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                    {/* Left Image Section */}
                    <div className="md:w-5/12 bg-amber-50 hidden md:block relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent"></div>
                        <img
                            src="/images/account-register.png"
                            alt="Tinh Tú Jewelry Collection"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80';
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h2 className="text-3xl font-serif font-medium mb-2">Tham Gia Cùng Chúng Tôi</h2>
                            <p className="text-sm text-amber-50/90">
                                Đăng ký để nhận thông tin về bộ sưu tập mới và các ưu đãi độc quyền từ Tinh Tú Jewelry.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div className="md:w-7/12 py-8 px-6 md:px-12">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-serif font-medium text-gray-800 mb-2">Đăng Ký Tài Khoản</h1>
                            <p className="text-gray-600">Tạo tài khoản để trải nghiệm dịch vụ từ Tinh Tú</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email & Name row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email của bạn"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Họ và tên của bạn"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Mật khẩu"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            minLength={6}
                                            required
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    {formData.password && (
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
                                    <label htmlFor="confirmPassword"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Nhập lại mật khẩu"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            required
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    {formData.password && formData.confirmPassword && (
                                        <div className="mt-1.5">
                                            {formData.password === formData.confirmPassword ? (
                                                <span className="text-xs text-green-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"/>
                          </svg>
                          Mật khẩu khớp
                        </span>
                                            ) : (
                                                <span className="text-xs text-red-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                          </svg>
                          Mật khẩu không khớp
                        </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gender & Age row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Giới tính
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tuổi
                                    </label>
                                    <input
                                        id="age"
                                        type="number"
                                        name="age"
                                        min="18"
                                        max="100"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="Địa chỉ của bạn"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-md hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md transition-colors font-medium disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : "Đăng Ký"}
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    Đã có tài khoản?{" "}
                                    <Link to="/login" className="text-amber-600 font-medium hover:text-amber-800">
                                        Đăng nhập
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;