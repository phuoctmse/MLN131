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
    <div className="w-full h-full relative overflow-hidden">
      {/* Background Image với overlay */}
      {slide.image && (
        <div className="absolute inset-0 z-0">
          <img 
            src={slide.image} 
            alt={slide.title}
            className="w-full h-full object-cover brightness-75"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNiOTFjMWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjZmFjYzE1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Vmnhu4d0IE5hbTwvdGV4dD48L3N2Zz4=';
            }}
          />
          {/* Strong overlay để text dễ đọc hơn */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
      )}
      
      {/* Background cho slide không có ảnh */}
      {!slide.image && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-900 via-red-800 to-yellow-800">
          {/* Animated background particles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      )}

      {/* Content Overlay - Layout mới tối ưu */}
      <div className="relative z-10 w-full h-full flex flex-col px-8 md:px-16 lg:px-20 py-8">
        
        {/* Header Section - Compact */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            {slide.icon && (
              <div dangerouslySetInnerHTML={{ __html: slide.icon }} className="text-yellow-400 opacity-90" />
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl leading-tight">
              {slide.title}
            </h1>
          </div>
          <div className="inline-block text-base md:text-lg font-bold text-white bg-red-600/90 px-4 py-2 rounded-full shadow-xl border border-yellow-400/50">
            Đoàn kết – Đa dạng – Một Việt Nam
          </div>
        </div>

        {/* Content Section - Clean Grid Layout */}
        <div className="flex-1 max-w-6xl mx-auto w-full">
          {slide.content.length <= 2 ? (
            // Layout cho 2 content items hoặc ít hơn - hiển thị cạnh nhau
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-center">
              {slide.content.map((point, index) => (
                <div key={index} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.3}s` }}>
                  {typeof point === 'string' ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-l-8 border-red-600">
                      <div className="font-bold text-xl md:text-2xl text-gray-800">
                        {renderContentPlain(point)}
                      </div>
                    </div>
                  ) : typeof point === 'object' && point !== null && 'text' in point ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-l-8 border-red-600">
                      <h3 className={`font-black text-xl md:text-2xl text-red-800 mb-4 ${point.highlight ? 'animate-pulse' : ''}`}>
                        {renderContentPlain(point.text)}
                      </h3>
                      {Array.isArray(point.subPoints) && point.subPoints.length > 0 && (
                        <div className="space-y-3">
                          {point.subPoints.map((sub, subIdx) => (
                            <button
                              key={subIdx}
                              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-4 py-3 rounded-xl font-semibold text-sm md:text-base shadow-lg hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300 text-left"
                              onClick={() => onSelectTerm(sub)}
                              type="button"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            // Layout cho nhiều content items - hiển thị theo cột dọc
            <div className="space-y-6 max-h-full overflow-y-auto">
              {slide.content.map((point, index) => (
                <div key={index} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.2}s` }}>
                  {typeof point === 'string' ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-l-8 border-red-600">
                      <div className="font-bold text-lg md:text-xl text-gray-800">
                        {renderContentPlain(point)}
                      </div>
                    </div>
                  ) : typeof point === 'object' && point !== null && 'text' in point ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-l-8 border-red-600">
                      <h3 className={`font-black text-lg md:text-xl text-red-800 mb-3 ${point.highlight ? 'animate-pulse' : ''}`}>
                        {renderContentPlain(point.text)}
                      </h3>
                      {Array.isArray(point.subPoints) && point.subPoints.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {point.subPoints.map((sub, subIdx) => (
                            <button
                              key={subIdx}
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-3 py-2 rounded-xl font-semibold text-sm shadow-lg hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300 text-left"
                              onClick={() => onSelectTerm(sub)}
                              type="button"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slide;
