import axiosInstance from './axiosConfig';
import SERVICE_ENDPOINTS from './apiConfig';

const BASE_URL = SERVICE_ENDPOINTS.ACCOUNT;

interface LoginResponse {
    data: {
        access_token: string;
        user: any;
    };
    message: string;
}

interface ProfileResponse {
    data: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        avatarUrl?: string;
        role?: {
            id: string;
            name: string;
            permissions?: Array<any>;
        };
    };
    message: string;
}

const authService = {
    /**
     * Đăng nhập người dùng
     * @param username Email/tên đăng nhập của người dùng
     * @param password Mật khẩu người dùng
     * @returns Thông tin người dùng và token truy cập
     */
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>(`${BASE_URL}/auth/login`, {
            username,
            password,
        });

        if (response.data?.data?.access_token) {
            localStorage.setItem('access_token', response.data.data.access_token);
        }

        return response.data;
    },

    /**
     * Đăng xuất người dùng
     */
    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post(`${BASE_URL}/auth/logout`);
        } finally {
            localStorage.removeItem('access_token');
        }
    },

    /**
     * Đăng ký người dùng mới
     * @param userData Thông tin đăng ký (email, password, name, etc.)
     */
    register: async (userData: any): Promise<any> => {
        const response = await axiosInstance.post(`${BASE_URL}/auth/register`, userData);
        return response.data;
    },

    /**
     * Lấy thông tin người dùng hiện tại
     */
    getCurrentUser: async (): Promise<ProfileResponse | null> => {
        try {
            const response = await axiosInstance.get<ProfileResponse>(`${BASE_URL}/profile`);
            return response.data;
        } catch (error) {
            return null;
        }
    },

    /**
     * Kiểm tra người dùng đã đăng nhập hay chưa
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Yêu cầu đặt lại mật khẩu
     * @param email Email của người dùng
     */
    requestPasswordReset: async (email: string): Promise<any> => {
        try {
            console.log('Sending password reset request to API for email:', email);
            const response = await axiosInstance.post(`${BASE_URL}/auth/forgot-password`, { email });
            console.log('Password reset API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in requestPasswordReset:', error);
            throw error;
        }
    },

    /**
     * Đặt lại mật khẩu
     * @param token Token đặt lại mật khẩu
     * @param password Mật khẩu mới
     * @param confirmPassword Xác nhận mật khẩu mới
     */
    resetPassword: async (token: string, password: string, confirmPassword: string): Promise<any> => {
        try {
            console.log('Sending reset password request with token:', token);
            
            // Change the payload to match what the backend expects
            const payload = {
                token,
                newPassword: password  // Changed from new_password to newPassword
                // Removed password_confirmation as backend doesn't expect it
            };
            
            console.log('Reset password payload:', payload);
            
            const response = await axiosInstance.post(`${BASE_URL}/auth/reset-password`, payload);
            console.log('Reset password API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in resetPassword:', error);
            throw error;
        }
    },

    /**
     * Cập nhật thông tin người dùng
     * @param userData Thông tin cần cập nhật
     */
    updateProfile: async (userData: any): Promise<any> => {
        const response = await axiosInstance.put(`${BASE_URL}/profile`, userData);
        return response.data;
    }
};

export default authService;