
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TermExplanation } from '../types';
import { textbookContent } from '../data/textbook';

// Fix: Initialize the Google Gemini AI client according to the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const getTermExplanation = async (term: string, followUpQuestion?: string): Promise<TermExplanation | null> => {
  console.log(`Searching for term: ${term}`);

  const normalizedTerm = term.toLowerCase();
  const relevantParagraphs = textbookContent.filter(p => p.text.toLowerCase().includes(normalizedTerm));

  if (relevantParagraphs.length === 0) {
    return null;
  }

  // In a real app, you'd pick the best paragraph or combine them. Here, we'll just use the first one.
  const contextParagraph = relevantParagraphs[0];

  // Build a prompt for Gemini with RAG context
  const prompt = `
    Dựa vào đoạn văn sau từ giáo trình:
    "${contextParagraph.text}"

    Hãy giải thích ngắn gọn thuật ngữ "${term}".
    ${followUpQuestion ? `Và trả lời câu hỏi sau: "${followUpQuestion}"` : ''}
  `;

  try {
    // Fix: Replace mock API call with a real call to the Gemini API.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Fix: Extract text from the response using the .text property as per guidelines.
    const explanationText = response.text;

    if(!explanationText) {
        console.error("Gemini API returned no text.");
        return null;
    }
    
    return {
      term: term,
      explanation: explanationText,
      citation: {
        source: 'Giáo trình Chủ nghĩa xã hội khoa học',
        chapter: contextParagraph.chapter,
        section: contextParagraph.section,
        page: contextParagraph.page,
        paragraphId: contextParagraph.id,
      },
    };
  } catch (error) {
    console.error("Error calling Gemini API", error);
    return null;
  }
};
