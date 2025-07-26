import { useState } from "react";
import { forgotPassword } from "../../config/api";
import { useNavigate } from "react-router-dom";
import styles from 'styles/auth.module.scss';
import { Button, Form, Input, message, notification } from 'antd';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';

// Đường dẫn hình ảnh (giống LoginPage)
const image1 = '/public/Rectangle 2.png'; // Hình ảnh lớn
const image2 = '/public/Rectangle 3.png'; // Hình ảnh nhỏ 1
const image3 = '/public/Rectangle 4.png'; // Hình ảnh nhỏ 2

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: { email: string }) => {
        const { email } = values;
        setIsSubmit(true);
        try {
            const response = await forgotPassword(email);
            message.success(response.data.message);
            // Chuyển hướng sau khi gửi thành công (tùy thuộc vào logic của bạn)
            // navigate('/reset-password');
        } catch (error: any) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: error.response?.data?.message || "Có lỗi xảy ra!",
                duration: 5,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className={styles["forgot-password-page"]}>
            <AuthHeader />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles["split-container"]}>
                        {/* Phần bên trái: Bộ sưu tập hình ảnh (giống LoginPage) */}
                        <div className={styles["image-section"]}>
                            <div className={styles["image-collage"]}>
                                <img src={image1} alt="Jewelry 1" className={styles["main-image"]} />
                                <div className={styles["sub-images"]}>
                                    <img src={image2} alt="Jewelry 2" className={styles["sub-image"]} />
                                    <img src={image3} alt="Jewelry 3" className={styles["sub-image"]} />
                                </div>
                            </div>
                        </div>

                        {/* Phần bên phải: Biểu mẫu quên mật khẩu */}
                        <section className={styles["form-section"]}>
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>
                                    Quên Mật Khẩu
                                </h2>
                            </div>
                            <Form
                                name="forgot-password"
                                onFinish={onFinish}
                                autoComplete="off"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                                >
                                    <Input placeholder="Nhập email của bạn" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        loading={isSubmit}
                                        className={styles["login-button"]}
                                    >
                                        Gửi mã xác nhận
                                    </Button>
                                </Form.Item>
                            </Form>
                        </section>
                    </div>
                </div>
            </main>
            <AuthFooter />
        </div>
    );
};

export default ForgotPassword;