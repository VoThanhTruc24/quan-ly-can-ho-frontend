import "./OwnerApartment.css";
import { useNavigate } from "react-router-dom";

function OwnerApartment() {
  const navigate = useNavigate();

  const fullName =
    localStorage.getItem("fullName");

  const username =
    localStorage.getItem("username");

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


          <button
            className="owner-menu active"
          >
            <span className="menu-icon">
              🏢
            </span>

            <span>
              Căn hộ của tôi
            </span>
          </button>


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

        <header className="owner-header">

          <div>

            <h1>
              Căn hộ của tôi
            </h1>

            <p>
              Thông tin căn hộ đang thuê
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


        {/* ================= APARTMENT ================= */}

        <section className="apartment-page-card">

          <div className="apartment-big-icon">
            🏢
          </div>


          <div className="apartment-content">

            <div className="apartment-title">

              <div>

                <h2>
                  Căn hộ A102
                </h2>

                <p>
                  Chung cư ABC
                </p>

              </div>

              <span className="active-badge">
                Đang thuê
              </span>

            </div>


            <div className="apartment-info-grid">

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

        </section>

      </main>

    </div>
  );
}

export default OwnerApartment;