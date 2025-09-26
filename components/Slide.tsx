
import React from 'react';
import { SlideContent } from '../types';
import { SparklesIcon } from './IconComponents';

interface SlideProps {
  slide: SlideContent;
  onSelectTerm: (term: string) => void;
}

const Slide: React.FC<SlideProps> = ({ slide, onSelectTerm }) => {
  const renderContentWithClickableTerms = (text: string) => {
    if (!slide.keyTerms || slide.keyTerms.length === 0) return text;
    // A simple regex to find key terms in content.
    // In a real app, this might be more sophisticated.
    const keyTermsRegex = new RegExp(`(${slide.keyTerms.join('|')})`, 'gi');
    const parts = text.split(keyTermsRegex);

    return parts.map((part, index) => {
      if (slide.keyTerms.some(term => term.toLowerCase() === part.toLowerCase())) {
        return (
          <button
            key={index}
            onClick={() => onSelectTerm(part)}
            className="text-cyan-400 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded"
            type="button"
            tabIndex={0}
          >
            <span className="inline-flex items-center gap-1">
              <SparklesIcon className="w-4 h-4 inline-block" />
              {part}
            </span>
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 text-white rounded-lg shadow-2xl relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-8 animate-fade-in-up">{slide.title}</h2>
      <ul className="space-y-4 text-xl md:text-2xl list-disc list-inside">
        {slide.content.map((point, index) => (
          <li key={index} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.2}s` }}>{renderContentWithClickableTerms(point)}</li>
        ))}
      </ul>
      <div className="mt-auto pt-8 border-t border-gray-600 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Thuật ngữ chính:</h4>
        <div className="flex flex-wrap gap-3">
          {Array.isArray(slide.keyTerms) && slide.keyTerms.length > 0 && slide.keyTerms.map((term, index) => (
            <button
              key={term}
              onClick={() => onSelectTerm(term)}
              className="px-4 py-2 bg-gray-700 text-cyan-300 rounded-full hover:bg-cyan-900 hover:text-white transition-all duration-300 hover:scale-110 flex items-center gap-2 animate-fade-in-scale"
              style={{ animationDelay: `${1.5 + index * 0.1}s` }}
            >
              <SparklesIcon className="w-5 h-5" />
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slide;
