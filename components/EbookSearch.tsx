import React, { useState } from 'react';
import EbookAIService from '../services/ebookAIService';
import { EbookParagraph } from '../types';

interface EbookSearchProps {
  onSelectParagraph: (paragraphId: string) => void;
}

const EbookSearch: React.FC<EbookSearchProps> = ({ onSelectParagraph }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EbookParagraph[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  
  const ebookAIService = EbookAIService.getInstance();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await ebookAIService.searchForAI(searchQuery, 10);
      setSearchResults(result.paragraphs);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTermLookup = async (term: string) => {
    setLoading(true);
    try {
      const result = await ebookAIService.lookupTerm(term);
      setSearchResults(result.relatedParagraphs);
      setSelectedTerms([term]);
    } catch (error) {
      console.error('Term lookup error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const popularTerms = [
    'chủ nghĩa xã hội',
    'giai cấp công nhân',
    'chủ nghĩa tư bản',
    'duy vật lịch sử',
    'Mác',
    'Lênin',
    'cách mạng',
    'phong trào công nhân'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Tìm kiếm trong Ebook</h2>
      
      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Nhập từ khóa hoặc thuật ngữ..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
        >
          {loading ? 'Tìm...' : 'Tìm kiếm'}
        </button>
      </div>

      {/* Popular Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Thuật ngữ phổ biến:</h3>
        <div className="flex flex-wrap gap-2">
          {popularTerms.map((term) => (
            <button
              key={term}
              onClick={() => handleTermLookup(term)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTerms.includes(term)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Kết quả tìm kiếm ({searchResults.length} đoạn văn):
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {searchResults.map((paragraph) => {
              const paragraphId = ebookAIService.getParagraphId(paragraph);
              return (
                <SearchResultItem
                  key={paragraphId}
                  paragraph={paragraph}
                  paragraphId={paragraphId}
                  searchQuery={searchQuery}
                  onSelect={() => onSelectParagraph(paragraphId)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
          <p className="text-sm mt-2">Thử với từ khóa khác hoặc chọn thuật ngữ phổ biến ở trên</p>
        </div>
      )}
    </div>
  );
};

// Component for individual search result
const SearchResultItem: React.FC<{
  paragraph: EbookParagraph;
  paragraphId: string;
  searchQuery: string;
  onSelect: () => void;
}> = ({ paragraph, paragraphId, searchQuery, onSelect }) => {
  const [chapterTitle, setChapterTitle] = useState('');
  const [headingTitle, setHeadingTitle] = useState('');
  
  const ebookAIService = EbookAIService.getInstance();

  React.useEffect(() => {
    const loadTitles = async () => {
      try {
        const [chapter, heading] = await Promise.all([
          ebookAIService.getChapterById(paragraph.chapterId),
          ebookAIService.getHeadingById(paragraph.headingId)
        ]);
        
        setChapterTitle(chapter ? chapter.title : 'Unknown Chapter');
        setHeadingTitle(heading ? heading.title : '');
      } catch (error) {
        console.error('Error loading titles:', error);
      }
    };
    
    loadTitles();
  }, [paragraph.chapterId, paragraph.headingId]);

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const terms = query.toLowerCase().split(/\s+/);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-blue-600 text-sm">
            {chapterTitle}
          </h4>
          {headingTitle && (
            <p className="text-gray-600 text-sm">{headingTitle}</p>
          )}
        </div>
        <button
          onClick={onSelect}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
        >
          Xem chi tiết
        </button>
      </div>
      
      <div 
        className="text-gray-800 leading-relaxed text-sm"
        dangerouslySetInnerHTML={{ 
          __html: highlightText(
            paragraph.text.length > 300 
              ? paragraph.text.substring(0, 300) + '...'
              : paragraph.text,
            searchQuery
          )
        }}
      />
      
      <div className="mt-2 text-xs text-gray-500">
        ID: {paragraphId} | Đoạn {paragraph.pIndex}
      </div>
    </div>
  );
};

export default EbookSearch;