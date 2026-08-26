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
// GET /api/owner/me
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

    const text =
      await response.text();

    throw new Error(
      text ||
      `Không thể lấy thông tin Owner: ${response.status}`
    );
  }


  return await response.json();
};


// =====================================================
// LẤY CĂN HỘ CỦA OWNER
// GET /api/owner/me/apartments
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

    const text =
      await response.text();

    throw new Error(
      text ||
      `Không thể lấy căn hộ: ${response.status}`
    );
  }


  return await response.json();
};


// =====================================================
// LẤY HỢP ĐỒNG CỦA OWNER
// GET /api/owner/me/contracts
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

    const text =
      await response.text();

    throw new Error(
      text ||
      `Không thể lấy hợp đồng: ${response.status}`
    );
  }


  return await response.json();
};


// =====================================================
// LẤY HÓA ĐƠN CỦA OWNER
// GET /api/owner/me/invoices
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

    const text =
      await response.text();

    throw new Error(
      text ||
      `Không thể lấy hóa đơn: ${response.status}`
    );
  }


  return await response.json();
};


// =====================================================
// THANH TOÁN HÓA ĐƠN
//
// PUT
// /api/owner/invoices/{invoiceId}/pay
// =====================================================

export const payInvoice = async (
  invoiceId,
  paymentMethod
) => {

  const token = getToken();


  // ------------------------------------------
  // KIỂM TRA TOKEN
  // ------------------------------------------

  if (!token) {

    throw new Error(
      "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại."
    );
  }


  // ------------------------------------------
  // KIỂM TRA INVOICE
  // ------------------------------------------

  if (!invoiceId) {

    throw new Error(
      "Không xác định được hóa đơn cần thanh toán."
    );
  }


  // ------------------------------------------
  // KIỂM TRA PAYMENT METHOD
  // ------------------------------------------

  if (!paymentMethod) {

    throw new Error(
      "Vui lòng chọn phương thức thanh toán."
    );
  }


  // ------------------------------------------
  // GỌI API
  // ------------------------------------------

  const response = await fetch(
    `${API_BASE_URL}/owner/invoices/${invoiceId}/pay`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        paymentMethod:
          paymentMethod,
      }),
    }
  );


  // ------------------------------------------
  // ĐỌC RESPONSE
  // ------------------------------------------

  const text =
    await response.text();


  let data;


  try {

    data =
      text
        ? JSON.parse(text)
        : null;

  } catch {

    data = text;
  }


  // ------------------------------------------
  // XỬ LÝ LỖI
  // ------------------------------------------

  if (!response.ok) {

    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ||
          `Thanh toán thất bại: ${response.status}`
    );
  }


  // ------------------------------------------
  // THÀNH CÔNG
  // ------------------------------------------

  return data;
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

    const text =
      await response.text();

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

export const createOwner = async (
  ownerData
) => {

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

    data =
      text
        ? JSON.parse(text)
        : null;

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
// GET
// /api/admin/owners/{ownerId}/apartments
// =====================================================

export const getOwnerApartments = async (
  ownerId
) => {

  const token = getToken();


  if (!ownerId) {

    throw new Error(
      "Không xác định được Owner."
    );
  }


  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
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
// PUT
// /api/admin/owners/{ownerId}/apartments/{apartmentId}
// =====================================================

export const assignApartmentToOwner = async (
  ownerId,
  apartmentId
) => {

  const token = getToken();


  if (!ownerId) {

    throw new Error(
      "Không xác định được Owner."
    );
  }


  if (!apartmentId) {

    throw new Error(
      "Không xác định được căn hộ."
    );
  }


  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments/${apartmentId}`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
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

    return text
      ? JSON.parse(text)
      : null;

  } catch {

    return text;
  }
};


// =====================================================
// BỎ GÁN CĂN HỘ KHỎI OWNER
// PUT
// /api/admin/owners/{ownerId}/apartments/{apartmentId}/unassign
// =====================================================

export const unassignApartmentFromOwner = async (
  ownerId,
  apartmentId
) => {

  const token = getToken();


  if (!ownerId) {

    throw new Error(
      "Không xác định được Owner."
    );
  }


  if (!apartmentId) {

    throw new Error(
      "Không xác định được căn hộ."
    );
  }


  const response = await fetch(
    `${API_BASE_URL}/admin/owners/${ownerId}/apartments/${apartmentId}/unassign`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
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

    return text
      ? JSON.parse(text)
      : null;

  } catch {

    return text;
  }
};