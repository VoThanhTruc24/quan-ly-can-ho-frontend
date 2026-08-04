import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;