import { createBrowserRouter } from "react-router-dom";
import { Projects } from "../pages";
import Layout from "../layouts";
import CreateProjects from "../pages/projects/CreateProjects";

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
      {
        path: "create-projects",
        element: <CreateProjects />,
        handle: {
          title: "برآورد جدید",
        },
      },
    ],
  },
]);
