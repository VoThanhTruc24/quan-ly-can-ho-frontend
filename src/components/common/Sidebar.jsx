import "./Sidebar.css";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Trang chủ",
      icon: "🏠",
      path: "/dashboard",
    },
    {
      name: "Khách hàng",
      icon: "👤",
      path: "/customers",
    },
    {
      name: "Căn hộ cho thuê",
      icon: "🏢",
      path: "/apartments",
    },

    {
      name: "Quản lý Owner",
      icon: "👥",
      path: "/owners",
    },
    
    {
      name: "Hợp đồng",
      icon: "📄",
      path: "/contracts",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          R
        </div>

        <div className="logo-content">
          <h2>RentHub</h2>
          <span>Quản lý căn hộ</span>
        </div>
      </div>

      {/* MENU */}
      <div className="sidebar-section">

        <span className="sidebar-title">
          MENU
        </span>

        <nav className="sidebar-menu">

          {menuItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={
                  isActive
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
                onClick={() => navigate(item.path)}
              >
                <span className="sidebar-item-icon">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </button>
            );
          })}

        </nav>
      </div>

      {/* KHÁC */}
      <div className="sidebar-section sidebar-other">

        <span className="sidebar-title">
          KHÁC
        </span>

        <button className="sidebar-item">
          <span className="sidebar-item-icon">
            📢
          </span>

          <span>Yêu cầu hỗ trợ</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-item-icon">
            📊
          </span>

          <span>Báo cáo</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-item-icon">
            🌐
          </span>

          <span>Ngôn ngữ</span>
        </button>

      </div>

      {/* LOGOUT */}
      <div className="sidebar-bottom">

        <button
          className="sidebar-item logout"
          onClick={handleLogout}
        >
          <span className="sidebar-item-icon">
            🚪
          </span>

          <span>Đăng xuất</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;