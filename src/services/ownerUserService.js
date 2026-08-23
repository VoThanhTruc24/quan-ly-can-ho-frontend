const API_BASE_URL = "http://localhost:8080/api";

// ==========================================
// LẤY TOKEN
// ==========================================

const getToken = () => {
  return localStorage.getItem("token");
};


// ==========================================
// HEADER
// ==========================================

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


// ==========================================
// THÔNG TIN OWNER ĐANG ĐĂNG NHẬP
// ==========================================

export const getMyOwnerInfo = async () => {

  const response = await fetch(
    `${API_BASE_URL}/owner/me`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể lấy thông tin Owner: ${response.status}`
    );
  }

  return await response.json();
};


// ==========================================
// CĂN HỘ CỦA OWNER
// ==========================================

export const getMyApartments = async () => {

  const response = await fetch(
    `${API_BASE_URL}/owner/me/apartments`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể lấy căn hộ: ${response.status}`
    );
  }

  return await response.json();
};


// ==========================================
// HỢP ĐỒNG CỦA OWNER
// ==========================================

export const getMyContracts = async () => {

  const response = await fetch(
    `${API_BASE_URL}/owner/me/contracts`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể lấy hợp đồng: ${response.status}`
    );
  }

  return await response.json();
};