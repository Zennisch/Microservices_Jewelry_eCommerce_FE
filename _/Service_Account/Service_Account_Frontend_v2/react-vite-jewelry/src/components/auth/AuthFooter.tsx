import React from 'react';
import styles from 'styles/auth.module.scss';

const AuthFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-section"]}>
          <h4>BỘ SƯU TẬP MỚI</h4>
          <p>Nhẫn Cũ Kỹ Tương</p>
          <p>Vòng Cổ Vương</p>
          <p>Lắc Tay Bọc</p>
        </div>
        <div className={styles["footer-section"]}>
          <h4>HỖ TRỢ</h4>
          <p>Giới Thiệu</p>
          <p>Chính Sách Bảo Hành</p>
          <p>Chính Sách Đổi Kiện</p>
        </div>
        <div className={styles["footer-section"]}>
          <h4>CHĂM SÓC KHÁCH HÀNG</h4>
          <p>Thời Gian: 6:30AM - 21:30PM (Hằng Ngày)</p>
          <p>LH KH: +84 999222111</p>
          <p>Email: tinh.tu@edu.vn</p>
        </div>
        <div className={styles["footer-section"]}>
          <h4>LIÊN HỆ VỚI CHÚNG TÔI</h4>
          <div className={styles["social-icons"]}>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className={styles["footer-bottom"]}>
        <p>Copyright © 2020 - Phát Triển Bởi Sinh Viên Đại Học Công Nghiệp TP. HCM</p>
      </div>
    </footer>
  );
};

export default AuthFooter;