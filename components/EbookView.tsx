
import React, { useEffect, useRef } from 'react';
import { Citation } from '../types';
import { textbookContent } from '../data/textbook';
import { ArrowLeftIcon } from './IconComponents';

interface EbookViewProps {
  citation: Citation;
  onBack: () => void;
}

const EbookView: React.FC<EbookViewProps> = ({ citation, onBack }) => {
  const highlightedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [citation]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 text-gray-800">
      <header className="sticky top-0 bg-white shadow-md p-4 flex items-center gap-4 z-10">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          Quay lại Slide
        </button>
        <h1 className="text-xl font-bold">{citation.source}</h1>
      </header>

      <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {textbookContent.map((paragraph) => {
            const isHighlighted = paragraph.id === citation.paragraphId;
            return (
              <div key={paragraph.id} ref={isHighlighted ? highlightedRef : null}>
                 { (paragraph.id === 'p1' || paragraph.section.endsWith('.1')) && 
                    <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">Chương {paragraph.chapter}</h2>
                 }
                <p
                  className={`mb-4 text-lg leading-relaxed transition-all duration-500 ${
                    isHighlighted ? 'bg-yellow-200 p-4 rounded-md ring-2 ring-yellow-400' : ''
                  }`}
                >
                  <span className="font-bold text-gray-500 mr-2">[{paragraph.section}, Tr.{paragraph.page}]</span>
                  {paragraph.text}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default EbookView;
