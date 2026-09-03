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
  payInvoice,
} from "../../services/ownerService";


function OwnerInvoice() {

  const navigate = useNavigate();


  // =====================================================
  // OWNER
  // =====================================================

  const [owner, setOwner] =
    useState(null);


  // =====================================================
  // INVOICES
  // =====================================================

  const [invoices, setInvoices] =
    useState([]);


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] =
    useState("");


  // =====================================================
  // PAYMENT MODAL
  // =====================================================

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);


  // =====================================================
  // PAYMENT METHOD
  //
  // null = chưa chọn
  // VNPAY = thanh toán được
  // MOMO / BANK_TRANSFER / CASH = chưa hỗ trợ
  // =====================================================

  const [paymentMethod, setPaymentMethod] =
    useState(null);


  const [paying, setPaying] =
    useState(false);


  const [paymentError, setPaymentError] =
    useState("");


  const [paymentSuccess, setPaymentSuccess] =
    useState(false);


  // =====================================================
  // VNPAY FORM
  // =====================================================

  const [bankCode, setBankCode] =
    useState(null);


  const [cardNumber, setCardNumber] =
    useState("");


  const [cardHolder, setCardHolder] =
    useState("");


  const [issueDate, setIssueDate] =
    useState("");


  const [otp, setOtp] =
    useState("");


  // =====================================================
  // BANK OPTIONS
  // Logo lấy từ link bên ngoài
  // =====================================================

  const bankOptions = [

    {
      value: "NCB",
      label: "NCB",
      description: "Ngân hàng Quốc Dân",
      logo:
        "https://www.google.com/s2/favicons?domain=ncb-bank.vn&sz=128",
    },

    {
      value: "VIETCOMBANK",
      label: "Vietcombank",
      description: "Ngân hàng Ngoại thương Việt Nam",
      logo:
        "https://www.google.com/s2/favicons?domain=vietcombank.com.vn&sz=128",
    },

    {
      value: "BIDV",
      label: "BIDV",
      description:
        "Ngân hàng Đầu tư và Phát triển Việt Nam",
      logo:
        "https://www.google.com/s2/favicons?domain=bidv.com.vn&sz=128",
    },

    {
      value: "VIETINBANK",
      label: "VietinBank",
      description:
        "Ngân hàng Công thương Việt Nam",
      logo:
        "https://www.google.com/s2/favicons?domain=vietinbank.vn&sz=128",
    },

    {
      value: "ACB",
      label: "ACB",
      description: "Ngân hàng Á Châu",
      logo:
        "https://www.google.com/s2/favicons?domain=acb.com.vn&sz=128",
    },

  ];


  // =====================================================
  // LOAD DATA
  // =====================================================

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


      // -------------------------------------------------
      // OWNER
      // -------------------------------------------------

      const ownerData =
        await getCurrentOwner();


      setOwner(ownerData);


      // -------------------------------------------------
      // INVOICE
      // -------------------------------------------------

      const invoiceData =
        await getMyInvoices();


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


  // =====================================================
  // FIRST LOAD
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);


  // =====================================================
  // DISPLAY NAME
  // =====================================================

  const displayName =
    owner?.fullName ||
    owner?.username ||
    localStorage.getItem("fullName") ||
    localStorage.getItem("username") ||
    "Chủ căn hộ";


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");

    navigate("/login");
  };


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {

    return (
      Number(amount || 0)
        .toLocaleString("vi-VN")
      + " đ"
    );
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

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


  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const normalizeStatus = (
    status
  ) => {

    return String(status || "")
      .trim()
      .toUpperCase();
  };


  // =====================================================
  // PAID
  // =====================================================

  const isPaid = (
    status
  ) => {

    return (
      normalizeStatus(status) ===
      "PAID"
    );
  };


  // =====================================================
  // OVERDUE
  // =====================================================

  const isOverdue = (
    status
  ) => {

    return (
      normalizeStatus(status) ===
      "OVERDUE"
    );
  };


  // =====================================================
  // UNPAID
  // =====================================================

  const isUnpaid = (
    status
  ) => {

    return (
      normalizeStatus(status) ===
      "UNPAID"
    );
  };


  // =====================================================
  // PAYMENT METHOD NAME
  // =====================================================

  const getPaymentMethodName = (
    method
  ) => {

    switch (
      String(method || "")
        .trim()
        .toUpperCase()
    ) {

      case "VNPAY":
        return "VNPay";

      case "MOMO":
        return "MoMo";

      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";

      case "CASH":
        return "Tiền mặt";

      default:
        return method || "--";
    }
  };


  // =====================================================
  // RESET PAYMENT FORM
  // =====================================================

  const resetPaymentForm = () => {

    // Không chọn phương thức sẵn
    setPaymentMethod(null);

    // Không chọn ngân hàng sẵn
    setBankCode(null);

    setCardNumber("");

    setCardHolder("");

    setIssueDate("");

    setOtp("");

    setPaymentError("");

    setPaymentSuccess(false);

    setPaying(false);
  };


  // =====================================================
  // OPEN PAYMENT
  // =====================================================

  const handleOpenPayment = (
    invoice
  ) => {

    if (isPaid(invoice.status)) {

      return;
    }


    setSelectedInvoice(invoice);

    resetPaymentForm();
  };


  // =====================================================
  // CLOSE PAYMENT
  // =====================================================

  const handleClosePayment = () => {

    if (paying) {

      return;
    }


    setSelectedInvoice(null);

    resetPaymentForm();
  };


  // =====================================================
  // SELECT PAYMENT METHOD
  // =====================================================

  const handleSelectPaymentMethod = (
    method
  ) => {

    setPaymentMethod(method);

    // Khi đổi phương thức
    // phải bỏ ngân hàng đã chọn

    setBankCode(null);

    // Xóa form cũ

    setCardNumber("");

    setCardHolder("");

    setIssueDate("");

    setOtp("");

    setPaymentError("");


    // 3 phương thức chưa hỗ trợ

    if (method !== "VNPAY") {

      setPaymentError(
        "Phương thức thanh toán này hiện chưa được hỗ trợ."
      );
    }
  };


  // =====================================================
  // SELECT BANK
  // =====================================================

  const handleSelectBank = (
    value
  ) => {

    setBankCode(value);

    setPaymentError("");
  };


  // =====================================================
  // CARD NUMBER
  // =====================================================

  const handleCardNumberChange = (
    event
  ) => {

    let value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 19);


    const groups =
      value.match(/.{1,4}/g);


    value =
      groups
        ? groups.join(" ")
        : "";


    setCardNumber(value);
  };


  // =====================================================
  // CARD HOLDER
  // =====================================================

  const handleCardHolderChange = (
    event
  ) => {

    const value =
      event.target.value.replace(
        /[^a-zA-ZÀ-ỹà-ỹ\s]/g,
        ""
      );


    setCardHolder(value);
  };


  // =====================================================
  // ISSUE DATE
  // =====================================================

  const handleIssueDateChange = (
    event
  ) => {

    let value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 4);


    if (value.length > 2) {

      value =
        value.slice(0, 2)
        + "/"
        + value.slice(2);
    }


    setIssueDate(value);
  };


  // =====================================================
  // OTP
  // =====================================================

  const handleOtpChange = (
    event
  ) => {

    setOtp(
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6)
    );
  };


  // =====================================================
  // VALIDATE VNPAY
  // =====================================================

  const validateVNPayForm = () => {

    // -------------------------------------------------
    // BANK
    // -------------------------------------------------

    if (!bankCode) {

      return (
        "Vui lòng chọn ngân hàng."
      );
    }


    // -------------------------------------------------
    // CARD NUMBER
    // -------------------------------------------------

    const cleanCardNumber =
      cardNumber.replace(/\s/g, "");


    if (
      !/^\d{16,19}$/.test(
        cleanCardNumber
      )
    ) {

      return (
        "Số thẻ phải gồm 16 - 19 chữ số."
      );
    }


    // -------------------------------------------------
    // CARD HOLDER
    // -------------------------------------------------

    if (
      !cardHolder.trim()
    ) {

      return (
        "Vui lòng nhập tên chủ thẻ."
      );
    }


    if (
      cardHolder.trim().length < 3
    ) {

      return (
        "Tên chủ thẻ không hợp lệ."
      );
    }


    // -------------------------------------------------
    // ISSUE DATE
    // -------------------------------------------------

    if (
      !/^\d{2}\/\d{2}$/.test(
        issueDate
      )
    ) {

      return (
        "Ngày phát hành phải có dạng MM/YY."
      );
    }


    // -------------------------------------------------
    // OTP
    // -------------------------------------------------

    if (
      !/^\d{6}$/.test(
        otp
      )
    ) {

      return (
        "Mã OTP phải gồm 6 chữ số."
      );
    }


    // -------------------------------------------------
    // DEMO OTP
    // -------------------------------------------------

    if (
      otp !== "123456"
    ) {

      return (
        "Mã OTP không đúng."
      );
    }


    return "";
  };


  // =====================================================
  // CONFIRM PAYMENT
  // =====================================================

  const handleConfirmPayment =
    async () => {

      if (!selectedInvoice) {

        return;
      }


      // -------------------------------------------------
      // CHỈ VNPAY
      // -------------------------------------------------

      if (
        paymentMethod !== "VNPAY"
      ) {

        setPaymentError(
          "Phương thức thanh toán này hiện chưa được hỗ trợ."
        );

        return;
      }


      // -------------------------------------------------
      // VALIDATE
      // -------------------------------------------------

      const validationError =
        validateVNPayForm();


      if (validationError) {

        setPaymentError(
          validationError
        );

        return;
      }


      try {

        setPaying(true);

        setPaymentError("");


        // -------------------------------------------------
        // GỌI BACKEND
        // -------------------------------------------------

        await payInvoice(
          selectedInvoice.id,
          "VNPAY"
        );


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        setPaymentSuccess(true);


        // -------------------------------------------------
        // LOAD DATA
        // -------------------------------------------------

        setTimeout(
          async () => {

            setSelectedInvoice(null);

            resetPaymentForm();

            await loadData();

          },
          1000
        );


      } catch (err) {

        console.error(
          "PAYMENT ERROR:",
          err
        );


        setPaymentError(
          err.message ||
          "Thanh toán thất bại."
        );

      } finally {

        setPaying(false);
      }
    };


  // =====================================================
  // SUMMARY
  // =====================================================

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
        !isPaid(invoice.status)
    ).length;


  const totalPaidAmount =
    invoices
      .filter(
        (invoice) =>
          isPaid(invoice.status)
      )
      .reduce(
        (sum, invoice) =>
          sum +
          Number(
            invoice.amount || 0
          ),
        0
      );


  const totalOutstanding =
    invoices
      .filter(
        (invoice) =>
          !isPaid(invoice.status)
      )
      .reduce(
        (sum, invoice) =>
          sum +
          Number(
            invoice.amount || 0
          ),
        0
      );


  // =====================================================
  // LOADING
  // =====================================================

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

          <div className="invoice-loading">
            Đang tải dữ liệu hóa đơn...
          </div>

        </main>

      </div>

    );
  }


  // =====================================================
  // ERROR
  // =====================================================

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

          <div className="invoice-error">

            <h2>
              Không thể tải dữ liệu
            </h2>

            <p>
              {error}
            </p>


            <button
              onClick={loadData}
            >
              Thử lại
            </button>

          </div>

        </main>

      </div>

    );
  }


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <div className="owner-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

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


      {/* =================================================
          MAIN
      ================================================= */}

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


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="invoice-summary">


          {/* TOTAL */}

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


          {/* PAID */}

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

              <small className="summary-money">

                {formatMoney(
                  totalPaidAmount
                )}

              </small>

            </div>

          </div>


          {/* UNPAID */}

          <div className="invoice-summary-card">

            <div className="invoice-summary-icon orange">
              ⏳
            </div>


            <div>

              <span>
                Chưa thanh toán
              </span>

              <strong>
                {unpaidInvoices}
              </strong>

              <small className="summary-money">

                Còn lại:{" "}

                {formatMoney(
                  totalOutstanding
                )}

              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            INVOICE LIST
        ================================================= */}

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


          {/* EMPTY */}

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

            invoices.map(
              (invoice) => {

                const paid =
                  isPaid(
                    invoice.status
                  );


                const overdue =
                  isOverdue(
                    invoice.status
                  );


                const unpaid =
                  isUnpaid(
                    invoice.status
                  );


                return (

                  <div
                    key={invoice.id}
                    className={
                      overdue
                        ? "invoice-item invoice-item-overdue"
                        : "invoice-item"
                    }
                  >


                    {/* LEFT */}

                    <div className="invoice-left">

                      <div className="invoice-icon">
                        💰
                      </div>


                      <div className="invoice-content">

                        <h3>

                          Hóa đơn tháng{" "}

                          {String(
                            invoice.month ?? ""
                          ).padStart(
                            2,
                            "0"
                          )}

                          /

                          {invoice.year}

                        </h3>


                        <p>

                          Hợp đồng #

                          {invoice.contractId}

                        </p>


                        <small>

                          Hạn thanh toán:{" "}

                          {formatDate(
                            invoice.dueDate
                          )}

                        </small>


                        {/* PAID DATE */}

                        {paid &&
                          invoice.paidDate && (

                            <small className="paid-info">

                              Đã thanh toán:{" "}

                              {formatDate(
                                invoice.paidDate
                              )}

                            </small>

                          )}


                        {/* PAYMENT METHOD */}

                        {paid &&
                          invoice.paymentMethod && (

                            <small className="paid-info">

                              Phương thức:{" "}

                              {getPaymentMethodName(
                                invoice.paymentMethod
                              )}

                            </small>

                          )}


                        {/* OVERDUE */}

                        {overdue && (

                          <small className="overdue-info">

                            Hóa đơn đã quá hạn thanh toán

                          </small>

                        )}

                      </div>

                    </div>


                    {/* RIGHT */}

                    <div className="invoice-right">

                      <strong>

                        {formatMoney(
                          invoice.amount
                        )}

                      </strong>


                      {/* PAID */}

                      {paid && (

                        <span className="invoice-paid">
                          Đã thanh toán
                        </span>

                      )}


                      {/* UNPAID */}

                      {unpaid && (

                        <div className="invoice-action-group">

                          <span className="invoice-unpaid">
                            Chưa thanh toán
                          </span>


                          <button
                            className="invoice-pay-button"
                            onClick={() =>
                              handleOpenPayment(
                                invoice
                              )
                            }
                          >
                            Thanh toán ngay
                          </button>

                        </div>

                      )}


                      {/* OVERDUE */}

                      {overdue && (

                        <div className="invoice-action-group">

                          <span className="invoice-overdue">
                            Quá hạn
                          </span>


                          <button
                            className="invoice-pay-button invoice-pay-overdue"
                            onClick={() =>
                              handleOpenPayment(
                                invoice
                              )
                            }
                          >
                            Thanh toán ngay
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                );

              }
            )

          )}

        </section>

      </main>


      {/* =================================================
          PAYMENT MODAL
      ================================================= */}

      {selectedInvoice && (

        <div
          className="payment-modal-overlay"
          onClick={handleClosePayment}
        >

          <div
            className="payment-modal vnpay-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =================================================
                SUCCESS
            ================================================= */}

            {paymentSuccess ? (

              <div className="payment-success">

                <div className="payment-success-icon">
                  ✓
                </div>


                <h2>
                  Thanh toán thành công
                </h2>


                <p>

                  Hóa đơn đã được cập nhật thành

                  <strong>
                    {" "}Đã thanh toán
                  </strong>

                </p>


                <div className="payment-success-amount">

                  {formatMoney(
                    selectedInvoice.amount
                  )}

                </div>


                <small>
                  Đang cập nhật dữ liệu...
                </small>

              </div>

            ) : (

              <>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="payment-modal-header">

                  <div>

                    <div className="vnpay-brand">
                      VNPay
                    </div>


                    <h2>
                      Thanh toán hóa đơn
                    </h2>


                    <p>

                      Hóa đơn tháng{" "}

                      {String(
                        selectedInvoice.month ?? ""
                      ).padStart(
                        2,
                        "0"
                      )}

                      /

                      {selectedInvoice.year}

                    </p>

                  </div>


                  <button
                    className="payment-modal-close"
                    onClick={
                      handleClosePayment
                    }
                    disabled={paying}
                  >
                    ×
                  </button>

                </div>


                {/* =================================================
                    AMOUNT
                ================================================= */}

                <div className="payment-modal-amount">

                  <div>

                    <span>
                      Số tiền thanh toán
                    </span>


                    <strong>

                      {formatMoney(
                        selectedInvoice.amount
                      )}

                    </strong>

                  </div>


                  <span className="payment-order-code">

                    INV-
                    {selectedInvoice.id}

                  </span>

                </div>


                {/* =================================================
                    PAYMENT METHOD
                ================================================= */}

                <div className="payment-method-title">

                  Phương thức thanh toán

                </div>


                {/* =================================================
                    4 METHODS
                ================================================= */}

                <div className="payment-method-tabs">


                  {/* =================================================
                      VNPAY
                  ================================================= */}

                  <button
                    type="button"
                    className={
                      paymentMethod === "VNPAY"
                        ? "payment-tab active"
                        : "payment-tab"
                    }
                    onClick={() =>
                      handleSelectPaymentMethod(
                        "VNPAY"
                      )
                    }
                  >

                    <span className="payment-tab-icon">
                      💳
                    </span>


                    <span>

                      <strong>
                        VNPay
                      </strong>

                      <small>
                        Thanh toán
                      </small>

                    </span>

                  </button>


                  {/* =================================================
                      MOMO
                  ================================================= */}

                  <button
                    type="button"
                    className={
                      paymentMethod === "MOMO"
                        ? "payment-tab active"
                        : "payment-tab"
                    }
                    onClick={() =>
                      handleSelectPaymentMethod(
                        "MOMO"
                      )
                    }
                  >

                    <span className="payment-tab-icon">
                      💗
                    </span>


                    <span>

                      <strong>
                        MoMo
                      </strong>

                      <small>
                        Ví điện tử
                      </small>

                    </span>

                  </button>


                  {/* =================================================
                      BANK
                  ================================================= */}

                  <button
                    type="button"
                    className={
                      paymentMethod === "BANK_TRANSFER"
                        ? "payment-tab active"
                        : "payment-tab"
                    }
                    onClick={() =>
                      handleSelectPaymentMethod(
                        "BANK_TRANSFER"
                      )
                    }
                  >

                    <span className="payment-tab-icon">
                      🏦
                    </span>


                    <span>

                      <strong>
                        Ngân hàng
                      </strong>

                      <small>
                        Chuyển khoản
                      </small>

                    </span>

                  </button>


                  {/* =================================================
                      CASH
                  ================================================= */}

                  <button
                    type="button"
                    className={
                      paymentMethod === "CASH"
                        ? "payment-tab active"
                        : "payment-tab"
                    }
                    onClick={() =>
                      handleSelectPaymentMethod(
                        "CASH"
                      )
                    }
                  >

                    <span className="payment-tab-icon">
                      💵
                    </span>


                    <span>

                      <strong>
                        Tiền mặt
                      </strong>

                      <small>
                        Trực tiếp
                      </small>

                    </span>

                  </button>

                </div>


                {/* =================================================
                    CHƯA CHỌN PHƯƠNG THỨC
                ================================================= */}

                {paymentMethod === null && (

                  <div className="payment-method-empty">

                    <div className="payment-method-empty-icon">
                      💳
                    </div>


                    <h3>
                      Chọn phương thức thanh toán
                    </h3>


                    <p>
                      Vui lòng chọn một phương thức
                      để tiếp tục.
                    </p>

                  </div>

                )}


                {/* =================================================
                    VNPAY
                ================================================= */}

                {paymentMethod === "VNPAY" && (

                  <div className="vnpay-payment-box">


                    {/* HEADER */}

                    <div className="vnpay-payment-header">

                      <div>

                        <div className="vnpay-small-brand">
                          PAYMENT GATEWAY
                        </div>


                        <h3>
                          Thanh toán qua VNPay
                        </h3>

                      </div>


                      <span className="vnpay-secure">
                        🔒 An toàn
                      </span>

                    </div>


                    {/* NOTE */}

                    <div className="vnpay-demo-note">

                      <span>
                        ℹ️
                      </span>


                      <p>

                        Chọn ngân hàng để tiếp tục
                        thanh toán.

                      </p>

                    </div>


                    {/* =================================================
                        BANK LIST
                    ================================================= */}

                    <div className="payment-field">

                      <label>
                        Chọn ngân hàng
                      </label>


                      <div className="bank-select-list">

                        {bankOptions.map(
                          (bank) => (

                            <button
                              key={bank.value}
                              type="button"
                              className={
                                bankCode === bank.value
                                  ? "bank-select-item selected"
                                  : "bank-select-item"
                              }
                              onClick={() =>
                                handleSelectBank(
                                  bank.value
                                )
                              }
                            >

                              <div className="bank-logo-box">

                                <img
                                  src={bank.logo}
                                  alt={bank.label}
                                  className="bank-logo"
                                  onError={(event) => {

                                    event.currentTarget.onerror =
                                      null;

                                    event.currentTarget.src =
                                      "https://www.google.com/s2/favicons?domain=google.com&sz=128";

                                  }}
                                />

                              </div>


                              <div className="bank-select-content">

                                <strong>
                                  {bank.label}
                                </strong>

                                <small>
                                  {bank.description}
                                </small>

                              </div>


                              <span className="bank-check">

                                {bankCode ===
                                bank.value
                                  ? "✓"
                                  : ""}

                              </span>

                            </button>

                          )
                        )}

                      </div>

                    </div>


                    {/* =================================================
                        CHƯA CHỌN BANK
                    ================================================= */}

                    {!bankCode && (

                      <div className="bank-required-message">

                        <div className="bank-required-icon">
                          🏦
                        </div>


                        <div>

                          <h4>
                            Chọn ngân hàng để tiếp tục
                          </h4>


                          <p>
                            Vui lòng chọn một ngân hàng
                            ở trên trước khi nhập thông tin.
                          </p>

                        </div>

                      </div>

                    )}


                    {/* =================================================
                        FORM
                        CHỈ HIỆN KHI ĐÃ CHỌN BANK
                    ================================================= */}

                    {bankCode && (

                      <>

                        {/* SỐ THẺ */}

                        <div className="payment-field">

                          <label>
                            Số thẻ
                          </label>


                          <input
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={
                              handleCardNumberChange
                            }
                            placeholder="Nhập số thẻ"
                            maxLength={23}
                          />

                        </div>


                        {/* TÊN CHỦ THẺ */}

                        <div className="payment-field">

                          <label>
                            Tên chủ thẻ
                          </label>


                          <input
                            type="text"
                            value={cardHolder}
                            onChange={
                              handleCardHolderChange
                            }
                            placeholder="NGUYEN VAN A"
                          />

                        </div>


                        {/* NGÀY PHÁT HÀNH */}

                        <div className="payment-field">

                          <label>
                            Ngày phát hành
                          </label>


                          <input
                            type="text"
                            value={issueDate}
                            onChange={
                              handleIssueDateChange
                            }
                            placeholder="MM/YY"
                            maxLength={5}
                          />

                        </div>


                        {/* OTP */}

                        <div className="payment-field">

                          <label>
                            Mã OTP
                          </label>


                          <input
                            type="password"
                            inputMode="numeric"
                            value={otp}
                            onChange={
                              handleOtpChange
                            }
                            placeholder="Nhập mã OTP"
                            maxLength={6}
                          />

                        </div>


                        {/* OTP NOTE */}

                        <div className="otp-demo-note">

                          <span>
                            🔑
                          </span>


                          <p>
                            Mã OTP kiểm thử:
                            <strong>
                              {" "}123456
                            </strong>
                          </p>

                        </div>


                        {/* ERROR */}

                        {paymentError && (

                          <div className="payment-modal-error">

                            <span>
                              ⚠
                            </span>


                            <p>
                              {paymentError}
                            </p>

                          </div>

                        )}


                        {/* FOOTER */}

                        <div className="payment-modal-footer">

                          <button
                            className="payment-cancel-button"
                            onClick={
                              handleClosePayment
                            }
                            disabled={paying}
                          >
                            Hủy
                          </button>


                          <button
                            className="payment-confirm-button"
                            onClick={
                              handleConfirmPayment
                            }
                            disabled={paying}
                          >

                            {paying
                              ? "Đang xử lý..."
                              : "Thanh toán"}

                          </button>

                        </div>

                      </>

                    )}


                    {/* =================================================
                        ERROR KHI CHƯA CHỌN BANK
                    ================================================= */}

                    {!bankCode &&
                      paymentError && (

                        <div className="payment-modal-error">

                          <span>
                            ⚠
                          </span>


                          <p>
                            {paymentError}
                          </p>

                        </div>

                      )}

                  </div>

                )}


                {/* =================================================
                    MOMO
                ================================================= */}

                {paymentMethod === "MOMO" && (

                  <div className="unsupported-payment-card">

                    <div className="unsupported-payment-icon">
                      💗
                    </div>


                    <div>

                      <h3>
                        Thanh toán MoMo
                      </h3>


                      <p>
                        Phương thức thanh toán này
                        hiện chưa được hỗ trợ.
                      </p>

                    </div>

                  </div>

                )}


                {/* =================================================
                    BANK TRANSFER
                ================================================= */}

                {paymentMethod === "BANK_TRANSFER" && (

                  <div className="unsupported-payment-card">

                    <div className="unsupported-payment-icon">
                      🏦
                    </div>


                    <div>

                      <h3>
                        Chuyển khoản ngân hàng
                      </h3>


                      <p>
                        Phương thức thanh toán này
                        hiện chưa được hỗ trợ.
                      </p>

                    </div>

                  </div>

                )}


                {/* =================================================
                    CASH
                ================================================= */}

                {paymentMethod === "CASH" && (

                  <div className="unsupported-payment-card">

                    <div className="unsupported-payment-icon">
                      💵
                    </div>


                    <div>

                      <h3>
                        Thanh toán tiền mặt
                      </h3>


                      <p>
                        Phương thức thanh toán này
                        hiện chưa được hỗ trợ.
                      </p>

                    </div>

                  </div>

                )}

              </>

            )}

          </div>

        </div>

      )}

    </div>

  );
}


export default OwnerInvoice;