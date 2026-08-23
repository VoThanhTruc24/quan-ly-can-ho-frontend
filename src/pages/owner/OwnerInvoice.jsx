import "./OwnerInvoice.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentOwner } from "../../services/ownerService";

function OwnerInvoice() {

  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [owner, setOwner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==============================
  // LOAD OWNER
  // ==============================

  useEffect(() => {

    const loadOwner = async () => {

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        setLoading(true);
        setError("");

        const ownerData =
          await getCurrentOwner();

        console.log(
          "✅ INVOICE OWNER:",
          ownerData
        );

        setOwner(ownerData);

      } catch (err) {

        console.error(
          "❌ INVOICE OWNER ERROR:",
          err
        );

        setError(
          err.message ||
          "Không thể tải thông tin Owner"
        );

      } finally {

        setLoading(false);

      }

    };


    loadOwner();

  }, [navigate]);


  // ==============================
  // DISPLAY NAME
  // ==============================

  const displayName =
    owner?.fullName ||
    owner?.username ||
    localStorage.getItem("fullName") ||
    localStorage.getItem("username") ||
    "Chủ căn hộ";


  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");

    navigate("/login");

  };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (

      <div className="owner-page">

        <aside className="owner-sidebar">

          <div className="owner-logo">

            <div className="owner-logo-icon">
              🏢
            </div>

            <span>
              Quản Lý Căn Hộ
            </span>

          </div>

        </aside>


        <main className="owner-main">

          <div
            style={{
              padding: "50px",
              fontSize: "20px",
            }}
          >
            Đang tải dữ liệu hóa đơn...
          </div>

        </main>

      </div>

    );

  }


  // ==============================
  // ERROR
  // ==============================

  if (error) {

    return (

      <div className="owner-page">

        <aside className="owner-sidebar">

          <div className="owner-logo">

            <div className="owner-logo-icon">
              🏢
            </div>

            <span>
              Quản Lý Căn Hộ
            </span>

          </div>


          <button
            className="owner-logout"
            onClick={handleLogout}
          >

            <span className="menu-icon">
              🚪
            </span>

            <span>
              Đăng xuất
            </span>

          </button>

        </aside>


        <main className="owner-main">

          <div
            style={{
              padding: "50px",
              color: "red",
            }}
          >

            <h2>
              Không thể tải dữ liệu
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Thử lại
            </button>

          </div>

        </main>

      </div>

    );

  }


  // ==============================
  // UI
  // ==============================

  return (

    <div className="owner-page">


      {/* ================= SIDEBAR ================= */}

      <aside className="owner-sidebar">

        <div className="owner-logo">

          <div className="owner-logo-icon">
            🏢
          </div>

          <span>
            Quản Lý Căn Hộ
          </span>

        </div>


        <nav className="owner-nav">


          {/* TRANG CHỦ */}

          <button
            className="owner-menu"
            onClick={() =>
              navigate("/owner")
            }
          >

            <span className="menu-icon">
              🏠
            </span>

            <span>
              Trang chủ
            </span>

          </button>


          {/* CĂN HỘ */}

          <button
            className="owner-menu"
            onClick={() =>
              navigate("/owner/apartment")
            }
          >

            <span className="menu-icon">
              🏢
            </span>

            <span>
              Căn hộ của tôi
            </span>

          </button>


          {/* HỢP ĐỒNG */}

          <button
            className="owner-menu"
            onClick={() =>
              navigate("/owner/contract")
            }
          >

            <span className="menu-icon">
              📄
            </span>

            <span>
              Hợp đồng
            </span>

          </button>


          {/* HÓA ĐƠN */}

          <button
            className="owner-menu active"
          >

            <span className="menu-icon">
              💰
            </span>

            <span>
              Hóa đơn
            </span>

          </button>


          {/* CÁ NHÂN */}

          <button
            className="owner-menu"
            onClick={() =>
              navigate("/owner/profile")
            }
          >

            <span className="menu-icon">
              👤
            </span>

            <span>
              Cá nhân
            </span>

          </button>

        </nav>


        {/* LOGOUT */}

        <button
          className="owner-logout"
          onClick={handleLogout}
        >

          <span className="menu-icon">
            🚪
          </span>

          <span>
            Đăng xuất
          </span>

        </button>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="owner-main">


        {/* HEADER */}

        <header className="owner-header">

          <div>

            <h1>
              Hóa đơn
            </h1>

            <p>
              Theo dõi các khoản thanh toán tiền thuê
            </p>

          </div>


          <div className="owner-header-user">

            <div className="owner-avatar">

              {displayName
                .charAt(0)
                .toUpperCase()}

            </div>


            <div className="owner-user-info">

              <strong>
                {displayName}
              </strong>

              <span>
                Chủ căn hộ
              </span>

            </div>

          </div>

        </header>


        {/* ================= SUMMARY ================= */}

        <section className="invoice-summary">


          <div className="invoice-summary-card">

            <div className="invoice-summary-icon blue">
              📄
            </div>

            <div>

              <span>
                Tổng hóa đơn
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>


          <div className="invoice-summary-card">

            <div className="invoice-summary-icon green">
              ✓
            </div>

            <div>

              <span>
                Đã thanh toán
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>


          <div className="invoice-summary-card">

            <div className="invoice-summary-icon orange">
              ⏳
            </div>

            <div>

              <span>
                Chưa thanh toán
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>


        </section>


        {/* ================= INVOICE LIST ================= */}

        <section className="invoice-container">


          <div className="invoice-title">

            <div>

              <h2>
                Danh sách hóa đơn
              </h2>

              <p>
                Các khoản thanh toán của bạn
              </p>

            </div>

          </div>


          {/* ================= EMPTY ================= */}

          <div className="invoice-item">

            <div className="invoice-left">

              <div className="invoice-icon">
                💰
              </div>


              <div>

                <h3>
                  Chưa có dữ liệu hóa đơn
                </h3>

                <p>
                  Hệ thống chưa cung cấp API
                  hóa đơn cho Owner.
                </p>

                <small>
                  Vui lòng kiểm tra lại sau khi
                  backend triển khai chức năng hóa đơn.
                </small>

              </div>

            </div>


            <div className="invoice-right">

              <strong>
                --
              </strong>

              <span className="invoice-unpaid">
                Chưa có dữ liệu
              </span>

            </div>

          </div>


        </section>


      </main>

    </div>

  );
}

export default OwnerInvoice;