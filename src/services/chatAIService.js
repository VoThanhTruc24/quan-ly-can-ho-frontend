const API_BASE_URL =
  "http://localhost:8080/api";

// ============================================================
// SEND MESSAGE TO RENTHUB AI
// ============================================================

export const sendAIMessage = async (
  message,
  history = []
) => {

  // ============================================================
  // TOKEN
  // ============================================================

  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại."
    );
  }

  // ============================================================
  // VALIDATE MESSAGE
  // ============================================================

  if (
    !message ||
    !message.trim()
  ) {
    throw new Error(
      "Vui lòng nhập câu hỏi."
    );
  }

  // ============================================================
  // CLEAN HISTORY
  // ============================================================

  const cleanHistory =
    Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              item.content &&
              String(item.content).trim()
          )
          .slice(-20)
          .map((item) => ({
            role:
              item.role === "assistant"
                ? "assistant"
                : "user",

            content:
              String(
                item.content
              ).trim(),
          }))
      : [];

  // ============================================================
  // REQUEST
  // ============================================================

  let response;

  try {

    response =
      await fetch(
        `${API_BASE_URL}/owner/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify({
              message:
                message.trim(),

              history:
                cleanHistory,
            }),
        }
      );

  } catch (error) {

    console.error(
      "RentHub AI network error:",
      error
    );

    throw new Error(
      "Không thể kết nối đến máy chủ RentHub."
    );
  }

  // ============================================================
  // READ RESPONSE
  // ============================================================

  let data = {};

  try {

    data =
      await response.json();

  } catch {

    data = {};
  }

  // ============================================================
  // SERVER ERROR
  // ============================================================

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Không thể xử lý câu hỏi."
    );
  }

  // ============================================================
  // REPLY
  // ============================================================

  if (
    !data.reply ||
    !String(data.reply).trim()
  ) {

    return (
      "Xin lỗi, RentHub AI chưa trả về câu trả lời."
    );
  }

  return String(
    data.reply
  ).trim();
};