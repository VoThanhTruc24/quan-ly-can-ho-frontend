import { useEffect, useMemo, useState } from "react";
import apartmentService from "../../services/apartmentService";
import "./Apartments.css";

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [floorFilter, setFloorFilter] = useState("ALL");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    area: "",
    status: "AVAILABLE",
  });

  const [alert, setAlert] = useState(null);

  // =====================================================
  // ALERT
  // =====================================================

  const showAlert = (message, type = "success") => {
    setAlert({
      message,
      type,
    });

    window.setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // =====================================================
  // GET APARTMENTS
  // =====================================================

  const fetchApartments = async () => {
    try {
      setLoading(true);

      const data = await apartmentService.getAllApartments();

      setApartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching apartments:", error);

      showAlert(
        error?.message || "Không thể tải danh sách căn hộ",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // =====================================================
  // FLOOR LIST
  // =====================================================

  const floors = useMemo(() => {
    const map = new Map();

    apartments.forEach((apartment) => {
      const floorId =
        apartment.floor?.id ??
        apartment.floorId ??
        null;

      if (floorId === null || floorId === undefined) {
        return;
      }

      const floorName =
        apartment.floor?.name ||
        apartment.floor?.floorNumber ||
        `Tầng ${floorId}`;

      map.set(String(floorId), {
        id: floorId,
        name:
          typeof floorName === "number"
            ? `Tầng ${floorName}`
            : String(floorName),
      });
    });

    return Array.from(map.values()).sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  }, [apartments]);

  // =====================================================
  // FLOOR NAME
  // =====================================================

  const getFloorName = (apartment) => {
    if (apartment.floor?.name) {
      return apartment.floor.name;
    }

    if (apartment.floor?.floorNumber) {
      return `Tầng ${apartment.floor.floorNumber}`;
    }

    if (apartment.floor?.id) {
      return `Tầng ${apartment.floor.id}`;
    }

    if (apartment.floorId) {
      return `Tầng ${apartment.floorId}`;
    }

    return "-";
  };

  // =====================================================
  // OWNER NAME
  // =====================================================

  const getOwnerName = (apartment) => {
    if (apartment.owner?.fullName) {
      return apartment.owner.fullName;
    }

    if (apartment.owner?.name) {
      return apartment.owner.name;
    }

    if (apartment.owner?.username) {
      return apartment.owner.username;
    }

    return "Chưa gán";
  };

  // =====================================================
  // STATUS
  // =====================================================

  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toUpperCase();
  };

  const getStatusText = (status) => {
    switch (normalizeStatus(status)) {
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

  const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
      case "AVAILABLE":
        return "status-available";

      case "RENTED":
        return "status-rented";

      case "MAINTENANCE":
        return "status-maintenance";

      default:
        return "status-default";
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredApartments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return apartments.filter((apartment) => {
      const apartmentId = String(
        apartment.id || ""
      ).toLowerCase();

      const apartmentName = String(
        apartment.name || ""
      ).toLowerCase();

      const floorName = String(
        getFloorName(apartment) || ""
      ).toLowerCase();

      const ownerName = String(
        getOwnerName(apartment) || ""
      ).toLowerCase();

      const matchesSearch =
        !keyword ||
        apartmentId.includes(keyword) ||
        apartmentName.includes(keyword) ||
        floorName.includes(keyword) ||
        ownerName.includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(apartment.status) === statusFilter;

      const currentFloorId =
        apartment.floor?.id ??
        apartment.floorId ??
        null;

      const matchesFloor =
        floorFilter === "ALL" ||
        String(currentFloorId) === String(floorFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFloor
      );
    });
  }, [
    apartments,
    search,
    statusFilter,
    floorFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const apartmentStats = useMemo(() => {
    const total = apartments.length;

    const available = apartments.filter(
      (item) =>
        normalizeStatus(item.status) === "AVAILABLE"
    ).length;

    const rented = apartments.filter(
      (item) =>
        normalizeStatus(item.status) === "RENTED"
    ).length;

    const maintenance = apartments.filter(
      (item) =>
        normalizeStatus(item.status) ===
        "MAINTENANCE"
    ).length;

    return {
      total,
      available,
      rented,
      maintenance,
    };
  }, [apartments]);

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (apartment) => {
    setEditingId(apartment.id);

    setEditForm({
      name: apartment.name || "",
      area: apartment.area ?? "",
      status: apartment.status || "AVAILABLE",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditForm({
      name: "",
      area: "",
      status: "AVAILABLE",
    });
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async (apartment) => {
    if (!editForm.name.trim()) {
      showAlert(
        "Tên căn hộ không được để trống",
        "error"
      );
      return;
    }

    if (
      !editForm.area ||
      Number(editForm.area) <= 0
    ) {
      showAlert(
        "Diện tích phải lớn hơn 0",
        "error"
      );
      return;
    }

    try {
      const floorId =
        apartment.floor?.id ??
        apartment.floorId;

      if (!floorId) {
        showAlert(
          "Căn hộ chưa có thông tin tầng",
          "error"
        );
        return;
      }

      const data = {
        name: editForm.name.trim(),
        area: Number(editForm.area),
        status: editForm.status,
        floorId: Number(floorId),
      };

      await apartmentService.updateApartment(
        apartment.id,
        data
      );

      showAlert(
        "Cập nhật căn hộ thành công"
      );

      handleCancelEdit();

      await fetchApartments();
    } catch (error) {
      console.error(
        "Error updating apartment:",
        error
      );

      showAlert(
        error?.message ||
          "Không thể cập nhật căn hộ",
        "error"
      );
    }
  };

  // =====================================================
  // EDIT INPUT
  // =====================================================

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CLEAR FILTER
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setFloorFilter("ALL");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="apartment-page">

      {/* ================= HEADER ================= */}

      <div className="apartment-header">
        <div>
          <h1>Căn hộ</h1>

          <p>
            Danh sách các căn hộ trong chung cư
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

      {/* ================= STATS ================= */}

      <div className="apartment-stats">

        <div className="stat-card">
          <div className="stat-icon stat-icon-total">
            🏢
          </div>

          <div>
            <span>Tổng căn hộ</span>
            <strong>
              {apartmentStats.total}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-available">
            ✓
          </div>

          <div>
            <span>Còn trống</span>
            <strong>
              {apartmentStats.available}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-rented">
            👤
          </div>

          <div>
            <span>Đang thuê</span>
            <strong>
              {apartmentStats.rented}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-maintenance">
            🔧
          </div>

          <div>
            <span>Bảo trì</span>
            <strong>
              {apartmentStats.maintenance}
            </strong>
          </div>
        </div>

      </div>

      {/* ================= FILTER ================= */}

      <div className="apartment-filter-card">

        <div className="apartment-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Tìm theo tên căn hộ, tầng hoặc Owner..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={floorFilter}
          onChange={(e) =>
            setFloorFilter(e.target.value)
          }
          className="apartment-filter-select"
        >
          <option value="ALL">
            Tất cả tầng
          </option>

          {floors.map((floor) => (
            <option
              key={floor.id}
              value={floor.id}
            >
              {floor.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="apartment-filter-select"
        >
          <option value="ALL">
            Tất cả trạng thái
          </option>

          <option value="AVAILABLE">
            Còn trống
          </option>

          <option value="RENTED">
            Đang thuê
          </option>

          <option value="MAINTENANCE">
            Bảo trì
          </option>
        </select>

        {(search ||
          statusFilter !== "ALL" ||
          floorFilter !== "ALL") && (
          <button
            type="button"
            className="clear-filter-btn"
            onClick={clearFilters}
          >
            Xóa lọc
          </button>
        )}

      </div>

      {/* ================= TABLE ================= */}

      <div className="apartment-table-card">

        <div className="table-header">
          <div>
            <h2>Danh sách căn hộ</h2>

            <p>
              Hiển thị{" "}
              <strong>
                {filteredApartments.length}
              </strong>{" "}
              / {apartments.length} căn hộ
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
                <th>Owner</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-row"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredApartments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-row"
                  >
                    {apartments.length === 0
                      ? "Chưa có dữ liệu căn hộ"
                      : "Không tìm thấy căn hộ phù hợp"}
                  </td>
                </tr>
              ) : (
                filteredApartments.map(
                  (apartment) => {
                    const isEditing =
                      editingId === apartment.id;

                    return (
                      <tr
                        key={apartment.id}
                        className={
                          isEditing
                            ? "editing-row"
                            : ""
                        }
                      >

                        {/* ID */}

                        <td className="id-cell">
                          #{apartment.id}
                        </td>

                        {/* APARTMENT */}

                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={
                                handleEditInputChange
                              }
                              className="table-edit-input"
                            />
                          ) : (
                            <div className="apartment-name">
                              <div className="apartment-icon">
                                🏢
                              </div>

                              <strong>
                                {apartment.name}
                              </strong>
                            </div>
                          )}
                        </td>

                        {/* AREA */}

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              name="area"
                              value={editForm.area}
                              onChange={
                                handleEditInputChange
                              }
                              min="1"
                              step="0.1"
                              className="table-edit-input area-input"
                            />
                          ) : (
                            `${apartment.area ?? "-"} m²`
                          )}
                        </td>

                        {/* FLOOR */}

                        <td>
                          {getFloorName(apartment)}
                        </td>

                        {/* OWNER */}

                        <td>
                          <span
                            className={
                              getOwnerName(apartment) ===
                              "Chưa gán"
                                ? "owner-unassigned"
                                : "owner-name"
                            }
                          >
                            {getOwnerName(
                              apartment
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          {isEditing ? (
                            <select
                              name="status"
                              value={
                                editForm.status
                              }
                              onChange={
                                handleEditInputChange
                              }
                              className="table-edit-select"
                            >
                              <option value="AVAILABLE">
                                Còn trống
                              </option>

                              <option value="RENTED">
                                Đang thuê
                              </option>

                              <option value="MAINTENANCE">
                                Bảo trì
                              </option>
                            </select>
                          ) : (
                            <span
                              className={`status-badge ${getStatusClass(
                                apartment.status
                              )}`}
                            >
                              {getStatusText(
                                apartment.status
                              )}
                            </span>
                          )}
                        </td>

                        {/* ACTION */}

                        <td>
                          <div className="action-buttons">

                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="save-inline-btn"
                                  onClick={() =>
                                    handleSaveEdit(
                                      apartment
                                    )
                                  }
                                >
                                  Lưu
                                </button>

                                <button
                                  type="button"
                                  className="cancel-inline-btn"
                                  onClick={
                                    handleCancelEdit
                                  }
                                >
                                  Hủy
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    apartment
                                  )
                                }
                              >
                                Sửa
                              </button>
                            )}

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

    </div>
  );
}

export default Apartments;