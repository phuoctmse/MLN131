import React, { useState, useEffect } from 'react';

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
    title: "Lý do chọn sản phẩm",
    subtitle: "Tại sao chọn hệ thống học tập MLN131?",
    content: [
      "Tích hợp AI thông minh hỗ trợ học tập 24/7",
      "Giao diện thân thiện, dễ sử dụng cho mọi đối tượng",
      "Nội dung chuẩn chỉnh theo chương trình Đại học",
      "Tương tác đa phương tiện: slide, ebook, chat AI"
    ],
    gradient: "from-red-900 via-red-700 to-yellow-700",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>`
  },
  {
    id: 2,
    title: "Ứng dụng AI trong sản phẩm",
    subtitle: "Công nghệ AI hiện đại phục vụ giáo dục",
    content: [
      "Chat AI thông minh trả lời mọi câu hỏi về nội dung học",
      "Tìm kiếm ngữ nghĩa nhanh chóng trong toàn bộ tài liệu",
      "Gợi ý nội dung liên quan và mở rộng kiến thức",
      "Hỗ trợ tra cứu tức thì từ giáo trình và slide"
    ],
    gradient: "from-blue-900 via-purple-700 to-red-700",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>`
  },
  {
    id: 3,
    title: "Tính ứng dụng và thu hút",
    subtitle: "Trải nghiệm học tập hiện đại và hấp dẫn",
    content: [
      "Giao diện đẹp mắt với theme dân tộc Việt Nam",
      "Animation mượt mà, tương tác trực quan",
      "Responsive hoàn hảo trên mọi thiết bị",
      "Kết hợp hoàn hảo giữa truyền thống và hiện đại"
    ],
    gradient: "from-yellow-900 via-red-700 to-red-900",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`
  }
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
    <div className={`w-full h-screen bg-gradient-to-br ${slide.gradient} flex items-center justify-center relative overflow-hidden transition-all duration-500`}>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-red-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-yellow-300/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-red-300/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Skip button */}
      <button
        onClick={skipIntro}
        className="absolute top-8 right-8 z-50 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30"
      >
        Bỏ qua →
      </button>

      {/* Main content */}
      <div className={`text-center px-8 max-w-4xl transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Icon */}
        <div className="flex justify-center mb-6 text-yellow-300 opacity-90">
          <div dangerouslySetInnerHTML={{ __html: slide.icon }} />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-yellow-200 mb-8 font-semibold">
          {slide.subtitle}
        </p>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {slide.content.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-white text-lg font-semibold animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-4">
          <div className="flex gap-2">
            {introSlides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          <span className="text-white/80 text-sm ml-4">
            {currentSlide + 1} / {introSlides.length}
          </span>
        </div>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300"
        >
          {currentSlide < introSlides.length - 1 ? 'Tiếp theo' : 'Bắt đầu học'}
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