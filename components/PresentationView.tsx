
import React, { useState, useCallback } from 'react';
import { slides } from '../data/slides';
import Slide from './Slide';
import SmartLookupPopup from './SmartLookupPopup';
import { Citation } from '../types';
import { useKeyPress } from '../hooks/useKeyPress';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

interface PresentationViewProps {
  onNavigateToEbook: (citation: Citation) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ onNavigateToEbook }) => {
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

  const handleSelectTerm = useCallback((term: string) => {
    setSelectedTerm(term);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedTerm(null);
  }, []);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="w-full max-w-6xl aspect-video relative">
        {slides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                {index === currentSlideIndex && <Slide slide={slide} onSelectTerm={handleSelectTerm} />}
            </div>
        ))}
      </div>

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

      <SmartLookupPopup
        term={selectedTerm}
        onClose={handleClosePopup}
        onNavigateToEbook={onNavigateToEbook}
      />
    </div>
  );
};

export default PresentationView;
