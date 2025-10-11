import React, { useState, useCallback, useEffect } from 'react';
import Slide from './Slide';
import SmartLookupPopup from './SmartLookupPopup';
import MobileModal from './MobileModal';
import { Citation } from '../types';
import { useKeyPress } from '../hooks/useKeyPress';
import { useIsMobile } from '../hooks/useIsMobile';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';
import { slides } from '@/data/slides';
import SlideLottie from './SlideLottie';
import RevealPresentation from './RevealPresentation';

interface PresentationViewProps {
  onNavigateToEbook: (citation: Citation) => void;
  onNavigateToPDF: (paragraphId?: string) => void;
  onOpenChat: (term?: string) => void;
  onShowRoadmap?: () => void;
  onShowIntro?: () => void;
  initialSlideId?: number;
  onSlideChange?: (slideId: number) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ 
  onNavigateToEbook, 
  onNavigateToPDF, 
  onOpenChat,
  onShowRoadmap,
  onShowIntro,
  initialSlideId = 1,
  onSlideChange
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(Math.max(0, (initialSlideId || 1) - 1));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [showIndicator, setShowIndicator] = useState(true);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const isMobile = useIsMobile(768); // 768px breakpoint
  // Always use RevealPresentation now

  const totalSlides = slides.length;

  // Show mobile modal when component mounts on mobile
  useEffect(() => {
    if (isMobile) {
      setShowMobileModal(true);
    }
  }, [isMobile]);

  const handleCloseMobileModal = () => {
    setShowMobileModal(false);
  };

  const handleBackToRoadmap = () => {
    if (onShowRoadmap) {
      onShowRoadmap();
    }
  };

  const goToNextSlide = useCallback(() => {
    setShowIndicator(true);
    const deck = (window as any).__REVEAL_DECK;
    if (deck && typeof deck.right === 'function') {
      deck.right();
      // Sync immediately after navigation
      setTimeout(() => {
        try {
          const indices = deck.getIndices ? deck.getIndices() : null;
          if (indices && typeof indices.h === 'number') {
            console.log(`➡️ Next slide sync: ${indices.h}`);
            setCurrentSlideIndex(indices.h);
          }
        } catch (e) {}
      }, 50);
      return;
    }
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setShowIndicator(true);
    const deck = (window as any).__REVEAL_DECK;
    if (deck && typeof deck.left === 'function') {
      deck.left();
      // Sync immediately after navigation
      setTimeout(() => {
        try {
          const indices = deck.getIndices ? deck.getIndices() : null;
          if (indices && typeof indices.h === 'number') {
            console.log(`⬅️ Prev slide sync: ${indices.h}`);
            setCurrentSlideIndex(indices.h);
          }
        } catch (e) {}
      }, 50);
      return;
    }
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Inform parent when slide changes so roadmap highlighting stays in sync
  React.useEffect(() => {
    if (typeof onSlideChange === 'function') {
      onSlideChange(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, onSlideChange]);

  useKeyPress('ArrowRight', goToNextSlide);
  useKeyPress('ArrowLeft', goToPrevSlide);

  // Sync currentSlideIndex with Reveal deck when available
  React.useEffect(() => {
    const syncWithReveal = () => {
      const deck = (window as any).__REVEAL_DECK;
      if (!deck) {
        console.log('🔄 Reveal deck not available yet');
        return false;
      }

      try {
        const indices = deck.getIndices ? deck.getIndices() : null;
        if (indices && typeof indices.h === 'number') {
          console.log(`🎯 Syncing slide index: ${indices.h}`);
          setCurrentSlideIndex(indices.h);
          setShowIndicator(true);
          return true;
        }
      } catch (e) {
        console.warn('Error syncing with Reveal:', e);
      }
      return false;
    };

    // Try to sync immediately
    if (syncWithReveal()) {
      console.log('✅ Initial sync successful, setting up event listener');
      const deck = (window as any).__REVEAL_DECK;
      if (deck && deck.on) {
        deck.on('slidechanged', syncWithReveal);
        return () => {
          try { deck.off('slidechanged', syncWithReveal); } catch (e) {}
        };
      }
    } else {
      console.log('⏳ Reveal not ready, retrying in 200ms...');
      // Reveal not ready, try again in 200ms with more retries
      let retryCount = 0;
      const retryTimer = setInterval(() => {
        if (syncWithReveal() || retryCount >= 10) {
          clearInterval(retryTimer);
          if (retryCount < 10) {
            console.log('✅ Retry sync successful, setting up event listener');
            const deck = (window as any).__REVEAL_DECK;
            if (deck && deck.on) {
              deck.on('slidechanged', syncWithReveal);
            }
          } else {
            console.warn('❌ Max retries reached, sync failed');
          }
        }
        retryCount++;
      }, 200);

      return () => {
        clearInterval(retryTimer);
        const deck = (window as any).__REVEAL_DECK;
        if (deck && deck.off) {
          try { deck.off('slidechanged', syncWithReveal); } catch (e) {}
        }
      };
    }
  }, []);

  // Force sync with Reveal deck periodically when indicator is shown
  React.useEffect(() => {
    if (showIndicator) {
      const syncCheck = setInterval(() => {
        const deck = (window as any).__REVEAL_DECK;
        if (deck && deck.getIndices) {
          try {
            const indices = deck.getIndices();
            if (indices && typeof indices.h === 'number' && indices.h !== currentSlideIndex) {
              console.log(`🔄 Force sync correction: ${currentSlideIndex} → ${indices.h}`);
              setCurrentSlideIndex(indices.h);
            }
          } catch (e) {}
        }
      }, 500); // Check every 500ms

      const hideTimer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);

      return () => {
        clearInterval(syncCheck);
        clearTimeout(hideTimer);
      };
    }
  }, [showIndicator, currentSlideIndex]);


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
  <div className="relative w-full h-screen flex flex-col items-center justify-center pt-16 overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-yellow-800">
      {/* Nav with logo/slogan */}
  <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 md:px-6 py-2 md:py-3 bg-red-800/90 border-b-2 border-yellow-400 shadow-lg">
        <div className="flex items-center gap-1 md:gap-2">
          {/* Simple Dong Son drum SVG icon */}
          <svg width="24" height="24" className="md:w-8 md:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="#FFD600" strokeWidth="3" fill="#B71C1C" />
            <circle cx="16" cy="16" r="7" stroke="#FFD600" strokeWidth="2" fill="none" />
            <path d="M16 9v14M9 16h14" stroke="#FFD600" strokeWidth="2" />
          </svg>
          <span className="ml-1 md:ml-2 text-sm md:text-lg lg:text-2xl font-bold text-yellow-300 drop-shadow truncate">Tự hào dân tộc Việt Nam</span>
        </div>
        
        {/* Center slogan */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block text-yellow-200 font-semibold text-sm xl:text-base">
          Đoàn kết – Đa dạng – Một Việt Nam
        </div>
        
        {/* Navigation links - Mobile responsive */}
        <nav className="flex items-center gap-2 md:gap-4 lg:gap-6">
          {onShowIntro && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onShowIntro();
              }}
              className="text-yellow-300 hover:text-yellow-100 transition-colors duration-300 font-semibold text-xs md:text-sm lg:text-base border-b-2 border-transparent hover:border-yellow-300 pb-1"
            >
              <span className="hidden sm:inline">Giới thiệu</span>
              <span className="sm:hidden">GT</span>
            </a>
          )}
          
          {onShowRoadmap && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onShowRoadmap();
              }}
              className="text-yellow-300 hover:text-yellow-100 transition-colors duration-300 font-semibold text-xs md:text-sm lg:text-base border-b-2 border-transparent hover:border-yellow-300 pb-1"
            >
              <span className="hidden sm:inline">Bản đồ</span>
              <span className="sm:hidden">BĐ</span>
            </a>
          )}

          {/* Reveal presentation is used by default */}
          
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToPDF();
            }}
            className="text-yellow-300 hover:text-yellow-100 transition-colors duration-300 font-semibold text-xs md:text-sm lg:text-base border-b-2 border-transparent hover:border-yellow-300 pb-1"
          >
            <span className="hidden sm:inline">Giáo trình</span>
            <span className="sm:hidden">GT</span>
          </a>
          
        </nav>
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
          {/* Reveal presentation mounted full-screen */}
          <div className="absolute inset-0 w-full h-full">
            <RevealPresentation onSelectTerm={handleSelectTerm} />
          </div>
        </div>
      </div>

      {/* Floating Chat Button - Mobile responsive */}
      <button
        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 bg-red-700 hover:bg-yellow-400 text-yellow-200 hover:text-red-900 rounded-full shadow-lg p-3 md:p-4 flex items-center gap-2 transition-all duration-300 hover:scale-110 font-bold border-2 border-yellow-400"
        title="Mở chat AI hỗ trợ"
        onClick={handleOpenChat}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden md:inline font-semibold text-sm md:text-base">Chat AI</span>
      </button>

      {/* Navigation Controls - Mobile responsive */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-red-700/80 hover:bg-yellow-400 text-yellow-200 hover:text-red-900 transition-all duration-300 hover:scale-110 border-2 border-yellow-400 shadow-lg backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-red-700/80 hover:bg-yellow-400 text-yellow-200 hover:text-red-900 transition-all duration-300 hover:scale-110 border-2 border-yellow-400 shadow-lg backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Slide Indicator with Progress Bar - Mobile responsive */}
      <div className={`absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-4 text-white bg-black/40 backdrop-blur-sm px-2 md:px-4 py-1.5 md:py-2 rounded-full border border-yellow-400/30 transition-all duration-500 ${
        showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="flex gap-1 md:gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                i === currentSlideIndex ? 'bg-yellow-400 scale-125 shadow-lg shadow-yellow-400/50' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">{currentSlideIndex + 1} / {totalSlides}</span>
      </div>

      {/* Mobile Modal */}
      <MobileModal
        isOpen={showMobileModal && isMobile}
        onClose={handleCloseMobileModal}
        onBackToRoadmap={handleBackToRoadmap}
      />

      {/* Chat popup is now global in App */}
    </div>
  );
};

export default PresentationView;
