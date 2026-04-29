import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminTours from "../pages/Admin/AdminTours";
import AdminNotFound from "../pages/Admin/AdminNotFound";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminOrders from "../pages/Admin/AdminOrders";
import AdminAccounts from "../pages/Admin/AdminAccounts";
import AdminRoles from "../pages/Admin/AdminRoles";
import LoginAdmin from "../components/Auth/Admin/LoginAdmin";
import PrivateRoutesAdmin from "../components/Auth/Admin/PrivateRoutesAdmin";
import ForgotPasswordAdmin from "../components/Auth/Admin/ForgotPasswordAdmin";
import ResetPasswordAdmin from "../components/Auth/Admin/ResetPassowrdAdmin";


export const adminRoutes = {
  path: "/admin",
  children: [
    {
      path: "auth",
      children: [
        { path: "login", element: <LoginAdmin /> },
        { path: "forgot-password", element: <ForgotPasswordAdmin /> },
        { path: "reset-password", element: <ResetPasswordAdmin /> }
      ]
    },
    {
      element: <PrivateRoutesAdmin />,
      children: [
        {
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
            }
          ]
        }
      ]
    },
    {
      path: "*",
      element: <AdminNotFound />
    }
  ]
};


