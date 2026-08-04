import "./Hero.css";
import bg from "../../assets/building.jpg"; // nhớ có ảnh này

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h4>GIẢI PHÁP QUẢN LÝ</h4>

        <h1>
          Căn Hộ <br />
          <span>Cho Thuê</span>
        </h1>

        <p>
          Quản lý dễ dàng – Vận hành hiệu quả – Tối ưu lợi nhuận
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Khám phá ngay</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;