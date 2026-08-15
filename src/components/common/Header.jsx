import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">

      {/* LOGO */}
      <div
        className="header-logo"
        onClick={() => navigate("/")}
      >
        <div className="header-logo-icon">
          R
        </div>

        <div className="header-logo-text">
          <strong>RentHub</strong>
          <span>Quản lý căn hộ</span>
        </div>
      </div>


      {/* MENU */}
      <nav className="header-nav">

        <a href="#about">
          Về chúng tôi
        </a>

        <a href="#features">
          Tính năng
        </a>

        <a href="#contact">
          Liên hệ
        </a>

      </nav>


      {/* LOGIN */}
      <div className="header-actions">

        <button
          className="header-login"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>

      </div>

    </header>
  );
}

export default Header;