import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchRole, callUpdateUser } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IRoleSelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [roles, setRoles] = useState<IRoleSelect[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.role) {
                setRoles([{
                    label: dataInit.role?.name,
                    value: dataInit.role?.id,
                    key: dataInit.role?.id,
                }])
            }
            form.setFieldsValue({
                ...dataInit,
                role: { label: dataInit.role?.name, value: dataInit.role?.id },
            })
        }
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role } = valuesForm;
        if (dataInit?.id) {
            const user = {
                id: dataInit.id,
                name,
                email,
                password,
                age,
                gender,
                address,
                role: { id: role.value, name: "" }
            }
            const res = await callUpdateUser(user);
            if (res.data) {
                message.success("Cập nhật user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const user = {
                name,
                email,
                password,
                age,
                gender,
                address,
                role: { id: role.value, name: "" }
            }
            const res = await callCreateUser(user);
            if (res.data) {
                message.success("Thêm mới user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setRoles([]);
        setOpenModal(false);
    }

    async function fetchRoleList(name: string): Promise<IRoleSelect[]> {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            return list.map(item => ({
                label: item.name as string,
                value: item.id as string
            }));
        }
        return [];
    }

    return (
        <ModalForm
            title={<>{dataInit?.id ? "Cập nhật User" : "Tạo mới User"}</>}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 900,
                keyboard: false,
                maskClosable: false,
                okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                cancelText: "Hủy"
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitUser}
            initialValues={dataInit?.id ? {
                ...dataInit,
                role: { label: dataInit.role?.name, value: dataInit.role?.id },
            } : {}}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng không bỏ trống' },
                            { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                        ]}
                        placeholder="Nhập email"
                    />
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText.Password
                        disabled={!!dataInit?.id}
                        label="Password"
                        name="password"
                        rules={[{ required: !dataInit?.id, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập password"
                    />
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <ProFormText
                        label="Tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập tên hiển thị"
                    />
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <ProFormDigit
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập tuổi"
                    />
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <ProFormSelect
                        name="gender"
                        label="Giới Tính"
                        valueEnum={{ MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' }}
                        placeholder="Chọn giới tính"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    />
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <ProForm.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                        <DebounceSelect
                            allowClear
                            showSearch
                            defaultValue={roles}
                            value={roles}
                            placeholder="Chọn vai trò"
                            fetchOptions={fetchRoleList}
                            onChange={(newValue: any) => setRoles(newValue as IRoleSelect[])}
                            style={{ width: '100%' }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
}

export default ModalUser;
