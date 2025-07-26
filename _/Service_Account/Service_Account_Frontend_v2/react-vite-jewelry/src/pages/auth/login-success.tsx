import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { Spin, Result } from 'antd';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const processLogin = () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const role = searchParams.get('role');
        
        if (token) {
          // Store token in localStorage
          localStorage.setItem('access_token', token);
          
          // Store user info
          const userInfo = {
            id: userId,
            email: email,
            name: name,
            role: role || 'NORMAL_USER'
          };
          
          // Dispatch user info to Redux store
          dispatch(setUserLoginInfo(userInfo));
          
          // Clean up URL and redirect to home
          navigate('/', { replace: true });
        } else {
          setError('No authentication token received');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Login success processing error:', err);
        setError('Authentication process failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processLogin();
  }, [dispatch, navigate, searchParams]);

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

export default LoginSuccess;