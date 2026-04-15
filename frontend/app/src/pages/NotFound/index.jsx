import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background">
      <Result
        status="404"
        title={<span className="text-5xl font-black text-primary">404</span>}
        subTitle={<span className="text-text1 font-medium text-lg mt-2 block">Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</span>}
        extra={
          <Link to="/">
            <Button
              type="primary"
              size="large"
              className="!h-12 !px-8 !rounded-full !bg-primary hover:!bg-primary-hover text-text2 !text-base !font-bold !border-none !shadow-lg hover:!shadow-primary/30 mt-4"
            >
              Về Trang Chủ
            </Button>
          </Link>
        }
      />
    </div>
  );
}

export default NotFound;
