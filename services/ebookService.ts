import { EbookParagraph, EbookChunk, EbookTOC, SearchIndex } from '../types';

class EbookService {
  private static instance: EbookService;
  private searchIndex: SearchIndex | null = null;
  private ebookTOC: EbookTOC | null = null;

  private constructor() {}

  static getInstance(): EbookService {
    if (!EbookService.instance) {
      EbookService.instance = new EbookService();
    }
    return EbookService.instance;
  }

  // Load and parse ebook paragraphs from file
  async loadParagraphs(): Promise<EbookParagraph[]> {
    try {
      const response = await fetch('/data/ebook_paragraphs.txt');
      const text = await response.text();
      return text
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line) as EbookParagraph);
    } catch (error) {
      console.error('Error loading ebook paragraphs:', error);
      return [];
    }
  }

  // Load and parse ebook chunks from file
  async loadChunks(): Promise<EbookChunk[]> {
    try {
      const response = await fetch('/data/ebook_chunks.txt');
      const text = await response.text();
      return text
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line) as EbookChunk);
    } catch (error) {
      console.error('Error loading ebook chunks:', error);
      return [];
    }
  }

  // Get table of contents
  async getTOC(): Promise<EbookTOC> {
    if (this.ebookTOC) {
      return this.ebookTOC;
    }
    
    try {
      const response = await fetch('/ebook_toc.json');
      if (!response.ok) {
        throw new Error('Failed to load ebook TOC');
      }
      this.ebookTOC = await response.json();
      return this.ebookTOC as EbookTOC;
    } catch (error) {
      console.error('Error loading ebook TOC:', error);
      throw error;
    }
  }

  // Build search index for fast lookups
  async buildSearchIndex(): Promise<SearchIndex> {
    if (this.searchIndex) {
      return this.searchIndex;
    }

    const paragraphs = await this.loadParagraphs();
    const chunks = await this.loadChunks();
    const toc = await this.getTOC();

    const searchIndex: SearchIndex = {
      paragraphs: new Map(),
      chunks: new Map(),
      chapterMap: new Map(),
      headingMap: new Map(),
      termIndex: new Map()
    };

    // Index paragraphs
    paragraphs.forEach(paragraph => {
      const paragraphId = this.getParagraphId(paragraph);
      searchIndex.paragraphs.set(paragraphId, paragraph);
      
      // Build term index for search
      this.indexTerms(paragraph.text, paragraphId, searchIndex.termIndex);
    });

    // Index chunks
    chunks.forEach(chunk => {
      searchIndex.chunks.set(chunk.chunkId, chunk);
    });

    // Index chapters and headings
    toc.chapters.forEach(chapter => {
      searchIndex.chapterMap.set(chapter.chapterId, chapter);
      chapter.headings.forEach(heading => {
        searchIndex.headingMap.set(heading.headingId, heading);
      });
    });

    this.searchIndex = searchIndex;
    return searchIndex;
  }

  // Generate unique paragraph ID
  getParagraphId(paragraph: EbookParagraph): string {
    return `${paragraph.chapterId}_${paragraph.headingId}_${paragraph.pIndex}`;
  }

  // Index terms for search functionality
  private indexTerms(text: string, paragraphId: string, termIndex: Map<string, string[]>): void {
    // Simple word extraction and indexing
    const words = text
      .toLowerCase()
      .replace(/[^\w\sÀ-ỹ]/g, ' ') // Keep Vietnamese characters
      .split(/\s+/)
      .filter(word => word.length > 2); // Skip very short words

    words.forEach(word => {
      if (!termIndex.has(word)) {
        termIndex.set(word, []);
      }
      const paragraphIds = termIndex.get(word)!;
      if (!paragraphIds.includes(paragraphId)) {
        paragraphIds.push(paragraphId);
      }
    });
  }

  // Search paragraphs by term
  async searchParagraphs(query: string): Promise<EbookParagraph[]> {
    const index = await this.buildSearchIndex();
    const searchTerms = query
      .toLowerCase()
      .replace(/[^\w\sÀ-ỹ]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2);

    const matchingParagraphIds = new Set<string>();

    searchTerms.forEach(term => {
      const paragraphIds = index.termIndex.get(term);
      if (paragraphIds) {
        paragraphIds.forEach(id => matchingParagraphIds.add(id));
      }
    });

    return Array.from(matchingParagraphIds)
      .map(id => index.paragraphs.get(id))
      .filter((paragraph): paragraph is EbookParagraph => paragraph !== undefined)
      .sort((a, b) => {
        // Sort by chapter order, then heading order, then paragraph index
        const chapterA = index.chapterMap.get(a.chapterId);
        const chapterB = index.chapterMap.get(b.chapterId);
        
        if (chapterA && chapterB) {
          if (chapterA.order !== chapterB.order) {
            return chapterA.order - chapterB.order;
          }
        }
        
        const headingA = index.headingMap.get(a.headingId);
        const headingB = index.headingMap.get(b.headingId);
        
        if (headingA && headingB) {
          if (headingA.order !== headingB.order) {
            return headingA.order - headingB.order;
          }
        }
        
        return a.pIndex - b.pIndex;
      });
  }

  // Get paragraph by ID
  async getParagraphById(paragraphId: string): Promise<EbookParagraph | null> {
    const index = await this.buildSearchIndex();
    return index.paragraphs.get(paragraphId) || null;
  }

  // Get chapter info
  async getChapterById(chapterId: string): Promise<any> {
    const index = await this.buildSearchIndex();
    return index.chapterMap.get(chapterId) || null;
  }

  // Get heading info
  async getHeadingById(headingId: string): Promise<any> {
    const index = await this.buildSearchIndex();
    return index.headingMap.get(headingId) || null;
  }

  // Get all paragraphs for display
  async getAllParagraphs(): Promise<EbookParagraph[]> {
    const index = await this.buildSearchIndex();
    return Array.from(index.paragraphs.values())
      .sort((a, b) => {
        // Sort by chapter order, then heading order, then paragraph index
        const chapterA = index.chapterMap.get(a.chapterId);
        const chapterB = index.chapterMap.get(b.chapterId);
        
        if (chapterA && chapterB) {
          if (chapterA.order !== chapterB.order) {
            return chapterA.order - chapterB.order;
          }
        }
        
        const headingA = index.headingMap.get(a.headingId);
        const headingB = index.headingMap.get(b.headingId);
        
        if (headingA && headingB) {
          if (headingA.order !== headingB.order) {
            return headingA.order - headingB.order;
          }
        }
        
        return a.pIndex - b.pIndex;
      });
  }

  // Get context around a specific paragraph (for AI)
  async getParagraphContext(paragraphId: string, contextSize: number = 2): Promise<EbookParagraph[]> {
    const allParagraphs = await this.getAllParagraphs();
    const targetIndex = allParagraphs.findIndex(p => this.getParagraphId(p) === paragraphId);
    
    if (targetIndex === -1) return [];

    const start = Math.max(0, targetIndex - contextSize);
    const end = Math.min(allParagraphs.length, targetIndex + contextSize + 1);
    
    return allParagraphs.slice(start, end);
  }
}

export default EbookService;