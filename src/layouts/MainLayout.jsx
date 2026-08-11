import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="app-layout">

      {/* Sidebar duy nhất */}
      <Sidebar />

      {/* Nội dung bên phải */}
      <div className="app-main">

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;