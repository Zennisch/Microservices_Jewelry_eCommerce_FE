import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { Spin, Result } from 'antd';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const callback = searchParams.get('callback') || '/';

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        // Lấy các tham số từ URL
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const role = searchParams.get('role');

        if (!token || !userId || !email || !name) {
          setError('Missing required authentication parameters.');
          return;
        }

        // Lưu token vào localStorage
        localStorage.setItem('access_token', token);

        // Cập nhật thông tin người dùng vào Redux store
        const userInfo = {
          id: userId,
          email,
          name,
          role: { name: role || 'ROLE_USER', permissions: [] }, // Đảm bảo role có cấu trúc đúng
        };
        dispatch(setUserLoginInfo(userInfo));

        // Làm sạch URL
        window.history.replaceState({}, document.title, callback);

        // Chuyển hướng đến callback URL hoặc trang home
        navigate(callback, { replace: true });
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication process failed. Please try again.');
      }
    };

    processOAuthLogin();
  }, [dispatch, navigate, callback, searchParams]);

  if (error) {
    return (
      <Result
        status="error"
        title="Authentication Failed"
        subTitle={error}
        extra={[
          <button key="login" onClick={() => navigate('/login')}>
            Back to Login
          </button>,
        ]}
      />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="Processing authentication..." />
    </div>
  );
};

export default OAuthCallback;