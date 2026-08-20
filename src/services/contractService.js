const API_BASE_URL = "http://localhost:8080/api";

const contractService = {

  // ==============================
  // GET ALL CONTRACTS
  // ==============================
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


  // ==============================
  // GET CONTRACT BY ID
  // ==============================
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


  // ==============================
  // CREATE CONTRACT
  // ==============================
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

      const text = await response.text();

      console.error(
        "CREATE CONTRACT ERROR:",
        response.status,
        text
      );

      throw new Error(
        `Lỗi tạo hợp đồng: ${response.status}`
      );
    }

    return await response.json();
  },


  // ==============================
  // UPDATE CONTRACT
  // ==============================
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

      const text = await response.text();

      console.error(
        "UPDATE CONTRACT ERROR:",
        response.status,
        text
      );

      throw new Error(
        `Lỗi cập nhật hợp đồng: ${response.status}`
      );
    }

    return await response.json();
  },


  // ==============================
  // DELETE CONTRACT
  // ==============================
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