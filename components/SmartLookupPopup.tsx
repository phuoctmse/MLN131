import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getTermExplanation,
  getBackendChatResponse,
  getHeadingTitle,
  createParagraphId,
} from "../services/geminiService";
import {
  TermExplanation,
  Citation,
  ChatMessage,
  BackendChatResponse,
} from "../types";
import {
  CloseIcon,
  BookOpenIcon,
  SparklesIcon,
  UserIcon,
} from "./IconComponents";

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
  // Remove explanation state since we only use backendResponse now
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [showCitations, setShowCitations] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("mln131-show-citations");
      return saved ? JSON.parse(saved) : true;
    } catch (error) {
      return true;
    }
  });
  const [lastProcessedTerm, setLastProcessedTerm] = useState<string | null>(
    null
  );
  const [backendResponse, setBackendResponse] =
    useState<BackendChatResponse | null>(null);
  const [referenceTitles, setReferenceTitles] = useState<Map<string, string>>(
    new Map()
  );
  const [citationTexts, setCitationTexts] = useState<Map<string, string>>(
    new Map()
  );
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialTerm = useRef<boolean>(false);

  // Chat history localStorage functions
  const saveChatHistory = useCallback((history: ChatMessage[]) => {
    try {
      localStorage.setItem("mln131-chat-history", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, []);

  const loadChatHistory = useCallback((): ChatMessage[] => {
    try {
      const saved = localStorage.getItem("mln131-chat-history");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load chat history:", error);
      return [];
    }
  }, []);

  const clearChatHistory = useCallback(() => {
    try {
      localStorage.removeItem("mln131-chat-history");
      localStorage.removeItem("mln131-backend-response");
      localStorage.removeItem("mln131-reference-titles");
      localStorage.removeItem("mln131-citation-texts");
      setChatHistory([]);
      setBackendResponse(null);
      setReferenceTitles(new Map());
      setCitationTexts(new Map());
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  }, []);

  // Backend response localStorage functions
  const saveBackendResponse = useCallback(
    (response: BackendChatResponse | null) => {
      try {
        if (response) {
          localStorage.setItem(
            "mln131-backend-response",
            JSON.stringify(response)
          );
        } else {
          localStorage.removeItem("mln131-backend-response");
        }
      } catch (error) {
        console.error("Failed to save backend response:", error);
      }
    },
    []
  );

  const loadBackendResponse = useCallback((): BackendChatResponse | null => {
    try {
      const saved = localStorage.getItem("mln131-backend-response");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to load backend response:", error);
      return null;
    }
  }, []);

  // Reference titles localStorage functions
  const saveReferenceTitles = useCallback((titles: Map<string, string>) => {
    try {
      const titlesObj = Object.fromEntries(titles);
      localStorage.setItem(
        "mln131-reference-titles",
        JSON.stringify(titlesObj)
      );
    } catch (error) {
      console.error("Failed to save reference titles:", error);
    }
  }, []);

  const loadReferenceTitles = useCallback((): Map<string, string> => {
    try {
      const saved = localStorage.getItem("mln131-reference-titles");
      if (saved) {
        const titlesObj = JSON.parse(saved);
        return new Map(Object.entries(titlesObj));
      }
      return new Map();
    } catch (error) {
      console.error("Failed to load reference titles:", error);
      return new Map();
    }
  }, []);

  // Citation texts localStorage functions
  const saveCitationTexts = useCallback((citations: Map<string, string>) => {
    try {
      const citationsObj = Object.fromEntries(citations);
      localStorage.setItem(
        "mln131-citation-texts",
        JSON.stringify(citationsObj)
      );
    } catch (error) {
      console.error("Failed to save citation texts:", error);
    }
  }, []);

  const loadCitationTexts = useCallback((): Map<string, string> => {
    try {
      const saved = localStorage.getItem("mln131-citation-texts");
      if (saved) {
        const citationsObj = JSON.parse(saved);
        return new Map(Object.entries(citationsObj));
      }
      return new Map();
    } catch (error) {
      console.error("Failed to load citation texts:", error);
      return new Map();
    }
  }, []);

  // Save citations toggle state
  const saveCitationsToggle = useCallback((show: boolean) => {
    try {
      localStorage.setItem("mln131-show-citations", JSON.stringify(show));
    } catch (error) {
      console.error("Failed to save citations toggle:", error);
    }
  }, []);

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
            saveBackendResponse(result);
            const newAiMessage: ChatMessage = {
              sender: "ai",
              text: result.content,
            };
            setChatHistory((prev) => {
              const newHistory = [...prev, newAiMessage];
              saveChatHistory(newHistory);
              return newHistory;
            });
            // Show follow-ups as buttons if available
            if (result.follow_ups && result.follow_ups.length > 0) {
              const followUpMessage: ChatMessage = {
                sender: "ai",
                text: "Câu hỏi gợi ý:",
                followUps: result.follow_ups,
              };
              setChatHistory((prev) => {
                const newHistory = [...prev, followUpMessage];
                saveChatHistory(newHistory);
                return newHistory;
              });
            }
          } else {
            setError("Không tìm thấy thông tin cho câu hỏi này.");
            const errorMsg: ChatMessage = {
              sender: "ai",
              text: "Xin lỗi, tôi không thể tìm thấy thông tin để trả lời câu hỏi này.",
            };
            setChatHistory((prev) => {
              const newHistory = [...prev, errorMsg];
              saveChatHistory(newHistory);
              return newHistory;
            });
          }
        } else {
          // For initial term lookup - use backend chat for normal conversation
          const result = await getBackendChatResponse(currentTerm);
          if (result) {
            setBackendResponse(result);
            saveBackendResponse(result);
            const newAiMessage: ChatMessage = {
              sender: "ai",
              text: result.content,
            };
            setChatHistory((prev) => {
              const newHistory = [...prev, newAiMessage];
              saveChatHistory(newHistory);
              return newHistory;
            });
            // Show follow-ups as buttons if available
            if (result.follow_ups && result.follow_ups.length > 0) {
              const followUpMessage: ChatMessage = {
                sender: "ai",
                text: "Câu hỏi gợi ý:",
                followUps: result.follow_ups,
              };
              setChatHistory((prev) => {
                const newHistory = [...prev, followUpMessage];
                saveChatHistory(newHistory);
                return newHistory;
              });
            }
          } else {
            setError("Không tìm thấy thông tin cho câu hỏi này.");
            const errorMsg: ChatMessage = {
              sender: "ai",
              text: "Xin lỗi, tôi không thể tìm thấy thông tin để trả lời câu hỏi này.",
            };
            setChatHistory((prev) => {
              const newHistory = [...prev, errorMsg];
              saveChatHistory(newHistory);
              return newHistory;
            });
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

  // Load chat history and citations on component mount
  useEffect(() => {
    const savedHistory = loadChatHistory();
    const savedBackendResponse = loadBackendResponse();
    const savedReferenceTitles = loadReferenceTitles();
    const savedCitationTexts = loadCitationTexts();

    setChatHistory(savedHistory);
    setBackendResponse(savedBackendResponse);
    setReferenceTitles(savedReferenceTitles);
    setCitationTexts(savedCitationTexts);
  }, [
    loadChatHistory,
    loadBackendResponse,
    loadReferenceTitles,
    loadCitationTexts,
  ]);

  useEffect(() => {
    if (isVisible && term) {
      // Check if we should process this term
      // Only process if it's different from the last one OR if we don't have any chat history yet
      const currentHistory = loadChatHistory();
      const shouldProcessTerm =
        term !== lastProcessedTerm || currentHistory.length === 0;

      if (shouldProcessTerm) {
        // Only process if this is a genuinely new term or first time opening
        setLastProcessedTerm(term);

        // Add user message to chat history when opening with a new term
        const userMessage: ChatMessage = {
          sender: "user",
          text: term,
        };
        setChatHistory((prev) => {
          // Check if the last message is already this term to avoid duplicates
          const lastMessage = prev[prev.length - 1];
          if (
            lastMessage &&
            lastMessage.sender === "user" &&
            lastMessage.text === term
          ) {
            return prev; // Don't add duplicate
          }
          const newHistory = [...prev, userMessage];
          saveChatHistory(newHistory);
          return newHistory;
        });

        // Then fetch AI response
        fetchExplanation(term);
      }
    }
    if (!isVisible) {
      // Keep the last processed term to prevent re-processing on reopen
      // Don't reset it here
    }
  }, [isVisible, term, fetchExplanation, lastProcessedTerm, loadChatHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  // Load reference titles and citation texts when backendResponse changes
  useEffect(() => {
    if (backendResponse?.references) {
      const loadTitlesAndCitations = async () => {
        const titles = new Map<string, string>();
        const citations = new Map<string, string>();

        for (const ref of backendResponse.references) {
          const title = await getHeadingTitle(ref.headingId);
          titles.set(ref.headingId, title);


          // Fetch citation text from ebook content
          try {
            const paragraphId = createParagraphId(ref.headingId, ref.pIndex);
            const response = await fetch(
              "/ebook_chapter_chap_4b6b984589dd283e.html"
            );
            if (response.ok) {
              const htmlText = await response.text();
              const parser = new DOMParser();
              const doc = parser.parseFromString(htmlText, "text/html");
              const targetElement = doc.querySelector(`#${paragraphId}`);
              if (targetElement) {
                const citationText =
                  targetElement.textContent?.trim().substring(0, 200) + "...";
                citations.set(paragraphId, citationText || "");
              }
            }
          } catch (error) {
            console.error("Error fetching citation text:", error);
          }
        }

        setReferenceTitles(titles);
        setCitationTexts(citations);
        saveReferenceTitles(titles);
        saveCitationTexts(citations);
      };
      loadTitlesAndCitations();
    }
  }, [backendResponse]);

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isLoading) return;
    const newHumanMessage: ChatMessage = { sender: "user", text: userQuery };
    setChatHistory((prev) => {
      const newHistory = [...prev, newHumanMessage];
      saveChatHistory(newHistory);
      return newHistory;
    });
    // Use the user query as a follow-up question
    fetchExplanation("", userQuery);
    setUserQuery("");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-4/5 md:w-1/2 xl:w-2/5 bg-gradient-to-br from-red-900 via-red-800 to-yellow-800 border-l-2 md:border-l-4 border-yellow-400 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isVisible
          ? "translate-x-0"
          : "translate-x-full pointer-events-none opacity-0"
      } flex flex-col`}
      style={{ zIndex: 1000 }}
    >
      <div className="p-2 md:p-4 border-b-2 md:border-b-4 border-yellow-400 flex justify-between items-center bg-gradient-to-r from-red-900 via-red-800 to-yellow-800">
        <h3 className="text-lg md:text-xl font-bold text-yellow-300 flex items-center gap-1 md:gap-2">
          <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          <span className="hidden sm:inline">Tra cứu thông minh</span>
          <span className="sm:hidden">AI Chat</span>
        </h3>
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={clearChatHistory}
            className="text-yellow-400 hover:text-yellow-200 transition-colors px-1.5 md:px-2 py-1 text-xs md:text-sm rounded border border-yellow-400 hover:bg-yellow-400/20"
            title="Xóa lịch sử chat"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="flex-grow p-2 md:p-4 overflow-y-auto">
        <h4 className="text-lg md:text-2xl font-semibold text-yellow-400 mb-2 md:mb-4">
          <span className="hidden sm:inline">
            Chat AI - {term || "Trợ lý thông minh"}
          </span>
          <span className="sm:hidden">{term || "AI Chat"}</span>
        </h4>

        <div className="space-y-2 md:space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg px-2 md:px-4 py-1.5 md:py-2 ${
                  msg.sender === "user"
                    ? "bg-red-700/90 text-yellow-100 border border-yellow-400"
                    : "bg-yellow-100 text-red-900 border border-yellow-400"
                } flex items-start gap-1 md:gap-2`}
              >
                {msg.sender === "user" ? (
                  <>
                    <p
                      className={`text-sm flex-grow ${
                        msg.sender === "ai" ? "leading-relaxed" : ""
                      }`}
                    >
                      {msg.text}
                    </p>
                    <UserIcon className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </p>
                      {msg.followUps && msg.followUps.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.followUps.map((followUp, followIndex) => (
                            <button
                              key={followIndex}
                              onClick={() => {
                                const newHumanMessage: ChatMessage = {
                                  sender: "user",
                                  text: followUp.question,
                                };
                                setChatHistory((prev) => {
                                  const newHistory = [...prev, newHumanMessage];
                                  saveChatHistory(newHistory);
                                  return newHistory;
                                });
                                fetchExplanation("", followUp.question);
                              }}
                              className="block w-full text-left p-2 bg-yellow-300/80 rounded hover:bg-red-600 transition-colors text-red-900 hover:text-yellow-100 text-sm border border-yellow-500"
                            >
                              {followUp.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-md md:max-w-lg rounded-lg px-4 py-2 bg-yellow-100 text-red-900 border border-yellow-400 flex items-start gap-2">
                <SparklesIcon className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    Trợ lý đang suy nghĩ
                  </span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
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
        <div className="p-4 border-t border-slate-600 bg-slate-700/50">
          {/* Show citations for all intents that have references */}
          {backendResponse.references &&
            backendResponse.references.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-yellow-400">
                    📚 Trích dẫn từ giáo trình:
                  </p>
                  <button
                    onClick={() => {
                      const newState = !showCitations;
                      setShowCitations(newState);
                      saveCitationsToggle(newState);
                    }}
                    className="text-xs text-yellow-300 hover:text-yellow-100 transition-colors px-2 py-1 rounded border border-yellow-400 hover:bg-yellow-400/20"
                  >
                    {showCitations ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                {showCitations && (
                  <div className="space-y-2">
                    {/* Chỉ hiển thị reference đầu tiên */}
                    {backendResponse.references.slice(0, 1).map((ref, index) => {
                      const paragraphId = createParagraphId(
                        ref.headingId,
                        ref.pIndex
                      );
                      const citationText = citationTexts.get(paragraphId);
                      const refTitle =
                        referenceTitles.get(ref.headingId) || ref.label;

                      return (
                        <div
                          key={index}
                          className="bg-red-900 text-yellow-100 p-3 rounded border-l-4 border-yellow-400"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-yellow-400 text-sm">
                              Từ {refTitle}:
                            </span>
                            <button
                              onClick={() => {
                                if (onNavigateToHTMLParagraph) {
                                  onNavigateToHTMLParagraph(paragraphId);
                                }
                              }}
                              className="text-xs text-yellow-300 hover:text-yellow-100 underline"
                            >
                              Xem trong ebook →
                            </button>
                          </div>
                          {citationText && (
                            <p className="text-sm italic">
                              &ldquo;{citationText}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          {/* Intent-specific sections */}
          {backendResponse.intent === "PROJECT_META_QA" && (
            <div>
              <p className="text-sm text-yellow-400 mb-2">Dự án Meta QA:</p>
              {backendResponse.references &&
              backendResponse.references.length > 0 ? (
                <button
                  onClick={() => {
                    const paragraphId = createParagraphId(
                      backendResponse.references[0].headingId,
                      backendResponse.references[0].pIndex
                    );
                    if (onNavigateToHTMLParagraph) {
                      onNavigateToHTMLParagraph(paragraphId);
                    }
                  }}
                  className="w-full text-left p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-start gap-3 no-underline cursor-pointer"
                >
                  <BookOpenIcon className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">
                      Mở Ebook tại{" "}
                      {referenceTitles.get(
                        backendResponse.references[0].headingId
                      ) || backendResponse.references[0].label}
                    </p>
                  </div>
                </button>
              ) : (
                <p className="text-yellow-700">Chọn đề tài để mở ebook.</p>
              )}
            </div>
          )}
          {backendResponse.intent === "NAV_EBOOK" && (
            <div>
              <p className="text-sm text-yellow-400 mb-2">Điều hướng Ebook:</p>
              {backendResponse.references &&
                backendResponse.references.length > 0 && (
                  <button
                    onClick={() => {
                      const paragraphId = createParagraphId(
                        backendResponse.references[0].headingId,
                        backendResponse.references[0].pIndex
                      );
                      if (onNavigateToHTMLParagraph) {
                        onNavigateToHTMLParagraph(paragraphId);
                      }
                    }}
                    className="w-full text-left p-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors flex items-start gap-3 no-underline cursor-pointer"
                  >
                    <BookOpenIcon className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">
                        Lướt đến{" "}
                        {referenceTitles.get(
                          backendResponse.references[0].headingId
                        ) || backendResponse.references[0].label}
                      </p>
                    </div>
                  </button>
                )}
            </div>
          )}
          {backendResponse.intent === "COURSE_TERM_CH6" && (
            <div>
              <p className="text-sm text-yellow-400 mb-2">
                Thuật ngữ khóa học:
              </p>
              {backendResponse.references &&
                backendResponse.references.length > 0 && (
                  <div className="space-y-2">
                    {/* Chỉ hiển thị reference đầu tiên */}
                    {backendResponse.references.slice(0, 1).map((ref, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const paragraphId = createParagraphId(
                            ref.headingId,
                            ref.pIndex
                          );
                          if (onNavigateToHTMLParagraph) {
                            onNavigateToHTMLParagraph(paragraphId);
                          }
                        }}
                        className="w-full text-left p-2 bg-red-700 rounded hover:bg-yellow-400 transition-colors text-yellow-100 hover:text-red-900"
                      >
                        Xem trong ebook:{" "}
                        {referenceTitles.get(ref.headingId) || ref.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
          {backendResponse.intent === "WEB_SEARCH" && (
            <div>
              <p className="text-sm text-yellow-400 mb-2">
                Kết quả tìm kiếm web:
              </p>
              {backendResponse.references &&
                backendResponse.references.slice(0, 1).map((ref, index) => (
                  <a
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors mb-2"
                  >
                    <p className="text-yellow-400 font-semibold">{ref.label}</p>
                    <p className="text-yellow-700 text-sm">{ref.url}</p>
                  </a>
                ))}
            </div>
          )}
          {backendResponse.intent === "SMALL_TALK" && (
            <div>
              <p className="text-sm text-yellow-400 mb-2">Trò chuyện:</p>
              {backendResponse.follow_ups &&
                backendResponse.follow_ups.length > 0 && (
                  <div className="space-y-2">
                    {backendResponse.follow_ups.map((followUp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const newHumanMessage: ChatMessage = {
                            sender: "user",
                            text: followUp.question,
                          };
                          setChatHistory((prev) => {
                            const newHistory = [...prev, newHumanMessage];
                            saveChatHistory(newHistory);
                            return newHistory;
                          });
                          fetchExplanation("", followUp.question);
                        }}
                        className="w-full text-left p-2 bg-yellow-400 rounded hover:bg-red-700 transition-colors text-red-900 hover:text-yellow-100"
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

      <div className="p-2 md:p-4 border-t border-slate-600">
        {/* Only show example questions if no chat history */}
        {chatHistory.length === 0 && (
          <>
            <p className="text-xs md:text-sm text-yellow-400 mb-2">
              Ví dụ câu hỏi:
            </p>
            <div className="grid grid-cols-1 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <button
                onClick={() => setUserQuery("Hai xu hướng khách quan…")}
                className="text-left p-1.5 md:p-2 bg-red-700 rounded hover:bg-yellow-400 transition-all duration-200 hover:scale-105 text-yellow-100 hover:text-red-900 text-xs md:text-sm border border-yellow-400"
              >
                Hai xu hướng khách quan…
              </button>
              <button
                onClick={() => setUserQuery("Mở mục 6.2.1 trong ebook")}
                className="text-left p-1.5 md:p-2 bg-red-700 rounded hover:bg-yellow-400 transition-colors text-yellow-100 hover:text-red-900 text-xs md:text-sm border border-yellow-400"
              >
                Mở mục 6.2.1 trong ebook
              </button>
              <button
                onClick={() => setUserQuery("Ai phụ trách Frontend?")}
                className="text-left p-1.5 md:p-2 bg-red-700 rounded hover:bg-yellow-400 transition-colors text-yellow-100 hover:text-red-900 text-xs md:text-sm border border-yellow-400"
              >
                Ai phụ trách Frontend?
              </button>
              <button
                onClick={() => setUserQuery("Hoàng Sa Trường Sa là của ai?")}
                className="text-left p-1.5 md:p-2 bg-red-700 rounded hover:bg-yellow-400 transition-colors text-yellow-100 hover:text-red-900 text-xs md:text-sm border border-yellow-400"
              >
                Hoàng Sa Trường Sa là của ai?
              </button>
              <button
                onClick={() => setUserQuery("giải thích giúp?")}
                className="text-left p-1.5 md:p-2 bg-red-700 rounded hover:bg-yellow-400 transition-colors text-yellow-100 hover:text-red-900 text-xs md:text-sm border border-yellow-400"
              >
                giải thích giúp?
              </button>
            </div>
          </>
        )}
        <form onSubmit={handleFollowUpSubmit}>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Nhập câu hỏi hoặc thuật ngữ cần tra cứu..."
            className="w-full bg-yellow-100 border border-yellow-400 rounded-md px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base text-red-900 placeholder-yellow-700 focus:outline-none focus:ring-2 focus:ring-red-700"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default SmartLookupPopup;
