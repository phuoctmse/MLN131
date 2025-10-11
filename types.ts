// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_BACKEND: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface SlideContent {
  id: number;
  title: string;
  content: Array<string | SlidePoint>;
  icon?: string;
  image?: string;
}

export interface SlidePoint {
  text: string;
  highlight?: boolean;
  subPoints?: string[];
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
  followUps?: Array<{
    label: string;
    question: string;
  }>;
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

export interface BackendChatResponse {
  intent: string;
  content: string;
  status: string;
  references: Array<{
    label: string;
    chapter: string;
    headingId: string;
    pIndex: number;
    url: string;
  }>;
  follow_ups: Array<{
    label: string;
    question: string;
  }>;
  note: string;
}
