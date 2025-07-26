import axios from 'axios';

// Base instance
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000 // 15 giây
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Thêm token vào header nếu có
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Xử lý response nếu cần
        return response;
    },
    (error) => {
        // Xử lý các lỗi chung
        if (error.response) {
            // Lỗi 401 - Unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('access_token');
                // Có thể dispatch một event hoặc chuyển hướng đến trang login
                window.location.href = '/account/login?session=expired';
            }

            // Lỗi 403 - Forbidden
            if (error.response.status === 403) {
                console.error('Bạn không có quyền truy cập tài nguyên này');
            }
        } else if (error.request) {
            console.error('Không nhận được phản hồi từ server', error.request);
        } else {
            console.error('Lỗi cấu hình request', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;