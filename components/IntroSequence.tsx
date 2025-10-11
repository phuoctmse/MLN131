import React, { useState, useEffect } from "react";

interface IntroSlide {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
  gradient: string;
  icon: string;
}

const introSlides: IntroSlide[] = [
  {
    id: 1,
    title: "Hệ thống học tập thông minh MLN131",
    subtitle: "Giải pháp học tập hiện đại cho môn Chủ nghĩa Mác - Lênin",
    content: [
      "🎯 Giải quyết khó khăn trong việc học lý luận chính trị",
      "🤖 AI hỗ trợ giải đáp thắc mắc tức thì 24/7",
      "📚 Tích hợp slide bài giảng + ebook + chat AI trong một nền tảng",
      "🎨 Giao diện thân thiện với văn hóa Việt Nam, dễ tiếp cận",
    ],
    gradient: "from-red-900 via-red-700 to-yellow-700",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>`,
  },
  {
    id: 2,
    title: "Ứng dụng AI trong sản phẩm",
    subtitle: "Trải nghiệm học tập thông minh và tương tác",
    content: [
      "💬 Chat AI thông minh trả lời mọi câu hỏi về nội dung học",
      "🔍 Tìm kiếm ngữ nghĩa nhanh chóng trong toàn bộ tài liệu",
      "💡 Gợi ý câu hỏi liên quan và mở rộng kiến thức",
      "📚 Hỗ trợ tra cứu tức thì với trích dẫn chính xác",
    ],
    gradient: "from-blue-900 via-purple-700 to-red-700",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>`,
  },
  {
    id: 3,
    title: "Công nghệ và kỹ thuật AI",
    subtitle: "Hệ sinh thái AI tiên tiến phục vụ giáo dục",
    content: [
      "🤖 Gemini: RAG thông minh theo giáo trình & phân loại câu hỏi",
      "🔎 Vertex Search API: tìm kiếm bổ sung & kiểm chứng thông tin",
      "📄 OCR (Tesseract): chuyển hình ảnh giáo trình thành văn bản",
      "🔗 LangChain: điều phối luồng dữ liệu & kết nối AI components",
    ],
    gradient: "from-indigo-900 via-blue-700 to-cyan-700",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.125C8.25 5.331 7.169 6.375 5.625 6.375H4.5a2.25 2.25 0 0 0-2.25 2.25v.75c0 .414.336.75.75.75h.75a.75.75 0 0 1 .75.75v3.75a2.25 2.25 0 0 0 2.25 2.25H7.5a.75.75 0 0 1 .75.75v.75c0 .414.336.75.75.75h.75a2.25 2.25 0 0 0 2.25-2.25v-.75a.75.75 0 0 1 .75-.75h3.75a2.25 2.25 0 0 0 2.25-2.25v-3.75a.75.75 0 0 1 .75-.75h.75c.414 0 .75-.336.75-.75v-.75a2.25 2.25 0 0 0-2.25-2.25h-1.125C19.169 4.5 18.25 3.831 18.25 3v-.75a.75.75 0 0 0-.75-.75h-2.25c-.414 0-.75.336-.75.75V3c0 1.169-1.081 2.25-2.625 2.25H8.25Z" /></svg>`,
  },
  {
    id: 4,
    title: "Quy trình AI thông minh",
    subtitle: "Từ câu hỏi đến câu trả lời chính xác",
    content: [
      "🎯 Hiểu mục đích câu hỏi từ người dùng",
      "📖 Truy vấn giáo trình với RAG (Retrieval-Augmented Generation)",
      "🌐 Bổ sung tìm kiếm web khi cần thiết",
      "✨ Tạo phản hồi tự nhiên kèm trích dẫn chính xác",
    ],
    gradient: "from-emerald-900 via-teal-700 to-blue-700",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`,
  },
  {
    id: 5,
    title: "Tính ứng dụng và thu hút",
    subtitle: "Trải nghiệm học tập hiện đại và hấp dẫn",
    content: [
      "🎨 Giao diện đẹp mắt với theme dân tộc Việt Nam",
      "✨ Animation mượt mà, tương tác trực quan",
      "📱 Responsive hoàn hảo trên mọi thiết bị",
      "🏛️ Kết hợp hoàn hảo giữa truyền thống và hiện đại",
    ],
    gradient: "from-yellow-900 via-red-700 to-red-900",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`,
  },
];

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (currentSlide < introSlides.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Hoàn thành intro sequence
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const skipIntro = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  // Auto advance sau 4 giây - DISABLED
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     nextSlide();
  //   }, 4000);

  //   return () => clearTimeout(timer);
  // }, [currentSlide]);

  const slide = introSlides[currentSlide];

  return (
    <div
      className={`w-full h-screen bg-gradient-to-br ${slide.gradient} flex items-center justify-center relative overflow-hidden transition-all duration-500`}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-red-400/20 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-20 h-20 bg-yellow-300/20 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-red-300/20 rounded-full animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Skip button - Mobile responsive */}
      <button
        onClick={skipIntro}
        className="absolute top-4 md:top-8 right-4 md:right-8 z-50 bg-white/20 hover:bg-white/30 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300 backdrop-blur-sm border border-white/30"
      >
        <span className="hidden sm:inline">Bỏ qua →</span>
        <span className="sm:hidden">Skip</span>
      </button>

      {/* Main content - Mobile responsive */}
      <div
        className={`text-center px-4 md:px-8 max-w-xs sm:max-w-2xl md:max-w-4xl transition-all duration-500 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Slide Number */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-400 text-red-900 rounded-full flex items-center justify-center font-black text-2xl md:text-3xl border-4 border-yellow-300 shadow-lg">
            {slide.id}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 md:mb-4 drop-shadow-2xl leading-tight">
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-yellow-100 mb-6 md:mb-8 font-bold leading-relaxed">
          {slide.subtitle}
        </p>

        {/* Content - Mobile responsive */}
        <div
          className={`gap-2 md:gap-4 mb-6 md:mb-8 ${
            slide.content.length > 4
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {slide.content.map((item, index) => (
            <div
              key={index}
              className="bg-white/95 rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-yellow-400 text-red-900 text-sm md:text-base lg:text-lg font-bold animate-fade-in-up shadow-lg"
              style={{
                animationDelay: `${index * 0.15}s`,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Progress indicator - Mobile responsive */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <div className="flex gap-1.5 md:gap-2">
            {introSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-yellow-400 scale-125"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
          <span className="text-white/80 text-xs md:text-sm">
            {currentSlide + 1} / {introSlides.length}
          </span>
        </div>

        {/* Next button - Mobile responsive */}
        <button
          onClick={nextSlide}
          className="mt-6 md:mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-base md:text-lg shadow-xl hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300"
        >
          {currentSlide < introSlides.length - 1 ? (
            <>
              <span className="hidden sm:inline">Tiếp theo</span>
              <span className="sm:hidden">Tiếp</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Bắt đầu học</span>
              <span className="sm:hidden">Bắt đầu</span>
            </>
          )}
        </button>
      </div>

      {/* Auto progress bar - DISABLED */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-red-400 transition-all duration-100 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / introSlides.length) * 100}%`,
            animation: 'progress 4s linear'
          }}
        />
      </div> */}

      <style>{`
        @keyframes progress {
          from { width: ${(currentSlide / introSlides.length) * 100}%; }
          to { width: ${((currentSlide + 1) / introSlides.length) * 100}%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default IntroSequence;
