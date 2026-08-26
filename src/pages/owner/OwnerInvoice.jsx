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
  // =====================================================

  const [paymentMethod, setPaymentMethod] =
    useState("VNPAY");


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
    useState("NCB");


  const [cardNumber, setCardNumber] =
    useState("");


  const [cardHolder, setCardHolder] =
    useState("");


  const [issueDate, setIssueDate] =
    useState("");


  const [otp, setOtp] =
    useState("");


  // =====================================================
  // DANH SÁCH NGÂN HÀNG
  // Logo lấy từ website tương ứng
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
      description: "Ngân hàng Đầu tư và Phát triển Việt Nam",
      logo:
        "https://www.google.com/s2/favicons?domain=bidv.com.vn&sz=128",
    },

    {
      value: "VIETINBANK",
      label: "VietinBank",
      description: "Ngân hàng Công thương Việt Nam",
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


      // OWNER

      const ownerData =
        await getCurrentOwner();


      setOwner(ownerData);


      // INVOICE

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
  // STATUS
  // =====================================================

  const normalizeStatus = (status) => {

    return String(status || "")
      .trim()
      .toUpperCase();
  };


  const isPaid = (status) => {

    return (
      normalizeStatus(status) ===
      "PAID"
    );
  };


  const isOverdue = (status) => {

    return (
      normalizeStatus(status) ===
      "OVERDUE"
    );
  };


  const isUnpaid = (status) => {

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
  // RESET FORM
  // =====================================================

  const resetPaymentForm = () => {

    setPaymentMethod("VNPAY");

    setBankCode("NCB");

    setCardNumber("");

    setCardHolder("");

    setIssueDate("");

    setOtp("");

    setPaymentError("");

    setPaymentSuccess(false);
  };


  // =====================================================
  // OPEN MODAL
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
  // CLOSE MODAL
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

    setPaymentError("");

    // Các phương thức khác chưa được xử lý
    if (method !== "VNPAY") {

      setPaymentError(
        "Phương thức thanh toán này hiện chưa được hỗ trợ."
      );
    }
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
      event.target.value
        .replace(
          /[^a-zA-ZÀ-ỹà-ỹ\s]/g,
          ""
        );


    setCardHolder(value);
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
  // VNPAY VALIDATION
  // =====================================================

  const validateVNPayForm = () => {

    // ------------------------------------------
    // CARD
    // ------------------------------------------

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


    // ------------------------------------------
    // CARD HOLDER
    // ------------------------------------------

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


    // ------------------------------------------
    // ISSUE DATE
    // ------------------------------------------

    if (
      !/^\d{2}\/\d{2}$/.test(
        issueDate
      )
    ) {

      return (
        "Ngày phát hành phải có dạng MM/YY."
      );
    }


    // ------------------------------------------
    // OTP
    // ------------------------------------------

    if (
      !/^\d{6}$/.test(otp)
    ) {

      return (
        "Mã OTP phải gồm 6 chữ số."
      );
    }


    // ------------------------------------------
    // DEMO OTP
    // ------------------------------------------

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

  const handleConfirmPayment = async () => {

    if (!selectedInvoice) {

      return;
    }


    // Chỉ VNPay được xử lý

    if (
      paymentMethod !== "VNPAY"
    ) {

      setPaymentError(
        "Phương thức thanh toán này hiện chưa được hỗ trợ."
      );

      return;
    }


    // Validate

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


      // ==========================================
      // GỌI BACKEND
      // ==========================================

      await payInvoice(
        selectedInvoice.id,
        "VNPAY"
      );


      // ==========================================
      // THÀNH CÔNG
      // ==========================================

      setPaymentSuccess(true);


      // Đợi để hiển thị màn hình thành công

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
                  isPaid(invoice.status);

                const overdue =
                  isOverdue(invoice.status);

                const unpaid =
                  isUnpaid(invoice.status);


                return (

                  <div
                    className={
                      overdue
                        ? "invoice-item invoice-item-overdue"
                        : "invoice-item"
                    }
                    key={invoice.id}
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
                          ).padStart(2, "0")}
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


                        {paid &&
                          invoice.paidDate && (

                            <small className="paid-info">
                              Đã thanh toán:{" "}
                              {formatDate(
                                invoice.paidDate
                              )}
                            </small>

                          )}


                        {paid &&
                          invoice.paymentMethod && (

                            <small className="paid-info">
                              Phương thức:{" "}
                              {getPaymentMethodName(
                                invoice.paymentMethod
                              )}
                            </small>

                          )}


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


                      {paid && (

                        <span className="invoice-paid">
                          Đã thanh toán
                        </span>

                      )}


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
                  </strong>.
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
                      ).padStart(2, "0")}
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
                    INV-{selectedInvoice.id}
                  </span>

                </div>


                {/* =================================================
                    METHOD TITLE
                ================================================= */}

                <div className="payment-method-title">

                  <span>
                    Phương thức thanh toán
                  </span>

                </div>


                {/* =================================================
                    PAYMENT METHODS
                ================================================= */}

                <div className="payment-method-tabs">


                  {/* VNPay */}

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


                  {/* MoMo */}

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


                  {/* Ngân hàng */}

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


                  {/* Tiền mặt */}

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
                    VNPAY
                ================================================= */}

                {paymentMethod === "VNPAY" && (

                  <div className="vnpay-payment-box">


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


                    {/* ==========================================
                        BANK LIST
                    =========================================== */}

                    <div className="payment-field">

                      <label>
                        Chọn ngân hàng
                      </label>


                      <div className="bank-select-list">

                        {bankOptions.map(
                          (bank) => (

                            <button
                              type="button"
                              key={bank.value}
                              className={
                                bankCode === bank.value
                                  ? "bank-select-item selected"
                                  : "bank-select-item"
                              }
                              onClick={() => {

                                setBankCode(
                                  bank.value
                                );

                                setPaymentError("");

                              }}
                            >

                              <div className="bank-logo-box">

                                <img
                                  src={bank.logo}
                                  alt={bank.label}
                                  className="bank-logo"
                                  onError={(event) => {

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

                                {bankCode === bank.value
                                  ? "✓"
                                  : ""}

                              </span>

                            </button>

                          )
                        )}

                      </div>

                    </div>


                    {/* ==========================================
                        CARD NUMBER
                    =========================================== */}

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


                    {/* ==========================================
                        CARD HOLDER
                    =========================================== */}

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


                    {/* ==========================================
                        ISSUE DATE
                    =========================================== */}

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


                    {/* ==========================================
                        OTP
                    =========================================== */}

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


                    {/* ==========================================
                        OTP NOTE
                    =========================================== */}

                    <div className="otp-demo-note">

                      <span>
                        🔑
                      </span>

                      <p>
                        Mã OTP dùng cho bài demo:
                        <strong>
                          {" "}123456
                        </strong>
                      </p>

                    </div>


                    {/* ==========================================
                        ERROR
                    =========================================== */}

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


                    {/* ==========================================
                        FOOTER
                    =========================================== */}

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