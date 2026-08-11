import { useEffect, useState } from "react";
import contractService from "../../services/contractService";
import "./Contracts.css";

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    apartmentName: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  const fetchContracts = async () => {
    try {
      setLoading(true);

      const data = await contractService.getAllContracts();

      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contracts:", error);

      showAlert(
        error.message || "Không thể tải danh sách hợp đồng",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({
      message,
      type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Vui lòng nhập tên khách hàng";
    }

    if (!formData.apartmentName.trim()) {
      newErrors.apartmentName = "Vui lòng nhập tên căn hộ";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate =
        "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (!formData.monthlyRent) {
      newErrors.monthlyRent =
        "Vui lòng nhập tiền thuê";
    } else if (Number(formData.monthlyRent) <= 0) {
      newErrors.monthlyRent =
        "Tiền thuê phải lớn hơn 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        customerName: formData.customerName,
        apartmentName: formData.apartmentName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyRent: Number(formData.monthlyRent),
        status: formData.status,
      };

      if (editingId) {
        await contractService.updateContract(
          editingId,
          data
        );

        showAlert(
          "Cập nhật hợp đồng thành công",
          "success"
        );
      } else {
        await contractService.createContract(data);

        showAlert(
          "Thêm hợp đồng thành công",
          "success"
        );
      }

      handleCancel();
      fetchContracts();
    } catch (error) {
      console.error(error);

      showAlert(
        error.message ||
          "Có lỗi xảy ra khi lưu hợp đồng",
        "error"
      );
    }
  };

  const handleEdit = (contract) => {
    setFormData({
      customerName: contract.customerName || "",
      apartmentName: contract.apartmentName || "",
      startDate: contract.startDate || "",
      endDate: contract.endDate || "",
      monthlyRent: contract.monthlyRent || "",
      status: contract.status || "ACTIVE",
    });

    setEditingId(contract.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa hợp đồng này không?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await contractService.deleteContract(id);

      showAlert(
        "Xóa hợp đồng thành công",
        "success"
      );

      fetchContracts();
    } catch (error) {
      console.error(error);

      showAlert(
        error.message ||
          "Không thể xóa hợp đồng",
        "error"
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      customerName: "",
      apartmentName: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      status: "ACTIVE",
    });

    setErrors({});
  };

  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "0 đ";
    }

    return `${Number(value).toLocaleString(
      "vi-VN"
    )} đ`;
  };

  const formatStatus = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Còn hiệu lực";

      case "EXPIRED":
        return "Đã hết hạn";

      case "TERMINATED":
        return "Đã chấm dứt";

      default:
        return status || "-";
    }
  };

  return (
    <div className="contract-page">

      {/* HEADER */}
      <div className="contract-header">

        <div>
          <h1>Hợp đồng</h1>

          <p>
            Quản lý các hợp đồng thuê căn hộ
            trong hệ thống
          </p>
        </div>

        <div className="contract-admin">

          <div className="contract-admin-avatar">
            👤
          </div>

          <div>
            <strong>Quản trị viên</strong>
            <span>Admin</span>
          </div>

        </div>

      </div>

      {/* ALERT */}
      {alert && (
        <div
          className={`contract-alert contract-alert-${alert.type}`}
        >
          {alert.message}
        </div>
      )}

      {/* TOOLBAR */}
      {!showForm && (
        <div className="contract-toolbar">

          <div className="contract-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng..."
            />

          </div>

          <button
            className="contract-btn-primary"
            onClick={() => {
              setShowForm(true);
              setErrors({});
            }}
          >
            + Thêm hợp đồng
          </button>

        </div>
      )}

      {/* FORM */}
      {showForm ? (

        <div className="contract-form-card">

          <div className="contract-form-header">

            <div>
              <h2>
                {editingId
                  ? "Cập nhật hợp đồng"
                  : "Thêm hợp đồng mới"}
              </h2>

              <p>
                Nhập thông tin hợp đồng thuê
                căn hộ
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="contract-form-grid">

              {/* CUSTOMER */}
              <div className="contract-form-group">

                <label>
                  Tên khách hàng
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên khách hàng"
                  className={
                    errors.customerName
                      ? "contract-input-error"
                      : ""
                  }
                />

                {errors.customerName && (
                  <span className="contract-error">
                    {errors.customerName}
                  </span>
                )}

              </div>

              {/* APARTMENT */}
              <div className="contract-form-group">

                <label>
                  Tên căn hộ
                </label>

                <input
                  type="text"
                  name="apartmentName"
                  value={formData.apartmentName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên căn hộ"
                  className={
                    errors.apartmentName
                      ? "contract-input-error"
                      : ""
                  }
                />

                {errors.apartmentName && (
                  <span className="contract-error">
                    {errors.apartmentName}
                  </span>
                )}

              </div>

              {/* START DATE */}
              <div className="contract-form-group">

                <label>
                  Ngày bắt đầu
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={
                    errors.startDate
                      ? "contract-input-error"
                      : ""
                  }
                />

                {errors.startDate && (
                  <span className="contract-error">
                    {errors.startDate}
                  </span>
                )}

              </div>

              {/* END DATE */}
              <div className="contract-form-group">

                <label>
                  Ngày kết thúc
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={
                    errors.endDate
                      ? "contract-input-error"
                      : ""
                  }
                />

                {errors.endDate && (
                  <span className="contract-error">
                    {errors.endDate}
                  </span>
                )}

              </div>

              {/* RENT */}
              <div className="contract-form-group">

                <label>
                  Tiền thuê hàng tháng
                </label>

                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 8000000"
                  className={
                    errors.monthlyRent
                      ? "contract-input-error"
                      : ""
                  }
                />

                {errors.monthlyRent && (
                  <span className="contract-error">
                    {errors.monthlyRent}
                  </span>
                )}

              </div>

              {/* STATUS */}
              <div className="contract-form-group">

                <label>
                  Trạng thái
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="ACTIVE">
                    Còn hiệu lực
                  </option>

                  <option value="EXPIRED">
                    Đã hết hạn
                  </option>

                  <option value="TERMINATED">
                    Đã chấm dứt
                  </option>
                </select>

              </div>

            </div>

            {/* FORM BUTTONS */}
            <div className="contract-form-actions">

              <button
                type="button"
                className="contract-btn-secondary"
                onClick={handleCancel}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="contract-btn-primary"
              >
                {editingId
                  ? "Cập nhật hợp đồng"
                  : "Tạo hợp đồng"}
              </button>

            </div>

          </form>

        </div>

      ) : (

        /* TABLE */
        <div className="contract-data-card">

          <div className="contract-data-header">

            <div>

              <h2>
                Danh sách hợp đồng
              </h2>

              <p>
                {contracts.length} hợp đồng
              </p>

            </div>

          </div>

          <div className="contract-table-wrapper">

            <table className="contract-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Căn hộ</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Tiền thuê</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="contract-empty"
                    >
                      Đang tải dữ liệu...
                    </td>

                  </tr>

                ) : contracts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="contract-empty"
                    >

                      <div className="contract-empty-icon">
                        📄
                      </div>

                      <strong>
                        Không có hợp đồng nào
                      </strong>

                      <span>
                        Hãy thêm hợp đồng đầu tiên
                      </span>

                    </td>

                  </tr>

                ) : (

                  contracts.map((contract) => (

                    <tr key={contract.id}>

                      <td className="contract-id">
                        #{contract.id}
                      </td>

                      <td>

                        <div className="contract-customer">

                          <div className="contract-avatar">
                            👤
                          </div>

                          <strong>
                            {contract.customerName}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {contract.apartmentName}
                      </td>

                      <td>
                        {contract.startDate}
                      </td>

                      <td>
                        {contract.endDate}
                      </td>

                      <td className="contract-money">
                        {formatMoney(
                          contract.monthlyRent
                        )}
                      </td>

                      <td>

                        <span
                          className={`contract-status contract-status-${String(
                            contract.status || ""
                          ).toLowerCase()}`}
                        >
                          {formatStatus(
                            contract.status
                          )}
                        </span>

                      </td>

                      <td>

                        <div className="contract-actions">

                          <button
                            className="contract-edit"
                            onClick={() =>
                              handleEdit(contract)
                            }
                          >
                            Sửa
                          </button>

                          <button
                            className="contract-delete"
                            onClick={() =>
                              handleDelete(
                                contract.id
                              )
                            }
                          >
                            Xóa
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default Contracts;