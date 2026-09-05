import { useEffect, useRef, useState } from "react";
import { sendAIMessage } from "../../services/chatAIService";
import "./ChatAI.css";

function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text:
        "Xin chào! Tôi là RentHub AI 👋\n" +
        "Tôi có thể hỗ trợ bạn về căn hộ, khách thuê, hợp đồng và hóa đơn.",
    },
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ============================================================
  // AUTO SCROLL
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    // ----------------------------------------------------------
    // Lấy lịch sử hội thoại hiện tại
    // ----------------------------------------------------------

    const history = messages
      .filter(
        (item) =>
          item.type === "user" ||
          item.type === "ai"
      )
      .map((item) => ({
        role:
          item.type === "user"
            ? "user"
            : "assistant",
        content: item.text,
      }))
      .slice(-20);

    // ----------------------------------------------------------
    // Hiển thị câu hỏi user
    // ----------------------------------------------------------

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      // --------------------------------------------------------
      // Gửi message + history
      // --------------------------------------------------------

      const reply = await sendAIMessage(
        text,
        history
      );

      // --------------------------------------------------------
      // Hiển thị AI
      // --------------------------------------------------------

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          text: reply,
        },
      ]);

    } catch (error) {
      console.error(
        "RentHub AI error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "error",
          text:
            error?.message ||
            "Không thể kết nối với RentHub AI.",
        },
      ]);

    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  // ============================================================
  // ENTER
  // ============================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================================
  // QUICK QUESTION
  // ============================================================

  const handleQuickQuestion = (question) => {
    setMessage(question);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // ============================================================
  // NEW CHAT
  // ============================================================

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: "ai",
        text:
          "Xin chào! 👋\n" +
          "Tôi có thể hỗ trợ gì cho bạn hôm nay?",
      },
    ]);

    setMessage("");
  };

  // ============================================================
  // QUICK QUESTIONS
  // ============================================================

  const quickQuestions = [
    "Tôi có bao nhiêu căn hộ?",
    "Căn hộ nào đang trống?",
    "Có hóa đơn nào chưa thanh toán?",
    "Hợp đồng nào sắp hết hạn?",
  ];

  // ============================================================
  // FORMAT MESSAGE
  // ============================================================

  const renderMessage = (text) => {
    if (!text) {
      return null;
    }

    const lines = text.split("\n");

    return lines.map((line, index) => (
      <span key={index}>
        {line}

        {index < lines.length - 1 && (
          <br />
        )}
      </span>
    ));
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ======================================================
          FLOATING BUTTON
      ====================================================== */}

      {!isOpen && (
        <button
          type="button"
          className="chat-ai-floating-button"
          onClick={() => setIsOpen(true)}
          title="RentHub AI"
          aria-label="Mở RentHub AI"
        >
          <span className="chat-ai-floating-icon">
            🤖
          </span>

          <span className="chat-ai-floating-text">
            RentHub AI
          </span>
        </button>
      )}

      {/* ======================================================
          CHAT WINDOW
      ====================================================== */}

      {isOpen && (
        <div className="chat-ai-container">
          <div className="chat-ai-window">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="chat-ai-header">

              <div className="chat-ai-header-left">

                <div className="chat-ai-avatar">
                  🤖
                </div>

                <div>
                  <h3>
                    RentHub AI
                  </h3>

                  <span>
                    Trợ lý thông minh cho Owner
                  </span>
                </div>

              </div>

              <div className="chat-ai-header-right">

                <button
                  type="button"
                  className="chat-ai-icon-button"
                  onClick={handleNewChat}
                  title="Cuộc trò chuyện mới"
                >
                  ↻
                </button>

                <button
                  type="button"
                  className="chat-ai-icon-button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  title="Đóng"
                >
                  ×
                </button>

              </div>

            </div>

            {/* ==================================================
                MESSAGES
            ================================================== */}

            <div className="chat-ai-messages">

              {messages.map((item) => (
                <div
                  key={item.id}
                  className={
                    `chat-ai-message-row ${item.type}`
                  }
                >

                  {item.type !== "user" && (
                    <div className="chat-ai-small-avatar">
                      🤖
                    </div>
                  )}

                  <div
                    className={
                      `chat-ai-bubble ${item.type}`
                    }
                  >
                    {renderMessage(item.text)}
                  </div>

                </div>
              ))}

              {/* ==================================================
                  TYPING
              ================================================== */}

              {loading && (
                <div className="chat-ai-message-row ai">

                  <div className="chat-ai-small-avatar">
                    🤖
                  </div>

                  <div className="chat-ai-bubble ai typing">

                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <small>
                      RentHub AI đang suy nghĩ...
                    </small>

                  </div>

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* ==================================================
                QUICK QUESTIONS
            ================================================== */}

            {messages.length === 1 &&
              !loading && (
                <div className="chat-ai-quick">

                  <div className="chat-ai-quick-title">
                    💡 Bạn có thể hỏi
                  </div>

                  <div className="chat-ai-quick-list">

                    {quickQuestions.map(
                      (question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() =>
                            handleQuickQuestion(
                              question
                            )
                          }
                        >
                          {question}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* ==================================================
                INPUT
            ================================================== */}

            <div className="chat-ai-input">

              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Hỏi RentHub AI bất cứ điều gì..."
                rows={1}
                disabled={loading}
              />

              <button
                type="button"
                className="chat-ai-send"
                onClick={handleSendMessage}
                disabled={
                  !message.trim() ||
                  loading
                }
                title="Gửi"
              >
                ➤
              </button>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="chat-ai-footer">
              🔒 Dữ liệu chỉ thuộc Owner đang đăng nhập
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default ChatAI;