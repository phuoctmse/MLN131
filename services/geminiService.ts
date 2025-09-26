// List of all valid paragraph IDs extracted from ebook_chapter_chap_4b6b984589dd283e.html
const VALID_PARAGRAPH_IDS = [
  "head_ab2d72dce28ef703_p0",
  "head_ab2d72dce28ef703_p1",
  "head_ab2d72dce28ef703_p2",
  "head_193869c4f4895660_p0",
  "head_193869c4f4895660_p1",
  "head_193869c4f4895660_p2",
  "head_193869c4f4895660_p3",
  "head_193869c4f4895660_p4",
  "head_193869c4f4895660_p5",
  "head_193869c4f4895660_p6",
  "head_193869c4f4895660_p7",
  "head_193869c4f4895660_p8",
  "head_193869c4f4895660_p9",
  "head_193869c4f4895660_p10",
  "head_193869c4f4895660_p11",
  "head_193869c4f4895660_p12",
  "head_193869c4f4895660_p13",
  "head_193869c4f4895660_p14",
  "head_193869c4f4895660_p15",
  "head_193869c4f4895660_p16",
  "head_193869c4f4895660_p17",
  "head_193869c4f4895660_p18",
  "head_193869c4f4895660_p19",
  "head_193869c4f4895660_p20",
  "head_193869c4f4895660_p21",
  "head_dc0b5148e2ead6e3_p0",
  "head_dc0b5148e2ead6e3_p1",
  "head_dc0b5148e2ead6e3_p2",
  "head_dc0b5148e2ead6e3_p3",
  "head_dc0b5148e2ead6e3_p4",
  "head_dc0b5148e2ead6e3_p5",
  "head_dc0b5148e2ead6e3_p6",
  "head_dc0b5148e2ead6e3_p7",
  "head_33c198fe6e1ce15b_p0",
  "head_33c198fe6e1ce15b_p1",
  "head_33c198fe6e1ce15b_p2",
  "head_33c198fe6e1ce15b_p3",
  "head_33c198fe6e1ce15b_p4",
  "head_33c198fe6e1ce15b_p5",
  "head_33c198fe6e1ce15b_p6",
  "head_33c198fe6e1ce15b_p7",
  "head_33c198fe6e1ce15b_p8",
  "head_33c198fe6e1ce15b_p9",
  "head_33c198fe6e1ce15b_p10",
  "head_33c198fe6e1ce15b_p11",
  "head_33c198fe6e1ce15b_p12",
  "head_e19c563cb7ddb363_p0",
  "head_e19c563cb7ddb363_p1",
  "head_e19c563cb7ddb363_p2",
  "head_e19c563cb7ddb363_p3",
  "head_e19c563cb7ddb363_p4",
  "head_e19c563cb7ddb363_p5",
  "head_e19c563cb7ddb363_p6",
  "head_e19c563cb7ddb363_p7",
  "head_e19c563cb7ddb363_p8",
  "head_e19c563cb7ddb363_p9",
  "head_e19c563cb7ddb363_p10",
  "head_e19c563cb7ddb363_p11",
  "head_e19c563cb7ddb363_p12",
  "head_e19c563cb7ddb363_p13",
  "head_194d4d4eda5a4735_p0",
  "head_194d4d4eda5a4735_p1",
  "head_194d4d4eda5a4735_p2",
  "head_194d4d4eda5a4735_p3",
  "head_194d4d4eda5a4735_p4",
  "head_194d4d4eda5a4735_p5",
  "head_194d4d4eda5a4735_p6",
  "head_1b751d2236050361_p0",
  "head_1b751d2236050361_p1",
  "head_1b751d2236050361_p2",
  "head_1b751d2236050361_p3",
  "head_1b751d2236050361_p4",
  "head_1b751d2236050361_p5",
  "head_1b751d2236050361_p6",
  "head_1b751d2236050361_p7",
  "head_1b751d2236050361_p8",
  "head_1b751d2236050361_p9",
  "head_1b751d2236050361_p10",
  "head_1b751d2236050361_p11",
  "head_1b751d2236050361_p12",
  "head_945489d75df40749_p0",
  "head_945489d75df40749_p1",
  "head_945489d75df40749_p2",
  "head_945489d75df40749_p3",
  "head_945489d75df40749_p4",
  "head_945489d75df40749_p5",
  "head_945489d75df40749_p6",
  "head_945489d75df40749_p7",
  "head_185b750c16e142f4_p0",
  "head_185b750c16e142f4_p1",
  "head_185b750c16e142f4_p2",
  "head_185b750c16e142f4_p3",
  "head_185b750c16e142f4_p4",
  "head_185b750c16e142f4_p5",
  "head_185b750c16e142f4_p6",
  "head_185b750c16e142f4_p7",
  "head_185b750c16e142f4_p8",
  "head_185b750c16e142f4_p9",
  "head_185b750c16e142f4_p10",
  "head_c0bdffb7328f4267_p0",
  "head_c0bdffb7328f4267_p1",
  "head_c0bdffb7328f4267_p2",
  "head_f2b3079c838d974b_p0",
  "head_f2b3079c838d974b_p1",
  "head_f2b3079c838d974b_p2"
];


import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TermExplanation } from '../types';

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Load content from the specific chapter file
const loadChapterContent = async (): Promise<string> => {
  try {
    const response = await fetch('/data/ebook_chapter_chap_4b6b984589dd283e.html');
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
