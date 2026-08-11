import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import dashboardService from "../../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalApartments: 0,
    totalContracts: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data =
        await dashboardService.getDashboardStats();

      setStats({
        totalCustomers:
          data?.totalCustomers ?? 0,

        totalApartments:
          data?.totalApartments ?? 0,

        totalContracts:
          data?.totalContracts ?? 0,

        revenue:
          data?.revenue ?? 0,
      });

    } catch (error) {
      console.error(
        "Error fetching stats:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

  const formatMoney = (value) => {
    return (
      Number(value || 0).toLocaleString("vi-VN") +
      " đ"
    );
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-topbar">

        <div>
          <h1>Trang chủ</h1>

          <p>
            Tổng quan hệ thống quản lý căn hộ
          </p>
        </div>

        <div className="dashboard-topbar-right">

          <div className="dashboard-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Tìm kiếm..."
              onKeyDown={handleSearch}
            />
          </div>

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

      {/* CONTENT */}

      <section className="dashboard-content">

        {/* STAT CARDS */}

        <div className="stats-grid">

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
                  : formatMoney(stats.revenue)}
              </strong>

              <span className="stat-description">
                Tổng doanh thu
              </span>

            </div>

          </div>

        </div>

        {/* LOWER CONTENT */}

        <div className="dashboard-grid">

          {/* REVENUE */}

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

            <div className="chart">

              <div className="chart-y">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <div className="chart-area">

                <div className="chart-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="chart-bars">

                  {[35, 50, 42, 68, 58, 78, 65, 88, 72, 92, 80, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="chart-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      >
                        <span></span>
                      </div>
                    )
                  )}

                </div>

                <div className="chart-months">

                  {[
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
                  ].map((month) => (
                    <span key={month}>
                      {month}
                    </span>
                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* OVERVIEW */}

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
                  {formatMoney(stats.revenue)}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

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