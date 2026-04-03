import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Order from "../../models/order.model";
import Admin from "../../models/admin.model";

// [GET] /admin/dashboard
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    // --- Tính toán thời gian ---
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Tính % tăng trưởng
    const calculatePercentage = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(1));
    };

    // 1. Thống kê TOURS
    const activeToursCurrent = await Tour.countDocuments({ deleted: false, status: "active", createdAt: { $gte: startOfCurrentMonth } });
    const activeToursLastMonth = await Tour.countDocuments({ deleted: false, status: "active", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } });
    const toursTotal = await Tour.countDocuments({ deleted: false, status: "active" }); // Tổng số tour hiện có

    // 2. Thống kê ORDERS (Bookings & Revenue)
    const currentOrders = await Order.find({ deleted: false, status: "confirmed", createdAt: { $gte: startOfCurrentMonth } });
    const lastMonthOrders = await Order.find({ deleted: false, status: "confirmed", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } });

    const revenueCurrent = currentOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const revenueLastMonth = lastMonthOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

    const bookingsCurrent = currentOrders.length;
    const bookingsLastMonth = lastMonthOrders.length;

    // 3. Thống kê USERS (Admin accounts)
    const usersCurrent = await Admin.countDocuments({ deleted: false, createdAt: { $gte: startOfCurrentMonth } });
    const usersLastMonth = await Admin.countDocuments({ deleted: false, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } });
    const usersTotal = await Admin.countDocuments({ deleted: false });

    // Lấy 5 đơn hàng mới nhất
    const recentOrders = await Order.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(5).select("-__v -deletedAt -createdAt -updatedAt");

    // --- CHART DATA AGGREGATION ---
    // Weekly Bookings & Revenue (Current Week, Monday - Sunday)
    // Get start of current week (Monday)
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const startOfWeek = new Date(now.setDate(diffToMonday));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyRevenueRaw = await Order.aggregate([
      {
        $match: {
          deleted: false,
          status: { $in: ["success", "confirmed"] },
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" } },
          totalRevenue: { $sum: { $toDouble: "$totalAmount" } }
        }
      }
    ]);

    const weeklyBookingsRaw = await Order.aggregate([
      {
        $match: {
          deleted: false,
          status: { $in: ["success", "confirmed"] },
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" } },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    // Map MongoDB $dayOfWeek to frontend Mon-Sun
    // MongoDB: 1:Sun, 2:Mon, 3:Tue, 4:Wed, 5:Thu, 6:Fri, 7:Sat
    const days = [
      { day: 'Mon', id: 2 },
      { day: 'Tue', id: 3 },
      { day: 'Wed', id: 4 },
      { day: 'Thu', id: 5 },
      { day: 'Fri', id: 6 },
      { day: 'Sat', id: 7 },
      { day: 'Sun', id: 1 }
    ];

    const weeklyRevenue = days.map(d => {
      const found = weeklyRevenueRaw.find(item => item._id === d.id);
      return { day: d.day, value: found ? found.totalRevenue : 0 };
    });

    const weeklyBookings = days.map(d => {
      const found = weeklyBookingsRaw.find(item => item._id === d.id);
      return { day: d.day, value: found ? found.totalBookings : 0 };
    });

    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      statistics: {
        revenue: {
          value: revenueCurrent,
          percentage: calculatePercentage(revenueCurrent, revenueLastMonth),
          isUp: revenueCurrent >= revenueLastMonth
        },
        bookings: {
          value: bookingsCurrent,
          percentage: calculatePercentage(bookingsCurrent, bookingsLastMonth),
          isUp: bookingsCurrent >= bookingsLastMonth
        },
        tours: {
          value: toursTotal,
          activeInMonth: activeToursCurrent,
          percentage: calculatePercentage(activeToursCurrent, activeToursLastMonth),
          isUp: activeToursCurrent >= activeToursLastMonth
        },
        users: {
          value: usersTotal,
          percentage: calculatePercentage(usersCurrent, usersLastMonth),
          isUp: usersCurrent >= usersLastMonth
        }
      },
      recentOrders: recentOrders,
      chartData: {
        weeklyRevenue,
        weeklyBookings
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: error.message
    });
  }
};
