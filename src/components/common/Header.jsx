import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">RentHub</div>

      <nav className="nav">
        <a href="#">Trang chủ</a>
        <a href="#">Về chúng tôi</a>
        <a href="#">Tính năng</a>
        <a href="#">Liên hệ</a>
      </nav>

      <button
        className="login-btn"
        onClick={() => navigate("/login")}
      >
        Đăng nhập
      </button>
    </header>
  );
}
export default Header;