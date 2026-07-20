import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

const hideNavBarRoutes = ["/create-projects", "/estimation-results"];

export default function Layout() {
  const { pathname } = useLocation();
  const showNavBar = !hideNavBarRoutes.includes(pathname);

  return (
    <div className="layout pt-5">
      <div className="topLevelComponent">
        <Header />
        <main className="mt-8 pb-22">
          <Outlet />
        </main>
        {showNavBar && <NavBar />}
      </div>
    </div>
  );
}
