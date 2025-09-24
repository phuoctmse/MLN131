
export interface SlideContent {
  id: number;
  title: string;
  content: string[];
  keyTerms: string[];
}

export interface Citation {
  source: string;
  chapter: number;
  section: string;
  page: number;
  paragraphId: string;
}

export interface TermExplanation {
  term: string;
  explanation: string;
  citation: Citation;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface TextbookParagraph {
  id: string;
  chapter: number;
  section: string;
  page: number;
  text: string;
}
