const API_BASE_URL = "http://localhost:8080/api";

const apartmentService = {
  // Lấy tất cả căn hộ
  getAllApartments: async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/apartments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi lấy danh sách căn hộ: ${response.status}`
      );
    }

    return await response.json();
  },

  // Lấy căn hộ theo ID
  getApartmentById: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/apartments/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi lấy căn hộ: ${response.status}`
      );
    }

    return await response.json();
  },

  // Tạo căn hộ
  createApartment: async (apartmentData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/apartments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apartmentData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi tạo căn hộ: ${response.status}`
      );
    }

    return await response.json();
  },

  // Cập nhật căn hộ
  updateApartment: async (id, apartmentData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/apartments/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apartmentData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi cập nhật căn hộ: ${response.status}`
      );
    }

    return await response.json();
  },

  // Xóa căn hộ
  deleteApartment: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/apartments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi xóa căn hộ: ${response.status}`
      );
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  },
};

export default apartmentService;