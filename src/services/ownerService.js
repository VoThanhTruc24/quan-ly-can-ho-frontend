const API_BASE_URL = "http://localhost:8080/api";


// =====================================================
// TOKEN
// =====================================================

const getToken = () => {
  return localStorage.getItem("token");
};


// =====================================================
// =====================================================
// OWNER
// =====================================================
// =====================================================


// =====================================================
// LẤY THÔNG TIN OWNER ĐANG LOGIN
// =====================================================

export const getCurrentOwner = async () => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {

    const text = await response.text();

    throw new Error(
      text ||
      `Không thể lấy thông tin Owner: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// LẤY CĂN HỘ CỦA OWNER
// =====================================================

export const getMyApartments = async () => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me/apartments`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {

    const text = await response.text();

    throw new Error(
      text ||
      `Không thể lấy căn hộ: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// LẤY HỢP ĐỒNG CỦA OWNER
// =====================================================

export const getMyContracts = async () => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me/contracts`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {

    const text = await response.text();

    throw new Error(
      text ||
      `Không thể lấy hợp đồng: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// LẤY HÓA ĐƠN CỦA OWNER
// =====================================================

export const getMyInvoices = async () => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/owner/me/invoices`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {

    const text = await response.text();

    throw new Error(
      text ||
      `Không thể lấy hóa đơn: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// =====================================================
// ADMIN - OWNER
// =====================================================
// =====================================================


// =====================================================
// LẤY DANH SÁCH OWNER
// GET /api/admin/owners
// =====================================================

export const getOwners = async () => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {

    const text = await response.text();

    throw new Error(
      text ||
      `Lỗi lấy danh sách Owner: ${response.status}`
    );
  }

  return await response.json();
};


// =====================================================
// TẠO OWNER
// POST /api/admin/owners
// =====================================================

export const createOwner = async (ownerData) => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(ownerData),
    }
  );


  const text =
    await response.text();


  let data;


  try {

    data = JSON.parse(text);

  } catch {

    data = text;
  }


  console.log(
    "CREATE OWNER STATUS:",
    response.status
  );

  console.log(
    "CREATE OWNER RESPONSE:",
    data
  );


  if (!response.ok) {

    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ||
          `Không thể tạo Owner: ${response.status}`
    );
  }


  return data;
};


// =====================================================
// LẤY CĂN HỘ CỦA OWNER
// GET /api/admin/owners/{ownerId}/apartments
// =====================================================

export const getOwnerApartments = async (
  ownerId
) => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );


  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      text ||
      `Lỗi lấy căn hộ của Owner: ${response.status}`
    );
  }


  return await response.json();
};


// =====================================================
// GÁN CĂN HỘ CHO OWNER
// PUT /api/admin/owners/{ownerId}/apartments/{apartmentId}
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );


  const text =
    await response.text();


  if (!response.ok) {

    throw new Error(
      text ||
      `Lỗi gán căn hộ: ${response.status}`
    );
  }


  try {

    return JSON.parse(text);

  } catch {

    return text;
  }
};


// =====================================================
// BỎ GÁN CĂN HỘ KHỎI OWNER
// PUT /api/admin/owners/{ownerId}/apartments/{apartmentId}/unassign
// =====================================================

export const unassignApartmentFromOwner = async (
  ownerId,
  apartmentId
) => {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments/${apartmentId}/unassign`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );


  const text =
    await response.text();


  if (!response.ok) {

    throw new Error(
      text ||
      `Lỗi bỏ gán căn hộ: ${response.status}`
    );
  }


  try {

    return JSON.parse(text);

  } catch {

    return text;
  }
};