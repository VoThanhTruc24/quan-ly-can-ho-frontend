const API_BASE_URL = "http://localhost:8080/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const dashboardService = {

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  getDashboardStats: async (year) => {
    const token = getToken();

    const url = year
      ? `${API_BASE_URL}/dashboard/stats?year=${year}`
      : `${API_BASE_URL}/dashboard/stats`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Lỗi API Dashboard: ${response.status}`
      );
    }

    return await response.json();
  },


  // =====================================================
  // APARTMENTS
  // =====================================================

  getApartments: async () => {
    const token = getToken();

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
        `Lỗi API căn hộ: ${response.status}`
      );
    }

    return await response.json();
  },


  // =====================================================
  // CUSTOMERS
  // =====================================================

  getCustomers: async () => {
    const token = getToken();

    const response = await fetch(
      `${API_BASE_URL}/customers`,
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
        `Lỗi API khách hàng: ${response.status}`
      );
    }

    return await response.json();
  },


  // =====================================================
  // SEARCH
  // =====================================================

  search: async (keyword) => {
    const token = getToken();

    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(
        keyword
      )}`,
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
        `Lỗi API tìm kiếm: ${response.status}`
      );
    }

    return await response.json();
  },
};

export default dashboardService;