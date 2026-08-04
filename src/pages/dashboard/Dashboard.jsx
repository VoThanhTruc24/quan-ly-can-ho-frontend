import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">faceWORKS</h2>

        <ul className="menu">
          <li className="active">🏠 Trang chủ</li>
          <li>👤 Khách hàng</li>
          <li>🏢 Căn hộ cho thuê</li>
          <li>📄 Hợp đồng</li>
          <li>📢 Yêu cầu hỗ trợ</li>
          <li>📊 Báo cáo</li>
          <li>🌐 Ngôn ngữ</li>
          <li>🚪 Đăng xuất</li>
        </ul>
      </div>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <h2>Trang chủ</h2>

          <div className="top-right">
            <input placeholder="Tìm kiếm ở đây" />
            <div className="user">
              <span>Sofia</span>
              <img src="https://i.pravatar.cc/40" alt="" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* LEFT */}
          <div className="left">
            <div className="card">
              <h3>Báo cáo số lượng khách hàng</h3>
              <div className="bars">
                <div className="bar">
                  <span>Successful deals</span>
                  <div className="progress">
                    <div style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div className="bar">
                  <span>Customers in care</span>
                  <div className="progress">
                    <div style={{ width: "80%" }}></div>
                  </div>
                </div>

                <div className="bar">
                  <span>Closed deals</span>
                  <div className="progress">
                    <div style={{ width: "40%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Báo cáo doanh thu</h3>

              <div className="chart">
                <div className="column" style={{ height: "40%" }}></div>
                <div className="column" style={{ height: "60%" }}></div>
                <div className="column" style={{ height: "80%" }}></div>
                <div className="column" style={{ height: "70%" }}></div>
                <div className="column" style={{ height: "90%" }}></div>
              </div>

              <div className="months">
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="card">
              <h3>Lưu lượng truy cập</h3>

              <ul className="traffic">
                <li>
                  <span>Tổng</span>
                  <b>90%</b>
                </li>
                <li>
                  <span>Batdongsan.com.vn</span>
                  <b>70%</b>
                </li>
                <li>
                  <span>Renthousetoday.vn</span>
                  <b>90%</b>
                </li>
                <li>
                  <span>Chotot.vn</span>
                  <b>40%</b>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Profile Report</h3>
              <h2>$84,686k</h2>

              <div className="line-chart">
                <div className="line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;