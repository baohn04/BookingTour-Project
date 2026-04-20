import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminTours from "../pages/Admin/AdminTours";
import AdminNotFound from "../pages/Admin/AdminNotFound";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminOrders from "../pages/Admin/AdminOrders";
import AdminAccounts from "../pages/Admin/AdminAccounts";
import AdminRoles from "../pages/Admin/AdminRoles";

export const adminRoutes = {
  // admin
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <AdminDashboard />
    },
    {
      path: "categories",
      element: <AdminCategories />
    },
    {
      path: "tours",
      element: <AdminTours />
    },
    {
      path: "orders",
      element: <AdminOrders />
    },
    {
      path: "accounts",
      element: <AdminAccounts />
    },
    {
      path: "roles",
      element: <AdminRoles />
    },
    {
      path: "*",
      element: <AdminNotFound />
    }
  ]
};
