import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getTermExplanation,
  getBackendChatResponse,
} from "../services/geminiService";
import { TermExplanation, Citation, ChatMessage, BackendChatResponse } from "../types";
import { CloseIcon, BookOpenIcon, SparklesIcon, UserIcon } from "./IconComponents";

interface SmartLookupPopupProps {
  term: string | null;
  isVisible: boolean;
  onClose: () => void;
  onNavigateToEbook: (citation: Citation) => void;
  onNavigateToHTMLParagraph?: (paragraphId: string) => void;
}

const SmartLookupPopup: React.FC<SmartLookupPopupProps> = ({
  term,
  isVisible,
  onClose,
  onNavigateToEbook,
  onNavigateToHTMLParagraph,
}) => {
  const [explanation, setExplanation] = useState<TermExplanation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [backendResponse, setBackendResponse] = useState<BackendChatResponse | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchExplanation = useCallback(
    async (currentTerm: string, followUp?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        if (followUp) {
          // For follow-up questions, use the backend API
          const result = await getBackendChatResponse(followUp);
          if (result) {
            setBackendResponse(result);
            const newAiMessage: ChatMessage = {
              sender: "ai",
              text: result.content,
            };
            setChatHistory((prev) => [...prev, newAiMessage]);
            // Optionally, show follow-ups as buttons
            if (result.follow_ups && result.follow_ups.length > 0) {
              // Handle follow-ups later in render
            }
          } else {
            setError("Không tìm thấy thông tin cho câu hỏi này.");
            const errorMsg: ChatMessage = {
              sender: "ai",
              text: "Xin lỗi, tôi không thể tìm thấy thông tin để trả lời câu hỏi này.",
            };
            setChatHistory((prev) => [...prev, errorMsg]);
          }
        } else {
          // For initial term lookup
          const result = await getTermExplanation(currentTerm);
          if (result) {
            setExplanation(result);
            const newAiMessage: ChatMessage = {
              sender: "ai",
              text: result.explanation,
            };
            setChatHistory((prev) => [...prev, newAiMessage]);
            if (result.interactiveQuestion) {
              setChatHistory((prev) => [
                ...prev,
                { sender: "ai", text: `💡 ${result.interactiveQuestion}` },
              ]);
            }
          } else {
            setError(
              "Không tìm thấy thông tin cho thuật ngữ này trong chương 6."
            );
            const errorMsg: ChatMessage = {
              sender: "ai",
              text: "Xin lỗi, tôi không thể tìm thấy thông tin chi tiết về thuật ngữ này trong chương 6.",
            };
            setChatHistory((prev) => [...prev, errorMsg]);
          }
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tra cứu.");
        const errorMsg: ChatMessage = {
          sender: "ai",
          text: "Đã có lỗi xảy ra khi kết nối với dịch vụ AI.",
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isVisible && term) {
      setChatHistory([]);
      setBackendResponse(null);
      fetchExplanation(term);
    }
    if (!isVisible) {
      setChatHistory([]);
      setBackendResponse(null);
    }
  }, [isVisible, term, fetchExplanation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isLoading) return;
    const newHumanMessage: ChatMessage = { sender: "user", text: userQuery };
    setChatHistory((prev) => [...prev, newHumanMessage]);
    // Use the user query as a follow-up question
    fetchExplanation("", userQuery);
    setUserQuery("");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-1/3 xl:w-1/4 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isVisible
          ? "translate-x-0"
          : "translate-x-full pointer-events-none opacity-0"
      } flex flex-col`}
      style={{ zIndex: 1000 }}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-cyan-400" />
          Tra cứu thông minh
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <h4 className="text-2xl font-semibold text-cyan-400 mb-4">
          {explanation?.term || term}
        </h4>

        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                } flex items-start gap-2`}
              >
                {msg.sender === "ai" ? (
                  <SparklesIcon className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <UserIcon className="w-4 h-4 mt-0.5 text-blue-300 flex-shrink-0" />
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-gray-700 text-gray-200 flex items-start gap-2">
                <SparklesIcon className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>

      {backendResponse && !isLoading && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          {backendResponse.intent === 'PROJECT_META.QA' && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Dự án Meta QA:</p>
              {backendResponse.references && backendResponse.references.length > 0 ? (
                <button
                  onClick={() => {
                    if (onNavigateToHTMLParagraph) {
                      onNavigateToHTMLParagraph(backendResponse.references[0].headingId);
                    }
                  }}
                  className="w-full text-left p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-start gap-3 no-underline cursor-pointer"
                >
                  <BookOpenIcon className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Mở Ebook tại {backendResponse.references[0].label}</p>
                  </div>
                </button>
              ) : (
                <p className="text-gray-300">Chọn đề tài để mở ebook.</p>
              )}
            </div>
          )}
          {backendResponse.intent === 'NAV.EBOOK' && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Điều hướng Ebook:</p>
              {backendResponse.references && backendResponse.references.length > 0 && (
                <button
                  onClick={() => {
                    if (onNavigateToHTMLParagraph) {
                      onNavigateToHTMLParagraph(backendResponse.references[0].headingId);
                    }
                  }}
                  className="w-full text-left p-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors flex items-start gap-3 no-underline cursor-pointer"
                >
                  <BookOpenIcon className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Lướt đến {backendResponse.references[0].label}</p>
                  </div>
                </button>
              )}
            </div>
          )}
          {backendResponse.intent === 'COURSE_TERM.CH6' && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Thuật ngữ khóa học:</p>
              <p className="text-gray-300 mb-2">{backendResponse.content}</p>
              {backendResponse.references && backendResponse.references.length > 0 && (
                <button
                  onClick={() => {
                    if (onNavigateToHTMLParagraph) {
                      onNavigateToHTMLParagraph(backendResponse.references[0].headingId);
                    }
                  }}
                  className="w-full text-left p-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors flex items-start gap-3 no-underline cursor-pointer"
                >
                  <BookOpenIcon className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Xem trong Ebook</p>
                  </div>
                </button>
              )}
            </div>
          )}
          {backendResponse.intent === 'WEB.SEARCH' && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Kết quả tìm kiếm web:</p>
              {backendResponse.references && backendResponse.references.map((ref, index) => (
                <a
                  key={index}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors mb-2"
                >
                  <p className="text-white font-semibold">{ref.label}</p>
                  <p className="text-gray-300 text-sm">{ref.url}</p>
                </a>
              ))}
            </div>
          )}
          {backendResponse.intent === 'SMALL_TALK' && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Trò chuyện:</p>
              <p className="text-gray-300 mb-2">{backendResponse.content}</p>
              {backendResponse.follow_ups && backendResponse.follow_ups.length > 0 && (
                <div className="space-y-2">
                  {backendResponse.follow_ups.map((followUp, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const newHumanMessage: ChatMessage = { sender: "user", text: followUp.question };
                        setChatHistory((prev) => [...prev, newHumanMessage]);
                        fetchExplanation("", followUp.question);
                      }}
                      className="w-full text-left p-2 bg-cyan-600 rounded hover:bg-cyan-500 transition-colors text-white"
                    >
                      {followUp.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {explanation && !backendResponse && !isLoading && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <p className="text-sm text-gray-400 mb-2">Nguồn trích dẫn:</p>
          <div className="flex flex-col gap-2">
            {explanation.citationText && (
              <div className="bg-gray-900 text-gray-100 p-2 rounded mb-2 text-sm border-l-4 border-cyan-400">
                <span className="font-semibold text-cyan-300">Trích dẫn:</span>{" "}
                {explanation.citationText}
              </div>
            )}
            {explanation.citation?.paragraphId && (
              <a
                href={`#${explanation.citation.paragraphId}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToHTMLParagraph)
                    onNavigateToHTMLParagraph(explanation.citation.paragraphId);
                }}
                className="w-full text-left p-3 bg-yellow-600 rounded-lg hover:bg-yellow-500 transition-colors flex items-start gap-3 no-underline cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <BookOpenIcon className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">
                    Xem đoạn trong giáo trình HTML
                  </p>
                  <p className="text-sm text-yellow-100">
                    Đoạn: {explanation.citation.paragraphId}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400 mb-2">Ví dụ câu hỏi:</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          <button
            onClick={() => setUserQuery("Hai xu hướng khách quan…")}
            className="text-left p-2 bg-cyan-700 rounded hover:bg-cyan-600 transition-colors text-white text-sm border border-cyan-500"
          >
            Hai xu hướng khách quan…
          </button>
          <button
            onClick={() => setUserQuery("Mở mục 6.2.1 trong ebook")}
            className="text-left p-2 bg-cyan-700 rounded hover:bg-cyan-600 transition-colors text-white text-sm border border-cyan-500"
          >
            Mở mục 6.2.1 trong ebook
          </button>
          <button
            onClick={() => setUserQuery("Ai phụ trách Frontend?")}
            className="text-left p-2 bg-cyan-700 rounded hover:bg-cyan-600 transition-colors text-white text-sm border border-cyan-500"
          >
            Ai phụ trách Frontend?
          </button>
          <button
            onClick={() => setUserQuery("Hoàng Sa Trường Sa là của ai?")}
            className="text-left p-2 bg-cyan-700 rounded hover:bg-cyan-600 transition-colors text-white text-sm border border-cyan-500"
          >
            Hoàng Sa Trường Sa là của ai?
          </button>
          <button
            onClick={() => setUserQuery("giải thích giúp?")}
            className="text-left p-2 bg-cyan-700 rounded hover:bg-cyan-600 transition-colors text-white text-sm border border-cyan-500"
          >
            giải thích giúp?
          </button>
        </div>
        <form onSubmit={handleFollowUpSubmit}>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Nhập câu hỏi hoặc thuật ngữ cần tra cứu..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default SmartLookupPopup;
