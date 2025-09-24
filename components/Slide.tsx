
import React from 'react';
import { SlideContent } from '../types';
import { SparklesIcon } from './IconComponents';

interface SlideProps {
  slide: SlideContent;
  onSelectTerm: (term: string) => void;
}

const Slide: React.FC<SlideProps> = ({ slide, onSelectTerm }) => {
  const renderContentWithClickableTerms = (text: string) => {
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
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center bg-gray-800 text-white rounded-lg shadow-2xl">
      <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-8">{slide.title}</h2>
      <ul className="space-y-4 text-xl md:text-2xl list-disc list-inside">
        {slide.content.map((point, index) => (
          <li key={index}>{renderContentWithClickableTerms(point)}</li>
        ))}
      </ul>
      <div className="mt-auto pt-8 border-t border-gray-600">
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Thuật ngữ chính:</h4>
        <div className="flex flex-wrap gap-3">
          {slide.keyTerms.map((term) => (
            <button
              key={term}
              onClick={() => onSelectTerm(term)}
              className="px-4 py-2 bg-gray-700 text-cyan-300 rounded-full hover:bg-cyan-900 hover:text-white transition-colors flex items-center gap-2"
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
