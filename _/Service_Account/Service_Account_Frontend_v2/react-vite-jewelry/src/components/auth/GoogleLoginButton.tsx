import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getGoogleLoginUrl } from '@/config/api';
import styles from 'styles/auth.module.scss';

interface GoogleLoginButtonProps {
  className?: string;
}

const GoogleLoginButton = ({ className }: GoogleLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Chuyển hướng trực tiếp đến endpoint backend
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google-redirect`;
    } catch (error) {
      console.error('Error redirecting to Google login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className={`${styles["google-btn"]} ${className}`} 
      onClick={handleGoogleLogin}
      loading={isLoading}
    >
      <GoogleOutlined className={styles["social-icon"]} />
      Google
    </Button>
  );
};

export default GoogleLoginButton;