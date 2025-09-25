import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getTermExplanation,
  getAIAnswerWithContext,
} from "../services/geminiService";
import { TermExplanation, Citation, ChatMessage } from "../types";
import { CloseIcon, BookOpenIcon, SparklesIcon } from "./IconComponents";

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
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchExplanation = useCallback(
    async (currentTerm: string, followUp?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        if (followUp) {
          // For follow-up questions, use the comprehensive AI answer function
          const result = await getAIAnswerWithContext(followUp);
          if (result) {
            const newAiMessage: ChatMessage = {
              sender: "ai",
              text: result.summary,
            };
            setChatHistory((prev) => [...prev, newAiMessage]);
            // Optionally, show interactive question as a separate message
            if (result.interactiveQuestion) {
              setChatHistory((prev) => [
                ...prev,
                { sender: "ai", text: `💡 ${result.interactiveQuestion}` },
              ]);
            }
          } else {
            setError(
              "Không tìm thấy thông tin cho câu hỏi này trong chương 6."
            );
            const errorMsg: ChatMessage = {
              sender: "ai",
              text: "Xin lỗi, tôi không thể tìm thấy thông tin chi tiết trong chương 6 để trả lời câu hỏi này.",
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
      fetchExplanation(term);
    }
    if (!isVisible) {
      setChatHistory([]);
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
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-gray-700 text-gray-200">
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

      {explanation && !isLoading && (
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
