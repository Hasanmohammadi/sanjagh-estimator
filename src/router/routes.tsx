import { createBrowserRouter } from "react-router-dom";
import { Projects } from "../pages";
import Layout from "../layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "projects",
        element: <Projects />,
        handle: {
          title: "برآورد نقاشی",
        },
      },
    ],
  },
]);
