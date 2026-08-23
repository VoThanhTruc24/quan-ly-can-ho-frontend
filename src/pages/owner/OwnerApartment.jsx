import "./OwnerApartment.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentOwner, getMyApartments } from "../../services/ownerService";

function OwnerApartment() {
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
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ==============================
        // LẤY OWNER ĐANG LOGIN
        // ==============================

        const ownerData = await getCurrentOwner();

        console.log("✅ OWNER APARTMENT:", ownerData);

        setOwner(ownerData);

        // ==============================
        // LẤY CĂN HỘ CỦA OWNER
        // ==============================

        const apartmentData = await getMyApartments();

        console.log(
          "✅ OWNER APARTMENTS:",
          apartmentData
        );

        setApartments(
          Array.isArray(apartmentData)
            ? apartmentData
            : []
        );

      } catch (err) {
        console.error(
          "❌ OWNER APARTMENT ERROR:",
          err
        );

        setError(
          err.message ||
          "Không thể tải dữ liệu căn hộ"
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
  // FORMAT STATUS
  // ==============================

  const formatStatus = (status) => {
    if (!status) {
      return "Chưa có trạng thái";
    }

    switch (status.toUpperCase()) {
      case "AVAILABLE":
        return "AVAILABLE";

      case "RENTED":
        return "Đang thuê";

      case "OCCUPIED":
        return "Đang thuê";

      case "VACANT":
        return "Còn trống";

      default:
        return status;
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
            Đang tải dữ liệu căn hộ...
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
            className="owner-menu active"
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
              Căn hộ của tôi
            </h1>

            <p>
              Thông tin căn hộ của bạn
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


        {/* ================= APARTMENTS ================= */}

        {apartments.length === 0 ? (

          <section className="apartment-page-card">

            <div className="apartment-big-icon">
              🏢
            </div>

            <div className="apartment-content">

              <div className="apartment-title">

                <div>

                  <h2>
                    Chưa được gán căn hộ
                  </h2>

                  <p>
                    Hiện tại bạn chưa có căn hộ nào.
                  </p>

                </div>

              </div>

            </div>

          </section>

        ) : (

          apartments.map((apartment) => (

            <section
              className="apartment-page-card"
              key={apartment.id}
            >

              <div className="apartment-big-icon">
                🏢
              </div>


              <div className="apartment-content">

                <div className="apartment-title">

                  <div>

                    <h2>
                      {apartment.name ||
                        "Chưa có tên căn hộ"}
                    </h2>

                    <p>
                      {apartment.floor?.block?.name ||
                        "Chưa có thông tin tòa nhà"}
                    </p>

                  </div>


                  <span className="active-badge">
                    {formatStatus(
                      apartment.status
                    )}
                  </span>

                </div>


                <div className="apartment-info-grid">


                  {/* VỊ TRÍ */}

                  <div>

                    <span>
                      📍 Vị trí
                    </span>

                    <strong>
                      {apartment.floor?.name ||
                        "Chưa có dữ liệu"}
                    </strong>

                  </div>


                  {/* TÒA NHÀ */}

                  <div>

                    <span>
                      🏢 Tòa nhà
                    </span>

                    <strong>
                      {apartment.floor?.block?.name ||
                        "Chưa có dữ liệu"}
                    </strong>

                  </div>


                  {/* DIỆN TÍCH */}

                  <div>

                    <span>
                      📐 Diện tích
                    </span>

                    <strong>
                      {apartment.area !== null &&
                      apartment.area !== undefined
                        ? `${apartment.area} m²`
                        : "Chưa có dữ liệu"}
                    </strong>

                  </div>


                  {/* TRẠNG THÁI */}

                  <div>

                    <span>
                      📊 Trạng thái
                    </span>

                    <strong>
                      {formatStatus(
                        apartment.status
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

          ))

        )}

      </main>

    </div>
  );
}

export default OwnerApartment;