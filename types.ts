
export interface SlideContent {
  id: number;
  title: string;
  content: string[];
  keyTerms: string[];
}

export interface Citation {
  source?: string;
  chapter: number;
  section: string;
  page: number;
  paragraphId: string;
}

export interface TermExplanation {
  term: string;
  explanation: string;
  interactiveQuestion?: string;
  citationText?: string;
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

// Ebook Data Types
export interface EbookParagraph {
  chapterId: string;
  headingId: string;
  pIndex: number;
  text: string;
}

export interface EbookChunk {
  chunkId: string;
  chapterId: string;
  headingId: string;
  pStart: number;
  pEnd: number;
  text: string;
}

export interface EbookHeading {
  headingId: string;
  title: string;
  order: number;
}

export interface EbookChapter {
  chapterId: string;
  title: string;
  order: number;
  headings: EbookHeading[];
}

export interface EbookTOC {
  chapters: EbookChapter[];
}

// Search and Index Types
export interface SearchIndex {
  paragraphs: Map<string, EbookParagraph>;
  chunks: Map<string, EbookChunk>;
  chapterMap: Map<string, EbookChapter>;
  headingMap: Map<string, EbookHeading>;
  termIndex: Map<string, string[]>; // term -> paragraph IDs
}
