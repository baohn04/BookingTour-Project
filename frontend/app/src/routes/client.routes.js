import LayoutDefault from "../components/ClientLayout";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetail from "../pages/Tours/TourDetail";
import Cart from "../pages/Cart";

export const clientRoutes = {
  // public client
  path: "/",
  element: <LayoutDefault />,
  children: [
    {
      index: true,
      element: <Home />
    },
    {
      path: "tours/:slug",
      element: <Tours />
    },
    {
      path: "tours/detail/:slug",
      element: <TourDetail />
    },
    {
      path: "cart",
      element: <Cart />
    }
  ]
};
