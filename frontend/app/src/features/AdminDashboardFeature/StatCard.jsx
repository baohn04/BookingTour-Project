import React from 'react';
import { Card, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

function StatCard(props) {
  const { title, value, percentage, isUp, icon, iconBg, iconColor, loading } = props;

  return (
    <Card variant="borderless" className="shadow-sm rounded-xl bg-white border border-gray-100">
      <Skeleton active loading={loading} paragraph={{ rows: 1 }} title={{ width: '60%' }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm mb-2 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{value}</h3>
            <p className={`text-xs ${isUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 font-medium`}>
              {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{percentage}% so với tháng trước</span>
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            {icon}
          </div>
        </div>
      </Skeleton>
    </Card>
  )
}

export default StatCard;
