import React from 'react';
import { SlideContent } from '../types';

interface SlideProps {
  slide: SlideContent;
  onSelectTerm: (term: string) => void;
}

const Slide: React.FC<SlideProps> = ({ slide, onSelectTerm }) => {
  const bulletIcon = (idx: number) => {
    if (idx === 0) return '🌏';
    if (idx === 1) return '💡';
    if (idx === 2) return '🏯';
    if (idx === 3) return '💡';
    return '✨';
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {slide.image ? (
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover brightness-75"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNiOTFjMWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjZmFjYzE1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Vmnhu4d0IE5hbTwvdGV4dD48L3N2Zz4=';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-900 via-red-800 to-yellow-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute top-32 right-20 w-16 h-16 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      )}

      <div className="relative z-10 w-full h-full flex flex-col px-4 md:px-16 lg:px-32 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {slide.icon && (
              <div dangerouslySetInnerHTML={{ __html: slide.icon }} className="text-yellow-400 opacity-90 scale-125" />
            )}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight cursor-pointer transition-colors duration-300 border-b-4 border-yellow-400 px-4 pb-2"
              onClick={() => onSelectTerm(slide.title)}
              style={{
                background: 'linear-gradient(90deg, #FFD54F 0%, #FFF59D 60%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 8px 18px rgba(0,0,0,0.45)'
              }}
            >
              {slide.title}
            </h1>

          </div>
        </div>

        {Array.isArray(slide.content) && slide.content.length === 2 ? (
          <div className="flex flex-row gap-10 items-stretch justify-center w-full animate-fade-in">
            <div className="flex-1 bg-black/30 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-yellow-400 p-8 flex flex-col gap-4 items-start animate-fade-in-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📖</span>
                <h2 className="font-black text-2xl md:text-3xl text-red-800">{slide.content[0].text}</h2>
              </div>
              {Array.isArray(slide.content[0].subPoints) && (
                <ul className="space-y-3 w-full">
                  {slide.content[0].subPoints.map((sub, subIdx) => (
                    <li key={subIdx} className="flex items-start gap-2 bg-yellow-600/10 rounded-xl px-4 py-3 font-semibold text-yellow-100 shadow-sm hover:bg-yellow-600/20 transition-all duration-300">
                      <span className="text-xl mt-1">{bulletIcon(subIdx)}</span>
                      <span className="text-yellow-100">{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex-1 bg-yellow-700/10 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-red-600 p-8 flex flex-col gap-4 items-start animate-fade-in-right">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🧭</span>
                <h2 className="font-black text-2xl md:text-3xl text-red-700">{slide.content[1].text}</h2>
              </div>
              {Array.isArray(slide.content[1].subPoints) && (
                <ul className="space-y-3 w-full">
                  {slide.content[1].subPoints.map((sub, subIdx) => (
                    <li key={subIdx} className="flex items-start gap-2 bg-black/20 rounded-xl px-4 py-3 font-semibold text-yellow-100 shadow-sm hover:bg-yellow-600/20 transition-all duration-300">
                      <span className="text-xl mt-1">{subIdx === 0 ? '🔗' : '⚖️'}</span>
                      <span className="text-yellow-100">{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-h-full overflow-y-auto">
            {Array.isArray(slide.content) && slide.content.map((point, index) => (
              <div key={index} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.2}s` }}>
                {typeof point === 'string' ? (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-l-8 border-red-600">
                    <div className="font-bold text-lg md:text-xl text-gray-800">{point}</div>
                  </div>
                ) : (point && 'text' in point) ? (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-l-8 border-red-600">
                    <h3 className={`font-black text-lg md:text-xl text-red-800 mb-3 ${point.highlight ? 'animate-pulse' : ''}`}>{point.text}</h3>
                    {Array.isArray(point.subPoints) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {point.subPoints.map((sub, subIdx) => (
                          <div key={subIdx} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-3 py-2 rounded-xl font-semibold text-sm shadow-lg text-left">{sub}</div>
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
  );
};

export default Slide;
