import React from 'react';
import { SlideContent } from '../types';
import { SparklesIcon } from './IconComponents';

interface SlideProps {
  slide: SlideContent;
  onSelectTerm: (term: string) => void;
}

const Slide: React.FC<SlideProps> = ({ slide, onSelectTerm }) => {
  // No more key term highlighting, just plain text
  const renderContentPlain = (text: string) => text;

  return (
    <div className="w-full h-full max-w-6xl max-h-[90vh] p-8 md:p-20 flex flex-col justify-center text-white relative overflow-y-auto overflow-x-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-2 mb-8 animate-fade-in-up">
        <div className="flex items-center gap-4">
          {slide.icon && (
            <div dangerouslySetInnerHTML={{ __html: slide.icon }} style={{ color: '#06b6d1' }} />
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">{slide.title}</h2>
        </div>
        <div className="mt-2 text-xl md:text-2xl font-bold text-yellow-400 bg-red-600/90 px-6 py-2 rounded-full shadow animate-fade-in-up border-2 border-yellow-400">
          Đoàn kết – Đa dạng – Một Việt Nam
        </div>
      </div>
      <div className="space-y-8 text-xl md:text-2xl text-white">
        {slide.content.map((point, index) => {
          if (typeof point === 'string') {
            return (
              <div key={index} className="animate-fade-in-left font-bold text-2xl md:text-3xl text-white drop-shadow-2xl mb-2" style={{ animationDelay: `${index * 0.2}s` }}>
                {renderContentPlain(point)}
              </div>
            );
          } else if (typeof point === 'object' && point !== null && 'text' in point) {
            return (
              <div key={index} className="animate-fade-in-left mb-6" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`font-extrabold text-2xl md:text-3xl py-2 px-4 rounded-lg inline-block text-red-900 bg-yellow-100/90 border-b-4 border-red-600 shadow-md mb-2 ${point.highlight ? 'animate-pulse' : ''}`}>{renderContentPlain(point.text)}</div>
                {Array.isArray(point.subPoints) && point.subPoints.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {point.subPoints.map((sub, subIdx) => (
                      <button
                        key={subIdx}
                        className="inline-block bg-red-700/90 text-white px-4 py-2 rounded-full shadow hover:bg-yellow-500/90 hover:text-red-900 transition-all duration-300 animate-fade-in-scale text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        onClick={() => onSelectTerm(sub)}
                        type="button"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
      {/* Removed key term section */}
    </div>
  );
};

export default Slide;
