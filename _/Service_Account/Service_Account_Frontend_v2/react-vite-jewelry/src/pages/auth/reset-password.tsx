import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../config/api";
import styles from 'styles/auth.module.scss';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

// Placeholder images (thay thế bằng URL hình ảnh thực tế)
const image1 = '/public/Rectangle 2.png'; // Thay thế bằng hình ảnh thực tế
const image2 = '/public/Rectangle 3.png'; // Thay thế bằng hình ảnh thực tế
const image3 = '/public/Rectangle 4.png'; // Thay thế bằng hình ảnh thực tế

const ResetPassword = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        if (!token) {
            message.error("Token không hợp lệ!");
            return;
        }

        setIsSubmit(true);
        try {
            const response = await resetPassword(token, values.password);
            message.success(response.data.message || "Mật khẩu đã được đặt lại thành công!");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu!");
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className={styles["login-page"]}>
            <AuthHeader />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles["split-container"]}>
                        {/* Phần bên trái: Bộ sưu tập hình ảnh */}
                        <div className={styles["image-section"]}>
                            <div className={styles["image-collage"]}>
                                <img src={image1} alt="Jewelry 1" className={styles["main-image"]} />
                                <div className={styles["sub-images"]}>
                                    <img src={image2} alt="Jewelry 2" className={styles["sub-image"]} />
                                    <img src={image3} alt="Jewelry 3" className={styles["sub-image"]} />
                                </div>
                            </div>
                        </div>

                        {/* Phần bên phải: Biểu mẫu đặt lại mật khẩu */}
                        <section className={styles["form-section"]}>
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>Đặt Lại Mật Khẩu</h2>
                                <p className={styles["welcome-text"]}>Vui lòng nhập mật khẩu mới của bạn</p>
                            </div>
                            <Form
                                name="reset_password"
                                onFinish={onFinish}
                                autoComplete="off"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mật Khẩu Mới"
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                    ]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className={styles["input-icon"]} />} 
                                        placeholder="Nhập mật khẩu mới" 
                                    />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Xác Nhận Mật Khẩu"
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className={styles["input-icon"]} />} 
                                        placeholder="Xác nhận mật khẩu mới" 
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        loading={isSubmit}
                                        className={styles["login-button"]}
                                    >
                                        Xác Nhận
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

export default ResetPassword;
