import "./OwnerProfile.css";
import { useNavigate } from "react-router-dom";

function OwnerProfile() {

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
            className="owner-menu active"
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


        {/* HEADER */}

        <header className="owner-header">

          <div>

            <h1>
              Cá nhân
            </h1>

            <p>
              Quản lý thông tin tài khoản của bạn
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


        {/* ================= PROFILE ================= */}

        <section className="profile-card">


          <div className="profile-top">

            <div className="profile-avatar">

              {displayName
                .charAt(0)
                .toUpperCase()}

            </div>


            <div>

              <h2>
                {displayName}
              </h2>

              <p>
                Chủ căn hộ
              </p>

            </div>

          </div>


          {/* THÔNG TIN */}

          <div className="profile-section">

            <h3>
              Thông tin tài khoản
            </h3>


            <div className="profile-grid">


              <div className="profile-field">

                <label>
                  Họ và tên
                </label>

                <div className="profile-input">
                  {displayName}
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Tên đăng nhập
                </label>

                <div className="profile-input">
                  {username || "owner"}
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Vai trò
                </label>

                <div className="profile-input">
                  Chủ căn hộ
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Trạng thái
                </label>

                <div className="profile-input status">
                  Đang hoạt động
                </div>

              </div>

            </div>

          </div>


          {/* CĂN HỘ */}

          <div className="profile-section">

            <h3>
              Thông tin căn hộ
            </h3>


            <div className="apartment-profile-box">

              <div className="apartment-profile-icon">
                🏢
              </div>


              <div>

                <strong>
                  Căn hộ A102
                </strong>

                <p>
                  Chung cư ABC
                </p>

              </div>

            </div>

          </div>


        </section>

      </main>

    </div>
  );
}

export default OwnerProfile;