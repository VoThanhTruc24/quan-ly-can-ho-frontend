import "./Login.css";
import bg from "../../assets/building.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate(); // 👈 phải đặt trong function

  return (
    <div
      className="login"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay"></div>

      <div className="login-box">
        <h2>Đăng nhập</h2>

        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Mật khẩu" />

        <button onClick={() => navigate("/dashboard")}>
          Đăng nhập
        </button>

        <p>Chưa có tài khoản? Đăng ký</p>
      </div>
    </div>
  );
}

export default Login;