// List of all valid paragraph IDs extracted from ebook_chapter_chap_6275cc3e02028042.html
const VALID_PARAGRAPH_IDS = [
  'head_c93223eb16cc661e_p0',
  'head_c93223eb16cc661e_p1',
  'head_c93223eb16cc661e_p2',
  'head_9291fa817baba63f_p0',
  'head_9291fa817baba63f_p1',
  'head_9291fa817baba63f_p2',
  'head_9291fa817baba63f_p3',
  'head_9291fa817baba63f_p4',
  'head_9291fa817baba63f_p5',
  'head_9291fa817baba63f_p6',
  'head_9291fa817baba63f_p7',
  'head_9291fa817baba63f_p8',
  'head_9291fa817baba63f_p9',
  'head_9291fa817baba63f_p10',
  'head_9291fa817baba63f_p11',
  'head_9291fa817baba63f_p12',
  'head_9291fa817baba63f_p13',
  'head_9291fa817baba63f_p14',
  'head_9291fa817baba63f_p15',
  'head_9291fa817baba63f_p16',
  'head_9291fa817baba63f_p17',
  'head_9291fa817baba63f_p18',
  'head_9291fa817baba63f_p19',
  'head_9291fa817baba63f_p20',
  'head_9291fa817baba63f_p21',
  'head_094b210b1c454094_p0',
  'head_094b210b1c454094_p1',
  'head_094b210b1c454094_p2',
  'head_094b210b1c454094_p3',
  'head_094b210b1c454094_p4',
  'head_094b210b1c454094_p5',
  'head_094b210b1c454094_p6',
  'head_094b210b1c454094_p7',
  'head_2b7378e1fadc7b12_p0',
  'head_2b7378e1fadc7b12_p1',
  'head_2b7378e1fadc7b12_p2',
  'head_2b7378e1fadc7b12_p3',
  'head_2b7378e1fadc7b12_p4',
  'head_2b7378e1fadc7b12_p5',
  'head_2b7378e1fadc7b12_p6',
  'head_2b7378e1fadc7b12_p7',
  'head_2b7378e1fadc7b12_p8',
  'head_2b7378e1fadc7b12_p9',
  'head_2b7378e1fadc7b12_p10',
  'head_2b7378e1fadc7b12_p11',
  'head_2b7378e1fadc7b12_p12',
  'head_796a5e31136dcd96_p0',
  'head_796a5e31136dcd96_p1',
  'head_796a5e31136dcd96_p2',
  'head_796a5e31136dcd96_p3',
  'head_796a5e31136dcd96_p4',
  'head_796a5e31136dcd96_p5',
  'head_796a5e31136dcd96_p6',
  'head_796a5e31136dcd96_p7',
  'head_796a5e31136dcd96_p8',
  'head_796a5e31136dcd96_p9',
  'head_796a5e31136dcd96_p10',
  'head_796a5e31136dcd96_p11',
  'head_796a5e31136dcd96_p12',
  'head_796a5e31136dcd96_p13',
  'head_7763b181c9614ccc_p0',
  'head_7763b181c9614ccc_p1',
  'head_7763b181c9614ccc_p2',
  'head_7763b181c9614ccc_p3',
  'head_7763b181c9614ccc_p4',
  'head_7763b181c9614ccc_p5',
  'head_7763b181c9614ccc_p6',
  'head_92676cdd44c0dc42_p0',
  'head_92676cdd44c0dc42_p1',
  'head_92676cdd44c0dc42_p2',
  'head_92676cdd44c0dc42_p3',
  'head_92676cdd44c0dc42_p4',
  'head_92676cdd44c0dc42_p5',
  'head_92676cdd44c0dc42_p6',
  'head_92676cdd44c0dc42_p7',
  'head_92676cdd44c0dc42_p8',
  'head_92676cdd44c0dc42_p9',
  'head_92676cdd44c0dc42_p10',
  'head_92676cdd44c0dc42_p11',
  'head_92676cdd44c0dc42_p12',
  'head_827e75db8a579664_p0',
  'head_827e75db8a579664_p1',
  'head_827e75db8a579664_p2',
  'head_827e75db8a579664_p3',
  'head_827e75db8a579664_p4',
  'head_827e75db8a579664_p5',
  'head_827e75db8a579664_p6',
  'head_827e75db8a579664_p7',
  'head_250646785f571213_p0',
  'head_250646785f571213_p1',
  'head_250646785f571213_p2',
  'head_250646785f571213_p3',
  'head_250646785f571213_p4',
  'head_250646785f571213_p5',
  'head_250646785f571213_p6',
  'head_250646785f571213_p7',
  'head_250646785f571213_p8',
  'head_250646785f571213_p9',
  'head_250646785f571213_p10',
  'head_24ac5c77c6e0fe27_p0',
  'head_24ac5c77c6e0fe27_p1',
  'head_24ac5c77c6e0fe27_p2',
  'head_b953125ea5fa3319_p0',
  'head_b953125ea5fa3319_p1',
  'head_b953125ea5fa3319_p2',
];

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TermExplanation } from '../types';

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Load content from the specific chapter file
const loadChapterContent = async (): Promise<string> => {
  try {
    const response = await fetch('/data/ebook_chapter_chap_6275cc3e02028042.html');
    const htmlContent = await response.text();
    
    // Extract text content from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove HTML tags and get plain text
    const textContent = doc.body.textContent || doc.body.innerText || '';
    
    return textContent;
  } catch (error) {
    console.error('Error loading chapter content:', error);
    return '';
  }
};

export const getTermExplanation = async (term: string, followUpQuestion?: string): Promise<TermExplanation | null> => {
  console.log(`Searching for term: ${term}`);

  try {
    // Load the chapter content
    const chapterContent = await loadChapterContent();
    
    if (!chapterContent) {
      console.log('No chapter content available');
      return null;
    }

    // Check if the term exists in the content
    if (!chapterContent.toLowerCase().includes(term.toLowerCase())) {
      console.log(`Term "${term}" not found in chapter content`);
      return null;
    }

    // Build a comprehensive prompt for Gemini with the full chapter context and the list of valid paragraph IDs
    const prompt = `
      Bạn là một chuyên gia về Chủ nghĩa xã hội khoa học. Dựa vào nội dung Chương 6 "VẤN ĐỀ DÂN TỘC VÀ TÔN GIÁO TRONG THỜI KỲ QUÁ ĐỘ LÊN CHỦ NGHĨA XÃ HỘI" sau đây:

      ${chapterContent}

      Danh sách tất cả các paragraphId hợp lệ trong chương này (chỉ được chọn từ danh sách này, không được tự nghĩ hoặc đoán):
      ${VALID_PARAGRAPH_IDS.map((id) => `- ${id}`).join('\n')}

      1. Hãy tóm tắt ngắn gọn ý nghĩa của thuật ngữ "${term}" (2-3 câu).
      2. Nếu có, hãy tạo một câu hỏi tương tác ngắn để kiểm tra sự hiểu biết của người học về thuật ngữ này (ví dụ: "Bạn có thể lấy ví dụ về ...?" hoặc "Theo bạn, tại sao ... lại quan trọng trong ...?").
      3. Chỉ trả lời dựa trên nội dung chương 6.
      4. BẮT BUỘC phải chỉ ra đoạn trích dẫn liên quan nhất trong chương (ghi rõ paragraphId đúng với id đoạn trong danh sách trên). Nếu không xác định được đoạn cụ thể, hãy trả lời "Không thể xác định đoạn trích dẫn cụ thể trong chương 6, không thể trả lời." và KHÔNG trả lời gì thêm.
      5. Trả về kết quả theo định dạng JSON với các trường: summary, interactiveQuestion, citationText, paragraphId.
    `;

    // Call Gemini API
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text;
    if (!aiText) {
      console.error("Gemini API returned no text.");
      return null;
    }

    // Try to parse JSON from AI response
    let summary = '', interactiveQuestion = '', citationText = '', paragraphId = '';
    try {
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        const json = JSON.parse(match[0]);
        summary = json.summary || '';
        interactiveQuestion = json.interactiveQuestion || '';
        citationText = json.citationText || '';
        paragraphId = json.paragraphId || '';
      } else {
        summary = aiText;
      }
    } catch (e) {
      summary = aiText;
    }

    return {
      term: term,
      explanation: summary,
      interactiveQuestion,
      citationText,
      citation: {
        chapter: 6,
        section: 'Vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội',
        page: 0,
        paragraphId: paragraphId || 'chap_6275cc3e02028042',
      },
    };
  } catch (error) {
    console.error("Error in getTermExplanation:", error);
    return null;
  }
};

// New function to get AI-powered answers with chapter context
export const getAIAnswerWithContext = async (question: string): Promise<{
  summary: string;
  interactiveQuestion: string;
  citationText: string;
  paragraphId: string;
  relevanceScore: number;
} | null> => {
  
  try {
    // Load the chapter content
    const chapterContent = await loadChapterContent();
    
    if (!chapterContent) {
      console.log('No chapter content available');
      return null;
    }

    const prompt = `
      Bạn là một giảng viên chuyên về Chủ nghĩa xã hội khoa học. Dựa vào nội dung Chương 6 "VẤN ĐỀ DÂN TỘC VÀ TÔN GIÁO TRONG THỜI KỲ QUÁ ĐỘ LÊN CHỦ NGHĨA XÃ HỘI" sau đây:

      ${chapterContent}

      Danh sách tất cả các paragraphId hợp lệ trong chương này (chỉ được chọn từ danh sách này, không được tự nghĩ hoặc đoán):
      ${VALID_PARAGRAPH_IDS.map((id) => `- ${id}`).join('\n')}

      1. Hãy tóm tắt ngắn gọn câu trả lời cho câu hỏi: "${question}" (2-3 câu).
      2. Nếu có, hãy tạo một câu hỏi tương tác ngắn để kiểm tra sự hiểu biết của người học về chủ đề này.
      3. Chỉ trả lời dựa trên nội dung chương 6.
      4. BẮT BUỘC phải chỉ ra đoạn trích dẫn liên quan nhất trong chương (ghi rõ paragraphId đúng với id đoạn trong danh sách trên). Nếu không xác định được đoạn cụ thể, hãy trả lời "Không thể xác định đoạn trích dẫn cụ thể trong chương 6, không thể trả lời." và KHÔNG trả lời gì thêm.
      5. Trả về kết quả theo định dạng JSON với các trường: summary, interactiveQuestion, citationText, paragraphId.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const aiText = response.text;
    if (!aiText) {
      return null;
    }

    let summary = '', interactiveQuestion = '', citationText = '', paragraphId = '';
    try {
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        const json = JSON.parse(match[0]);
        summary = json.summary || '';
        interactiveQuestion = json.interactiveQuestion || '';
        citationText = json.citationText || '';
        paragraphId = json.paragraphId || '';
      } else {
        summary = aiText;
      }
    } catch (e) {
      summary = aiText;
    }


    return {
      summary,
      interactiveQuestion,
      citationText,
      paragraphId,
      relevanceScore: 1.0
    };
  } catch (error) {
    console.error("Error in getAIAnswerWithContext:", error);
    return null;
  }
};
