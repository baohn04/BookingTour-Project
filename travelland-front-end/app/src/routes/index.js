import LayoutDefault from "../components/Layout";
import Home from "../pages/Home";
import ListTours from "../pages/ListTours";


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
        element: <ListTours />
      }
    ]
  }
]