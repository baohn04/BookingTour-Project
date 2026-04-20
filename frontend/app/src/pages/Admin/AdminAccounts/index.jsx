import React, { useState } from 'react';
import { Table, Input, Space, Button, Select, Skeleton, Popconfirm, message, Tooltip, Avatar, Tag, Form } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useAdminAccounts } from '../../../hooks/useAdminAccounts';
import AddAccountModal from '../../../features/AdminAccountsFeature/AddAccountModal';
import EditAccountModal from '../../../features/AdminAccountsFeature/EditAccountModal';
import { createAdminAccount, editAdminAccount, deleteAdminAccount, changeAccountStatus } from '../../../services/adminAccountServices';

const { Search } = Input;
const { Option } = Select;

function AdminAccounts() {
  const { accounts, pagination, loading, queryParams, setQueryParams, refetchAccounts } = useAdminAccounts();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const showCreateModal = () => {
    setIsAddModalVisible(true);
  };

  const showEditModal = (id) => {
    setEditId(id);
    setIsEditModalVisible(true);
  };

  const handleAddModalCancel = () => {
    createForm.resetFields();
    setIsAddModalVisible(false);
  };

  const handleEditModalCancel = () => {
    editForm.resetFields();
    setIsEditModalVisible(false);
  };

  const handleCreateOk = async () => {
    try {
      const values = await createForm.validateFields();
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'avatar') {
          if (values[key] && values[key].length > 0 && values[key][0].originFileObj) {
            formData.append('avatar', values[key][0].originFileObj);
          }
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      message.loading({ content: 'Đang tạo tài khoản...', key: 'createAccount' });
      await createAdminAccount(formData);
      message.success({ content: 'Tạo tài khoản mới thành công!', key: 'createAccount', duration: 2 });

      handleAddModalCancel();
      refetchAccounts();
    } catch (error) {
      if (!error.errorFields) { // Not a validation error
        message.error({ content: error?.response?.data?.message || 'Có lỗi xảy ra!', key: 'createAccount', duration: 2 });
      }
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'avatar') {
          if (values[key] && values[key].length > 0 && values[key][0].originFileObj) {
            formData.append('avatar', values[key][0].originFileObj);
          }
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      message.loading({ content: 'Đang cập nhật tài khoản...', key: 'editAccount' });
      await editAdminAccount(editId, formData);
      message.success({ content: 'Cập nhật tài khoản thành công!', key: 'editAccount', duration: 2 });

      handleEditModalCancel();
      refetchAccounts();
    } catch (error) {
      if (!error.errorFields) {
        message.error({ content: error?.response?.data?.message || 'Có lỗi xảy ra!', key: 'editAccount', duration: 2 });
      }
    }
  };

  const handleChangeStatus = async (newStatus, id) => {
    try {
      message.loading({ content: 'Đang cập nhật trạng thái...', key: 'updateStatus' });
      await changeAccountStatus(newStatus, id);
      message.success({ content: 'Cập nhật trạng thái thành công!', key: 'updateStatus', duration: 2 });
      refetchAccounts();
    } catch (error) {
      message.error({ content: 'Lỗi khi cập nhật trạng thái', key: 'updateStatus', duration: 2 });
    }
  };

  const handleDelete = async (id) => {
    try {
      message.loading({ content: 'Đang xóa tài khoản...', key: 'delAcc' });
      await deleteAdminAccount(id);
      message.success({ content: 'Đã xóa tài khoản thành công!', key: 'delAcc', duration: 2 });
      refetchAccounts();
    } catch (error) {
      message.error({ content: 'Lỗi hệ thống khi xóa tài khoản', key: 'delAcc', duration: 2 });
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      key: 'fullName',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} className="border border-gray-100" />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm">{record.fullName}</span>
            <span className="text-gray-500 text-xs">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Phân quyền',
      key: 'role',
      render: (_, record) => (
        <span className="font-medium text-gray-600">{record.role?.title || 'Chưa phân quyền'}</span>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <span className="text-gray-600">{text || '---'}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status, record) => {
        let color = status === 'active' ? 'success' : 'error';
        const toggleStatus = status === 'active' ? 'inactive' : 'active';

        return (
          <Tooltip title="Nhấn để đổi trạng thái">
            <Tag
              color={color}
              className="rounded-full px-3 py-1 border-none font-medium cursor-pointer hover:opacity-80 hover:shadow-sm transition-all"
              onClick={() => handleChangeStatus(toggleStatus, record._id)}
            >
              {status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="large">
          <Tooltip title="Chi tiết/Sửa">
            <EditOutlined
              className="text-blue-500 text-lg hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => showEditModal(record._id)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa tài khoản này?"
              description="Thao tác này không thể hoàn tác!"
              onConfirm={() => handleDelete(record._id)}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className="text-red-500 text-lg hover:text-red-600 transition-colors cursor-pointer" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0" style={{ color: 'var(--color-text1)' }}>
            QUẢN LÝ TÀI KHOẢN
          </h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách tài khoản quản trị hệ thống</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: 'red' }}
          size="large"
          className="flex items-center rounded-md"
          onClick={showCreateModal}
        >
          Thêm mới
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-800 m-0" style={{ color: 'var(--color-text1)' }}>
            Danh sách Quản trị viên
          </h2>
          <Space>
            <Search
              placeholder="Tìm kiếm theo tên / email..."
              style={{ width: 280 }}
              allowClear
              onSearch={(val) => setQueryParams(prev => ({ ...prev, keyword: val, page: 1 }))}
            />
            <Select
              value={queryParams.status}
              style={{ width: 150 }}
              onChange={(val) => setQueryParams(prev => ({ ...prev, status: val, page: 1 }))}
            >
              <Option value="">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Dừng hoạt động</Option>
            </Select>
          </Space>
        </div>

        {/* The Table */}
        <div className="p-0">
          <Skeleton active loading={loading} paragraph={{ rows: 8 }} className="p-6">
            <Table
              columns={columns}
              dataSource={accounts}
              rowKey="_id"
              loading={false}
              pagination={{
                current: pagination?.currentPage || 1,
                pageSize: pagination?.limitItems || 5,
                total: pagination?.totalItems || accounts.length,
                showSizeChanger: false,
                onChange: (page) => setQueryParams(prev => ({ ...prev, page }))
              }}
              className="w-full"
              rowClassName="hover:bg-gray-50/50 transition-colors"
            />
          </Skeleton>
        </div>
      </div>

      <AddAccountModal
        visible={isAddModalVisible}
        onOk={handleCreateOk}
        onCancel={handleAddModalCancel}
        form={createForm}
      />

      <EditAccountModal
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditModalCancel}
        form={editForm}
        accountId={editId}
      />
    </div>
  );
}

export default AdminAccounts;