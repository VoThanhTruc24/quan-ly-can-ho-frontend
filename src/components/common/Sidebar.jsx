import './Sidebar.css'

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">faceWORKS</h2>

      <ul>
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
  )
}