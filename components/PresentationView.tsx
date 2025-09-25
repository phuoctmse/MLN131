
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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-gray-900">
      <div className="w-full max-w-6xl aspect-video relative">
        {slides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                {index === currentSlideIndex && <Slide slide={slide} onSelectTerm={handleSelectTerm} />}
            </div>
        ))}
      </div>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-colors"
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Slide Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white bg-black/30 px-3 py-1 rounded-full">
        <span>{currentSlideIndex + 1}</span>
        <span className="text-gray-400">/</span>
        <span>{totalSlides}</span>
      </div>

      {/* PDF Button */}
      <button
        onClick={() => onNavigateToPDF()}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
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
