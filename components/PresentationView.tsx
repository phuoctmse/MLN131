import React, { useState, useCallback } from 'react';
import Slide from './Slide';
import SmartLookupPopup from './SmartLookupPopup';
import { Citation } from '../types';
import { useKeyPress } from '../hooks/useKeyPress';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';
import { slides } from '@/data/slides';
import SlideLottie from './SlideLottie';

interface PresentationViewProps {
  onNavigateToEbook: (citation: Citation) => void;
  onNavigateToPDF: (paragraphId?: string) => void;
  onOpenChat: (term?: string) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ onNavigateToEbook, onNavigateToPDF, onOpenChat }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const totalSlides = slides.length;

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useKeyPress('ArrowRight', goToNextSlide);
  useKeyPress('ArrowLeft', goToPrevSlide);


  // Always open chat and set term via global handler
  const handleSelectTerm = useCallback((term: string) => {
    if (typeof window !== 'undefined') {
      // Use prop to open global chat
      onOpenChat(term);
    }
  }, [onOpenChat]);

  const handleOpenChat = useCallback(() => {
    if (typeof window !== 'undefined') {
      onOpenChat();
    }
  }, [onOpenChat]);

  return (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 pt-20 overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-yellow-800">
      {/* Nav with logo/slogan */}
  <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-red-800/90 border-b-2 border-yellow-400 shadow-lg">
        <div className="flex items-center gap-2">
          {/* Simple Dong Son drum SVG icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="#FFD600" strokeWidth="3" fill="#B71C1C" />
            <circle cx="16" cy="16" r="7" stroke="#FFD600" strokeWidth="2" fill="none" />
            <path d="M16 9v14M9 16h14" stroke="#FFD600" strokeWidth="2" />
          </svg>
          <span className="ml-2 text-lg md:text-2xl font-bold text-yellow-300 drop-shadow">Tự hào dân tộc Việt Nam</span>
        </div>
        <div className="hidden md:block text-yellow-200 font-semibold text-base">Đoàn kết – Đa dạng – Một Việt Nam</div>
      </div>
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-yellow-300/60">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* New large floating particles for background effect */}
  <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDuration: '4s' }}></div>
  <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        {/* Existing small particles */}
  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '0s' }}></div>
  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
  <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
  <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-35" style={{ animationDelay: '3s' }}></div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main slide */}
          {slides.map((slide, index) => (
              <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}>
                  {index === currentSlideIndex && (
                    <>
                      <Slide slide={slide} onSelectTerm={handleSelectTerm} />
                      <SlideLottie />
                    </>
                  )}
              </div>
          ))}
          {/* Next slide preview on the right */}
          {slides.length > 1 && (
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-4/5 flex items-center justify-end pointer-events-none select-none">
              <div className="w-full h-full flex items-center justify-center opacity-40 scale-90 blur-sm transition-all duration-700">
                <Slide slide={slides[(currentSlideIndex + 1) % slides.length]} onSelectTerm={() => {}} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-red-700 hover:bg-yellow-400 text-yellow-200 hover:text-red-900 rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-300 hover:scale-110 font-bold border-2 border-yellow-400"
        title="Mở chat AI hỗ trợ"
        onClick={handleOpenChat}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden md:inline font-semibold">Chat AI</span>
      </button>

      {/* Navigation Controls */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 text-white"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 text-white"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Keyboard Hints */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-white/70 text-sm bg-black/20 px-4 py-2 rounded-lg">
        <span>← → để chuyển slide • Click thuật ngữ để tra cứu</span>
      </div>

      {/* Slide Indicator with Progress Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 text-white bg-black/30 px-4 py-2 rounded-full">
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentSlideIndex ? 'bg-cyan-400 scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        <span className="text-sm">{currentSlideIndex + 1} / {totalSlides}</span>
      </div>

      {/* PDF Button */}
      <button
        onClick={() => onNavigateToPDF()}
        className="fixed top-20 right-6 z-40 bg-yellow-400 hover:bg-yellow-500 text-red-900 rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-300 hover:scale-110 font-bold border-2 border-red-700"
        title="Xem giáo trình"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        <span className="hidden md:inline font-semibold">Giáo trình</span>
      </button>

      {/* Chat popup is now global in App */}
    </div>
  );
};

export default PresentationView;
