import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Layout() {
  return (
    <div className="layout mt-5">
      <div className="topLevelComponent">
        <Header />
        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
