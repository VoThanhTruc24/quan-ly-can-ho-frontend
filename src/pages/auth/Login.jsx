import "./Login.css";
import bg from "../../assets/building.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();
      console.log("LOGIN:", data);

      if (data.success) {
        // ✅ LƯU DATA
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // ✅ PHÂN QUYỀN
        if (data.role === "ADMIN") {
          navigate("/dashboard");
        } else if (data.role === "OWNER") {
          navigate("/owner");
        } else {
          navigate("/");
        }
      } else {
        alert("Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi login:", err);
    }
  };

  return (
    <div
      className="login"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="login-box">
        <h2>Đăng nhập</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Đăng nhập
        </button>

        <p>Chưa có tài khoản? Đăng ký</p>
      </div>
    </div>
  );
}

export default Login;