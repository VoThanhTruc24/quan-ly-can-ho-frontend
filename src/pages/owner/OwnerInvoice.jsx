import "./OwnerInvoice.css";
import { useNavigate } from "react-router-dom";

function OwnerInvoice() {

  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const fullName = localStorage.getItem("fullName");

  const displayName =
    fullName || username || "Chủ căn hộ";


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");

    navigate("/login");
  };


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

          {/* Trang chủ */}

          <button
            className="owner-menu"
            onClick={() => navigate("/owner")}
          >
            <span className="menu-icon">
              🏠
            </span>

            <span>
              Trang chủ
            </span>
          </button>


          {/* Căn hộ */}

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


          {/* Hợp đồng */}

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


          {/* Hóa đơn */}

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


          {/* Cá nhân */}

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


        {/* Đăng xuất */}

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
                3
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
                2
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
                1
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


          {/* HÓA ĐƠN 1 */}

          <div className="invoice-item">

            <div className="invoice-left">

              <div className="invoice-icon">
                💰
              </div>

              <div>

                <h3>
                  Hóa đơn tháng 08/2026
                </h3>

                <p>
                  Căn hộ A102
                </p>

                <small>
                  Hạn thanh toán: 31/08/2026
                </small>

              </div>

            </div>


            <div className="invoice-right">

              <strong>
                20.000.000 đ
              </strong>

              <span className="invoice-paid">
                Đã thanh toán
              </span>

            </div>

          </div>


          {/* HÓA ĐƠN 2 */}

          <div className="invoice-item">

            <div className="invoice-left">

              <div className="invoice-icon">
                💰
              </div>

              <div>

                <h3>
                  Hóa đơn tháng 07/2026
                </h3>

                <p>
                  Căn hộ A102
                </p>

                <small>
                  Hạn thanh toán: 31/07/2026
                </small>

              </div>

            </div>


            <div className="invoice-right">

              <strong>
                20.000.000 đ
              </strong>

              <span className="invoice-paid">
                Đã thanh toán
              </span>

            </div>

          </div>


          {/* HÓA ĐƠN 3 */}

          <div className="invoice-item">

            <div className="invoice-left">

              <div className="invoice-icon">
                💰
              </div>

              <div>

                <h3>
                  Hóa đơn tháng 06/2026
                </h3>

                <p>
                  Căn hộ A102
                </p>

                <small>
                  Hạn thanh toán: 30/06/2026
                </small>

              </div>

            </div>


            <div className="invoice-right">

              <strong>
                20.000.000 đ
              </strong>

              <span className="invoice-unpaid">
                Chưa thanh toán
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default OwnerInvoice;