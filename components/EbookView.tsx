
import React, { useEffect, useRef, useState } from 'react';
import { Citation, EbookParagraph } from '../types';
import { ArrowLeftIcon } from './IconComponents';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileNotification from './MobileNotification';
import EbookService from '../services/ebookService';

interface EbookViewProps {
  citation: Citation;
  onBack: () => void;
}

const EbookView: React.FC<EbookViewProps> = ({ citation, onBack }) => {
  const highlightedRef = useRef<HTMLDivElement>(null);
  const [paragraphs, setParagraphs] = useState<EbookParagraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile(768);
  const ebookService = EbookService.getInstance();

  // Show mobile notification if on mobile device
  if (isMobile) {
    return <MobileNotification />;
  }

  useEffect(() => {
    loadEbookData();
  }, []);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [citation, paragraphs]);

  const loadEbookData = async () => {
    try {
      setLoading(true);
      const allParagraphs = await ebookService.getAllParagraphs();
      setParagraphs(allParagraphs);
      setError(null);
    } catch (err) {
      console.error('Error loading ebook data:', err);
      setError('Không thể tải dữ liệu ebook');
    } finally {
      setLoading(false);
    }
  };

  const getChapterTitle = async (chapterId: string): Promise<string> => {
    try {
      const chapter = await ebookService.getChapterById(chapterId);
      return chapter ? chapter.title : `Chương ${chapterId}`;
    } catch {
      return `Chương ${chapterId}`;
    }
  };

  const getHeadingTitle = async (headingId: string): Promise<string> => {
    try {
      const heading = await ebookService.getHeadingById(headingId);
      return heading ? heading.title : '';
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải dữ liệu ebook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadEbookData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 text-gray-800">
      <header className="sticky top-0 bg-white shadow-md p-2 md:p-4 flex items-center gap-2 md:gap-4 z-10">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm md:text-base"
        >
          <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Quay lại Slide</span>
          <span className="sm:hidden">Quay lại</span>
        </button>
        <h1 className="text-lg md:text-xl font-bold flex-1 truncate">{citation.source}</h1>
        <div className="text-xs md:text-sm text-gray-600 hidden sm:block">
          {paragraphs.length} đoạn văn
        </div>
      </header>

      <main className="flex-grow p-2 md:p-4 lg:p-8 xl:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
          {paragraphs.map((paragraph, idx) => {
            // Generate paragraph ID for highlighting and citation matching
            const paragraphId = ebookService.getParagraphId(paragraph);
            const isHighlighted = citation && citation.paragraphId === paragraphId;
            
            // Check if this is the first paragraph of a new chapter
            const isNewChapter = idx === 0 || paragraphs[idx - 1].chapterId !== paragraph.chapterId;
            
            // Check if this is the first paragraph of a new heading
            const isNewHeading = idx === 0 || 
              paragraphs[idx - 1].headingId !== paragraph.headingId ||
              paragraphs[idx - 1].chapterId !== paragraph.chapterId;

            return (
              <div key={paragraphId} ref={isHighlighted ? highlightedRef : null}>
                {/* Show chapter heading if first paragraph of a chapter */}
                {isNewChapter && paragraph.chapterId !== 'unknown' && (
                  <ChapterHeading chapterId={paragraph.chapterId} />
                )}
                
                {/* Show section heading if first paragraph of a new heading */}
                {isNewHeading && paragraph.headingId !== 'unknown' && (
                  <SectionHeading headingId={paragraph.headingId} />
                )}
                
                <div
                  className={`mb-3 md:mb-4 text-sm md:text-base lg:text-lg leading-relaxed transition-all duration-500 ${
                    isHighlighted 
                      ? 'bg-yellow-200 p-3 md:p-4 rounded-md ring-2 ring-yellow-400' 
                      : 'hover:bg-gray-50 p-2 rounded-md'
                  }`}
                >
                  {/* Debug info - can be removed in production */}
                  <span className="inline-block text-xs text-gray-400 font-mono mb-1 md:mb-2">
                    ID: {paragraphId}
                  </span>
                  
                  <p className="text-justify leading-relaxed">
                    {paragraph.text}
                  </p>
                  
                  {/* Show paragraph index for debugging */}
                  <span className="inline-block text-xs text-gray-400 mt-1">
                    Đoạn {paragraph.pIndex}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// Component for chapter headings
const ChapterHeading: React.FC<{ chapterId: string }> = ({ chapterId }) => {
  const [title, setTitle] = useState<string>('');
  const ebookService = EbookService.getInstance();

  useEffect(() => {
    const loadTitle = async () => {
      try {
        const chapter = await ebookService.getChapterById(chapterId);
        setTitle(chapter ? chapter.title : `Chương ${chapterId}`);
      } catch {
        setTitle(`Chương ${chapterId}`);
      }
    };
    loadTitle();
  }, [chapterId]);

  if (chapterId === 'unknown') return null;

  return (
    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mt-6 md:mt-8 mb-4 md:mb-6 pb-2 md:pb-3 border-b-2 border-blue-500 text-blue-800">
      {title}
    </h1>
  );
};

// Component for section headings
const SectionHeading: React.FC<{ headingId: string }> = ({ headingId }) => {
  const [title, setTitle] = useState<string>('');
  const ebookService = EbookService.getInstance();

  useEffect(() => {
    const loadTitle = async () => {
      try {
        const heading = await ebookService.getHeadingById(headingId);
        setTitle(heading ? heading.title : '');
      } catch {
        setTitle('');
      }
    };
    loadTitle();
  }, [headingId]);

  if (headingId === 'unknown' || !title) return null;

  return (
    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mt-4 md:mt-6 mb-3 md:mb-4 text-gray-700">
      {title}
    </h2>
  );
};

export default EbookView;
