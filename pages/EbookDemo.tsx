import React, { useState } from 'react';
import EbookView from '../components/EbookView';
import EbookSearch from '../components/EbookSearch';
import { Citation } from '../types';

const EbookDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'search' | 'ebook'>('search');
  const [currentCitation, setCurrentCitation] = useState<Citation | null>(null);

  const handleSelectParagraph = (paragraphId: string) => {
    // Create a citation object for the selected paragraph
    const citation: Citation = {
      source: 'Chủ nghĩa xã hội khoa học',
      chapter: 1, // This would be determined from the paragraph data
      section: 'Demo Section',
      page: 1,
      paragraphId: paragraphId
    };
    
    setCurrentCitation(citation);
    setCurrentView('ebook');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setCurrentCitation(null);
  };

  if (currentView === 'ebook' && currentCitation) {
    return (
      <EbookView 
        citation={currentCitation}
        onBack={handleBackToSearch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Ebook Chủ nghĩa xã hội khoa học
        </h1>
        <p className="text-gray-600 mt-2">
          Hệ thống tìm kiếm và truy xuất thông tin với AI hỗ trợ
        </p>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-2">
            <EbookSearch onSelectParagraph={handleSelectParagraph} />
          </div>
          
          {/* Info Panel */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thông tin hệ thống</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Tính năng:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  <li>Tìm kiếm full-text trong toàn bộ giáo trình</li>
                  <li>Truy xuất nhanh thuật ngữ phổ biến</li>
                  <li>Hiển thị kết quả với highlight từ khóa</li>
                  <li>Xem chi tiết đoạn văn với ngữ cảnh</li>
                  <li>Index hóa dữ liệu cho AI truy cập</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Dữ liệu:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  <li>11 chương từ giáo trình</li>
                  <li>543+ đoạn văn được index</li>
                  <li>234+ chunks cho AI context</li>
                  <li>Cấu trúc phân cấp chương-mục</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">AI Integration:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  <li>RAG (Retrieval Augmented Generation)</li>
                  <li>Context-aware search</li>
                  <li>Semantic term lookup</li>
                  <li>Relevance scoring</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn sử dụng:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Nhập từ khóa vào ô tìm kiếm</li>
                <li>Hoặc click vào thuật ngữ phổ biến</li>
                <li>Xem danh sách kết quả được highlight</li>
                <li>Click "Xem chi tiết" để đọc toàn văn</li>
                <li>Sử dụng nút "Quay lại" để tiếp tục tìm kiếm</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EbookDemo;