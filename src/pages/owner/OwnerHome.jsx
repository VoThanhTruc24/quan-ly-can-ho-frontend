import "./OwnerHome.css";
import { useNavigate } from "react-router-dom";

function OwnerHome() {
  const navigate = useNavigate();

  // ==========================================
  // LẤY THÔNG TIN USER TỪ LOCAL STORAGE
  // ==========================================

  const username =
    localStorage.getItem("username");

  const fullName =
    localStorage.getItem("fullName");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");

    navigate("/login");
  };

  // ==========================================
  // USER NAME HIỂN THỊ
  // ==========================================

  const displayName =
    fullName ||
    username ||
    "Người dùng";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="owner-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="owner-sidebar">

        {/* LOGO */}

        <div className="owner-logo">

          <div className="owner-logo-icon">
            🏢
          </div>

          <span>
            Quản Lý Căn Hộ
          </span>

        </div>

        {/* MENU */}

        <nav className="owner-nav">

          {/* TRANG CHỦ */}

          <button
            className="owner-menu active"
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
            className="owner-menu"
            onClick={() =>
              navigate("/owner/invoice")
            }
          >
            <span className="menu-icon">
              💰
            </span>

            <span>
              Hóa đơn
            </span>
          </button>

          {/* HỒ SƠ */}

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

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="owner-main">

        {/* HEADER */}

        <header className="owner-header">

          <div className="owner-header-title">

            <h1>
              Trang chủ
            </h1>

            <p>
              Tổng quan thông tin căn hộ
              của bạn
            </p>

          </div>

          {/* USER */}

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

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="owner-welcome">

          <div className="welcome-content">

            <h2>
              Xin chào, {displayName}! 👋
            </h2>

            <p>
              Chào mừng bạn đến với
              hệ thống quản lý căn hộ.
            </p>

          </div>

          <div className="welcome-building">
            🏢
          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="owner-statistics">

          {/* CĂN HỘ */}

          <div className="owner-stat-card">

            <div className="stat-icon apartment">
              🏢
            </div>

            <div className="stat-content">

              <span>
                Căn hộ của tôi
              </span>

              <strong>
                1
              </strong>

            </div>

          </div>

          {/* HỢP ĐỒNG */}

          <div className="owner-stat-card">

            <div className="stat-icon contract">
              📄
            </div>

            <div className="stat-content">

              <span>
                Hợp đồng
              </span>

              <strong>
                1
              </strong>

            </div>

          </div>

          {/* TIỀN THUÊ */}

          <div className="owner-stat-card">

            <div className="stat-icon money">
              💰
            </div>

            <div className="stat-content">

              <span>
                Tiền thuê tháng
              </span>

              <strong>
                20.000.000 đ
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            THÔNG TIN CĂN HỘ
        ================================================= */}

        <section className="owner-section">

          <div className="owner-section-header">

            <div>

              <h2>
                Căn hộ của tôi
              </h2>

              <p>
                Thông tin căn hộ đang thuê
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/owner/apartment")
              }
            >
              Xem chi tiết
              <span>→</span>
            </button>

          </div>

          {/* APARTMENT CARD */}

          <div className="owner-apartment-card">

            <div className="apartment-image">
              🏢
            </div>

            <div className="apartment-main-info">

              <div className="apartment-title-row">

                <div>

                  <h3>
                    Căn hộ A102
                  </h3>

                  <p>
                    Chung cư ABC
                  </p>

                </div>

                <span className="active-badge">
                  Đang thuê
                </span>

              </div>

              <div className="apartment-details">

                <div>

                  <span>
                    📍 Vị trí
                  </span>

                  <strong>
                    Tầng 1
                  </strong>

                </div>

                <div>

                  <span>
                    🛏️ Phòng
                  </span>

                  <strong>
                    2 phòng ngủ
                  </strong>

                </div>

                <div>

                  <span>
                    📐 Diện tích
                  </span>

                  <strong>
                    70 m²
                  </strong>

                </div>

                <div>

                  <span>
                    💰 Giá thuê
                  </span>

                  <strong className="rent-price">
                    20.000.000 đ/tháng
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            HỢP ĐỒNG
        ================================================= */}

        <section className="owner-section">

          <div className="owner-section-header">

            <div>

              <h2>
                Hợp đồng của tôi
              </h2>

              <p>
                Thông tin hợp đồng hiện tại
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/owner/contract")
              }
            >
              Xem chi tiết
              <span>→</span>
            </button>

          </div>

          <div className="owner-contract-card">

            <div className="contract-icon">
              📄
            </div>

            <div className="contract-main">

              <div>

                <h3>
                  Hợp đồng thuê căn hộ A102
                </h3>

                <p>
                  Mã hợp đồng: HD001
                </p>

              </div>

              <span className="active-badge">
                Đang hiệu lực
              </span>

            </div>

            <div className="contract-details">

              <div>

                <span>
                  Ngày bắt đầu
                </span>

                <strong>
                  20/08/2026
                </strong>

              </div>

              <div>

                <span>
                  Ngày kết thúc
                </span>

                <strong>
                  20/08/2027
                </strong>

              </div>

              <div>

                <span>
                  Tiền thuê
                </span>

                <strong className="rent-price">
                  20.000.000 đ/tháng
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            HÓA ĐƠN GẦN NHẤT
        ================================================= */}

        <section className="owner-section">

          <div className="owner-section-header">

            <div>

              <h2>
                Hóa đơn gần nhất
              </h2>

              <p>
                Theo dõi tiền thuê của bạn
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/owner/invoice")
              }
            >
              Xem tất cả
              <span>→</span>
            </button>

          </div>

          <div className="owner-invoice-card">

            <div className="invoice-icon">
              💰
            </div>

            <div className="invoice-main">

              <h3>
                Tiền thuê tháng 08/2026
              </h3>

              <p>
                Hạn thanh toán: 31/08/2026
              </p>

            </div>

            <div className="invoice-amount">

              <strong>
                20.000.000 đ
              </strong>

              <span className="paid-badge">
                Đã thanh toán
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default OwnerHome;