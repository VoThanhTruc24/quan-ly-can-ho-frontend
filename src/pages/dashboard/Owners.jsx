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

  const [selectedApartment, setSelectedApartment] =
    useState("");

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

      setOwners(data);
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

      const data =
        await getOwnerApartments(owner.id);

      setOwnerApartments(data);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Không thể lấy thông tin căn hộ"
      );
    }
  };

  // ==============================
  // ASSIGN APARTMENT
  // ==============================

  const handleAssignApartment = async () => {
    if (!selectedApartment) {
      setError("Vui lòng nhập ID căn hộ");
      return;
    }

    try {
      setError("");
      setMessage("");

      await assignApartmentToOwner(
        selectedOwner.id,
        Number(selectedApartment)
      );

      setMessage(
        `Đã gán căn hộ ID ${selectedApartment} cho ${selectedOwner.username}`
      );

      // Load lại căn hộ của Owner
      const data =
        await getOwnerApartments(
          selectedOwner.id
        );

      setOwnerApartments(data);

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
            onSubmit={handleCreateOwner}
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
                onClick={() =>
                  setShowCreateForm(false)
                }
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

                  <th>
                    ID
                  </th>

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
                onClick={() =>
                  setSelectedOwner(null)
                }
              >
                ×
              </button>

            </div>


            {/* CĂN HỘ ĐANG CÓ */}

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
                          Diện tích:{" "}
                          {apartment.area} m²
                        </span>

                      </div>

                      <span className="status">
                        {apartment.status}
                      </span>

                    </div>

                  )
                )

              )}

            </div>


            {/* GÁN CĂN HỘ */}

            <div className="assign-section">

              <h3>
                Gán căn hộ mới
              </h3>

              <div className="assign-input">

                <input
                  type="number"
                  placeholder="Nhập ID căn hộ"
                  value={
                    selectedApartment
                  }
                  onChange={(e) =>
                    setSelectedApartment(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={
                    handleAssignApartment
                  }
                >
                  Gán
                </button>

              </div>

              <p className="hint">
                Ví dụ: nhập <strong>2</strong>{" "}
                để gán căn hộ có ID = 2.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Owners;