import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import dashboardService from "../../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // 1. DASHBOARD STATISTICS
  // ==========================================

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalApartments: 0,
    totalContracts: 0,
    revenue: 0,
  });

  // ==========================================
  // 2. DOANH THU THEO THÁNG
  // ==========================================

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  // ==========================================
  // 3. LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  // ==========================================
  // 4. LẤY DỮ LIỆU DASHBOARD
  // ==========================================

  const fetchStats = async () => {
    try {
      const data = await dashboardService.getDashboardStats();

      console.log("Dashboard API:", data);

      // ----------------------------------------
      // Thống kê tổng quan
      // ----------------------------------------

      setStats({
        totalCustomers:
          data?.totalCustomers ?? 0,

        totalApartments:
          data?.totalApartments ?? 0,

        totalContracts:
          data?.totalContracts ?? 0,

        // QUAN TRỌNG:
        // Backend trả totalRevenue
        // chứ không phải revenue
        revenue:
          data?.totalRevenue ?? 0,
      });

      // ----------------------------------------
      // Doanh thu theo tháng
      // ----------------------------------------

      setMonthlyRevenue(
        data?.monthlyRevenue ?? []
      );

    } catch (error) {
      console.error(
        "Error fetching stats:",
        error
      );

      // Nếu API lỗi thì đưa dữ liệu về 0
      setStats({
        totalCustomers: 0,
        totalApartments: 0,
        totalContracts: 0,
        revenue: 0,
      });

      setMonthlyRevenue([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 5. GỌI API KHI MỞ DASHBOARD
  // ==========================================

  useEffect(() => {
    fetchStats();
  }, []);

  // ==========================================
  // 6. SEARCH
  // ==========================================

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const keyword =
        e.target.value.trim();

      if (keyword) {
        console.log(
          "Search:",
          keyword
        );
      }
    }
  };

  // ==========================================
  // 7. FORMAT TIỀN
  // ==========================================

  const formatMoney = (value) => {
    return (
      Number(value || 0).toLocaleString(
        "vi-VN"
      ) + " đ"
    );
  };

  // ==========================================
  // 8. DANH SÁCH 12 THÁNG
  // ==========================================

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ==========================================
  // 9. TÍNH CHIỀU CAO BIỂU ĐỒ
  // ==========================================

  /*
    Backend trả:

    [
      {
        month: 1,
        revenue: 0
      },
      {
        month: 8,
        revenue: 18000000
      }
    ]

    Nhưng CSS cần:

    height: 0% -> 100%

    Vì vậy phải chuyển doanh thu
    thành phần trăm.
  */

  const revenueValues = months.map(
    (_, index) => {
      const monthData =
        monthlyRevenue.find(
          (item) =>
            Number(item.month) ===
            index + 1
        );

      return Number(
        monthData?.revenue || 0
      );
    }
  );

  // Doanh thu lớn nhất trong 12 tháng
  const maxRevenue = Math.max(
    ...revenueValues,
    1
  );

  // Chuyển doanh thu thành %
  const chartHeights =
    revenueValues.map(
      (revenue) => {
        if (revenue === 0) {
          return 0;
        }

        return (
          (revenue / maxRevenue) *
          100
        );
      }
    );

  // ==========================================
  // 10. RETURN GIAO DIỆN
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="dashboard-topbar">

        <div>
          <h1>Trang chủ</h1>

          <p>
            Tổng quan hệ thống quản lý căn hộ
          </p>
        </div>

        <div className="dashboard-topbar-right">

          {/* SEARCH */}

          <div className="dashboard-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Tìm kiếm..."
              onKeyDown={handleSearch}
            />

          </div>

          {/* ACCOUNT */}

          <div className="dashboard-account">

            <div className="dashboard-avatar">
              👤
            </div>

            <div className="dashboard-account-info">

              <strong>
                Quản trị viên
              </strong>

              <span>
                Admin
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================
          CONTENT
      ====================================== */}

      <section className="dashboard-content">


        {/* ===================================
            STAT CARDS
        ==================================== */}

        <div className="stats-grid">


          {/* KHÁCH HÀNG */}

          <div className="stat-card">

            <div className="stat-icon">
              👤
            </div>

            <div className="stat-info">

              <span className="stat-label">
                Khách hàng
              </span>

              <strong className="stat-value">

                {loading
                  ? "..."
                  : stats.totalCustomers}

              </strong>

              <span className="stat-description">
                Tổng số khách hàng
              </span>

            </div>

          </div>


          {/* CĂN HỘ */}

          <div className="stat-card">

            <div className="stat-icon">
              🏢
            </div>

            <div className="stat-info">

              <span className="stat-label">
                Căn hộ
              </span>

              <strong className="stat-value">

                {loading
                  ? "..."
                  : stats.totalApartments}

              </strong>

              <span className="stat-description">
                Căn hộ đang quản lý
              </span>

            </div>

          </div>


          {/* HỢP ĐỒNG */}

          <div className="stat-card">

            <div className="stat-icon">
              📄
            </div>

            <div className="stat-info">

              <span className="stat-label">
                Hợp đồng
              </span>

              <strong className="stat-value">

                {loading
                  ? "..."
                  : stats.totalContracts}

              </strong>

              <span className="stat-description">
                Hợp đồng hiện tại
              </span>

            </div>

          </div>


          {/* DOANH THU */}

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div className="stat-info">

              <span className="stat-label">
                Doanh thu
              </span>

              <strong className="stat-value">

                {loading
                  ? "..."
                  : formatMoney(
                      stats.revenue
                    )}

              </strong>

              <span className="stat-description">
                Tổng doanh thu
              </span>

            </div>

          </div>

        </div>


        {/* ===================================
            LOWER CONTENT
        ==================================== */}

        <div className="dashboard-grid">


          {/* =================================
              REVENUE CHART
          ================================== */}

          <div className="dashboard-card revenue-card">

            <div className="card-header">

              <div>

                <h2>
                  Báo cáo doanh thu
                </h2>

                <p>
                  Doanh thu theo tháng
                </p>

              </div>

              <button className="card-action">
                Năm nay ▾
              </button>

            </div>


            {/* ===============================
                CHART
            ================================ */}

            <div className="chart">


              {/* Y AXIS */}

              <div className="chart-y">

                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>

              </div>


              {/* CHART AREA */}

              <div className="chart-area">


                {/* GRID LINES */}

                <div className="chart-lines">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>


                {/* ===========================
                    BARS
                ============================ */}

                <div className="chart-bars">

                  {chartHeights.map(
                    (height, index) => {

                      const revenue =
                        revenueValues[index];

                      return (
                        <div
                          key={index}
                          className="chart-bar"
                          style={{
                            height:
                              `${height}%`,
                          }}
                          title={
                            `${months[index]}: ` +
                            `${formatMoney(
                              revenue
                            )}`
                          }
                        >

                          <span></span>

                        </div>
                      );

                    }
                  )}

                </div>


                {/* ===========================
                    MONTHS
                ============================ */}

                <div className="chart-months">

                  {months.map(
                    (month) => (

                      <span
                        key={month}
                      >
                        {month}
                      </span>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>


          {/* =================================
              OVERVIEW
          ================================== */}

          <div className="dashboard-card overview-card">

            <div className="card-header">

              <div>

                <h2>
                  Tổng quan
                </h2>

                <p>
                  Tình trạng hệ thống
                </p>

              </div>

            </div>


            <div className="overview-list">


              {/* KHÁCH HÀNG */}

              <div className="overview-item">

                <div className="overview-left">

                  <span className="overview-icon">
                    👤
                  </span>

                  <span>
                    Khách hàng
                  </span>

                </div>

                <strong>
                  {stats.totalCustomers}
                </strong>

              </div>


              {/* CĂN HỘ */}

              <div className="overview-item">

                <div className="overview-left">

                  <span className="overview-icon">
                    🏢
                  </span>

                  <span>
                    Căn hộ
                  </span>

                </div>

                <strong>
                  {stats.totalApartments}
                </strong>

              </div>


              {/* HỢP ĐỒNG */}

              <div className="overview-item">

                <div className="overview-left">

                  <span className="overview-icon">
                    📄
                  </span>

                  <span>
                    Hợp đồng
                  </span>

                </div>

                <strong>
                  {stats.totalContracts}
                </strong>

              </div>


              {/* DOANH THU */}

              <div className="overview-item">

                <div className="overview-left">

                  <span className="overview-icon">
                    💰
                  </span>

                  <span>
                    Doanh thu
                  </span>

                </div>

                <strong>
                  {formatMoney(
                    stats.revenue
                  )}
                </strong>

              </div>


            </div>

          </div>

        </div>


        {/* ===================================
            QUICK ACTIONS
        ==================================== */}

        <div className="quick-section">

          <div className="section-title">

            <h2>
              Thao tác nhanh
            </h2>

            <p>
              Truy cập nhanh các chức năng quản lý
            </p>

          </div>


          <div className="quick-actions">


            {/* KHÁCH HÀNG */}

            <button
              onClick={() =>
                navigate("/customers")
              }
            >

              <span>👤</span>

              <div>

                <strong>
                  Khách hàng
                </strong>

                <small>
                  Quản lý khách hàng
                </small>

              </div>

            </button>


            {/* CĂN HỘ */}

            <button
              onClick={() =>
                navigate("/apartments")
              }
            >

              <span>🏢</span>

              <div>

                <strong>
                  Căn hộ
                </strong>

                <small>
                  Quản lý căn hộ cho thuê
                </small>

              </div>

            </button>


            {/* HỢP ĐỒNG */}

            <button
              onClick={() =>
                navigate("/contracts")
              }
            >

              <span>📄</span>

              <div>

                <strong>
                  Hợp đồng
                </strong>

                <small>
                  Quản lý hợp đồng
                </small>

              </div>

            </button>


          </div>

        </div>


      </section>

    </div>
  );
}

export default Dashboard;