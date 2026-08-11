import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Customers from "../pages/dashboard/Customers";
import Apartments from "../pages/dashboard/Apartments";
import Contracts from "../pages/dashboard/Contracts";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN - không có Sidebar */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* CÁC TRANG QUẢN LÝ - dùng chung Sidebar */}
        <Route element={<MainLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/apartments"
            element={<Apartments />}
          />

          <Route
            path="/contracts"
            element={<Contracts />}
          />

        </Route>

        {/* Mặc định */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;