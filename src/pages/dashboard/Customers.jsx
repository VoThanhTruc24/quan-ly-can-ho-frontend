import { useEffect, useMemo, useState } from "react";
import customerService from "../../services/customerService";
import "./Customers.css";

const API_BASE_URL = "http://localhost:8080/api";

function Customers() {
  // =========================================================
  // STATE
  // =========================================================

  const [customers, setCustomers] = useState([]);
  const [apartments, setApartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingApartments, setLoadingApartments] =
    useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",

    apartmentName: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
  });

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // ALERT
  // =========================================================

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

  // =========================================================
  // LOAD CUSTOMERS + RENTAL INFO
  // =========================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/customers/with-rental-info`,
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const text =
        await response.text();

      let data = [];

      try {
        data = text
          ? JSON.parse(text)
          : [];
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
                `Không thể tải khách hàng (${response.status})`
        );
      }

      setCustomers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "FETCH CUSTOMERS ERROR:",
        error
      );

      setCustomers([]);

      showAlert(
        error.message ||
          "Không thể tải danh sách khách hàng",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD APARTMENTS
  // =========================================================

  const fetchApartments = async () => {
    try {
      setLoadingApartments(true);

      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/apartments`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const text =
        await response.text();

      let data = [];

      try {
        data = text
          ? JSON.parse(text)
          : [];
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
                `Không thể tải căn hộ (${response.status})`
        );
      }

      console.log(
        "DANH SÁCH CĂN HỘ:",
        data
      );

      setApartments(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "FETCH APARTMENTS ERROR:",
        error
      );

      setApartments([]);

      showAlert(
        error.message ||
          "Không thể tải danh sách căn hộ",
        "error"
      );
    } finally {
      setLoadingApartments(false);
    }
  };

  // =========================================================
  // FIRST LOAD
  // =========================================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  const openCreateForm = async () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",

      apartmentName: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
    });

    setErrors({});

    setShowForm(true);

    await fetchApartments();
  };

  // =========================================================
  // NORMALIZE APARTMENT STATUS
  // =========================================================

  const normalizeApartmentStatus = (
    status
  ) => {
    return String(
      status || ""
    )
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // =========================================================
  // CHECK APARTMENT HAS OWNER
  // =========================================================

  const hasApartmentOwner = (
    apartment
  ) => {
    if (!apartment) {
      return false;
    }

    const ownerId =
      apartment?.owner?.id ??
      apartment?.ownerId ??
      null;

    return (
      ownerId !== null &&
      ownerId !== undefined
    );
  };

  // =========================================================
  // OWNER NAME
  // =========================================================

  const getApartmentOwnerName = (
    apartment
  ) => {
    if (!apartment) {
      return "Chưa có Owner";
    }

    return (
      apartment?.owner?.fullName ||
      apartment?.owner?.username ||
      apartment?.owner?.name ||
      (apartment?.owner?.id
        ? `Owner #${apartment.owner.id}`
        : "Chưa có Owner")
    );
  };

  // =========================================================
  // CHECK APARTMENT AVAILABLE
  //
  // Điều kiện:
  // 1. PHẢI có Owner
  // 2. PHẢI đang AVAILABLE
  // =========================================================

  const isApartmentAvailable = (
    apartment
  ) => {
    // -------------------------------------------------------
    // 1. PHẢI CÓ OWNER
    // -------------------------------------------------------

    if (!hasApartmentOwner(apartment)) {
      return false;
    }

    // -------------------------------------------------------
    // 2. PHẢI CÒN TRỐNG
    // -------------------------------------------------------

    const status =
      normalizeApartmentStatus(
        apartment?.status
      );

    return (
      status === "AVAILABLE" ||
      status === "VACANT" ||
      status === "EMPTY" ||
      status === "TRONG" ||
      status === "CON TRONG" ||
      status === "CHUA THUE"
    );
  };

  // =========================================================
  // AVAILABLE APARTMENTS
  // Chỉ gồm:
  // - Có Owner
  // - Còn trống
  // =========================================================

  const availableApartments =
    useMemo(() => {
      return apartments.filter(
        isApartmentAvailable
      );
    }, [apartments]);

  // =========================================================
  // SELECTED APARTMENT
  // =========================================================

  const selectedApartment =
    useMemo(() => {
      if (!formData.apartmentName) {
        return null;
      }

      return (
        apartments.find(
          (apartment) =>
            String(
              apartment?.name || ""
            ).trim() ===
            String(
              formData.apartmentName || ""
            ).trim()
        ) || null
      );
    }, [
      apartments,
      formData.apartmentName,
    ]);

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    // -------------------------------------------------------
    // CUSTOMER
    // -------------------------------------------------------

    if (!formData.name.trim()) {
      newErrors.name =
        "Vui lòng nhập tên khách hàng";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Vui lòng nhập email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
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

    // -------------------------------------------------------
    // RENTAL
    // -------------------------------------------------------

    if (
      formData.apartmentName
    ) {
      // -----------------------------------------------------
      // CĂN HỘ PHẢI THẬT SỰ HỢP LỆ
      // -----------------------------------------------------

      const apartment =
        apartments.find(
          (item) =>
            String(
              item?.name || ""
            ).trim() ===
            String(
              formData.apartmentName
            ).trim()
        );

      if (!apartment) {
        newErrors.apartmentName =
          "Không tìm thấy căn hộ đã chọn";
      } else if (
        !hasApartmentOwner(apartment)
      ) {
        newErrors.apartmentName =
          "Căn hộ chưa được gán Owner";
      } else if (
        !isApartmentAvailable(apartment)
      ) {
        newErrors.apartmentName =
          "Căn hộ hiện không còn trống";
      }

      // -----------------------------------------------------
      // DATE
      // -----------------------------------------------------

      if (!formData.startDate) {
        newErrors.startDate =
          "Vui lòng chọn ngày bắt đầu";
      }

      if (!formData.endDate) {
        newErrors.endDate =
          "Vui lòng chọn ngày kết thúc";
      }

      if (
        formData.startDate &&
        formData.endDate
      ) {
        const start =
          new Date(
            formData.startDate
          );

        const end =
          new Date(
            formData.endDate
          );

        if (end <= start) {
          newErrors.endDate =
            "Ngày kết thúc phải sau ngày bắt đầu";
        }
      }

      // -----------------------------------------------------
      // RENT
      // -----------------------------------------------------

      if (!formData.monthlyRent) {
        newErrors.monthlyRent =
          "Vui lòng nhập tiền thuê";
      } else if (
        Number(
          formData.monthlyRent
        ) <= 0
      ) {
        newErrors.monthlyRent =
          "Tiền thuê phải lớn hơn 0";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // =========================================================
  // INPUT
  // =========================================================

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (errors[name]) {
      setErrors(
        (previous) => ({
          ...previous,
          [name]: "",
        })
      );
    }

    // -------------------------------------------------------
    // BỎ CHỌN CĂN HỘ
    // -------------------------------------------------------

    if (
      name === "apartmentName" &&
      value === ""
    ) {
      setFormData(
        (previous) => ({
          ...previous,

          apartmentName: "",
          startDate: "",
          endDate: "",
          monthlyRent: "",
        })
      );

      setErrors(
        (previous) => ({
          ...previous,

          apartmentName: "",
          startDate: "",
          endDate: "",
          monthlyRent: "",
        })
      );
    }
  };

  // =========================================================
  // CREATE CONTRACT
  // =========================================================

  const createContractForCustomer =
    async (customer) => {
      const token = getToken();

      // -----------------------------------------------------
      // TÌM CĂN HỘ ĐÃ CHỌN
      // -----------------------------------------------------

      const apartment =
        apartments.find(
          (item) =>
            String(
              item?.name || ""
            ).trim() ===
            String(
              formData.apartmentName || ""
            ).trim()
        );

      if (!apartment) {
        throw new Error(
          "Không tìm thấy căn hộ đã chọn."
        );
      }

      // -----------------------------------------------------
      // PHẢI CÓ OWNER
      // -----------------------------------------------------

      if (!hasApartmentOwner(apartment)) {
        throw new Error(
          `Căn hộ ${apartment.name} chưa được gán Owner nên không thể cho thuê.`
        );
      }

      // -----------------------------------------------------
      // PHẢI AVAILABLE
      // -----------------------------------------------------

      if (!isApartmentAvailable(apartment)) {
        throw new Error(
          `Căn hộ ${apartment.name} hiện không còn trống.`
        );
      }

      const contractData = {
        customerName:
          customer.name,

        apartmentName:
          formData.apartmentName,

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        monthlyRent:
          Number(
            formData.monthlyRent
          ),

        status:
          "Đang thuê",
      };

      console.log(
        "TẠO HỢP ĐỒNG:",
        contractData
      );

      const response =
        await fetch(
          `${API_BASE_URL}/contracts`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            body:
              JSON.stringify(
                contractData
              ),
          }
        );

      const text =
        await response.text();

      let data = null;

      try {
        data = text
          ? JSON.parse(text)
          : null;
      } catch {
        data = text;
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
                `Không thể tạo hợp đồng (${response.status})`
        );
      }

      return data;
    };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // =====================================================
      // UPDATE CUSTOMER
      // =====================================================

      if (editingId) {
        await customerService
          .updateCustomer(
            editingId,
            {
              name:
                formData.name.trim(),

              email:
                formData.email.trim(),

              phone:
                formData.phone.trim(),

              address:
                formData.address.trim(),
            }
          );

        showAlert(
          "Cập nhật khách hàng thành công",
          "success"
        );
      }

      // =====================================================
      // CREATE CUSTOMER
      // =====================================================

      else {
        const customerData = {
          name:
            formData.name.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          address:
            formData.address.trim(),
        };

        // ---------------------------------------------------
        // CREATE CUSTOMER
        // ---------------------------------------------------

        const createdCustomer =
          await customerService
            .createCustomer(
              customerData
            );

        console.log(
          "KHÁCH HÀNG MỚI:",
          createdCustomer
        );

        // ---------------------------------------------------
        // CREATE CONTRACT
        // ---------------------------------------------------

        if (
          formData.apartmentName
        ) {
          await createContractForCustomer(
            createdCustomer
          );

          showAlert(
            "Thêm khách hàng và tạo hợp đồng thành công",
            "success"
          );
        } else {
          showAlert(
            "Thêm khách hàng thành công",
            "success"
          );
        }
      }

      resetForm();

      await fetchCustomers();

    } catch (error) {
      console.error(
        "SAVE CUSTOMER ERROR:",
        error
      );

      showAlert(
        error.message ||
          "Có lỗi xảy ra khi lưu khách hàng",
        "error"
      );
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (
    customer
  ) => {
    setFormData({
      name:
        customer.name || "",

      email:
        customer.email || "",

      phone:
        customer.phone || "",

      address:
        customer.address || "",

      apartmentName:
        customer.apartmentName ||
        "",

      startDate: "",
      endDate: "",
      monthlyRent: "",
    });

    setEditingId(
      customer.id
    );

    setErrors({});

    setShowForm(true);

    fetchApartments();
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc chắn muốn xóa khách hàng này?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await customerService
        .deleteCustomer(id);

      showAlert(
        "Xóa khách hàng thành công",
        "success"
      );

      await fetchCustomers();

    } catch (error) {
      console.error(
        "DELETE CUSTOMER ERROR:",
        error
      );

      showAlert(
        error.message ||
          "Không thể xóa khách hàng",
        "error"
      );
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",

      apartmentName: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
    });

    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getCustomerStatus = (
    customer
  ) => {
    const status =
      customer?.contractStatus
        ?.toString()
        .trim()
        .toLowerCase();

    if (
      !customer?.contractId
    ) {
      return {
        label: "Chưa thuê",
        className: "empty",
      };
    }

    if (
      status === "đang thuê" ||
      status === "active" ||
      status ===
        "đang hoạt động"
    ) {
      return {
        label: "Đang thuê",
        className: "active",
      };
    }

    if (
      status ===
        "đã kết thúc" ||
      status === "ended" ||
      status ===
        "expired" ||
      status === "inactive"
    ) {
      return {
        label: "Đã kết thúc",
        className: "inactive",
      };
    }

    return {
      label:
        customer.contractStatus ||
        "Chưa xác định",

      className: "neutral",
    };
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredCustomers =
    customers.filter(
      (customer) => {
        const keyword =
          search
            .trim()
            .toLowerCase();

        if (!keyword) {
          return true;
        }

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
            .includes(keyword) ||

          customer.apartmentName
            ?.toLowerCase()
            .includes(keyword) ||

          String(
            customer.contractId ||
              ""
          ).includes(keyword)
        );
      }
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="customers-page">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <header className="customers-topbar">

        <div className="customers-title">

          <h1>
            Khách hàng
          </h1>

          <p>
            Danh sách và thông tin thuê
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

      {/* ===================================================
          ALERT
      ==================================================== */}

      {alert && (
        <div
          className={`customer-alert ${alert.type}`}
        >

          <span className="alert-icon">
            {alert.type ===
            "success"
              ? "✓"
              : "!"}
          </span>

          <span>
            {alert.message}
          </span>

        </div>
      )}

      {/* ===================================================
          TOOLBAR
      ==================================================== */}

      <div className="customers-toolbar">

        <div className="customers-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        {!showForm && (
          <button
            type="button"
            className="btn-add-customer"
            onClick={
              openCreateForm
            }
          >

            <span>
              ＋
            </span>

            Thêm khách hàng

          </button>
        )}

      </div>

      {/* ===================================================
          FORM
      ==================================================== */}

      {showForm ? (

        <div className="customer-form-card">

          <div className="customer-form-heading">

            <div>

              <h2>
                {editingId
                  ? "Chỉnh sửa khách hàng"
                  : "Thêm khách hàng"}
              </h2>

              <p>
                {editingId
                  ? "Cập nhật thông tin khách hàng"
                  : "Nhập thông tin khách hàng"}
              </p>

            </div>

          </div>

          <form
            className="customer-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* =================================================
                NAME
            ================================================== */}

            <div className="customer-form-group">

              <label>
                Tên khách hàng
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleInputChange
                }
                placeholder="Nhập tên khách hàng"
              />

              {errors.name && (
                <span className="form-error">
                  {errors.name}
                </span>
              )}

            </div>

            {/* =================================================
                EMAIL
            ================================================== */}

            <div className="customer-form-group">

              <label>
                Email
                <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleInputChange
                }
                placeholder="example@gmail.com"
              />

              {errors.email && (
                <span className="form-error">
                  {errors.email}
                </span>
              )}

            </div>

            {/* =================================================
                PHONE
            ================================================== */}

            <div className="customer-form-group">

              <label>
                Số điện thoại
                <span>*</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleInputChange
                }
                placeholder="Nhập số điện thoại"
              />

              {errors.phone && (
                <span className="form-error">
                  {errors.phone}
                </span>
              )}

            </div>

            {/* =================================================
                ADDRESS
            ================================================== */}

            <div className="customer-form-group">

              <label>
                Địa chỉ
                <span>*</span>
              </label>

              <input
                type="text"
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleInputChange
                }
                placeholder="Nhập địa chỉ"
              />

              {errors.address && (
                <span className="form-error">
                  {errors.address}
                </span>
              )}

            </div>

            {/* =================================================
                RENTAL
            ================================================== */}

            {!editingId && (

              <div className="customer-rental-section">

                <div className="customer-rental-header">

                  <div>

                    <h3>
                      Thông tin thuê
                    </h3>

                    <p>
                      Chỉ có thể thuê căn hộ đã được gán Owner và còn trống.
                    </p>

                  </div>

                  <div className="available-apartment-count">

                    <span className="available-count-dot"></span>

                    <strong>
                      {
                        availableApartments.length
                      }
                    </strong>

                    <span>
                      căn có thể thuê
                    </span>

                  </div>

                </div>

                {/* =================================================
                    APARTMENT SELECT
                ================================================== */}

                <div className="customer-rental-grid">

                  <div className="customer-form-group">

                    <label>
                      Căn hộ
                    </label>

                    <select
                      name="apartmentName"
                      value={
                        formData.apartmentName
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={
                        loadingApartments
                      }
                    >

                      <option value="">

                        {loadingApartments
                          ? "Đang tải căn hộ..."
                          : availableApartments.length >
                            0
                          ? "Không chọn - Chưa thuê"
                          : "Không có căn hộ có thể thuê"}

                      </option>

                      {availableApartments.map(
                        (apartment) => (

                          <option
                            key={
                              apartment.id
                            }
                            value={
                              apartment.name
                            }
                          >

                            {apartment.name}

                            {" — "}

                            {getApartmentOwnerName(
                              apartment
                            )}

                            {" — "}

                            {apartment.area ??
                              "--"}

                            {" m²"}

                          </option>

                        )
                      )}

                    </select>

                    {errors.apartmentName && (
                      <span className="form-error">
                        {
                          errors.apartmentName
                        }
                      </span>
                    )}

                    {!loadingApartments &&
                      availableApartments.length ===
                        0 && (

                        <small className="form-help warning">
                          Không có căn hộ vừa được
                          gán Owner vừa đang còn trống.
                        </small>

                      )}

                  </div>

                  {/* =================================================
                      START DATE
                  ================================================== */}

                  <div className="customer-form-group">

                    <label>
                      Ngày bắt đầu

                      {formData.apartmentName && (
                        <span>*</span>
                      )}

                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={
                        formData.startDate
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={
                        !formData.apartmentName
                      }
                    />

                    {errors.startDate && (
                      <span className="form-error">
                        {errors.startDate}
                      </span>
                    )}

                  </div>

                  {/* =================================================
                      END DATE
                  ================================================== */}

                  <div className="customer-form-group">

                    <label>
                      Ngày kết thúc

                      {formData.apartmentName && (
                        <span>*</span>
                      )}

                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={
                        formData.endDate
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={
                        !formData.apartmentName
                      }
                    />

                    {errors.endDate && (
                      <span className="form-error">
                        {errors.endDate}
                      </span>
                    )}

                  </div>

                  {/* =================================================
                      MONTHLY RENT
                  ================================================== */}

                  <div className="customer-form-group">

                    <label>
                      Tiền thuê hàng tháng

                      {formData.apartmentName && (
                        <span>*</span>
                      )}

                    </label>

                    <div className="rent-input-wrapper">

                      <input
                        type="number"
                        name="monthlyRent"
                        value={
                          formData.monthlyRent
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="VD: 5000000"
                        min="0"
                        disabled={
                          !formData.apartmentName
                        }
                      />

                      <span>
                        đ
                      </span>

                    </div>

                    {errors.monthlyRent && (
                      <span className="form-error">
                        {
                          errors.monthlyRent
                        }
                      </span>
                    )}

                  </div>

                </div>

                {/* =================================================
                    SELECTED APARTMENT INFO
                ================================================== */}

                {formData.apartmentName &&
                  selectedApartment && (

                    <div className="rental-note">

                      <span>
                        ✓
                      </span>

                      <p>

                        Căn hộ{" "}

                        <strong>
                          {
                            selectedApartment.name
                          }
                        </strong>

                        {" thuộc Owner "}

                        <strong>
                          {getApartmentOwnerName(
                            selectedApartment
                          )}
                        </strong>

                        {" — "}

                        {
                          selectedApartment.area ??
                            "--"
                        }

                        {" m²."}

                        <br />

                        Sau khi lưu, hệ thống sẽ
                        tạo hợp đồng thuê và hóa đơn
                        chưa thanh toán.

                      </p>

                    </div>

                  )}

              </div>

            )}

            {/* =================================================
                EDIT CURRENT APARTMENT
            ================================================== */}

            {editingId &&
              formData.apartmentName && (

                <div className="current-rental-info">

                  <div className="current-rental-title">
                    Căn hộ hiện tại
                  </div>

                  <div className="current-rental-value">

                    <span>
                      🏢
                    </span>

                    <strong>
                      {
                        formData.apartmentName
                      }
                    </strong>

                    <small>
                      Hệ thống giữ nguyên
                      hợp đồng hiện tại
                    </small>

                  </div>

                </div>

              )}

            {/* =================================================
                BUTTONS
            ================================================== */}

            <div className="customer-form-buttons">

              <button
                type="button"
                className="btn-cancel"
                onClick={
                  resetForm
                }
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn-submit"
              >

                {editingId
                  ? "Cập nhật"
                  : formData.apartmentName
                    ? "Lưu khách & tạo hợp đồng"
                    : "Lưu khách hàng"}

              </button>

            </div>

          </form>

        </div>

      ) : (

        /* =================================================
           TABLE
        ================================================== */

        <div className="customers-card">

          <div className="customers-card-header">

            <div>

              <h2>
                Danh sách khách hàng
              </h2>

              <p>
                {
                  filteredCustomers.length
                }{" "}
                khách hàng
              </p>

            </div>

            <div className="customers-count">

              <strong>
                {customers.length}
              </strong>

              <span>
                khách hàng
              </span>

            </div>

          </div>

          <div className="table-wrapper">

            <table className="customers-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Khách hàng
                  </th>

                  <th>
                    Liên hệ
                  </th>

                  <th>
                    Địa chỉ
                  </th>

                  <th>
                    Căn hộ
                  </th>

                  <th>
                    Hợp đồng
                  </th>

                  <th>
                    Trạng thái
                  </th>

                  <th>
                    Hành động
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="customer-loading"
                    >

                      <div className="loading-state">

                        <div className="loading-spinner"></div>

                        <span>
                          Đang tải dữ liệu...
                        </span>

                      </div>

                    </td>

                  </tr>

                ) : filteredCustomers.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="customer-empty"
                    >

                      <div className="empty-state">

                        <div className="empty-icon">
                          👥
                        </div>

                        <strong>
                          Không có khách hàng
                        </strong>

                        <span>
                          Không tìm thấy dữ liệu phù hợp.
                        </span>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredCustomers.map(
                    (customer) => {

                      const status =
                        getCustomerStatus(
                          customer
                        );

                      return (

                        <tr
                          key={
                            customer.id
                          }
                        >

                          <td className="customer-id">

                            <span>
                              #
                              {
                                customer.id
                              }
                            </span>

                          </td>

                          <td>

                            <div className="customer-person">

                              <div className="customer-mini-avatar">

                                {customer.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "?"}

                              </div>

                              <div className="customer-person-info">

                                <strong>
                                  {
                                    customer.name ||
                                    "--"
                                  }
                                </strong>

                                <small>
                                  Khách hàng #
                                  {
                                    customer.id
                                  }
                                </small>

                              </div>

                            </div>

                          </td>

                          <td>

                            <div className="contact-line">

                              <span className="contact-icon">
                                ✉
                              </span>

                              <span>
                                {
                                  customer.email ||
                                  "--"
                                }
                              </span>

                            </div>

                            <div className="contact-line">

                              <span className="contact-icon">
                                ☎
                              </span>

                              <span>
                                {
                                  customer.phone ||
                                  "--"
                                }
                              </span>

                            </div>

                          </td>

                          <td>

                            <div className="customer-address-cell">
                              {
                                customer.address ||
                                "--"
                              }
                            </div>

                          </td>

                          <td>

                            {customer.apartmentName ? (

                              <div className="apartment-info-cell">

                                <div className="apartment-mini-icon">
                                  🏢
                                </div>

                                <div className="apartment-info-content">

                                  <strong>
                                    {
                                      customer.apartmentName
                                    }
                                  </strong>

                                  <small>
                                    ID:{" "}
                                    {
                                      customer.apartmentId ??
                                      "--"
                                    }
                                  </small>

                                </div>

                              </div>

                            ) : (

                              <span className="muted-cell">
                                Chưa thuê
                              </span>

                            )}

                          </td>

                          <td>

                            {customer.contractId ? (

                              <div className="contract-info-cell">

                                <strong>
                                  #
                                  {
                                    customer.contractId
                                  }
                                </strong>

                                <small>
                                  Hợp đồng thuê
                                </small>

                              </div>

                            ) : (

                              <span className="muted-cell">
                                Chưa có
                              </span>

                            )}

                          </td>

                          <td>

                            <span
                              className={`customer-status ${status.className}`}
                            >

                              <span className="status-dot"></span>

                              {
                                status.label
                              }

                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                type="button"
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
                                type="button"
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

                      );
                    }
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