import React from 'react';
import styles from 'styles/auth.module.scss';

const AuthHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <img src="/public/logo.png" alt="Tinh Tử Logo" className={styles.logo} />
    </header>
  );
};

export default AuthHeader;