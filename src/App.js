import "./App.css";

function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <strong>faceWORKS</strong>
        </div>
        <ul>
          <li>🏠 Trang chủ</li>
          <li>👥 Khách hàng</li>
          <li>🏢 Căn hộ cho thuê</li>
          <li>📄 Hợp đồng</li>
          <li>🎯 Yêu cầu hỗ trợ</li>
          <li>📊 Báo cáo</li>
          <li>🌐 Ngôn ngữ</li>
          <li className="logout">🚪 Đăng xuất</li>
        </ul>
      </aside>

      <main className="dashboard">
        <div className="dashboard-top">
          <h2>Trang chủ</h2>
          <div className="top-actions">
            <input className="search-input" placeholder="Tìm kiếm ở đây" />
            <div className="user-box">
              <img
                src="https://i.pravatar.cc/100"
                alt="Sofia"
              />
              <div>
                <div>Sofia</div>
                <small>Admin</small>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="card large">
            <h3>Báo cáo số lượng khách hàng</h3>
            <div className="chart">
              <div className="stats-list">
                <div className="stats-item">
                  <span className="label">Successful deals</span>
                  <span className="value">20k</span>
                </div>
                <div className="stats-item">
                  <span className="label">Customers in care</span>
                  <span className="value">13k</span>
                </div>
                <div className="stats-item">
                  <span className="label">Closed deals</span>
                  <span className="value">9k</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <h3>Lưu lượng truy cập</h3>
            <div className="stats-list">
              <div className="stats-item">
                <div className="label">Tổng</div>
                <div className="value">90%</div>
              </div>
              <div className="stats-item">
                <div className="label">Batdongsan.com.vn</div>
                <div className="value">70%</div>
              </div>
              <div className="stats-item">
                <div className="label">Renthousetoday.vn</div>
                <div className="value">90%</div>
              </div>
              <div className="stats-item">
                <div className="label">Chotot.vn</div>
                <div className="value">40%</div>
              </div>
            </div>
          </section>
        </div>

        <div className="bottom-grid">
          <section className="card">
            <h3>Báo cáo doanh thu</h3>
            <div className="chart" />
          </section>

          <section className="card small">
            <h3>Profile Report</h3>
            <div className="profile-report">
              <div className="info">
                <strong>$84,686k</strong>
                Doanh thu
              </div>
              <div className="chart" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;