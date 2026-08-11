const API_BASE_URL =
  "http://localhost:8080/api";

const customerService = {
  // GET ALL
  getAllCustomers: async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/customers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi lấy danh sách khách hàng: ${response.status}`
      );
    }

    return await response.json();
  },

  // GET BY ID
  getCustomerById: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/customers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi lấy khách hàng: ${response.status}`
      );
    }

    return await response.json();
  },

  // CREATE
  createCustomer: async (customerData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/customers`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(customerData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi tạo khách hàng: ${response.status}`
      );
    }

    return await response.json();
  },

  // UPDATE
  updateCustomer: async (id, customerData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/customers/${id}`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(customerData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi cập nhật khách hàng: ${response.status}`
      );
    }

    return await response.json();
  },

  // DELETE
  deleteCustomer: async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/customers/${id}`,
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
        `Lỗi xóa khách hàng: ${response.status}`
      );
    }

    // Một số API DELETE trả về body rỗng
    const text = await response.text();

    return text ? JSON.parse(text) : null;
  },
};

export default customerService;