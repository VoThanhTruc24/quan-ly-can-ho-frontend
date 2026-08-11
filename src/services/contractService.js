const API_BASE_URL = "http://localhost:8080/api";

const contractService = {
  // Lấy tất cả hợp đồng
  getAllContracts: async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/contracts`,
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
        `Lỗi lấy danh sách hợp đồng: ${response.status}`
      );
    }

    return await response.json();
  },

  // Lấy hợp đồng theo ID
  getContractById: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/contracts/${id}`,
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
        `Lỗi lấy hợp đồng: ${response.status}`
      );
    }

    return await response.json();
  },

  // Tạo hợp đồng
  createContract: async (contractData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/contracts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi tạo hợp đồng: ${response.status}`
      );
    }

    return await response.json();
  },

  // Cập nhật hợp đồng
  updateContract: async (id, contractData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/contracts/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi cập nhật hợp đồng: ${response.status}`
      );
    }

    return await response.json();
  },

  // Xóa hợp đồng
  deleteContract: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/contracts/${id}`,
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
        `Lỗi xóa hợp đồng: ${response.status}`
      );
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  },
};

export default contractService;