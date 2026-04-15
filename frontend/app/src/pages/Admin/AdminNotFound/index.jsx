import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg p-6 shadow-sm border border-gray-100 mt-4">
      <Result
        status="404"
        title={<span className="text-4xl font-bold text-gray-800">404</span>}
        subTitle={<span className="text-gray-500 font-medium text-base mt-2 block">Không tìm thấy chức năng hoặc đường dẫn quản trị này.</span>}
        extra={
          <Link to="/admin">
            <Button type="primary" size="large" className="mt-2">
              Trở về Bảng điều khiển
            </Button>
          </Link>
        }
      />
    </div>
  );
}

export default AdminNotFound;
