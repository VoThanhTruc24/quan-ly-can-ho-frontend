import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Customers from "../pages/dashboard/Customers";
import Apartments from "../pages/dashboard/Apartments";
import Contracts from "../pages/dashboard/Contracts";
import Owners from "../pages/dashboard/Owners";


// ===============================
// OWNER
// ===============================

import OwnerHome from "../pages/owner/OwnerHome";
import OwnerApartment from "../pages/owner/OwnerApartment";
import OwnerContract from "../pages/owner/OwnerContract";
import OwnerInvoice from "../pages/owner/OwnerInvoice";
import OwnerProfile from "../pages/owner/OwnerProfile";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =================================
            TRANG HOME
        ================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================
            LOGIN
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================
            OWNER
        ================================= */}

        <Route
          path="/owner"
          element={<OwnerHome />}
        />

        <Route
          path="/owner/apartment"
          element={<OwnerApartment />}
        />

        <Route
           path="/owner/contract"
           element={<OwnerContract />}
        />

        <Route
          path="/owner/invoice"
          element={<OwnerInvoice />}
        />

        <Route
          path="/owner/profile"
          element={<OwnerProfile />}
        />


        {/* =================================
            CÁC TRANG QUẢN LÝ ADMIN
            DÙNG CHUNG SIDEBAR
        ================================= */}

        <Route element={<MainLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/owners"
            element={<Owners />}
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


        {/* =================================
            ĐƯỜNG DẪN KHÔNG TỒN TẠI
            → VỀ HOME
        ================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default AppRoutes;