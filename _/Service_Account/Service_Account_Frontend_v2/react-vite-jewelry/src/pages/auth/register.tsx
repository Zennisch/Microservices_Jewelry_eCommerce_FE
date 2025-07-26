import { Button, Divider, Form, Input, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';

// Đường dẫn hình ảnh (sử dụng /assets/ thay vì /public/)
const image1 = '/public/Rectangle 2.png'; // Hình ảnh lớn
const image2 = '/public/Rectangle 3.png'; // Hình ảnh nhỏ 1
const image3 = '/public/Rectangle 4.png'; // Hình ảnh nhỏ 2

const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
    };

    return (
        <div className={styles["register-page"]}>
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

                        {/* Phần bên phải: Biểu mẫu đăng ký */}
                        <section className={styles["form-section"]}>
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>
                                    Đăng Ký Tài Khoản
                                </h2>
                            </div>
                            <Form<IUser>
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Họ tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                >
                                    <Input placeholder="Họ tên" />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input type="email" placeholder="Email" />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password placeholder="Mật khẩu" />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tuổi"
                                    name="age"
                                    rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                                >
                                    <Input type="number" placeholder="Tuổi" />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    name="gender"
                                    label="Giới tính"
                                    rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                                >
                                    <Select placeholder="Chọn giới tính" allowClear>
                                        <Option value="MALE">Nam</Option>
                                        <Option value="FEMALE">Nữ</Option>
                                        <Option value="OTHER">Khác</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                                >
                                    <Input placeholder="Địa chỉ" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        loading={isSubmit}
                                        className={styles["login-button"]}
                                    >
                                        Đăng ký
                                    </Button>
                                </Form.Item>

                                <Divider>Hoặc</Divider>
                                <p className={styles["register-link"]}>
                                    Đã có tài khoản? <Link to="/login">Đăng Nhập</Link>
                                </p>
                            </Form>
                        </section>
                    </div>
                </div>
            </main>
            <AuthFooter />
        </div>
    );
};

export default RegisterPage;