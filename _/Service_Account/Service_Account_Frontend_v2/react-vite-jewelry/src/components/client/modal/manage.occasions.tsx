import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Switch, Space, Popconfirm, message, Tabs, Card, Badge, Tooltip, Tag, Typography, Row, Col, Empty, Skeleton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, CalendarOutlined, HeartOutlined, NotificationOutlined, ClockCircleOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { getUserOccasionReminders, getUpcomingOccasions, createOccasionReminder, updateOccasionReminder, deleteOccasionReminder } from '@/config/api';
import { IOccasionReminder, IUpcomingOccasion } from '@/types/backend';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const { Title, Text, Paragraph } = Typography;

dayjs.extend(relativeTime);

const OccasionManager = () => {
  const [occasions, setOccasions] = useState<IOccasionReminder[]>([]);
  const [upcomingOccasions, setUpcomingOccasions] = useState<IUpcomingOccasion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<IOccasionReminder | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchOccasions = async () => {
    setLoading(true);
    try {
      const query = `page=${pagination.current - 1}&size=${pagination.pageSize}&sort=occasionDate,asc`;
      console.log('Fetching occasions with query:', query);
      const res = await getUserOccasionReminders(query);
      console.log('Occasions response:', res);
      
      if (res && res.data) {
        // API trả về cấu trúc có thuộc tính content chứa mảng dữ liệu
        if (res.data.content && Array.isArray(res.data.content)) {
          setOccasions(res.data.content);
          setPagination({
            ...pagination,
            total: res.data.totalElements || res.data.content.length
          });
        } 
        // Trường hợp khác - nếu data là mảng trực tiếp
        else if (Array.isArray(res.data)) {
          setOccasions(res.data);
          setPagination({
            ...pagination,
            total: res.data.length
          });
        }
        // Trường hợp data là object có thuộc tính data hoặc result
        else if (res.data.data && Array.isArray(res.data.data)) {
          setOccasions(res.data.data);
          setPagination({
            ...pagination,
            total: res.data.meta?.total || res.data.data.length
          });
        }
        else if (res.data.result && Array.isArray(res.data.result)) {
          setOccasions(res.data.result);
          setPagination({
            ...pagination,
            total: res.data.meta?.total || res.data.result.length
          });
        }
        else {
          console.log('Unexpected data structure:', res.data);
          setOccasions([]);
        }
      } else {
        console.log('No data in response');
        setOccasions([]);
      }
    } catch (error) {
      console.error('Error fetching occasions:', error);
      message.error('Không thể tải danh sách dịp đặc biệt');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingOccasions = async () => {
    try {
      const res = await getUpcomingOccasions();
      if (res && res.data) {
        setUpcomingOccasions(res.data || []);
      }
    } catch (error) {
      console.error('Error fetching upcoming occasions:', error);
    }
  };

  useEffect(() => {
    fetchOccasions();
    fetchUpcomingOccasions();
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,
      current: pagination.current
    });
  };

  const showModal = (record?: IOccasionReminder) => {
    setEditingOccasion(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        occasionDate: dayjs(record.occasionDate)
      });
    } else {
      form.resetFields();
      // Đặt giá trị mặc định
      form.setFieldsValue({
        yearlyRecurring: true,
        reminderDaysBefore: 7
      });
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        occasionDate: values.occasionDate.format('YYYY-MM-DD')
      };

      setLoading(true);
      if (editingOccasion?.id) {
        await updateOccasionReminder(editingOccasion.id, formattedValues);
        message.success('Cập nhật dịp đặc biệt thành công');
      } else {
        await createOccasionReminder(formattedValues);
        message.success('Tạo dịp đặc biệt thành công');
      }
      setModalVisible(false);
      fetchOccasions();
      fetchUpcomingOccasions();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi lưu dịp đặc biệt');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteOccasionReminder(id);
      message.success('Xóa dịp đặc biệt thành công');
      fetchOccasions();
      fetchUpcomingOccasions();
    } catch (error) {
      console.error('Error deleting occasion:', error);
      message.error('Có lỗi xảy ra khi xóa dịp đặc biệt');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên dịp',
      dataIndex: 'occasionName',
      key: 'occasionName',
      render: (text: string) => (
        <Space>
          <GiftOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Người nhận',
      dataIndex: 'recipientName',
      key: 'recipientName',
      render: (text: string, record: IOccasionReminder) => (
        <Space direction="vertical" size={0}>
          <Text>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.relationship}</Text>
        </Space>
      )
    },
    {
      title: 'Ngày',
      dataIndex: 'occasionDate',
      key: 'occasionDate',
      render: (text: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#52c41a' }} />
          <Text>{dayjs(text).format('DD/MM/YYYY')}</Text>
        </Space>
      )
    },
    {
      title: 'Nhắc nhở',
      key: 'reminder',
      render: (_: any, record: IOccasionReminder) => (
        <Space direction="vertical" size={0}>
          <Space>
            <ClockCircleOutlined />
            <Text>{record.reminderDaysBefore} ngày trước</Text>
          </Space>
          <Tag color={record.reminderSent ? 'success' : 'default'} style={{ marginTop: 4 }}>
            {record.reminderSent ? 'Đã gửi' : 'Chưa gửi'}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Lặp lại',
      dataIndex: 'yearlyRecurring',
      key: 'yearlyRecurring',
      render: (recurring: boolean) => (
        <Tag color={recurring ? 'blue' : 'default'}>
          {recurring ? 'Hàng năm' : 'Một lần'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IOccasionReminder) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa dịp này?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getOccasionCardColor = (daysUntil: number) => {
    if (daysUntil <= 3) return '#ff4d4f';
    if (daysUntil <= 7) return '#faad14';
    return '#52c41a';
  };

  const UpcomingOccasionsView = () => {
    if (loading) {
      return (
        <div style={{ padding: '0 24px' }}>
          <Skeleton active />
          <Skeleton active />
        </div>
      );
    }

    return (
      <div style={{ padding: '0 24px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {upcomingOccasions.length === 0 ? (
            <Col span={24}>
              <Empty 
                description="Không có dịp đặc biệt nào sắp tới" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Col>
          ) : (
            upcomingOccasions.map(occasion => (
              <Col xs={24} sm={12} md={8} key={occasion.id}>
                <Card 
                  hoverable
                  style={{ 
                    borderLeft: `4px solid ${getOccasionCardColor(occasion.daysUntil)}`,
                    height: '100%'
                  }}
                  actions={[
                    <Tooltip title="Chỉnh sửa">
                      <EditOutlined key="edit" onClick={() => {
                        const fullOccasion = occasions.find(o => o.id === occasion.id);
                        if (fullOccasion) {
                          showModal(fullOccasion);
                        }
                      }} />
                    </Tooltip>,
                    <Tooltip title="Xóa">
                      <Popconfirm
                        title="Bạn có chắc muốn xóa dịp này?"
                        onConfirm={() => handleDelete(occasion.id!)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <DeleteOutlined key="delete" />
                      </Popconfirm>
                    </Tooltip>
                  ]}
                >
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge 
                      count={occasion.daysUntil} 
                      style={{ 
                        backgroundColor: getOccasionCardColor(occasion.daysUntil),
                        fontSize: '12px'
                      }}
                      overflowCount={99}
                    />
                  </div>
                  
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Space>
                      <GiftOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                      <Title level={5} style={{ margin: 0 }}>{occasion.occasionName}</Title>
                    </Space>
                    
                    <Space>
                      <UserOutlined />
                      <Text>{occasion.recipientName}</Text>
                      <Tag color="blue">{occasion.relationship}</Tag>
                    </Space>
                    
                    <Space>
                      <CalendarOutlined />
                      <Text>{dayjs(occasion.occasionDate).format('DD/MM/YYYY')}</Text>
                    </Space>
                    
                    <Space>
                      <ClockCircleOutlined />
                      <Text>Còn {occasion.daysUntil} ngày</Text>
                    </Space>
                    
                    {occasion.giftPreferences && (
                      <Space align="start">
                        <HeartOutlined style={{ color: '#ff4d4f' }} />
                        <Text type="secondary" style={{ flex: 1 }}>
                          {occasion.giftPreferences}
                        </Text>
                      </Space>
                    )}
                    
                    {occasion.reminderSent && (
                      <Tag color="success" icon={<NotificationOutlined />}>
                        Đã gửi nhắc nhở
                      </Tag>
                    )}
                  </Space>
                </Card>
              </Col>
            ))
          )}
        </Row>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            Thêm dịp đặc biệt mới
          </Button>
        </div>
      </div>
    );
  };

  const AllOccasionsView = () => (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Tất cả dịp đặc biệt</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
        >
          Thêm dịp đặc biệt
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={occasions} 
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        size="middle"
        bordered
        style={{ marginBottom: 16 }}
      />
    </div>
  );

  const items = [
    {
      key: 'upcoming',
      label: (
        <span>
          <CalendarOutlined />
          Sắp tới
        </span>
      ),
      children: <UpcomingOccasionsView />
    },
    {
      key: 'all',
      label: (
        <span>
          <GiftOutlined />
          Tất cả dịp đặc biệt
        </span>
      ),
      children: <AllOccasionsView />
    }
  ];

  return (
    <div>
      <Tabs defaultActiveKey="upcoming" items={items} />
      
      <Modal
        title={
          <Space>
            {editingOccasion ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingOccasion ? "Cập nhật dịp đặc biệt" : "Thêm dịp đặc biệt mới"}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            yearlyRecurring: true,
            reminderDaysBefore: 7
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="occasionName"
                label="Tên dịp"
                rules={[{ required: true, message: 'Vui lòng nhập tên dịp' }]}
              >
                <Input prefix={<GiftOutlined />} placeholder="Ví dụ: Sinh nhật, Kỷ niệm..." />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="recipientName"
                label="Người nhận"
                rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên người nhận quà/chúc mừng" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="relationship"
                label="Mối quan hệ"
                rules={[{ required: true, message: 'Vui lòng nhập mối quan hệ' }]}
              >
                <Input prefix={<TeamOutlined />} placeholder="Ví dụ: Bạn bè, Gia đình..." />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="occasionDate"
                label="Ngày diễn ra"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="reminderDaysBefore"
                label="Nhắc trước (ngày)"
                rules={[{ required: true, message: 'Vui lòng nhập số ngày nhắc trước' }]}
                tooltip="Hệ thống sẽ gửi email nhắc nhở trước ngày diễn ra theo số ngày này"
              >
                <InputNumber min={1} max={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="yearlyRecurring"
                label="Lặp lại hàng năm"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="giftPreferences"
                label="Quà yêu thích"
              >
                <Input.TextArea 
                  placeholder="Gợi ý quà tặng..." 
                  rows={2}
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Ghi chú"
              >
                <Input.TextArea 
                  placeholder="Ghi chú thêm..." 
                  rows={2}
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingOccasion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OccasionManager;