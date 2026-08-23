import "./OwnerContract.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentOwner,
  getMyContracts,
} from "../../services/ownerService";

function OwnerContract() {

  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [owner, setOwner] = useState(null);
  const [contracts, setContracts] = useState([]);

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
        // LẤY OWNER
        // ==============================

        const ownerData =
          await getCurrentOwner();

        console.log(
          "✅ OWNER CONTRACT:",
          ownerData
        );

        setOwner(ownerData);


        // ==============================
        // LẤY CONTRACT
        // ==============================

        const contractData =
          await getMyContracts();

        console.log(
          "✅ OWNER CONTRACTS:",
          contractData
        );

        setContracts(
          Array.isArray(contractData)
            ? contractData
            : []
        );


      } catch (err) {

        console.error(
          "❌ OWNER CONTRACT ERROR:",
          err
        );

        setError(
          err.message ||
          "Không thể tải dữ liệu hợp đồng"
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
  // FORMAT MONEY
  // ==============================

  const formatMoney = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Chưa có dữ liệu";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return (
      number.toLocaleString("vi-VN") +
      " đ/tháng"
    );

  };


  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (value) => {

    if (!value) {
      return "Chưa có dữ liệu";
    }

    try {

      return new Date(value)
        .toLocaleDateString("vi-VN");

    } catch {

      return value;

    }

  };


  // ==============================
  // FORMAT STATUS
  // ==============================

  const formatStatus = (status) => {

    if (!status) {
      return "Chưa có trạng thái";
    }

    switch (status.toUpperCase()) {

      case "ACTIVE":
        return "Đang hiệu lực";

      case "INACTIVE":
        return "Không hiệu lực";

      case "EXPIRED":
        return "Đã hết hạn";

      case "TERMINATED":
        return "Đã chấm dứt";

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
            Đang tải dữ liệu hợp đồng...
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


        {/* ================= CONTRACTS ================= */}

        {contracts.length === 0 ? (

          <section className="contract-page-card">

            <div className="contract-header">

              <div className="contract-icon-large">
                📄
              </div>

              <div>

                <h2>
                  Chưa có hợp đồng
                </h2>

                <p>
                  Hiện tại bạn chưa có hợp đồng nào
                  được ghi nhận trong hệ thống.
                </p>

              </div>

            </div>

          </section>

        ) : (

          contracts.map((contract) => (

            <section
              className="contract-page-card"
              key={contract.id}
            >

              {/* ================= HEADER ================= */}

              <div className="contract-header">

                <div className="contract-icon-large">
                  📄
                </div>


                <div>

                  <h2>
                    Hợp đồng thuê{" "}
                    {contract.apartment?.name ||
                      contract.apartmentName ||
                      ""}
                  </h2>

                  <p>
                    Mã hợp đồng:{" "}
                    {contract.id ||
                      "Chưa có mã"}
                  </p>

                </div>


                <span className="active-badge">

                  {formatStatus(
                    contract.status
                  )}

                </span>

              </div>


              {/* ================= THÔNG TIN ================= */}

              <div className="contract-info">


                {/* CĂN HỘ */}

                <div className="contract-info-item">

                  <span>
                    🏢 Căn hộ
                  </span>

                  <strong>

                    {contract.apartment?.name ||
                      contract.apartmentName ||
                      "Chưa có dữ liệu"}

                  </strong>

                </div>


                {/* NGÀY BẮT ĐẦU */}

                <div className="contract-info-item">

                  <span>
                    📅 Ngày bắt đầu
                  </span>

                  <strong>

                    {formatDate(
                      contract.startDate
                    )}

                  </strong>

                </div>


                {/* NGÀY KẾT THÚC */}

                <div className="contract-info-item">

                  <span>
                    📅 Ngày kết thúc
                  </span>

                  <strong>

                    {formatDate(
                      contract.endDate
                    )}

                  </strong>

                </div>


                {/* TIỀN THUÊ */}

                <div className="contract-info-item">

                  <span>
                    💰 Tiền thuê
                  </span>

                  <strong className="rent-price">

                    {formatMoney(
                      contract.rentPrice
                    )}

                  </strong>

                </div>

              </div>


              {/* ================= FOOTER ================= */}

              <div className="contract-footer">


                <div>

                  <span>
                    Trạng thái hợp đồng
                  </span>

                  <strong>

                    {formatStatus(
                      contract.status
                    )}

                  </strong>

                </div>


                <div>

                  <span>
                    Thời hạn
                  </span>

                  <strong>

                    {contract.duration
                      ? `${contract.duration} tháng`
                      : contract.term
                        ? `${contract.term} tháng`
                        : "Chưa có dữ liệu"}

                  </strong>

                </div>


              </div>

            </section>

          ))

        )}

      </main>

    </div>

  );
}

export default OwnerContract;