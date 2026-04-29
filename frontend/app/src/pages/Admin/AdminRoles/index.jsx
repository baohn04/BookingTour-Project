import React, { useState } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, message, Skeleton, Form } from 'antd';
import { useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAdminRoles } from '../../../hooks/useAdminRoles';
import { createAdminRole, editAdminRole, deleteAdminRole, updatePermissions } from '../../../services/adminRoleServices';
import AddRoleModal from '../../../features/AdminRolesFeature/AddRoleModal';
import EditRoleModal from '../../../features/AdminRolesFeature/EditRoleModal';
import PermissionsModal from '../../../features/AdminRolesFeature/PermissionsModal';

function AdminRoles() {
  const { roles, loading, refetchRoles } = useAdminRoles();
  const permissions = useSelector(state => state.account?.userInfo?.role?.permissions || []);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // --- Handlers ---
  const showCreateModal = () => setIsAddModalVisible(true);

  const showEditModal = (id) => {
    setEditId(id);
    setIsEditModalVisible(true);
  };

  const handleAddCancel = () => {
    createForm.resetFields();
    setIsAddModalVisible(false);
  };

  const handleEditCancel = () => {
    editForm.resetFields();
    setIsEditModalVisible(false);
  };

  const handleCreateOk = async () => {
    try {
      const values = await createForm.validateFields();
      message.loading({ content: 'Đang tạo nhóm quyền...', key: 'createRole' });
      await createAdminRole(values);
      message.success({ content: 'Tạo nhóm quyền thành công!', key: 'createRole', duration: 2 });
      handleAddCancel();
      refetchRoles();
    } catch (error) {
      if (!error.errorFields) {
        message.error({ content: error?.response?.data?.message || 'Có lỗi xảy ra!', key: 'createRole', duration: 2 });
      }
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      message.loading({ content: 'Đang cập nhật...', key: 'editRole' });
      await editAdminRole(editId, values);
      message.success({ content: 'Cập nhật thành công!', key: 'editRole', duration: 2 });
      handleEditCancel();
      refetchRoles();
    } catch (error) {
      if (!error.errorFields) {
        message.error({ content: error?.response?.data?.message || 'Có lỗi xảy ra!', key: 'editRole', duration: 2 });
      }
    }
  };

  const handlePermissionsOk = async () => {
    setPermissionsLoading(true);
    try {
      const table = document.querySelector('[data-permissions-table]');
      const rows = table.querySelectorAll('[data-name]');
      let permissions = [];

      rows.forEach((row) => {
        const name = row.getAttribute("data-name");
        const inputs = row.querySelectorAll("input");
        
        if (name === "id") {
          inputs.forEach((input) => {
            const id = input.value;
            permissions.push({
              id: id,
              permissions: []
            });
          });
        } else {
          inputs.forEach((input, index) => {
            const checked = input.checked;
            if (checked) {
              permissions[index].permissions.push(name);
            }
          });
        }
      });

      if (permissions.length > 0) {
        message.loading({ content: 'Đang cập nhật phân quyền...', key: 'perm' });
        await updatePermissions({ permissions: JSON.stringify(permissions) });
        message.success({ content: 'Phân quyền thành công!', key: 'perm', duration: 2 });
        
        setIsPermissionsModalVisible(false);
        refetchRoles();
      }
    } catch (error) {
      console.error("Permissions error:", error);
      message.error({ content: 'Có lỗi xảy ra khi phân quyền', key: 'perm', duration: 2 });
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      message.loading({ content: 'Đang xóa...', key: 'delRole' });
      await deleteAdminRole(id);
      message.success({ content: 'Đã xóa nhóm quyền!', key: 'delRole', duration: 2 });
      refetchRoles();
    } catch (error) {
      message.error({ content: 'Lỗi khi xóa nhóm quyền', key: 'delRole', duration: 2 });
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      render: (_, __, index) => <span className="text-gray-500 font-medium">{index + 1}</span>,
    },
    {
      title: 'Tên nhóm quyền',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span className="text-gray-500 text-sm whitespace-pre-line">{text || '---'}</span>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={permissions.includes('role-edit') ? "Chỉnh sửa" : "Không có quyền"}>
            <EditOutlined
              className={`text-lg transition-colors ${permissions.includes('role-edit') ? 'text-blue-500 hover:text-blue-600 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={() => permissions.includes('role-edit') && showEditModal(record._id)}
            />
          </Tooltip>
          <Tooltip title={permissions.includes('role-delete') ? "Xóa" : "Không có quyền"}>
            <Popconfirm
              title="Xóa nhóm quyền này?"
              onConfirm={() => handleDelete(record._id)}
              disabled={!permissions.includes('role-delete')}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className={`text-lg transition-colors ${permissions.includes('role-delete') ? 'text-red-500 hover:text-red-600 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-0">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0 flex items-center gap-2 uppercase">
            Quản lý phân quyền
          </h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách vai trò và phân quyền quản trị</p>
        </div>

        <Space size="middle">
          <Tooltip title={!permissions.includes('role-permissions') && "Không có quyền phân quyền"}>
            <Button
              icon={<CheckCircleOutlined />}
              size="large"
              className="rounded-md flex items-center shadow-sm font-medium border-gray-300"
              onClick={() => permissions.includes('role-permissions') && setIsPermissionsModalVisible(true)}
              disabled={!permissions.includes('role-permissions')}
            >
              Phân quyền
            </Button>
          </Tooltip>

          <Tooltip title={!permissions.includes('role-create') && "Không có quyền thêm mới"}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{ backgroundColor: permissions.includes('role-create') ? 'red' : '#d9d9d9' }}
              className="rounded-md flex items-center shadow-sm font-medium bg-primary border-none"
              onClick={permissions.includes('role-create') ? showCreateModal : undefined}
              disabled={!permissions.includes('role-create')}
            >
              Thêm mới
            </Button>
          </Tooltip>
        </Space>
      </div>


      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-base font-semibold text-gray-700 m-0">Danh mục vai trò hiện tại</h2>
        </div>

        <div className="p-0">
          <Skeleton active loading={loading} paragraph={{ rows: 6 }} className="p-6">
            <Table
              columns={columns}
              dataSource={roles}
              rowKey="_id"
              pagination={false}
              className="w-full"
              rowClassName="hover:bg-gray-50/50 transition-colors"
            />
          </Skeleton>
        </div>
      </div>

      {/* Modals */}
      <AddRoleModal
        visible={isAddModalVisible}
        onOk={handleCreateOk}
        onCancel={handleAddCancel}
        form={createForm}
      />

      <EditRoleModal
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        form={editForm}
        roleId={editId}
      />

      <PermissionsModal
        visible={isPermissionsModalVisible}
        onCancel={() => setIsPermissionsModalVisible(false)}
        onOk={handlePermissionsOk}
        roles={roles}
        loading={permissionsLoading}
      />
    </div>
  );
}

export default AdminRoles;