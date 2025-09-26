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
import { TermExplanation, BackendChatResponse } from '../types';

// Ebook TOC types
interface EbookHeading {
  headingId: string;
  title: string;
  order: number;
}

interface EbookChapter {
  chapterId: string;
  title: string;
  order: number;
  headings: EbookHeading[];
}

interface EbookTOC {
  chapters: EbookChapter[];
}

// Load ebook TOC
let ebookTOC: EbookTOC | null = null;

const loadEbookTOC = async (): Promise<EbookTOC> => {
  if (ebookTOC) return ebookTOC;
  
  try {
    const response = await fetch('/data/ebook_toc.json');
    ebookTOC = await response.json();
    return ebookTOC;
  } catch (error) {
    console.error('Error loading ebook TOC:', error);
    return { chapters: [] };
  }
};

// Get heading title by headingId
export const getHeadingTitle = async (headingId: string): Promise<string> => {
  const toc = await loadEbookTOC();
  for (const chapter of toc.chapters) {
    const heading = chapter.headings.find(h => h.headingId === headingId);
    if (heading) {
      return heading.title;
    }
  }
  return headingId; // fallback
};

// Create paragraph ID from headingId and pIndex
export const createParagraphId = (headingId: string, pIndex: number): string => {
  return `${headingId}_p${pIndex}`;
};

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
    const query = followUpQuestion || term;
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        context_hint: null,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BackendChatResponse = await response.json();

    if (data.status !== 'ok') {
      return null;
    }

    // Map backend response to TermExplanation
    const citation = data.references.length > 0 ? {
      chapter: parseInt(data.references[0].chapter) || 0,
      section: data.references[0].headingId,
      page: data.references[0].pIndex,
      paragraphId: data.references[0].url,
    } : {
      chapter: 6,
      section: 'Vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội',
      page: 0,
      paragraphId: 'chap_6275cc3e02028042',
    };

    return {
      term: term,
      explanation: data.content,
      interactiveQuestion: data.follow_ups.length > 0 ? data.follow_ups[0].question : undefined,
      citationText: data.note,
      citation: citation,
    };
  } catch (error) {
    console.error("Error in getTermExplanation:", error);
    return null;
  }
};

// New function to get AI-powered answers with chapter context
export const getBackendChatResponse = async (query: string): Promise<BackendChatResponse | null> => {
  // Mock response for testing
  if (query.includes("Hai xu hướng khách quan") || query.includes("dân tộc") || query.includes("tôn giáo")) {
    return {
      status: "ok",
      intent: "COURSE_TERM_CH6",
      content: "Chào bạn, mình xin giải thích về vấn đề dân tộc và tôn giáo ở Việt Nam dựa trên ngữ cảnh bạn cung cấp nhé. \n\nTrong bối cảnh thế giới có xu hướng xung đột dân tộc, tôn giáo, Việt Nam, ngoại trừ giai đoạn bị Pháp và Mỹ lợi dụng tôn giáo, nhìn chung đã giải quyết mối quan hệ dân tộc và tôn giáo khá tốt dưới sự lãnh đạo của Đảng Cộng sản Việt Nam. Tuy nhiên, vẫn có những mâu thuẫn cần nhận diện và giải quyết khách quan để phát huy các giá trị tốt đẹp, góp phần làm phong phú văn hóa Việt Nam và đảm bảo ổn định chính trị quốc gia.\n\nĐể giải quyết tốt mối quan hệ này, cần tuân thủ nguyên tắc đặt trong mối quan hệ với cộng đồng quốc gia – dân tộc thống nhất theo định hướng xã hội chủ nghĩa, đảm bảo quyền tự do tín ngưỡng, tôn giáo và quyền của các dân tộc thiểu số. Đồng thời, phải kiên quyết đấu tranh chống việc lợi dụng vấn đề dân tộc, tôn giáo vào mục đích chính trị, đặc biệt là âm mưu \"diễn biến hòa bình\" của các thế lực thù địch, nhất là ở các khu vực trọng điểm như Tây Bắc, Tây Nguyên, Tây Nam Bộ và Tây duyên hải miền Trung.",
      references: [
        {
          label: "Ch6 • head_94548… • p2",
          chapter: "6",
          headingId: "head_945489d75df40749",
          pIndex: 2,
          url: "ebook_chapter_chap_4b6b984589dd283e.html"
        },
        {
          label: "Ch6 • head_185b7… • p4",
          chapter: "6",
          headingId: "head_185b750c16e142f4",
          pIndex: 4,
          url: "ebook_chapter_chap_4b6b984589dd283e.html"
        },
        {
          label: "Ch6 • head_185b7… • p5",
          chapter: "6",
          headingId: "head_185b750c16e142f4",
          pIndex: 5,
          url: "ebook_chapter_chap_4b6b984589dd283e.html"
        }
      ],
      follow_ups: [
        {
          label: "Những giá trị tốt đẹp của dân tộc và tôn giáo được phát huy như thế nào?",
          question: "Những giá trị tốt đẹp của dân tộc và tôn giáo được phát huy như thế nào?"
        },
        {
          label: "Các thế lực thù địch thường lợi dụng vấn đề dân tộc và tôn giáo như thế nào?",
          question: "Các thế lực thù địch thường lợi dụng vấn đề dân tộc và tôn giáo như thế nào?"
        }
      ],
      note: "Nguồn: trích dẫn trực tiếp từ Chapter 6"
    };
  }

  // For other queries, try to call real backend
  try {
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        context_hint: null,
      }),
    });

    if (!response.ok) {
      console.error('Backend API error:', response.statusText);
      return null;
    }

    const backendResponse: BackendChatResponse = await response.json();
    return backendResponse;
  } catch (error) {
    console.error("Error in getBackendChatResponse:", error);
    return null;
  }
};
