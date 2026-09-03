import "./OwnerContract.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCurrentOwner,
  getMyContracts,
  getMyInvoices,
} from "../../services/ownerService";


function OwnerContract() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [owner, setOwner] =
    useState(null);

  const [contracts, setContracts] =
    useState([]);

  const [invoices, setInvoices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      const token =
        localStorage.getItem("token");


      // -------------------------------------------------
      // CHECK LOGIN
      // -------------------------------------------------

      if (!token) {

        navigate("/login");

        return;
      }


      try {

        setLoading(true);

        setError("");


        // =================================================
        // OWNER
        // =================================================

        const ownerData =
          await getCurrentOwner();


        console.log(
          "✅ OWNER:",
          ownerData
        );


        setOwner(
          ownerData
        );


        // =================================================
        // CONTRACTS
        // =================================================

        const contractData =
          await getMyContracts();


        console.log(
          "✅ CONTRACTS:",
          contractData
        );


        setContracts(
          Array.isArray(contractData)
            ? contractData
            : []
        );


        // =================================================
        // INVOICES
        //
        // Dùng để lấy tiền thuê nếu Contract
        // không trả rentPrice.
        // =================================================

        try {

          const invoiceData =
            await getMyInvoices();


          console.log(
            "✅ INVOICES:",
            invoiceData
          );


          setInvoices(
            Array.isArray(invoiceData)
              ? invoiceData
              : []
          );

        } catch (invoiceError) {

          console.warn(
            "⚠️ Không lấy được invoice:",
            invoiceError
          );


          // Invoice lỗi không làm hỏng
          // trang hợp đồng.

          setInvoices([]);

        }

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


  // =====================================================
  // OWNER NAME
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
      ) + " đ/tháng"
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


    // -------------------------------------------------
    // FALLBACK
    // -------------------------------------------------

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
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (
    status
  ) => {

    if (!status) {

      return "Chưa có trạng thái";
    }


    switch (
      String(status)
        .trim()
        .toUpperCase()
    ) {

      case "ACTIVE":
        return "Đang hiệu lực";

      case "INACTIVE":
        return "Không hiệu lực";

      case "EXPIRED":
        return "Đã hết hạn";

      case "TERMINATED":
        return "Đã chấm dứt";

      case "RENTING":
        return "Đang thuê";

      default:
        return status;

    }

  };


  // =====================================================
  // NUMBER
  // =====================================================

  const getNumberValue = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return null;
    }


    const number =
      Number(value);


    if (
      Number.isNaN(number)
    ) {

      return null;
    }


    return number;

  };


  // =====================================================
  // GET RENT FROM INVOICE
  // =====================================================

  const getInvoiceRentPrice = (
    contractId
  ) => {

    if (
      contractId === null ||
      contractId === undefined
    ) {

      return null;
    }


    const matchedInvoices =
      invoices
        .filter(
          (invoice) =>

            Number(
              invoice.contractId
            ) ===

            Number(
              contractId
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
        );


    if (
      matchedInvoices.length === 0
    ) {

      return null;
    }


    for (
      const invoice
      of matchedInvoices
    ) {

      const amount =
        getNumberValue(
          invoice.amount
        );


      if (
        amount !== null
      ) {

        return amount;
      }

    }


    return null;

  };


  // =====================================================
  // GET RENT PRICE
  //
  // Ưu tiên:
  // contract.rentPrice
  // contract.rent
  // contract.rentalPrice
  // contract.monthlyRent
  // contract.monthlyPrice
  // contract.price
  //
  // Nếu không có -> invoice.amount
  // =====================================================

  const getRentPrice = (
    contract
  ) => {

    if (!contract) {

      return null;
    }


    const values = [

      contract.rentPrice,

      contract.rent,

      contract.rentalPrice,

      contract.monthlyRent,

      contract.monthlyPrice,

      contract.price,

    ];


    // -------------------------------------------------
    // TỪ CONTRACT
    // -------------------------------------------------

    for (
      const value
      of values
    ) {

      const number =
        getNumberValue(
          value
        );


      if (
        number !== null
      ) {

        return number;
      }

    }


    // -------------------------------------------------
    // TỪ INVOICE
    // -------------------------------------------------

    return getInvoiceRentPrice(
      contract.id
    );

  };


  // =====================================================
  // ADD MONTHS
  //
  // Hàm này dùng để tính:
  //
  // 15/01 + 11 tháng = 15/12
  //
  // Không dùng trực tiếp new Date(year, month + n, day)
  // vì những ngày như 31/01 + 1 tháng có thể bị
  // JavaScript nhảy sang tháng tiếp theo.
  // =====================================================

  const addMonthsClamped = (
    date,
    months
  ) => {

    const year =
      date.getFullYear();

    const month =
      date.getMonth();

    const day =
      date.getDate();


    // Ngày cuối của tháng đích

    const lastDay =
      new Date(
        year,
        month + months + 1,
        0
      ).getDate();


    const safeDay =
      Math.min(
        day,
        lastDay
      );


    return new Date(
      year,
      month + months,
      safeDay
    );

  };


  // =====================================================
  // GET CONTRACT DURATION
  //
  // TÍNH CHÍNH XÁC:
  //
  // 15/01/2026 -> 31/12/2026
  // = 11 tháng 16 ngày
  //
  // 01/03/2026 -> 28/02/2027
  // = 12 tháng
  //
  // 01/05/2026 -> 30/04/2027
  // = 12 tháng
  // =====================================================

  const getContractDuration = (
    contract
  ) => {

    if (!contract) {

      return "Chưa có dữ liệu";
    }


    if (
      !contract.startDate ||
      !contract.endDate
    ) {

      return "Chưa có dữ liệu";
    }


    // =================================================
    // PARSE START DATE
    // =================================================

    const startParts =
      String(
        contract.startDate
      ).split("-");


    // =================================================
    // PARSE END DATE
    // =================================================

    const endParts =
      String(
        contract.endDate
      ).split("-");


    if (
      startParts.length !== 3 ||
      endParts.length !== 3
    ) {

      return "Chưa có dữ liệu";
    }


    const startYear =
      Number(
        startParts[0]
      );

    const startMonth =
      Number(
        startParts[1]
      );

    const startDay =
      Number(
        startParts[2]
      );


    const endYear =
      Number(
        endParts[0]
      );

    const endMonth =
      Number(
        endParts[1]
      );

    const endDay =
      Number(
        endParts[2]
      );


    if (
      !startYear ||
      !startMonth ||
      !startDay ||
      !endYear ||
      !endMonth ||
      !endDay
    ) {

      return "Chưa có dữ liệu";
    }


    // =================================================
    // CREATE DATE OBJECTS
    // =================================================

    const startDate =
      new Date(
        startYear,
        startMonth - 1,
        startDay
      );


    const endDate =
      new Date(
        endYear,
        endMonth - 1,
        endDay
      );


    // =================================================
    // INVALID
    // =================================================

    if (
      endDate < startDate
    ) {

      return "Không hợp lệ";
    }


    // =================================================
    // SPECIAL CASE:
    // START = NGÀY 1
    // END = NGÀY CUỐI THÁNG
    //
    // Ví dụ:
    //
    // 01/03/2026 -> 28/02/2027
    // = 12 tháng
    //
    // 01/05/2026 -> 30/04/2027
    // = 12 tháng
    // =================================================

    const lastDayOfEndMonth =
      new Date(
        endYear,
        endMonth,
        0
      ).getDate();


    const isFirstDay =
      startDay === 1;


    const isLastDay =
      endDay ===
      lastDayOfEndMonth;


    if (
      isFirstDay &&
      isLastDay
    ) {

      const fullMonths =
        (
          endYear -
          startYear
        ) *
          12
          +
        (
          endMonth -
          startMonth
        )
        +
        1;


      return `${fullMonths} tháng`;

    }


    // =================================================
    // SỐ THÁNG BAN ĐẦU
    // =================================================

    let months =
      (
        endYear -
        startYear
      ) *
        12
        +
      (
        endMonth -
        startMonth
      );


    if (
      months < 0
    ) {

      return "Không hợp lệ";
    }


    // =================================================
    // NGÀY SAU KHI CỘNG months THÁNG
    // =================================================

    let calculatedDate =
      addMonthsClamped(
        startDate,
        months
      );


    // =================================================
    // NẾU NGÀY TÍNH ĐƯỢC VƯỢT NGÀY KẾT THÚC
    // THÌ CHƯA ĐỦ THÁNG ĐÓ
    // =================================================

    if (
      calculatedDate >
      endDate
    ) {

      months--;

      if (
        months < 0
      ) {

        months = 0;
      }


      calculatedDate =
        addMonthsClamped(
          startDate,
          months
        );

    }


    // =================================================
    // TÍNH SỐ NGÀY CÒN LẠI
    // =================================================

    const millisecondsPerDay =
      24 *
      60 *
      60 *
      1000;


    const remainingDays =
      Math.floor(
        (
          endDate.getTime() -
          calculatedDate.getTime()
        ) /
        millisecondsPerDay
      );


    // =================================================
    // HIỂN THỊ
    // =================================================

    if (
      months === 0 &&
      remainingDays === 0
    ) {

      return "Dưới 1 tháng";
    }


    if (
      months === 0
    ) {

      return `${remainingDays} ngày`;
    }


    if (
      remainingDays === 0
    ) {

      return `${months} tháng`;
    }


    return (
      `${months} tháng ${remainingDays} ngày`
    );

  };


  // =====================================================
  // APARTMENT NAME
  // =====================================================

  const getApartmentName = (
    contract
  ) => {

    return (
      contract?.apartment?.name ||
      contract?.apartmentName ||
      contract?.apartment?.code ||
      contract?.apartment?.number ||
      "Chưa có dữ liệu"
    );

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

            Đang tải dữ liệu hợp đồng...

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
  // MAIN UI
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


        {/* NAV */}

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


        {/* =================================================
            CONTRACT LIST
        ================================================= */}

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
                  Hiện tại bạn chưa có hợp đồng
                  nào được ghi nhận trong hệ thống.
                </p>

              </div>

            </div>


          </section>

        ) : (

          contracts.map(
            (contract) => {

              const rentPrice =
                getRentPrice(
                  contract
                );


              const duration =
                getContractDuration(
                  contract
                );


              return (

                <section
                  className="contract-page-card"
                  key={contract.id}
                >


                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div className="contract-header">


                    <div className="contract-icon-large">
                      📄
                    </div>


                    <div>

                      <h2>

                        Hợp đồng thuê{" "}

                        {getApartmentName(
                          contract
                        )}

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


                  {/* =================================================
                      CONTRACT INFO
                  ================================================= */}

                  <div className="contract-info">


                    {/* CĂN HỘ */}

                    <div className="contract-info-item">

                      <span>
                        🏢 Căn hộ
                      </span>


                      <strong>

                        {getApartmentName(
                          contract
                        )}

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


                      <strong
                        className="rent-price"
                      >

                        {rentPrice !== null

                          ? formatMoney(
                              rentPrice
                            )

                          : "Chưa có dữ liệu"}

                      </strong>

                    </div>


                  </div>


                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <div className="contract-footer">


                    {/* TRẠNG THÁI */}

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


                    {/* THỜI HẠN */}

                    <div>

                      <span>
                        Thời hạn
                      </span>


                      <strong>
                        {duration}
                      </strong>

                    </div>


                  </div>


                </section>

              );

            }
          )

        )}


      </main>

    </div>

  );

}


export default OwnerContract;