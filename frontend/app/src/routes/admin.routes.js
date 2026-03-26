import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Tours from "../pages/Admin/Tours";

export const adminRoutes = {
  // private admin
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />
    },
    {
      path: "tours",
      element: <Tours />
    }
  ]
};
