import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="layout pt-5">
      <div className="topLevelComponent">
        <Header />
        <main className="mt-8">
          <Outlet />
        </main>
        <NavBar />
      </div>
    </div>
  );
}
