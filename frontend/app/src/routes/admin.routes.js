import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminTours from "../pages/Admin/AdminTours";


export const adminRoutes = {
  // private admin
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <AdminDashboard />
    },
    {
      path: "tours",
      element: <AdminTours />
    }
  ]
};
