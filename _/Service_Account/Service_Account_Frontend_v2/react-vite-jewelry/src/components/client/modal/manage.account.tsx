import { Modal, Tabs, Form, Input, Button, message, Avatar, Card, Row, Col, Typography } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, changeUserPassword } from "@/config/api";
import OccasionManager from "./manage.occasions";
import { UserOutlined, LockOutlined, EditOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserUpdateInfo = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getUserProfile();
            if (res) {
                form.setFieldsValue(res.data);
                setUserData(res.data);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (values: any) => {
        setLoading(true);
        const res = await updateUserProfile(values);
        setLoading(false);
        if (res) {
            message.success("Cập nhật thông tin thành công");
            setUserData({...userData, ...values});
        }
    };

    return (
        <Card bordered={false} className="profile-card">
            <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Avatar 
                        size={100} 
                        icon={<UserOutlined />} 
                        src={userData?.avatar}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    <Title level={4} style={{ marginTop: 16, marginBottom: 0 }}>
                        {userData?.name || 'Người dùng'}
                    </Title>
                    <Text type="secondary">{userData?.email}</Text>
                </Col>
                <Col xs={24} md={16}>
                    <Form 
                        form={form} 
                        onFinish={handleUpdate} 
                        layout="vertical"
                        style={{ maxWidth: '100%' }}
                    >
                        <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                            <Input prefix={<UserOutlined />} placeholder="Nhập tên của bạn" />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address">
                            <Input placeholder="Nhập địa chỉ của bạn" />
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                icon={<EditOutlined />}
                                style={{ width: '100%' }}
                            >
                                Cập nhật thông tin
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Card>
    );
};

const UserChangePassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (values: any) => {
        setLoading(true);
        const res = await changeUserPassword(values);
        setLoading(false);
        if (res) {
            message.success("Đổi mật khẩu thành công");
            form.resetFields();
        }
    };

    return (
        <Card bordered={false} className="password-card">
            <Title level={4} style={{ marginBottom: 24 }}>
                <LockOutlined style={{ marginRight: 8 }} />
                Thay đổi mật khẩu
            </Title>
            <Form 
                form={form} 
                onFinish={handleChangePassword} 
                layout="vertical"
                style={{ maxWidth: 400, margin: '0 auto' }}
            >
                <Form.Item 
                    label="Mật khẩu cũ" 
                    name="oldPassword" 
                    rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                </Form.Item>
                <Form.Item 
                    label="Mật khẩu mới" 
                    name="newPassword" 
                    rules={[
                        { required: true, message: "Nhập mật khẩu mới" },
                        { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
                <Form.Item 
                    label="Xác nhận mật khẩu" 
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: "Xác nhận mật khẩu mới" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu mới" />
                </Form.Item>
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={<LockOutlined />}
                        style={{ width: '100%' }}
                    >
                        Cập nhật mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

const ManageAccount = ({ open, onClose }: IProps) => {
    const items: TabsProps['items'] = [
        {
            key: 'user-update-info',
            label: (
                <span>
                    <UserOutlined />
                    Thông tin cá nhân
                </span>
            ),
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: (
                <span>
                    <LockOutlined />
                    Đổi mật khẩu
                </span>
            ),
            children: <UserChangePassword />,
        },
        {
            key: 'user-occasions',
            label: (
                <span>
                    <GiftOutlined />
                    Dịp đặc biệt
                </span>
            ),
            children: <OccasionManager />,
        },
    ];

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Quản lý tài khoản</Title>}
            open={open}
            onCancel={() => onClose(false)}
            maskClosable={false}
            footer={null}
            destroyOnClose={true}
            width={isMobile ? "100%" : "800px"}
            bodyStyle={{ padding: '16px 0' }}
            style={{ top: 20 }}
        >
            <Tabs 
                defaultActiveKey="user-update-info" 
                items={items} 
                tabBarStyle={{ marginBottom: 24, paddingLeft: 24, paddingRight: 24 }}
                style={{ height: '70vh', overflowY: 'auto' }}
            />
        </Modal>
    );
};

export default ManageAccount;
