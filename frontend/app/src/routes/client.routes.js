import LayoutDefault from "../components/ClientLayout";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetail from "../pages/Tours/TourDetail";
import SearchResults from "../pages/SearchResults";
import Categories from "../pages/Categories";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";

export const clientRoutes = {
  // client
  path: "/",
  element: <LayoutDefault />,
  children: [
    {
      index: true,
      element: <Home />
    },
    {
      path: "categories",
      element: <Categories />
    },
    {
      path: "tours/search",
      element: <SearchResults />
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
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]
};
