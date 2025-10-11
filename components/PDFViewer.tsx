import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ArrowLeftIcon } from './IconComponents';

// Set up the worker - using local worker from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PDFViewerProps {
  pdfUrl: string;
  onBack: () => void;
  initialPage?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onBack, initialPage = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPDF();
  }, [pdfUrl]);

  useEffect(() => {
    if (pdf) {
      renderPage(currentPage);
    }
  }, [pdf, currentPage, scale]);

  const loadPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdfDoc = await loadingTask.promise;
      
      setPdf(pdfDoc);
      setTotalPages(pdfDoc.numPages);
      setCurrentPage(Math.min(initialPage, pdfDoc.numPages));
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Không thể tải file PDF. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdf || !canvasRef.current) return;

    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      setError(`Không thể hiển thị trang ${pageNum}`);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1.5);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextPage();
          break;
        case 'Home':
          e.preventDefault();
          goToPage(1);
          break;
        case 'End':
          e.preventDefault();
          goToPage(totalPages);
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
        case '+':
        case '=':
          if (e.ctrlKey) {
            e.preventDefault();
            zoomIn();
          }
          break;
        case '-':
          if (e.ctrlKey) {
            e.preventDefault();
            zoomOut();
          }
          break;
        case '0':
          if (e.ctrlKey) {
            e.preventDefault();
            resetZoom();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, isFullscreen]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải file PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={loadPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Thử lại
            </button>
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full ${isFullscreen ? 'h-screen' : 'h-screen'} flex flex-col bg-gray-900`}>
      {/* Header với các điều khiển */}
      <header className="sticky top-0 bg-white shadow-md p-4 flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Quay lại
          </button>
          
          <span className="text-gray-700 font-medium">
            Giáo trình Chủ nghĩa xã hội khoa học
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={zoomOut}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              title="Zoom out (Ctrl + -)"
            >
              -
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={zoomIn}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              title="Zoom in (Ctrl + +)"
            >
              +
            </button>
            <button 
              onClick={resetZoom}
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-xs"
              title="Reset zoom (Ctrl + 0)"
            >
              Reset
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page (←)"
            >
              ‹
            </button>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
              />
              <span className="text-sm text-gray-600">/ {totalPages}</span>
            </div>
            
            <button 
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page (→)"
            >
              ›
            </button>
          </div>

          {/* Fullscreen button */}
          <button 
            onClick={toggleFullscreen}
            className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
            title="Fullscreen (F11)"
          >
            {isFullscreen ? '⊞' : '⊡'}
          </button>
        </div>
      </header>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto bg-gray-800 p-4">
        <div className="flex justify-center">
          <div className="bg-white shadow-2xl">
            <canvas 
              ref={canvasRef}
              className="max-w-full h-auto"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* Footer với thông tin điều khiển */}
      <footer className="bg-gray-100 px-4 py-2 text-xs text-gray-600 text-center">
        Sử dụng phím mũi tên để chuyển trang | Ctrl + (+/-) để zoom | ESC để thoát fullscreen
      </footer>
    </div>
  );
};

export default PDFViewer;