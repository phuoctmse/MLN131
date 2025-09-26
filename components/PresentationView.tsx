
import React, { useState, useCallback } from 'react';
import Slide from './Slide';
import SmartLookupPopup from './SmartLookupPopup';
import { Citation } from '../types';
import { useKeyPress } from '../hooks/useKeyPress';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';
import { slides } from '@/data/slides';

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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-35" style={{ animationDelay: '3s' }}></div>
      </div>
      <div className="w-full max-w-6xl aspect-video relative">
        {slides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}>
                {index === currentSlideIndex && <Slide slide={slide} onSelectTerm={handleSelectTerm} />}
            </div>
        ))}
      </div>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-300 hover:scale-110 animate-pulse"
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
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium"
        title="Xem giáo trình HTML"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        Giáo trình HTML
      </button>

      {/* Chat popup is now global in App */}
    </div>
  );
};

export default PresentationView;
