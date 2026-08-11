const API_BASE_URL =
  "http://localhost:8080/api";

const dashboardService = {
  // Dashboard statistics
  getDashboardStats: async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/dashboard/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi API Dashboard: ${response.status}`
      );
    }

    return await response.json();
  },

  // Apartments
  getApartments: async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/apartments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi API căn hộ: ${response.status}`
      );
    }

    return await response.json();
  },

  // Customers
  getCustomers: async () => {
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
        `Lỗi API khách hàng: ${response.status}`
      );
    }

    return await response.json();
  },

  // Search
  search: async (keyword) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(
        keyword
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi API tìm kiếm: ${response.status}`
      );
    }

    return await response.json();
  },
};

export default dashboardService;