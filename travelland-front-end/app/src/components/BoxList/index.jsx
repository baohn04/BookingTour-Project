import React from 'react';
import { Row, Col, Skeleton } from 'antd';
import BoxItem from './BoxItem';

function BoxList(props) {
  const { tours, loading, toggleFavorite } = props;

  if (loading) {
    return (
      <Row gutter={[24, 32]}>
        {[...Array(8)].map((_, i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <div className="rounded-2xl border border-text2 p-4 h-full">
              <Skeleton.Image active className="!w-full !h-48 mb-4 rounded-xl" />
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  if (!tours || tours.length === 0) {
    return <div className="text-center text-text1 py-10 w-full">Không tìm thấy tour nào.</div>;
  }

  return (
    <Row gutter={[24, 32]}>
      {tours.map((item) => (
        <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
          <div className="h-full">
            <BoxItem
              item={item}
              onFavoriteClick={() => toggleFavorite && toggleFavorite(item.id)}
            />
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default BoxList;
