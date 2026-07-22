import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "@/layouts";
import CreateProjects from "@/pages/projects/create-project";
import Projects from "@/pages/projects";
import EstimationResult from "@/pages/estimation-results";
import PriceConfig from "@/pages/price-config";
import Settings from "@/pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/projects"),
  },
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
      {
        path: "estimation-results",
        element: <EstimationResult />,
        handle: {
          title: "نتایج برآورد",
        },
      },
      {
        path: "settings/price-config",
        element: <PriceConfig />,
        handle: {
          title: "تنظیم قیمت پایه",
        },
      },
      {
        path: "settings",
        element: <Settings />,
        handle: {
          title: "تنظیمات",
        },
      },
    ],
  },
]);
