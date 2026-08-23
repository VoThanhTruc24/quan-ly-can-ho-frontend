import "./OwnerProfile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentOwner,
  getMyApartments,
} from "../../services/ownerService";

function OwnerProfile() {

  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [owner, setOwner] = useState(null);
  const [apartments, setApartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {

    const loadData = async () => {

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        setLoading(true);
        setError("");


        // ==============================
        // LẤY OWNER THẬT
        // ==============================

        const ownerData =
          await getCurrentOwner();

        console.log(
          "✅ PROFILE OWNER:",
          ownerData
        );

        setOwner(ownerData);


        // ==============================
        // LẤY CĂN HỘ THẬT
        // ==============================

        const apartmentData =
          await getMyApartments();

        console.log(
          "✅ PROFILE APARTMENTS:",
          apartmentData
        );

        setApartments(
          Array.isArray(apartmentData)
            ? apartmentData
            : []
        );


      } catch (err) {

        console.error(
          "❌ PROFILE ERROR:",
          err
        );

        setError(
          err.message ||
          "Không thể tải thông tin cá nhân"
        );

      } finally {

        setLoading(false);

      }

    };


    loadData();

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
  // USERNAME
  // ==============================

  const username =
    owner?.username ||
    localStorage.getItem("username") ||
    "Chưa có dữ liệu";


  // ==============================
  // ROLE
  // ==============================

  const role =
    owner?.role || "OWNER";


  // ==============================
  // STATUS
  // ==============================

  const status =
    owner?.status || "ACTIVE";


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
  // FORMAT ROLE
  // ==============================

  const formatRole = (value) => {

    if (!value) {
      return "Chủ căn hộ";
    }

    switch (value.toUpperCase()) {

      case "OWNER":
        return "Chủ căn hộ";

      case "ADMIN":
        return "Quản trị viên";

      case "TENANT":
        return "Người thuê";

      default:
        return value;

    }

  };


  // ==============================
  // FORMAT STATUS
  // ==============================

  const formatStatus = (value) => {

    if (!value) {
      return "Chưa có dữ liệu";
    }

    switch (value.toUpperCase()) {

      case "ACTIVE":
        return "Đang hoạt động";

      case "INACTIVE":
        return "Không hoạt động";

      case "BLOCKED":
        return "Đã khóa";

      default:
        return value;

    }

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
            Đang tải thông tin cá nhân...
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
                {formatRole(role)}
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
                {formatRole(role)}
              </p>

            </div>

          </div>


          {/* ================= THÔNG TIN ================= */}

          <div className="profile-section">

            <h3>
              Thông tin tài khoản
            </h3>


            <div className="profile-grid">


              {/* HỌ TÊN */}

              <div className="profile-field">

                <label>
                  Họ và tên
                </label>

                <div className="profile-input">

                  {displayName}

                </div>

              </div>


              {/* USERNAME */}

              <div className="profile-field">

                <label>
                  Tên đăng nhập
                </label>

                <div className="profile-input">

                  {username}

                </div>

              </div>


              {/* ROLE */}

              <div className="profile-field">

                <label>
                  Vai trò
                </label>

                <div className="profile-input">

                  {formatRole(role)}

                </div>

              </div>


              {/* STATUS */}

              <div className="profile-field">

                <label>
                  Trạng thái
                </label>

                <div className="profile-input status">

                  {formatStatus(status)}

                </div>

              </div>


            </div>

          </div>


          {/* ================= CĂN HỘ ================= */}

          <div className="profile-section">

            <h3>
              Thông tin căn hộ
            </h3>


            {apartments.length === 0 ? (

              <div className="apartment-profile-box">

                <div className="apartment-profile-icon">
                  🏢
                </div>

                <div>

                  <strong>
                    Chưa được gán căn hộ
                  </strong>

                  <p>
                    Hiện tại bạn chưa có căn hộ nào.
                  </p>

                </div>

              </div>

            ) : (

              apartments.map((apartment) => (

                <div
                  className="apartment-profile-box"
                  key={apartment.id}
                >

                  <div className="apartment-profile-icon">
                    🏢
                  </div>


                  <div>

                    <strong>
                      {apartment.name ||
                        "Chưa có tên căn hộ"}
                    </strong>

                    <p>
                      {apartment.floor?.block?.name ||
                        "Chưa có thông tin tòa nhà"}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>


        </section>


      </main>

    </div>

  );
}

export default OwnerProfile;