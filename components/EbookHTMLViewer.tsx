import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon } from './IconComponents';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileNotification from './MobileNotification';

interface EbookHTMLViewerProps {
  onBack: () => void;
  highlightParagraphId?: string;
  onOpenChat?: (term?: string) => void;
}

const EbookHTMLViewer: React.FC<EbookHTMLViewerProps> = ({ onBack, highlightParagraphId, onOpenChat }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile(768);

  // Show mobile notification if on mobile device
  if (isMobile) {
    return <MobileNotification />;
  }

  useEffect(() => {
    loadHTMLContent();
  }, []);

  useEffect(() => {
    if (highlightParagraphId && htmlContent) {
      highlightParagraph(highlightParagraphId);
    }
  }, [highlightParagraphId, htmlContent]);

  const loadHTMLContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/ebook_chapter_chap_4b6b984589dd283e.html');
      if (!response.ok) {
        throw new Error('Failed to load ebook content');
      }
      const htmlText = await response.text();
      
      // Parse HTML and extract body content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const bodyContent = doc.body.innerHTML;
      
      setHtmlContent(bodyContent);
    } catch (err) {
      setError('Không thể tải nội dung giáo trình');
      console.error('Error loading HTML content:', err);
    } finally {
      setLoading(false);
    }
  };

  const highlightParagraph = (paragraphId: string) => {
    if (!containerRef.current) return;

    // Remove previous highlights
    const previousHighlights = containerRef.current.querySelectorAll('.ai-highlight');
    previousHighlights.forEach(el => {
      el.classList.remove('ai-highlight');
    });

    // Add new highlight
    const targetElement = containerRef.current.querySelector(`#${paragraphId}`);
    if (targetElement) {
      targetElement.classList.add('ai-highlight');
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white">Đang tải giáo trình...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-red-900 via-red-800 to-yellow-800 flex flex-col">
      {/* Header - Mobile responsive */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-yellow-800 text-yellow-100 px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-4 shadow-lg border-b-2 md:border-b-4 border-yellow-400">
        <button
          onClick={onBack}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-red-700 hover:bg-yellow-400 hover:text-red-900 rounded-lg transition-colors border border-yellow-400 font-semibold text-sm md:text-base"
        >
          <ArrowLeftIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Quay lại</span>
          <span className="sm:hidden">←</span>
        </button>
        <h1 className="text-sm md:text-lg font-semibold text-yellow-100 drop-shadow flex-1 truncate">
          <span className="hidden md:inline">Chương 6: Vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội</span>
          <span className="md:hidden">Chương 6: Dân tộc & Tôn giáo</span>
        </h1>
      </div>

      {/* Content - Mobile responsive */}
      <div className="flex-1 overflow-auto">
        <div 
          ref={containerRef}
          className="ebook-content max-w-4xl mx-auto py-4 md:py-8 px-3 md:px-6 bg-[#fff8e1] rounded-none md:rounded-xl shadow-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* Floating Chat Button - Mobile responsive */}
      <button
        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 bg-gradient-to-br from-red-800 via-red-900 to-yellow-800 hover:from-yellow-600 hover:via-red-800 hover:to-yellow-600 text-yellow-100 hover:text-red-900 border-2 md:border-4 border-yellow-400 rounded-full shadow-lg p-3 md:p-4 flex items-center gap-1 md:gap-2 transition-colors font-semibold drop-shadow-lg"
        title="Mở chat AI hỗ trợ"
        onClick={() => onOpenChat && onOpenChat()}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden md:inline font-semibold text-sm md:text-base">Chat AI</span>
      </button>

      {/* Custom Styles */}
      <style jsx>{`

        .ebook-content {
          font-family: 'Segoe UI', 'Arial', 'Tahoma', 'DejaVu Sans', 'Liberation Sans', 'Noto Sans', 'Roboto', 'Helvetica Neue', 'sans-serif';
          line-height: 1.8;
          color: #222;
        }

        .ebook-content h1 {
          color: #b91c1c;
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f59e0b;
          text-shadow: 1px 1px 2px #fde68a;
        }

        .ebook-content h2 {
          color: #f59e0b;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
        }

        .ebook-content h3 {
          color: #f59e0b;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }

        .ebook-content h4 {
          color: #b91c1c;
          font-size: 1rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
        }

        /* Desktop styles */
        @media (min-width: 768px) {
          .ebook-content h1 {
            font-size: 2rem;
            margin: 2rem 0 1.5rem 0;
          }

          .ebook-content h2 {
            font-size: 1.5rem;
            margin: 1.5rem 0 1rem 0;
          }

          .ebook-content h3 {
            font-size: 1.25rem;
            margin: 1.25rem 0 0.75rem 0;
          }

          .ebook-content h4 {
            font-size: 1.125rem;
            margin: 1rem 0 0.5rem 0;
          }
        }

        .ebook-content .para {
          margin: 1rem 0;
          text-align: justify;
          text-indent: 2rem;
        }


        .ebook-content .hl {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }

        .ai-highlight {
          background-color: #fde68a !important;
          padding: 0.5rem !important;
          border-radius: 0.5rem !important;
          border-left: 4px solid #f59e0b !important;
          animation: highlight-pulse 2s ease-in-out;
        }

        @keyframes highlight-pulse {
          0% { 
            background-color: #fde68a;
            transform: scale(1);
          }
          50% { 
            background-color: #f59e0b;
            transform: scale(1.02);
          }
          100% { 
            background-color: #fde68a;
            transform: scale(1);
          }
        }

        .ebook-content ul, .ebook-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .ebook-content li {
          margin: 0.5rem 0;
        }

        .ebook-content blockquote {
          border-left: 4px solid #b91c1c;
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          background-color: #f3f4f6;
          font-style: italic;
        }

        .ebook-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .ebook-content th, .ebook-content td {
          border: 1px solid #f59e0b;
          padding: 0.75rem;
          text-align: left;
        }

        .ebook-content th {
          background-color: #fde68a;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default EbookHTMLViewer;