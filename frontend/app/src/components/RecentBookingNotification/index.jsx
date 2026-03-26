import React from "react";
import { notification } from "antd";
import { useRecentBookingNotification } from "../../hooks/useRecentBookingNotification";

const RecentBookingNotification = () => {
  const [api, contextHolder] = notification.useNotification();
  
  useRecentBookingNotification(api);

  return <>{contextHolder}</>;
};

export default RecentBookingNotification;