// Export all ebook-related services and utilities
export { default as EbookService } from './services/ebookService';
export { default as EbookAIService } from './services/ebookAIService';
export { getTermExplanation } from './services/geminiService';

// Export ebook components
export { default as EbookView } from './components/EbookView';
export { default as EbookSearch } from './components/EbookSearch';


// Re-export types
export * from './types';