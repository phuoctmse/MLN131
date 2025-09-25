
import React, { useState, useCallback } from 'react';
// import Slide from './Slide';
// import SmartLookupPopup from './SmartLookupPopup';
import { Citation } from '../types';
// import { useKeyPress } from '../hooks/useKeyPress';
// import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';
// import { slides } from '../data/slides';

interface PresentationViewProps {
  onNavigateToEbook: (citation: Citation) => void;
  onNavigateToPDF: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ onNavigateToEbook, onNavigateToPDF }) => {
  // Tạm thời ẩn các slide data để tập trung vào PDF.js
  // const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // const totalSlides = slides.length;

  // const goToNextSlide = useCallback(() => {
  //   setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  // }, [totalSlides]);

  // const goToPrevSlide = useCallback(() => {
  //   setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  // }, [totalSlides]);

  // useKeyPress('ArrowRight', goToNextSlide);
  // useKeyPress('ArrowLeft', goToPrevSlide);

  // const handleSelectTerm = useCallback((term: string) => {
  //   setSelectedTerm(term);
  // }, []);

  // const handleClosePopup = useCallback(() => {
  //   setSelectedTerm(null);
  // }, []);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-gray-900">
      {/* Tạm thời ẩn slides để tập trung vào PDF */}
      <div className="w-full max-w-6xl aspect-video relative flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Giáo trình Chủ nghĩa xã hội khoa học</h1>
          <p className="text-xl mb-8">Click nút "Giáo trình PDF" để xem nội dung</p>
        </div>
      </div>

      {/* Slides tạm thời bị ẩn */}
      {/* <div className="w-full max-w-6xl aspect-video relative">
        {slides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                {index === currentSlideIndex && <Slide slide={slide} onSelectTerm={handleSelectTerm} />}
            </div>
        ))}
      </div> */}


      {/* Navigation Controls - tạm thời ẩn */}
      {/* <button
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
      </button> */}

      {/* Slide Indicator - tạm thời ẩn */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white bg-black/30 px-3 py-1 rounded-full">
        <span>{currentSlideIndex + 1}</span>
        <span className="text-gray-400">/</span>
        <span>{totalSlides}</span>
      </div> */}

      {/* PDF Button */}
      <button
        onClick={onNavigateToPDF}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
        title="Xem giáo trình PDF"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        Giáo trình PDF
      </button>

      {/* SmartLookupPopup - tạm thời ẩn */}
      {/* <SmartLookupPopup
        term={selectedTerm}
        onClose={handleClosePopup}
        onNavigateToEbook={onNavigateToEbook}
      /> */}
    </div>
  );
};

export default PresentationView;
