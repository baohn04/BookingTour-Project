import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/adminDashboardServices';

export const useAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: { value: 0, percentage: 0, isUp: true },
    totalBookings: { value: 0, percentage: 0, isUp: true },
    activeTours: { value: 0, percentage: 0, isUp: true },
    totalUsers: { value: 0, percentage: 0, isUp: true }
  });
  const [chartData, setChartData] = useState({
    weeklyRevenue: [],
    weeklyBookings: []
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData();
        
        if (result && result.statistics) {
          setStats({
            totalRevenue: {
              value: result.statistics.revenue?.value || 0,
              percentage: result.statistics.revenue?.percentage || 0,
              isUp: result.statistics.revenue?.isUp ?? true
            },
            totalBookings: {
              value: result.statistics.bookings?.value || 0,
              percentage: result.statistics.bookings?.percentage || 0,
              isUp: result.statistics.bookings?.isUp ?? true
            },
            activeTours: {
              value: result.statistics.tours?.value || 0,
              percentage: result.statistics.tours?.percentage || 0,
              isUp: result.statistics.tours?.isUp ?? true
            },
            totalUsers: {
              value: result.statistics.users?.value || 0,
              percentage: result.statistics.users?.percentage || 0,
              isUp: result.statistics.users?.isUp ?? true
            }
          });
        }
        
        if (result && result.chartData) {
          setChartData({
            weeklyRevenue: result.chartData.weeklyRevenue || [],
            weeklyBookings: result.chartData.weeklyBookings || []
          });
        }

        if (result && result.recentOrders) {
          setRecentBookings(result.recentOrders.map((order, index) => ({
            ...order,
            key: order._id || index.toString()
          })));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  return { loading, stats, chartData, recentBookings };
};
