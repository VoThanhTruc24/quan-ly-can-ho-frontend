import "./OwnerHome.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const API_BASE_URL =
  "http://localhost:8080/api";


function OwnerHome() {

  const navigate =
    useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [owner, setOwner] =
    useState(null);


  const [apartments, setApartments] =
    useState([]);


  const [contracts, setContracts] =
    useState([]);


  const [invoices, setInvoices] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {

    return localStorage.getItem("token");

  };


  // =====================================================
  // LOAD OWNER DATA
  // =====================================================

  useEffect(() => {

    const loadOwnerData =
      async () => {

        console.log(
          "🔥 OWNER HOME ĐÃ LOAD"
        );


        const token =
          getToken();


        // -------------------------------------------------
        // CHƯA ĐĂNG NHẬP
        // -------------------------------------------------

        if (!token) {

          navigate("/login");

          return;
        }


        try {

          setLoading(true);

          setError("");


          const headers = {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          };


          // =================================================
          // 1. OWNER
          // =================================================

          console.log(
            "🔥 GET /owner/me"
          );


          const ownerResponse =
            await fetch(
              `${API_BASE_URL}/owner/me`,
              {
                method: "GET",
                headers,
              }
            );


          if (!ownerResponse.ok) {

            throw new Error(
              `Không lấy được thông tin Owner: ${ownerResponse.status}`
            );

          }


          const ownerData =
            await ownerResponse.json();


          console.log(
            "✅ OWNER:",
            ownerData
          );


          setOwner(
            ownerData
          );


          // =================================================
          // 2. APARTMENTS
          // =================================================

          console.log(
            "🔥 GET /owner/me/apartments"
          );


          const apartmentResponse =
            await fetch(
              `${API_BASE_URL}/owner/me/apartments`,
              {
                method: "GET",
                headers,
              }
            );


          if (!apartmentResponse.ok) {

            throw new Error(
              `Không lấy được căn hộ: ${apartmentResponse.status}`
            );

          }


          const apartmentData =
            await apartmentResponse.json();


          console.log(
            "✅ APARTMENTS:",
            apartmentData
          );


          setApartments(
            Array.isArray(
              apartmentData
            )
              ? apartmentData
              : []
          );


          // =================================================
          // 3. CONTRACTS
          // =================================================

          console.log(
            "🔥 GET /owner/me/contracts"
          );


          const contractResponse =
            await fetch(
              `${API_BASE_URL}/owner/me/contracts`,
              {
                method: "GET",
                headers,
              }
            );


          if (!contractResponse.ok) {

            throw new Error(
              `Không lấy được hợp đồng: ${contractResponse.status}`
            );

          }


          const contractData =
            await contractResponse.json();


          console.log(
            "✅ CONTRACTS:",
            contractData
          );


          setContracts(
            Array.isArray(
              contractData
            )
              ? contractData
              : []
          );


          // =================================================
          // 4. INVOICES
          //
          // API mới của Owner
          // =================================================

          console.log(
            "🔥 GET /owner/me/invoices"
          );


          const invoiceResponse =
            await fetch(
              `${API_BASE_URL}/owner/me/invoices`,
              {
                method: "GET",
                headers,
              }
            );


          if (!invoiceResponse.ok) {

            // Không để cả trang Home chết
            // nếu invoice API có vấn đề

            console.warn(
              "⚠️ Không lấy được invoice:",
              invoiceResponse.status
            );


            setInvoices([]);

          } else {

            const invoiceData =
              await invoiceResponse.json();


            console.log(
              "✅ INVOICES:",
              invoiceData
            );


            setInvoices(
              Array.isArray(
                invoiceData
              )
                ? invoiceData
                : []
            );

          }

        } catch (err) {

          console.error(
            "❌ OWNER DATA ERROR:",
            err
          );


          setError(
            err.message ||
            "Không thể tải dữ liệu Owner"
          );

        } finally {

          setLoading(false);
        }

      };


    loadOwnerData();

  }, [navigate]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "fullName"
    );


    navigate("/login");

  };


  // =====================================================
  // OWNER NAME
  // =====================================================

  const displayName =
    owner?.fullName ||
    owner?.username ||
    "Chủ căn hộ";


  // =====================================================
  // APARTMENT ĐẦU TIÊN
  // =====================================================

  const apartment =
    apartments.length > 0
      ? apartments[0]
      : null;


  // =====================================================
  // CONTRACT ĐẦU TIÊN
  // =====================================================

  const contract =
    contracts.length > 0
      ? contracts[0]
      : null;


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "Chưa có dữ liệu";
    }


    const number =
      Number(value);


    if (
      Number.isNaN(number)
    ) {

      return String(value);
    }


    return (
      number.toLocaleString(
        "vi-VN"
      ) + " đ"
    );
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    value
  ) => {

    if (!value) {

      return "Chưa có dữ liệu";
    }


    const text =
      String(value);


    // -------------------------------------------------
    // YYYY-MM-DD
    // -------------------------------------------------

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        text
      )
    ) {

      const [
        year,
        month,
        day,
      ] =
        text.split("-");


      return (
        `${day}/${month}/${year}`
      );
    }


    try {

      const date =
        new Date(value);


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return text;
      }


      return date.toLocaleDateString(
        "vi-VN"
      );

    } catch {

      return text;
    }
  };


  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const normalizeStatus = (
    status
  ) => {

    return String(
      status || ""
    )
      .trim()
      .toUpperCase();
  };


  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getInvoiceStatusLabel = (
    status
  ) => {

    const normalized =
      normalizeStatus(
        status
      );


    if (
      normalized === "PAID"
    ) {

      return "Đã thanh toán";
    }


    if (
      normalized === "OVERDUE"
    ) {

      return "Quá hạn";
    }


    if (
      normalized === "UNPAID"
    ) {

      return "Chưa thanh toán";
    }


    return (
      status ||
      "Chưa có trạng thái"
    );
  };


  // =====================================================
  // GET RENT PRICE
  //
  // Ưu tiên:
  // contract.rentPrice
  // contract.rent
  // contract.rentalPrice
  // contract.monthlyRent
  // contract.price
  //
  // Nếu không có thì lấy invoice amount
  // thuộc contract này
  // =====================================================

  const getRentPrice = (
    targetContract
  ) => {

    if (!targetContract) {

      return null;
    }


    const possibleValues = [

      targetContract.rentPrice,

      targetContract.rent,

      targetContract.rentalPrice,

      targetContract.monthlyRent,

      targetContract.monthlyPrice,

      targetContract.price,

    ];


    for (
      const value of possibleValues
    ) {

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {

        const number =
          Number(value);


        if (
          !Number.isNaN(number)
        ) {

          return number;
        }

      }

    }


    // -------------------------------------------------
    // LẤY TỪ INVOICE
    // -------------------------------------------------

    if (
      targetContract.id !== null &&
      targetContract.id !== undefined
    ) {

      const contractInvoices =
        invoices
          .filter(
            (invoice) =>
              Number(
                invoice.contractId
              ) ===
              Number(
                targetContract.id
              )
          )
          .sort(
            (a, b) => {

              const yearA =
                Number(
                  a.year || 0
                );

              const yearB =
                Number(
                  b.year || 0
                );


              if (
                yearA !== yearB
              ) {

                return (
                  yearB -
                  yearA
                );
              }


              const monthA =
                Number(
                  a.month || 0
                );

              const monthB =
                Number(
                  b.month || 0
                );


              return (
                monthB -
                monthA
              );
            }
          );


      if (
        contractInvoices.length > 0
      ) {

        const invoiceAmount =
          contractInvoices[0].amount;


        if (
          invoiceAmount !== null &&
          invoiceAmount !== undefined
        ) {

          const number =
            Number(
              invoiceAmount
            );


          if (
            !Number.isNaN(number)
          ) {

            return number;
          }

        }

      }

    }


    return null;
  };


  // =====================================================
  // RENT PRICE HIỆN TẠI
  // =====================================================

  const rentPrice =
    getRentPrice(
      contract
    );


  // =====================================================
  // INVOICE GẦN NHẤT
  //
  // Sort theo:
  // year DESC
  // month DESC
  // id DESC
  // =====================================================

  const latestInvoice =
    [...invoices]
      .sort(
        (a, b) => {

          const yearA =
            Number(
              a.year || 0
            );

          const yearB =
            Number(
              b.year || 0
            );


          if (
            yearA !== yearB
          ) {

            return (
              yearB -
              yearA
            );
          }


          const monthA =
            Number(
              a.month || 0
            );

          const monthB =
            Number(
              b.month || 0
            );


          if (
            monthA !== monthB
          ) {

            return (
              monthB -
              monthA
            );
          }


          return (
            Number(
              b.id || 0
            ) -
            Number(
              a.id || 0
            )
          );
        }
      )[0] || null;


  // =====================================================
  // INVOICE STATUS CLASS
  // =====================================================

  const getInvoiceClassName = (
    status
  ) => {

    const normalized =
      normalizeStatus(
        status
      );


    if (
      normalized === "PAID"
    ) {

      return "invoice-status-paid";
    }


    if (
      normalized === "OVERDUE"
    ) {

      return "invoice-status-overdue";
    }


    return "invoice-status-unpaid";
  };


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

        </aside>


        <main className="owner-main">

          <div
            style={{
              padding: "50px",
              fontSize: "20px",
            }}
          >

            Đang tải dữ liệu Owner...

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


  // =====================================================
  // UI
  // =====================================================

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
              navigate(
                "/owner/apartment"
              )
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
              navigate(
                "/owner/contract"
              )
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
              navigate(
                "/owner/invoice"
              )
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
              navigate(
                "/owner/profile"
              )
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


        {/* =================================================
            HEADER
        ================================================= */}

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
                {apartments.length}
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
                {contracts.length}
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

                {rentPrice !== null
                  ? formatMoney(
                      rentPrice
                    )
                  : "Chưa có dữ liệu"}

              </strong>

            </div>

          </div>


        </section>


        {/* =================================================
            APARTMENT
        ================================================= */}

        <section className="owner-section">


          <div className="owner-section-header">

            <div>

              <h2>
                Căn hộ của tôi
              </h2>


              <p>
                Thông tin căn hộ của bạn
              </p>

            </div>


            <button
              className="view-button"
              onClick={() =>
                navigate(
                  "/owner/apartment"
                )
              }
            >

              Xem chi tiết

              <span>
                →
              </span>

            </button>

          </div>


          {apartment ? (

            <div className="owner-apartment-card">


              <div className="apartment-image">
                🏢
              </div>


              <div className="apartment-main-info">


                <div className="apartment-title-row">

                  <div>

                    <h3>
                      {apartment.name ||
                        "Chưa có tên căn hộ"}
                    </h3>


                    <p>
                      {apartment.floor
                        ?.block
                        ?.name ||
                        "Chưa có thông tin tòa nhà"}
                    </p>

                  </div>


                  <span className="active-badge">

                    {apartment.status ||
                      "Chưa có trạng thái"}

                  </span>

                </div>


                <div className="apartment-details">


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
                      {apartment.floor
                        ?.block
                        ?.name ||
                        "Chưa có dữ liệu"}
                    </strong>

                  </div>


                  {/* DIỆN TÍCH */}

                  <div>

                    <span>
                      📐 Diện tích
                    </span>


                    <strong>

                      {apartment.area !==
                        null &&
                      apartment.area !==
                        undefined

                        ? `${apartment.area} m²`

                        : "Chưa có dữ liệu"}

                    </strong>

                  </div>


                  {/* GIÁ THUÊ */}

                  <div>

                    <span>
                      💰 Giá thuê
                    </span>


                    <strong
                      className="rent-price"
                    >

                      {rentPrice !==
                        null

                        ? `${formatMoney(
                            rentPrice
                          )}/tháng`

                        : "Chưa có dữ liệu"}

                    </strong>

                  </div>


                </div>

              </div>

            </div>

          ) : (

            <div
              className="owner-apartment-card"
              style={{
                justifyContent:
                  "center",

                padding:
                  "40px",
              }}
            >

              <strong>
                Bạn chưa được gán căn hộ.
              </strong>

            </div>

          )}

        </section>


        {/* =================================================
            CONTRACT
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
                navigate(
                  "/owner/contract"
                )
              }
            >

              Xem chi tiết

              <span>
                →
              </span>

            </button>

          </div>


          {contract ? (

            <div className="owner-contract-card">


              <div className="contract-icon">
                📄
              </div>


              <div className="contract-main">

                <div>

                  <h3>

                    Hợp đồng thuê{" "}

                    {apartment?.name ||
                      ""}

                  </h3>


                  <p>

                    Mã hợp đồng:{" "}

                    {contract.id ||
                      "Chưa có mã"}

                  </p>

                </div>


                <span className="active-badge">

                  {contract.status ||
                    "Đang hiệu lực"}

                </span>

              </div>


              <div className="contract-details">


                {/* START */}

                <div>

                  <span>
                    Ngày bắt đầu
                  </span>


                  <strong>
                    {formatDate(
                      contract.startDate
                    )}
                  </strong>

                </div>


                {/* END */}

                <div>

                  <span>
                    Ngày kết thúc
                  </span>


                  <strong>
                    {formatDate(
                      contract.endDate
                    )}
                  </strong>

                </div>


                {/* RENT */}

                <div>

                  <span>
                    Tiền thuê
                  </span>


                  <strong
                    className="rent-price"
                  >

                    {rentPrice !==
                      null

                      ? `${formatMoney(
                          rentPrice
                        )}/tháng`

                      : "Chưa có dữ liệu"}

                  </strong>

                </div>


              </div>

            </div>

          ) : (

            <div
              className="owner-contract-card"
              style={{
                justifyContent:
                  "center",

                padding:
                  "40px",
              }}
            >

              <strong>
                Chưa có hợp đồng.
              </strong>

            </div>

          )}

        </section>


        {/* =================================================
            LATEST INVOICE
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
                navigate(
                  "/owner/invoice"
                )
              }
            >

              Xem tất cả

              <span>
                →
              </span>

            </button>

          </div>


          {latestInvoice ? (

            <div className="owner-invoice-card">


              <div className="invoice-icon">
                💰
              </div>


              <div className="invoice-main">


                <h3>

                  Hóa đơn tháng{" "}

                  {String(
                    latestInvoice.month ||
                    ""
                  ).padStart(
                    2,
                    "0"
                  )}

                  /

                  {latestInvoice.year}

                </h3>


                <p>

                  Hợp đồng #

                  {latestInvoice.contractId}

                </p>


                <small>

                  Hạn thanh toán:{" "}

                  {formatDate(
                    latestInvoice.dueDate
                  )}

                </small>


              </div>


              <div className="invoice-amount">


                <strong>

                  {formatMoney(
                    latestInvoice.amount
                  )}

                </strong>


                <span
                  className={
                    getInvoiceClassName(
                      latestInvoice.status
                    )
                  }
                >

                  {getInvoiceStatusLabel(
                    latestInvoice.status
                  )}

                </span>


              </div>


            </div>

          ) : (

            <div className="owner-invoice-card">


              <div className="invoice-icon">
                💰
              </div>


              <div className="invoice-main">

                <h3>
                  Chưa có hóa đơn
                </h3>


                <p>
                  Hiện chưa có hóa đơn
                  cho các hợp đồng của bạn.
                </p>

              </div>


              <div className="invoice-amount">

                <strong>
                  --
                </strong>

              </div>


            </div>

          )}

        </section>


      </main>

    </div>

  );

}


export default OwnerHome;