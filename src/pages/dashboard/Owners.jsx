import { useEffect, useState } from "react";

import {
  getOwners,
  createOwner,
  getOwnerApartments,
  assignApartmentToOwner,
} from "../../services/ownerService";

import "./Owners.css";

function Owners() {
  const [owners, setOwners] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==============================
  // FORM OWNER
  // ==============================

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // ==============================
  // ASSIGN APARTMENT
  // ==============================

  const [selectedOwner, setSelectedOwner] =
    useState(null);

  const [ownerApartments, setOwnerApartments] =
    useState([]);

  const [apartments, setApartments] =
    useState([]);

  const [selectedApartment, setSelectedApartment] =
    useState("");

  const [loadingApartments, setLoadingApartments] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==============================
  // LOAD OWNER
  // ==============================

  const loadOwners = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOwners();

      setOwners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Không thể tải danh sách Owner"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  // ==============================
  // LOAD ALL APARTMENTS
  // ==============================

  const loadApartments = async () => {
    try {
      setLoadingApartments(true);

      const response = await fetch(
        "http://localhost:8080/api/apartments"
      );

      if (!response.ok) {
        throw new Error(
          "Không thể tải danh sách căn hộ"
        );
      }

      const data = await response.json();

      setApartments(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Error loading apartments:",
        err
      );

      setApartments([]);

      setError(
        err.message ||
          "Không thể tải danh sách căn hộ"
      );
    } finally {
      setLoadingApartments(false);
    }
  };

  // ==============================
  // CREATE OWNER
  // ==============================

  const handleCreateOwner = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      if (!username.trim()) {
        setError("Vui lòng nhập username");
        return;
      }

      if (!password.trim()) {
        setError("Vui lòng nhập mật khẩu");
        return;
      }

      await createOwner({
        username: username.trim(),
        password: password,
        fullName: fullName.trim(),
      });

      setMessage("Tạo Owner thành công!");

      // Reset form
      setUsername("");
      setPassword("");
      setFullName("");

      setShowCreateForm(false);

      // Load lại danh sách
      await loadOwners();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Không thể tạo Owner"
      );
    }
  };

  // ==============================
  // OPEN ASSIGN
  // ==============================

  const handleOpenAssign = async (owner) => {
    try {
      setError("");
      setMessage("");

      setSelectedOwner(owner);

      setSelectedApartment("");

      // Lấy căn hộ của Owner
      const ownerData =
        await getOwnerApartments(owner.id);

      setOwnerApartments(
        Array.isArray(ownerData)
          ? ownerData
          : []
      );

      // Lấy toàn bộ căn hộ
      await loadApartments();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Không thể lấy thông tin căn hộ"
      );
    }
  };

  // ==============================
  // CLOSE MODAL
  // ==============================

  const handleCloseModal = () => {
    setSelectedOwner(null);
    setOwnerApartments([]);
    setSelectedApartment("");

    setMessage("");
    setError("");
  };

  // ==============================
  // FLOOR NAME
  // ==============================

  const getFloorName = (apartment) => {
    if (apartment?.floor?.name) {
      return apartment.floor.name;
    }

    if (apartment?.floor?.floorNumber) {
      return `Tầng ${apartment.floor.floorNumber}`;
    }

    if (apartment?.floor?.id) {
      return `Tầng ${apartment.floor.id}`;
    }

    if (apartment?.floorId) {
      return `Tầng ${apartment.floorId}`;
    }

    return "Chưa có tầng";
  };

  // ==============================
  // STATUS TEXT
  // ==============================

  const getApartmentStatus = (status) => {
    const normalized = String(
      status || ""
    ).toUpperCase();

    switch (normalized) {
      case "AVAILABLE":
        return "Còn trống";

      case "RENTED":
        return "Đang thuê";

      case "MAINTENANCE":
        return "Bảo trì";

      default:
        return status || "-";
    }
  };

  // ==============================
  // APARTMENTS AVAILABLE FOR ASSIGN
  // ==============================

  const availableApartments =
    apartments.filter((apartment) => {
      const apartmentId = String(
        apartment.id
      );

      // Kiểm tra đã thuộc Owner hiện tại chưa
      const alreadyOwnedByCurrentOwner =
        ownerApartments.some(
          (item) =>
            String(item.id) === apartmentId
        );

      if (alreadyOwnedByCurrentOwner) {
        return false;
      }

      // Có owner rồi thì không cho gán
      if (apartment.owner) {
        return false;
      }

      if (apartment.ownerId) {
        return false;
      }

      // Chỉ cho chọn căn đang còn trống
      const status = String(
        apartment.status || ""
      ).toUpperCase();

      return (
        status === "AVAILABLE" ||
        status === "VACANT" ||
        status === "EMPTY"
      );
    });

  // ==============================
  // ASSIGN APARTMENT
  // ==============================

  const handleAssignApartment = async () => {
    if (!selectedApartment) {
      setError("Vui lòng chọn căn hộ");
      return;
    }

    if (!selectedOwner) {
      setError(
        "Không xác định được Owner"
      );
      return;
    }

    try {
      setError("");
      setMessage("");

      const apartment =
        apartments.find(
          (item) =>
            String(item.id) ===
            String(selectedApartment)
        );

      if (!apartment) {
        setError(
          "Không tìm thấy căn hộ đã chọn"
        );
        return;
      }

      await assignApartmentToOwner(
        selectedOwner.id,
        Number(selectedApartment)
      );

      setMessage(
        `Đã gán căn ${apartment.name} cho ${selectedOwner.username}`
      );

      // Load lại căn hộ của Owner
      const ownerData =
        await getOwnerApartments(
          selectedOwner.id
        );

      setOwnerApartments(
        Array.isArray(ownerData)
          ? ownerData
          : []
      );

      // Load lại danh sách toàn bộ căn hộ
      await loadApartments();

      setSelectedApartment("");
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Không thể gán căn hộ"
      );
    }
  };

  return (
    <div className="owners-page">

      {/* ==============================
          HEADER
      ============================== */}

      <div className="owners-header">

        <div>
          <h1>Quản lý Owner</h1>

          <p>
            Quản lý tài khoản chủ căn hộ
            và căn hộ được phân công
          </p>
        </div>

        <button
          className="create-owner-btn"
          onClick={() =>
            setShowCreateForm(
              !showCreateForm
            )
          }
        >
          + Thêm Owner
        </button>

      </div>

      {/* ==============================
          MESSAGE
      ============================== */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ==============================
          CREATE FORM
      ============================== */}

      {showCreateForm && (
        <div className="owner-form-card">

          <h2>
            Tạo tài khoản Owner
          </h2>

          <form
            onSubmit={
              handleCreateOwner
            }
          >

            <div className="form-group">

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                placeholder="Nhập username"
              />

            </div>

            <div className="form-group">

              <label>
                Họ và tên
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Nhập họ tên Owner"
              />

            </div>

            <div className="form-group">

              <label>
                Mật khẩu
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Nhập mật khẩu"
              />

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  setError("");
                }}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                Tạo Owner
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ==============================
          OWNER LIST
      ============================== */}

      <div className="owners-card">

        <div className="card-title">

          <div>
            <h2>
              Danh sách Owner
            </h2>

            <p>
              {owners.length} tài khoản Owner
            </p>
          </div>

        </div>

        {loading ? (

          <div className="loading">
            Đang tải dữ liệu...
          </div>

        ) : owners.length === 0 ? (

          <div className="empty">
            Chưa có Owner nào
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>
                    Username
                  </th>

                  <th>
                    Họ tên
                  </th>

                  <th>
                    Vai trò
                  </th>

                  <th>
                    Căn hộ
                  </th>

                  <th>
                    Thao tác
                  </th>

                </tr>

              </thead>

              <tbody>

                {owners.map((owner) => (

                  <tr key={owner.id}>

                    <td>
                      {owner.id}
                    </td>

                    <td>
                      <strong>
                        {owner.username}
                      </strong>
                    </td>

                    <td>
                      {owner.fullName ||
                        "Chưa cập nhật"}
                    </td>

                    <td>

                      <span className="role-badge">
                        {owner.role}
                      </span>

                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          handleOpenAssign(
                            owner
                          )
                        }
                      >
                        Xem căn hộ
                      </button>

                    </td>

                    <td>

                      <button
                        className="assign-btn"
                        onClick={() =>
                          handleOpenAssign(
                            owner
                          )
                        }
                      >
                        Gán căn hộ
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==============================
          ASSIGN MODAL
      ============================== */}

      {selectedOwner && (

        <div className="modal-overlay">

          <div className="owner-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Gán căn hộ
                </h2>

                <p>
                  Owner:{" "}
                  <strong>
                    {selectedOwner.username}
                  </strong>
                </p>

              </div>

              <button
                className="close-btn"
                onClick={
                  handleCloseModal
                }
              >
                ×
              </button>

            </div>

            {/* ==========================
                CĂN HỘ ĐANG CÓ
            ========================== */}

            <div className="current-apartments">

              <h3>
                Căn hộ đang được gán
              </h3>

              {ownerApartments.length ===
              0 ? (

                <p className="empty-text">
                  Owner chưa có căn hộ.
                </p>

              ) : (

                ownerApartments.map(
                  (apartment) => (

                    <div
                      className="apartment-item"
                      key={apartment.id}
                    >

                      <div>

                        <strong>
                          {apartment.name}
                        </strong>

                        <span>
                          {getFloorName(
                            apartment
                          )}
                        </span>

                        <span>
                          Diện tích:{" "}
                          {apartment.area} m²
                        </span>

                      </div>

                      <span className="status">
                        {getApartmentStatus(
                          apartment.status
                        )}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

            {/* ==========================
                GÁN CĂN HỘ
            ========================== */}

            <div className="assign-section">

              <h3>
                Gán căn hộ mới
              </h3>

              <div className="assign-input">

                <select
                  value={selectedApartment}
                  onChange={(e) =>
                    setSelectedApartment(
                      e.target.value
                    )
                  }
                  disabled={
                    loadingApartments ||
                    availableApartments.length ===
                      0
                  }
                >

                  <option value="">
                    {loadingApartments
                      ? "Đang tải căn hộ..."
                      : availableApartments.length ===
                        0
                      ? "Không còn căn hộ trống"
                      : "Chọn căn hộ"}
                  </option>

                  {availableApartments.map(
                    (apartment) => (
                      <option
                        key={apartment.id}
                        value={apartment.id}
                      >
                        {apartment.name} —{" "}
                        {getFloorName(
                          apartment
                        )}{" "}
                        — {apartment.area} m²
                      </option>
                    )
                  )}

                </select>

                <button
                  onClick={
                    handleAssignApartment
                  }
                  disabled={
                    !selectedApartment ||
                    loadingApartments
                  }
                >
                  Gán căn hộ
                </button>

              </div>

              <p className="hint">
                Chỉ hiển thị các căn hộ còn
                trống và chưa được gán Owner.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Owners;