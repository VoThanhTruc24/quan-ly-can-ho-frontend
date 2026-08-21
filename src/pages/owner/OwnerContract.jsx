import "./OwnerContract.css";
import { useNavigate } from "react-router-dom";

function OwnerContract() {

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username");

  const fullName =
    localStorage.getItem("fullName");

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
            className="owner-menu active"
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
              Hợp đồng
            </h1>

            <p>
              Thông tin hợp đồng thuê căn hộ
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


        {/* ================= CONTRACT ================= */}

        <section className="contract-page-card">


          <div className="contract-header">

            <div className="contract-icon-large">
              📄
            </div>


            <div>

              <h2>
                Hợp đồng thuê căn hộ A102
              </h2>

              <p>
                Mã hợp đồng: HD001
              </p>

            </div>


            <span className="active-badge">
              Đang hiệu lực
            </span>

          </div>


          {/* THÔNG TIN */}

          <div className="contract-info">


            <div className="contract-info-item">

              <span>
                🏢 Căn hộ
              </span>

              <strong>
                A102
              </strong>

            </div>


            <div className="contract-info-item">

              <span>
                📅 Ngày bắt đầu
              </span>

              <strong>
                20/08/2026
              </strong>

            </div>


            <div className="contract-info-item">

              <span>
                📅 Ngày kết thúc
              </span>

              <strong>
                20/08/2027
              </strong>

            </div>


            <div className="contract-info-item">

              <span>
                💰 Tiền thuê
              </span>

              <strong className="rent-price">
                20.000.000 đ/tháng
              </strong>

            </div>

          </div>


          {/* FOOTER */}

          <div className="contract-footer">

            <div>

              <span>
                Trạng thái hợp đồng
              </span>

              <strong>
                Đang có hiệu lực
              </strong>

            </div>


            <div>

              <span>
                Thời hạn
              </span>

              <strong>
                12 tháng
              </strong>

            </div>

          </div>


        </section>

      </main>

    </div>
  );
}

export default OwnerContract;