import "./OwnerInvoice.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCurrentOwner,
  getMyInvoices,
} from "../../services/ownerService";


function OwnerInvoice() {

  const navigate = useNavigate();


  // ==========================================
  // OWNER
  // ==========================================

  const [owner, setOwner] =
    useState(null);


  // ==========================================
  // INVOICES
  // ==========================================

  const [invoices, setInvoices] =
    useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // ERROR
  // ==========================================

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    const loadData = async () => {

      const token =
        localStorage.getItem("token");


      // --------------------------------------
      // KIỂM TRA LOGIN
      // --------------------------------------

      if (!token) {

        navigate("/login");

        return;
      }


      try {

        setLoading(true);

        setError("");


        // --------------------------------------
        // LẤY OWNER
        // --------------------------------------

        const ownerData =
          await getCurrentOwner();


        console.log(
          "OWNER:",
          ownerData
        );


        setOwner(ownerData);


        // --------------------------------------
        // LẤY HÓA ĐƠN
        // --------------------------------------

        const invoiceData =
          await getMyInvoices();


        console.log(
          "OWNER INVOICES:",
          invoiceData
        );


        setInvoices(
          Array.isArray(invoiceData)
            ? invoiceData
            : []
        );

      } catch (err) {

        console.error(
          "OWNER INVOICE ERROR:",
          err
        );


        setError(
          err.message ||
          "Không thể tải dữ liệu hóa đơn"
        );

      } finally {

        setLoading(false);
      }
    };


    loadData();

  }, [navigate]);


  // ==========================================
  // DISPLAY NAME
  // ==========================================

  const displayName =
    owner?.fullName ||
    owner?.username ||
    localStorage.getItem("fullName") ||
    localStorage.getItem("username") ||
    "Chủ căn hộ";


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
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {

    return (
      Number(amount || 0)
        .toLocaleString("vi-VN")
      + " đ"
    );
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }


    const parts =
      String(date).split("-");


    if (parts.length === 3) {

      return (
        `${parts[2]}/${parts[1]}/${parts[0]}`
      );
    }


    return String(date);
  };


  // ==========================================
  // NORMALIZE STATUS
  // ==========================================

  const normalizeStatus = (status) => {

    return String(status || "")
      .trim()
      .toUpperCase();
  };


  // ==========================================
  // KIỂM TRA TRẠNG THÁI
  // ==========================================

  const isPaid = (status) => {

    return (
      normalizeStatus(status) ===
      "PAID"
    );
  };


  const isUnpaid = (status) => {

    return (
      normalizeStatus(status) ===
      "UNPAID"
    );
  };


  const isOverdue = (status) => {

    return (
      normalizeStatus(status) ===
      "OVERDUE"
    );
  };


  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const getPaymentMethodName = (
    paymentMethod
  ) => {

    switch (
      String(paymentMethod || "")
        .trim()
        .toUpperCase()
    ) {

      case "BANK_TRANSFER":
        return "Chuyển khoản";

      case "MOMO":
        return "MoMo";

      case "VNPAY":
        return "VNPay";

      case "CASH":
        return "Tiền mặt";

      default:
        return paymentMethod || "--";
    }
  };


  // ==========================================
  // SUMMARY
  // ==========================================

  const totalInvoices =
    invoices.length;


  const paidInvoices =
    invoices.filter(
      (invoice) =>
        isPaid(invoice.status)
    ).length;


  const unpaidInvoices =
    invoices.filter(
      (invoice) =>
        isUnpaid(invoice.status)
    ).length;


  const overdueInvoices =
    invoices.filter(
      (invoice) =>
        isOverdue(invoice.status)
    ).length;


  // ==========================================
  // TỔNG TIỀN CÒN PHẢI THANH TOÁN
  // ==========================================

  const totalOutstanding =
    invoices
      .filter(
        (invoice) =>
          !isPaid(invoice.status)
      )
      .reduce(
        (sum, invoice) =>
          sum +
          Number(invoice.amount || 0),
        0
      );


  // ==========================================
  // TỔNG TIỀN ĐÃ THANH TOÁN
  // ==========================================

  const totalPaidAmount =
    invoices
      .filter(
        (invoice) =>
          isPaid(invoice.status)
      )
      .reduce(
        (sum, invoice) =>
          sum +
          Number(invoice.amount || 0),
        0
      );


  // ==========================================
  // LOADING
  // ==========================================

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
              fontSize: "20px",
              color: "#172a4d",
            }}
          >
            Đang tải dữ liệu hóa đơn...
          </div>

        </main>

      </div>

    );
  }


  // ==========================================
  // ERROR
  // ==========================================

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
              className="owner-menu active"
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


        <main className="owner-main">

          <div
            style={{
              padding: "50px",
              color: "#dc2626",
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
              style={{
                marginTop: "15px",
                padding:
                  "10px 18px",
                border: "none",
                borderRadius: "10px",
                background:
                  "#2563eb",
                color: "#fff",
                cursor:
                  "pointer",
              }}
            >
              Thử lại
            </button>

          </div>

        </main>

      </div>

    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="owner-page">


      {/* ======================================
          SIDEBAR
      ======================================= */}

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


      {/* ======================================
          MAIN
      ======================================= */}

      <main className="owner-main">


        {/* ======================================
            HEADER
        ======================================= */}

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


        {/* ======================================
            SUMMARY
        ======================================= */}

        <section className="invoice-summary">


          {/* TỔNG HÓA ĐƠN */}

          <div className="invoice-summary-card">

            <div className="invoice-summary-icon blue">
              📄
            </div>

            <div>

              <span>
                Tổng hóa đơn
              </span>

              <strong>
                {totalInvoices}
              </strong>

            </div>

          </div>


          {/* ĐÃ THANH TOÁN */}

          <div className="invoice-summary-card">

            <div className="invoice-summary-icon green">
              ✓
            </div>

            <div>

              <span>
                Đã thanh toán
              </span>

              <strong>
                {paidInvoices}
              </strong>

              <small
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {formatMoney(
                  totalPaidAmount
                )}
              </small>

            </div>

          </div>


          {/* CHƯA THANH TOÁN */}

          <div className="invoice-summary-card">

            <div className="invoice-summary-icon orange">
              ⏳
            </div>

            <div>

              <span>
                Chưa thanh toán
              </span>

              <strong>
                {
                  unpaidInvoices +
                  overdueInvoices
                }
              </strong>

              <small
                style={{
                  color: overdueInvoices > 0
                    ? "#dc2626"
                    : "#64748b",
                  fontSize: "11px",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {overdueInvoices > 0
                  ? `${overdueInvoices} hóa đơn quá hạn`
                  : "Không có hóa đơn quá hạn"}
              </small>

            </div>

          </div>


        </section>


        {/* ======================================
            INVOICE CONTAINER
        ======================================= */}

        <section className="invoice-container">


          {/* ====================================
              TITLE
          ===================================== */}

          <div className="invoice-title">

            <div>

              <h2>
                Danh sách hóa đơn
              </h2>

              <p>

                Các khoản thanh toán của bạn

                {" · "}

                Còn phải thanh toán:{" "}

                <strong
                  style={{
                    color: "#2563eb",
                  }}
                >
                  {formatMoney(
                    totalOutstanding
                  )}
                </strong>

              </p>

            </div>

          </div>


          {/* ====================================
              EMPTY
          ===================================== */}

          {invoices.length === 0 ? (

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
                    Owner hiện tại chưa có hóa đơn.
                  </p>

                  <small>
                    Khi hệ thống phát sinh hóa đơn,
                    dữ liệu sẽ hiển thị tại đây.
                  </small>

                </div>

              </div>


              <div className="invoice-right">

                <strong>
                  0 đ
                </strong>

                <span className="invoice-unpaid">
                  Chưa có dữ liệu
                </span>

              </div>

            </div>

          ) : (


            /* ==================================
               INVOICE LIST
            =================================== */

            invoices.map(
              (invoice) => (

                <div
                  className={`invoice-item ${
                    isOverdue(
                      invoice.status
                    )
                      ? "invoice-item-overdue"
                      : ""
                  }`}
                  key={invoice.id}
                >


                  {/* =================================
                      LEFT
                  ================================= */}

                  <div className="invoice-left">

                    <div className="invoice-icon">
                      💰
                    </div>


                    <div>

                      <h3>
                        Hóa đơn tháng{" "}
                        {String(
                          invoice.month ?? ""
                        ).padStart(2, "0")}
                        /
                        {invoice.year}
                      </h3>


                      <p>
                        Hợp đồng #
                        {invoice.contractId}
                      </p>


                      {/* HẠN THANH TOÁN */}

                      <small>
                        Hạn thanh toán:{" "}
                        {formatDate(
                          invoice.dueDate
                        )}
                      </small>


                      {/* NGÀY THANH TOÁN */}

                      {isPaid(
                        invoice.status
                      ) && (
                        <small>
                          Đã thanh toán:{" "}
                          {formatDate(
                            invoice.paidDate
                          )}
                        </small>
                      )}


                      {/* PHƯƠNG THỨC */}

                      {isPaid(
                        invoice.status
                      ) &&
                        invoice.paymentMethod && (
                          <small>
                            Phương thức:{" "}
                            {getPaymentMethodName(
                              invoice.paymentMethod
                            )}
                          </small>
                        )}


                      {/* CẢNH BÁO QUÁ HẠN */}

                      {isOverdue(
                        invoice.status
                      ) && (
                        <small
                          style={{
                            color:
                              "#dc2626",
                            fontWeight:
                              "600",
                          }}
                        >
                          Khoản thanh toán
                          đã quá hạn
                        </small>
                      )}

                    </div>

                  </div>


                  {/* =================================
                      RIGHT
                  ================================= */}

                  <div className="invoice-right">

                    <strong>
                      {formatMoney(
                        invoice.amount
                      )}
                    </strong>


                    {/* PAID */}

                    {isPaid(
                      invoice.status
                    ) && (

                      <span
                        className="invoice-paid"
                      >
                        Đã thanh toán
                      </span>

                    )}


                    {/* UNPAID */}

                    {isUnpaid(
                      invoice.status
                    ) && (

                      <span
                        className="invoice-unpaid"
                      >
                        Chưa thanh toán
                      </span>

                    )}


                    {/* OVERDUE */}

                    {isOverdue(
                      invoice.status
                    ) && (

                      <span
                        className="invoice-overdue"
                      >
                        Quá hạn
                      </span>

                    )}

                  </div>


                </div>

              )
            )

          )}

        </section>


      </main>

    </div>
  );
}


export default OwnerInvoice;