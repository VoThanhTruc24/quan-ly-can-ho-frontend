import "./Login.css";
import bg from "../../assets/building.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    // ==========================================
    // KIỂM TRA INPUT
    // ==========================================

    if (!username.trim()) {
      alert("Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    try {

      setLoading(true);

      // ==========================================
      // GỌI API LOGIN
      // ==========================================

      const res = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      const data = await res.json();

      console.log("LOGIN:", data);

      // ==========================================
      // LOGIN THẤT BẠI
      // ==========================================

      if (!res.ok || !data.success) {

        alert(
          data.message ||
          "Sai tên đăng nhập hoặc mật khẩu"
        );

        return;
      }

      // ==========================================
      // LƯU THÔNG TIN ĐĂNG NHẬP
      // ==========================================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "username",
        data.username
      );

      localStorage.setItem(
        "fullName",
        data.fullName || ""
      );

      // ==========================================
      // PHÂN QUYỀN
      // ==========================================

      if (data.role === "ADMIN") {

        console.log(
          "Đăng nhập với quyền ADMIN"
        );

        navigate("/dashboard");

      } else if (data.role === "OWNER") {

        console.log(
          "Đăng nhập với quyền OWNER"
        );

        navigate("/owner");

      } else {

        console.log(
          "Role không xác định:",
          data.role
        );

        navigate("/");
      }

    } catch (err) {

      console.error(
        "Lỗi login:",
        err
      );

      alert(
        "Không thể kết nối đến máy chủ."
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================================
  // ENTER ĐỂ LOGIN
  // ==========================================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >

      <div className="login-box">

        <h2>Đăng nhập</h2>

        {/* USERNAME */}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Đang đăng nhập..."
            : "Đăng nhập"}
        </button>

        <p>
          Chưa có tài khoản? Đăng ký
        </p>

      </div>

    </div>
  );
}

export default Login;