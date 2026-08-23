const API_BASE_URL = "http://localhost:8080/api";

const getToken = () => {
  return localStorage.getItem("token");
};


// =====================================================
// OWNER - LẤY THÔNG TIN OWNER ĐANG ĐĂNG NHẬP
// =====================================================

export const getCurrentOwner = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể lấy thông tin Owner: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// OWNER - LẤY CĂN HỘ CỦA OWNER ĐANG ĐĂNG NHẬP
// =====================================================

export const getMyApartments = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me/apartments`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể lấy căn hộ: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// OWNER - LẤY HỢP ĐỒNG CỦA OWNER ĐANG ĐĂNG NHẬP
// =====================================================

export const getMyContracts = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me/contracts`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể lấy hợp đồng: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// ADMIN - LẤY DANH SÁCH OWNER
// =====================================================

export const getOwners = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Lỗi lấy danh sách Owner: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// ADMIN - TẠO TÀI KHOẢN OWNER
// =====================================================

export const createOwner = async (ownerData) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ownerData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : "Không thể tạo Owner"
    );
  }

  return data;
};


// =====================================================
// ADMIN - LẤY CĂN HỘ CỦA MỘT OWNER
// =====================================================

export const getOwnerApartments = async (ownerId) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Lỗi lấy căn hộ của Owner: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// ADMIN - GÁN OWNER VỚI CĂN HỘ
// =====================================================

export const assignApartmentToOwner = async (
  ownerId,
  apartmentId
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments/${apartmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.text();

    throw new Error(
      data || `Lỗi gán căn hộ: ${response.status}`
    );
  }

  return await response.json();
};