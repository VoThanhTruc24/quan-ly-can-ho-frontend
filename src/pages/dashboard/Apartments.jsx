import { useState, useEffect } from "react";
import apartmentService from "../../services/apartmentService";
import "./Apartments.css";

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    status: "AVAILABLE",
    floorId: "",
  });

  const [errors, setErrors] = useState({});

  // =========================
  // GET APARTMENTS
  // =========================
  const fetchApartments = async () => {
    try {
      setLoading(true);

      const data = await apartmentService.getAllApartments();

      setApartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      showAlert(
        error.message || "Không thể tải danh sách căn hộ",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // =========================
  // ALERT
  // =========================
  const showAlert = (message, type = "success") => {
    setAlert({
      message,
      type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // =========================
  // VALIDATE
  // =========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên căn hộ";
    }

    if (!formData.area) {
      newErrors.area = "Vui lòng nhập diện tích";
    } else if (Number(formData.area) <= 0) {
      newErrors.area = "Diện tích phải lớn hơn 0";
    }

    if (!formData.floorId) {
      newErrors.floorId = "Vui lòng nhập ID tầng";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // INPUT
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        name: formData.name,
        area: Number(formData.area),
        status: formData.status,
        floorId: Number(formData.floorId),
      };

      if (editingId) {
        await apartmentService.updateApartment(editingId, data);

        showAlert(
          "Cập nhật căn hộ thành công",
          "success"
        );
      } else {
        await apartmentService.createApartment(data);

        showAlert(
          "Thêm căn hộ thành công",
          "success"
        );
      }

      handleCancel();
      fetchApartments();
    } catch (error) {
      console.error(error);

      showAlert(
        error.message || "Có lỗi xảy ra khi lưu căn hộ",
        "error"
      );
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (apartment) => {
    setFormData({
      name: apartment.name || "",
      area: apartment.area || "",
      status: apartment.status || "AVAILABLE",
      floorId:
        apartment.floor?.id ||
        apartment.floorId ||
        "",
    });

    setEditingId(apartment.id);
    setShowForm(true);
    setErrors({});
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa căn hộ này không?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apartmentService.deleteApartment(id);

      showAlert(
        "Xóa căn hộ thành công",
        "success"
      );

      fetchApartments();
    } catch (error) {
      console.error(error);

      showAlert(
        error.message || "Không thể xóa căn hộ",
        "error"
      );
    }
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      name: "",
      area: "",
      status: "AVAILABLE",
      floorId: "",
    });

    setErrors({});
  };

  // =========================
  // FILTER
  // =========================
  const filteredApartments = apartments.filter(
    (apartment) => {
      const keyword = search.toLowerCase();

      return (
        String(apartment.id || "")
          .toLowerCase()
          .includes(keyword) ||
        String(apartment.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(
          apartment.floor?.name ||
            apartment.floor?.id ||
            apartment.floorId ||
            ""
        )
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  // =========================
  // STATUS
  // =========================
  const getStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Còn trống";

      case "RENTED":
        return "Đã cho thuê";

      case "MAINTENANCE":
        return "Bảo trì";

      default:
        return status || "-";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "status-available";

      case "RENTED":
        return "status-rented";

      case "MAINTENANCE":
        return "status-maintenance";

      default:
        return "";
    }
  };

  return (
    <div className="apartment-page">

      {/* ================= HEADER ================= */}
      <div className="apartment-header">

        <div>
          <h1>Căn hộ cho thuê</h1>

          <p>
            Quản lý thông tin các căn hộ trong hệ thống
          </p>
        </div>

        <div className="admin-box">
          <div className="admin-avatar">
            👤
          </div>

          <div>
            <strong>Quản trị viên</strong>
            <span>Admin</span>
          </div>
        </div>

      </div>

      {/* ================= ALERT ================= */}
      {alert && (
        <div
          className={`apartment-alert ${
            alert.type === "error"
              ? "alert-error"
              : "alert-success"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* ================= SEARCH + ADD ================= */}
      {!showForm && (
        <div className="apartment-toolbar">

          <div className="apartment-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Tìm kiếm căn hộ..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <button
            className="apartment-add-btn"
            onClick={() => {
              setShowForm(true);
              setErrors({});
            }}
          >
            + Thêm căn hộ
          </button>

        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm ? (
        <div className="apartment-form-card">

          <div className="form-title">
            <div>
              <h2>
                {editingId
                  ? "Cập nhật căn hộ"
                  : "Thêm căn hộ mới"}
              </h2>

              <p>
                Nhập thông tin căn hộ bên dưới
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* NAME */}
              <div className="apartment-form-group">
                <label>Tên căn hộ</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: A101"
                  className={
                    errors.name ? "input-error" : ""
                  }
                />

                {errors.name && (
                  <span className="field-error">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* AREA */}
              <div className="apartment-form-group">
                <label>Diện tích (m²)</label>

                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 70"
                  className={
                    errors.area ? "input-error" : ""
                  }
                />

                {errors.area && (
                  <span className="field-error">
                    {errors.area}
                  </span>
                )}
              </div>

              {/* FLOOR */}
              <div className="apartment-form-group">
                <label>ID tầng</label>

                <input
                  type="number"
                  name="floorId"
                  value={formData.floorId}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 1"
                  className={
                    errors.floorId ? "input-error" : ""
                  }
                />

                {errors.floorId && (
                  <span className="field-error">
                    {errors.floorId}
                  </span>
                )}
              </div>

              {/* STATUS */}
              <div className="apartment-form-group">
                <label>Trạng thái</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="AVAILABLE">
                    Còn trống
                  </option>

                  <option value="RENTED">
                    Đã cho thuê
                  </option>

                  <option value="MAINTENANCE">
                    Bảo trì
                  </option>
                </select>
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                {editingId
                  ? "Cập nhật"
                  : "Tạo căn hộ"}
              </button>

            </div>

          </form>

        </div>
      ) : (
        /* ================= TABLE ================= */
        <div className="apartment-table-card">

          <div className="table-header">

            <div>
              <h2>Danh sách căn hộ</h2>

              <p>
                {filteredApartments.length} căn hộ
              </p>
            </div>

          </div>

          <div className="table-wrapper">

            <table className="apartment-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Căn hộ</th>
                  <th>Diện tích</th>
                  <th>Tầng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="empty-row"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredApartments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="empty-row"
                    >
                      Không có căn hộ nào
                    </td>
                  </tr>
                ) : (
                  filteredApartments.map(
                    (apartment) => (
                      <tr key={apartment.id}>

                        <td className="id-cell">
                          #{apartment.id}
                        </td>

                        <td>
                          <div className="apartment-name">
                            <div className="apartment-icon">
                              🏢
                            </div>

                            <strong>
                              {apartment.name}
                            </strong>
                          </div>
                        </td>

                        <td>
                          {apartment.area} m²
                        </td>

                        <td>
                          {apartment.floor?.name ||
                            apartment.floor?.id ||
                            apartment.floorId ||
                            "-"}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              apartment.status
                            )}`}
                          >
                            {getStatusText(
                              apartment.status
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(apartment)
                              }
                            >
                              Sửa
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  apartment.id
                                )
                              }
                            >
                              Xóa
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default Apartments;