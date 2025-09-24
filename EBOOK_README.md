# Ebook System - Chủ nghĩa xã hội khoa học

Hệ thống hiển thị và tìm kiếm ebook với tích hợp AI để hỗ trợ truy xuất thông tin nhanh chóng và chính xác.

## 🚀 Tính năng chính

### 1. Hiển thị Ebook
- Hiển thị toàn bộ nội dung ebook với cấu trúc phân cấp rõ ràng
- Tự động tạo tiêu đề chương và mục từ dữ liệu TOC
- Highlight đoạn văn được trích dẫn
- Navigation mượt mà với scroll tự động

### 2. Tìm kiếm thông minh
- **Full-text search**: Tìm kiếm trong toàn bộ nội dung ebook
- **Term lookup**: Tra cứu nhanh thuật ngữ phổ biến
- **Highlight kết quả**: Làm nổi bật từ khóa trong kết quả tìm kiếm
- **Context-aware**: Hiển thị ngữ cảnh xung quanh kết quả

### 3. Indexing cho AI
- **Paragraph-level indexing**: Mỗi đoạn văn có ID duy nhất
- **Chapter/Heading mapping**: Liên kết cấu trúc phân cấp
- **Term frequency analysis**: Phân tích tần suất từ khóa
- **Context retrieval**: Truy xuất ngữ cảnh cho AI

### 4. AI Integration
- **RAG (Retrieval Augmented Generation)**: Tích hợp với Gemini API
- **Smart term explanation**: Giải thích thuật ngữ dựa trên ngữ cảnh
- **Relevance scoring**: Tính điểm liên quan cho kết quả
- **Citation generation**: Tự động tạo trích dẫn chính xác

## 📁 Cấu trúc dữ liệu

### Input Files (trong folder `data/`)
- `ebook_toc.json`: Cấu trúc table of contents với chapterID và headingID
- `ebook_paragraphs.txt`: Từng đoạn văn với metadata (JSONL format)  
- `ebook_chunks.txt`: Chunks lớn hơn cho AI context (JSONL format)

### Data Schema
```typescript
// Paragraph structure
{
  chapterId: string,    // ID duy nhất của chương
  headingId: string,    // ID duy nhất của mục
  pIndex: number,       // Thứ tự đoạn văn trong mục
  text: string          // Nội dung đoạn văn
}

// Generated paragraph ID format
paragraphId = "${chapterId}_${headingId}_${pIndex}"
```

## 🛠️ Architecture

### Services Layer
1. **EbookService**: Core service xử lý dữ liệu ebook
   - Load và parse dữ liệu từ files
   - Build search index
   - Paragraph lookup và context retrieval

2. **EbookAIService**: AI integration layer
   - Search with relevance scoring
   - Term definition extraction
   - Context generation for AI

3. **GeminiService**: AI API integration  
   - Term explanation với RAG
   - Context-aware Q&A
   - Citation generation

### Components
1. **EbookView**: Hiển thị toàn bộ ebook
2. **EbookSearch**: Giao diện tìm kiếm  
3. **EbookDemo**: Demo page tích hợp

## 🔧 Setup và sử dụng

### 1. Cấu trúc files
```
public/
  data/
    ebook_toc.json
    ebook_paragraphs.txt  
    ebook_chunks.txt
```

### 2. Import và sử dụng
```typescript
import { 
  EbookService, 
  EbookAIService, 
  EbookView, 
  EbookSearch 
} from './ebook';

// Load dữ liệu
const ebookService = EbookService.getInstance();
const paragraphs = await ebookService.getAllParagraphs();

// Tìm kiếm
const aiService = EbookAIService.getInstance();  
const results = await aiService.searchForAI("chủ nghĩa xã hội", 10);

// Tra cứu thuật ngữ
const termInfo = await aiService.lookupTerm("giai cấp công nhân");
```

### 3. AI Integration
```typescript
import { getTermExplanation, getAIAnswerWithContext } from './services/geminiService';

// Giải thích thuật ngữ với AI
const explanation = await getTermExplanation("chủ nghĩa tư bản");

// Trả lời câu hỏi với context
const answer = await getAIAnswerWithContext("Vai trò của giai cấp công nhân là gì?");
```

## 🎯 Use Cases

### 1. Hiển thị Ebook truyền thống
- Load toàn bộ nội dung có cấu trúc
- Navigation theo chương mục
- Citation và bookmark

### 2. Tìm kiếm thông minh
- Tìm kiếm full-text trong toàn giáo trình  
- Tra cứu thuật ngữ nhanh chóng
- Xem kết quả với context

### 3. Trợ lý AI
- Giải thích thuật ngữ chuyên ngành
- Trả lời câu hỏi dựa trên nội dung giáo trình
- Tạo trích dẫn tự động

### 4. Research Tool
- Extract định nghĩa từ văn bản
- Phân tích mối liên hệ giữa các khái niệm  
- Context retrieval cho nghiên cứu

## 📊 Performance

### Indexing
- **543 paragraphs** được index với ID duy nhất
- **234 chunks** cho AI context  
- **11 chapters** với cấu trúc phân cấp
- **Search performance**: < 100ms cho most queries

### Memory Usage  
- **In-memory search index** cho tốc độ  
- **Lazy loading** cho dữ liệu lớn
- **Caching** cho API calls thường xuyên

## 🔮 Future Enhancements

1. **Advanced Search**
   - Fuzzy search cho typos
   - Semantic search với embeddings
   - Search filters (chapter, date range, etc.)

2. **AI Features**
   - Chat interface với ebook context
   - Automatic question generation  
   - Knowledge graph construction

3. **User Experience**  
   - Bookmarking và notes
   - Reading progress tracking
   - Responsive mobile design

4. **Performance**
   - Search result caching
   - Pagination cho large datasets
   - CDN cho static assets

## 🐛 Known Issues

1. File loading phụ thuộc vào fetch API (cần server hoặc file:// protocol)
2. Large datasets có thể ảnh hưởng initial load time
3. AI API calls cần handle rate limiting
4. Vietnamese text processing có thể cần fine-tuning

## 🤝 Contributing

1. Thêm test cases cho search functionality
2. Optimize performance cho datasets lớn  
3. Enhance UI/UX cho mobile
4. Improve AI prompt engineering
5. Add more sophisticated NLP processing