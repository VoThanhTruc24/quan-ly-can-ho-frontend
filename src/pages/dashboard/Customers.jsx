import { useState, useEffect } from "react";

import customerService from "../../services/customerService";

import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     LOAD CUSTOMERS
  ========================= */

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const data =
        await customerService.getAllCustomers();

      console.log("Customers API:", data);

      setCustomers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Error fetching customers:",
        error
      );

      showAlert(
        error.message ||
          "Không thể tải danh sách khách hàng",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* =========================
     ALERT
  ========================= */

  const showAlert = (
    message,
    type = "success"
  ) => {
    setAlert({
      message,
      type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Vui lòng nhập tên khách hàng";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Vui lòng nhập email";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Vui lòng nhập số điện thoại";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =========================
     INPUT
  ========================= */

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

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

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {

      if (editingId) {

        await customerService.updateCustomer(
          editingId,
          formData
        );

        showAlert(
          "Cập nhật khách hàng thành công",
          "success"
        );

      } else {

        await customerService.createCustomer(
          formData
        );

        showAlert(
          "Thêm khách hàng thành công",
          "success"
        );
      }

      resetForm();

      fetchCustomers();

    } catch (error) {

      console.error(error);

      showAlert(
        error.message ||
          "Có lỗi xảy ra khi lưu khách hàng",
        "error"
      );
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (customer) => {

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setEditingId(customer.id);

    setShowForm(true);

    setErrors({});
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Bạn có chắc chắn muốn xóa khách hàng này?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await customerService.deleteCustomer(id);

      showAlert(
        "Xóa khách hàng thành công",
        "success"
      );

      fetchCustomers();

    } catch (error) {

      console.error(error);

      showAlert(
        error.message ||
          "Không thể xóa khách hàng",
        "error"
      );
    }
  };

  /* =========================
     RESET
  ========================= */

  const resetForm = () => {

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingId(null);

    setShowForm(false);

    setErrors({});
  };

  /* =========================
     FILTER
  ========================= */

  const filteredCustomers =
    customers.filter((customer) => {

      const keyword =
        search.toLowerCase();

      return (
        customer.name
          ?.toLowerCase()
          .includes(keyword) ||

        customer.email
          ?.toLowerCase()
          .includes(keyword) ||

        customer.phone
          ?.toLowerCase()
          .includes(keyword) ||

        customer.address
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="customers-page">

      {/* HEADER */}

      <header className="customers-topbar">

        <div className="customers-title">

          <h1>
            Khách hàng
          </h1>

          <p>
            Quản lý thông tin khách hàng
            của hệ thống
          </p>

        </div>

        <div className="customers-account">

          <div className="customers-avatar">
            👤
          </div>

          <div className="customers-account-info">

            <strong>
              Quản trị viên
            </strong>

            <span>
              Admin
            </span>

          </div>

        </div>

      </header>

      {/* ALERT */}

      {alert && (
        <div
          className={`customer-alert ${alert.type}`}
        >
          {alert.message}
        </div>
      )}

      {/* TOOLBAR */}

      <div className="customers-toolbar">

        <div className="customers-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {!showForm && (
          <button
            className="btn-add-customer"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setErrors({});
            }}
          >
            + Thêm khách hàng
          </button>
        )}

      </div>

      {/* FORM */}

      {showForm ? (

        <div className="customer-form-card">

          <h2>
            {editingId
              ? "Chỉnh sửa khách hàng"
              : "Thêm khách hàng mới"}
          </h2>

          <form
            className="customer-form"
            onSubmit={handleSubmit}
          >

            <div className="customer-form-group">

              <label>
                Tên khách hàng
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên khách hàng"
              />

              {errors.name && (
                <span className="form-error">
                  {errors.name}
                </span>
              )}

            </div>

            <div className="customer-form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
              />

              {errors.email && (
                <span className="form-error">
                  {errors.email}
                </span>
              )}

            </div>

            <div className="customer-form-group">

              <label>
                Số điện thoại
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
              />

              {errors.phone && (
                <span className="form-error">
                  {errors.phone}
                </span>
              )}

            </div>

            <div className="customer-form-group">

              <label>
                Địa chỉ
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />

              {errors.address && (
                <span className="form-error">
                  {errors.address}
                </span>
              )}

            </div>

            <div className="customer-form-buttons">

              <button
                type="button"
                className="btn-cancel"
                onClick={resetForm}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn-submit"
              >
                {editingId
                  ? "Cập nhật"
                  : "Lưu khách hàng"}
              </button>

            </div>

          </form>

        </div>

      ) : (

        /* TABLE */

        <div className="customers-card">

          <div className="customers-card-header">

            <div>
              <h2>
                Danh sách khách hàng
              </h2>

              <p>
                {filteredCustomers.length} khách hàng
              </p>
            </div>

          </div>

          <div className="table-wrapper">

            <table className="customers-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Hành động</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="customer-loading"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>

                ) : filteredCustomers.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="customer-empty"
                    >
                      Không có khách hàng nào
                    </td>
                  </tr>

                ) : (

                  filteredCustomers.map(
                    (customer) => (

                      <tr
                        key={customer.id}
                      >

                        <td className="customer-id">
                          #{customer.id}
                        </td>

                        <td className="customer-name">
                          {customer.name}
                        </td>

                        <td>
                          {customer.email}
                        </td>

                        <td>
                          {customer.phone}
                        </td>

                        <td>
                          {customer.address}
                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="btn-edit"
                              onClick={() =>
                                handleEdit(
                                  customer
                                )
                              }
                            >
                              Sửa
                            </button>

                            <button
                              className="btn-delete"
                              onClick={() =>
                                handleDelete(
                                  customer.id
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

export default Customers;