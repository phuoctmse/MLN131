
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TermExplanation } from '../types';
import EbookAIService from './ebookAIService';

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTermExplanation = async (term: string, followUpQuestion?: string): Promise<TermExplanation | null> => {
  console.log(`Searching for term: ${term}`);

  const ebookAIService = EbookAIService.getInstance();
  
  try {
    // Search for relevant content using our ebook service
    const searchResult = await ebookAIService.searchForAI(term, 5);
    
    if (searchResult.paragraphs.length === 0) {
      return null;
    }

    // Get the most relevant paragraph for context
    const contextParagraph = searchResult.paragraphs[0];
    
    // Build context from multiple relevant paragraphs
    const contextTexts = searchResult.paragraphs
      .slice(0, 3)
      .map(p => p.text)
      .join('\n\n');

    // Build a comprehensive prompt for Gemini with RAG context
    const prompt = `
      Bạn là một chuyên gia về Chủ nghĩa xã hội khoa học. Dựa vào các đoạn văn sau từ giáo trình:

      ${contextTexts}

      Hãy giải thích thuật ngữ "${term}" một cách ngắn gọn, rõ ràng và chính xác theo nội dung giáo trình.
      
      ${followUpQuestion ? `Đồng thời trả lời câu hỏi sau: "${followUpQuestion}"` : ''}
      
      Yêu cầu:
      - Giải thích phải dựa trên nội dung giáo trình đã cung cấp
      - Sử dụng ngôn ngữ học thuật phù hợp
      - Nếu thuật ngữ có nhiều nghĩa, hãy giải thích theo ngữ cảnh của chủ nghĩa xã hội khoa học
      - Giới hạn trong 2-3 câu cho định nghĩa chính
    `;

    // Call Gemini API
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const explanationText = response.text;

    if (!explanationText) {
      console.error("Gemini API returned no text.");
      return null;
    }

    // Generate citation from the most relevant paragraph
    const paragraphId = ebookAIService.getParagraphId(contextParagraph);
    const chapter = await ebookAIService.getChapterById(contextParagraph.chapterId);
    const heading = await ebookAIService.getHeadingById(contextParagraph.headingId);
    
    return {
      term: term,
      explanation: explanationText,
      citation: {
        source: 'Chủ nghĩa xã hội khoa học',
        chapter: chapter ? chapter.order : 0,
        section: heading ? heading.title : 'Unknown Section',
        page: 0, // Page numbers would need to be calculated
        paragraphId: paragraphId,
      },
    };
  } catch (error) {
    console.error("Error in getTermExplanation:", error);
    return null;
  }
};

// New function to get AI-powered answers with ebook context
export const getAIAnswerWithContext = async (question: string): Promise<{
  answer: string;
  sources: any[];
  relevanceScore: number;
} | null> => {
  const ebookAIService = EbookAIService.getInstance();
  
  try {
    const searchResult = await ebookAIService.searchForAI(question, 8);
    
    if (searchResult.paragraphs.length === 0) {
      return null;
    }

    const contextTexts = searchResult.paragraphs
      .map((p, index) => `[Đoạn ${index + 1}]: ${p.text}`)
      .join('\n\n');

    const prompt = `
      Bạn là một giảng viên chuyên về Chủ nghĩa xã hội khoa học. Dựa vào nội dung giáo trình sau:

      ${contextTexts}

      Hãy trả lời câu hỏi: "${question}"

      Yêu cầu:
      - Trả lời dựa hoàn toàn trên nội dung giáo trình đã cung cấp
      - Trình bày logic, có cấu trúc rõ ràng
      - Sử dụng ngôn ngữ học thuật phù hợp
      - Nếu câu hỏi không thể trả lời từ nội dung đã cho, hãy nói rõ
      - Trích dẫn cụ thể từ các đoạn văn khi cần thiết
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const answer = response.text;

    if (!answer) {
      return null;
    }

    // Prepare sources information
    const sources = searchResult.paragraphs.map(async (p) => {
      const chapter = await ebookAIService.getChapterById(p.chapterId);
      const heading = await ebookAIService.getHeadingById(p.headingId);
      
      return {
        paragraphId: ebookAIService.getParagraphId(p),
        chapterTitle: chapter ? chapter.title : 'Unknown Chapter',
        headingTitle: heading ? heading.title : 'Unknown Section',
        text: p.text.substring(0, 200) + '...' // Truncated preview
      };
    });

    const resolvedSources = await Promise.all(sources);

    return {
      answer,
      sources: resolvedSources,
      relevanceScore: searchResult.relevanceScore
    };
  } catch (error) {
    console.error("Error in getAIAnswerWithContext:", error);
    return null;
  }
};
