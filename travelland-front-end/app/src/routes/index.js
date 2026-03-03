import LayoutDefault from "../components/Layout";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetail from "../pages/Tours/TourDetail";


export const routes = [
  {
    // public
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
      }
    ]
  }
]