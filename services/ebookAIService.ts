import EbookService from './ebookService';
import { EbookParagraph, Citation } from '../types';

export interface AISearchResult {
  paragraphs: EbookParagraph[];
  relevanceScore: number;
  context: string;
}

export interface TermLookupResult {
  definition: string;
  citations: Citation[];
  relatedParagraphs: EbookParagraph[];
}

class EbookAIService {
  private static instance: EbookAIService;
  private ebookService: EbookService;

  private constructor() {
    this.ebookService = EbookService.getInstance();
  }

  static getInstance(): EbookAIService {
    if (!EbookAIService.instance) {
      EbookAIService.instance = new EbookAIService();
    }
    return EbookAIService.instance;
  }

  /**
   * Search for relevant paragraphs based on a query
   * This method provides structured data for AI to process
   */
  async searchForAI(query: string, maxResults: number = 10): Promise<AISearchResult> {
    const paragraphs = await this.ebookService.searchParagraphs(query);
    const limitedParagraphs = paragraphs.slice(0, maxResults);
    
    // Calculate relevance score based on how many query terms match
    const queryTerms = query.toLowerCase().split(/\s+/);
    const relevanceScore = this.calculateRelevanceScore(limitedParagraphs, queryTerms);
    
    // Generate context summary
    const context = await this.generateContextSummary(limitedParagraphs);
    
    return {
      paragraphs: limitedParagraphs,
      relevanceScore,
      context
    };
  }

  /**
   * Look up a specific term and get definition with citations
   */
  async lookupTerm(term: string): Promise<TermLookupResult> {
    const paragraphs = await this.ebookService.searchParagraphs(term);
    
    // Get the most relevant paragraphs (first few that contain the term)
    const relevantParagraphs = paragraphs.slice(0, 5);
    
    // Generate citations
    const citations: Citation[] = [];
    for (const paragraph of relevantParagraphs) {
      const citation = await this.generateCitation(paragraph);
      if (citation) {
        citations.push(citation);
      }
    }
    
    // Extract definition (first paragraph that seems to define the term)
    const definition = this.extractDefinition(term, relevantParagraphs);
    
    return {
      definition,
      citations,
      relatedParagraphs: relevantParagraphs
    };
  }

  /**
   * Get structured data for a specific paragraph (for AI context)
   */
  async getParagraphForAI(paragraphId: string): Promise<{
    paragraph: EbookParagraph | null;
    context: EbookParagraph[];
    metadata: any;
  }> {
    const paragraph = await this.ebookService.getParagraphById(paragraphId);
    const context = await this.ebookService.getParagraphContext(paragraphId, 3);
    
    let metadata = {};
    if (paragraph) {
      const chapter = await this.ebookService.getChapterById(paragraph.chapterId);
      const heading = await this.ebookService.getHeadingById(paragraph.headingId);
      
      metadata = {
        chapter: chapter ? { title: chapter.title, order: chapter.order } : null,
        heading: heading ? { title: heading.title, order: heading.order } : null,
        position: {
          chapterId: paragraph.chapterId,
          headingId: paragraph.headingId,
          paragraphIndex: paragraph.pIndex
        }
      };
    }
    
    return {
      paragraph,
      context,
      metadata
    };
  }

  /**
   * Generate a citation object from a paragraph
   */
  private async generateCitation(paragraph: EbookParagraph): Promise<Citation | null> {
    try {
      const chapter = await this.ebookService.getChapterById(paragraph.chapterId);
      const heading = await this.ebookService.getHeadingById(paragraph.headingId);
      
      return {
        // source: 'Chủ nghĩa xã hội khoa học', // Removed as requested
        chapter: chapter ? chapter.order : 0,
        section: heading ? heading.title : 'Unknown Section',
        page: 0, // Page numbers might need to be calculated differently
        paragraphId: this.ebookService.getParagraphId(paragraph)
      };
    } catch {
      return null;
    }
  }

  /**
   * Calculate relevance score based on term matches
   */
  private calculateRelevanceScore(paragraphs: EbookParagraph[], queryTerms: string[]): number {
    if (paragraphs.length === 0) return 0;
    
    let totalMatches = 0;
    let totalWords = 0;
    
    paragraphs.forEach(paragraph => {
      const words = paragraph.text.toLowerCase().split(/\s+/);
      totalWords += words.length;
      
      queryTerms.forEach(term => {
        const matches = words.filter(word => word.includes(term)).length;
        totalMatches += matches;
      });
    });
    
    return totalWords > 0 ? (totalMatches / totalWords) * 100 : 0;
  }

  /**
   * Generate a context summary from paragraphs
   */
  private async generateContextSummary(paragraphs: EbookParagraph[]): Promise<string> {
    if (paragraphs.length === 0) return '';
    
    const summaryPoints: string[] = [];
    const chapterIds = new Set<string>();
    
    paragraphs.forEach(p => chapterIds.add(p.chapterId));
    
    for (const chapterId of chapterIds) {
      const chapter = await this.ebookService.getChapterById(chapterId);
      if (chapter) {
        summaryPoints.push(`${chapter.title}`);
      }
    }
    
    return `Tìm thấy ${paragraphs.length} đoạn văn liên quan từ các chương: ${summaryPoints.join(', ')}`;
  }

  /**
   * Extract definition for a term from paragraphs
   */
  private extractDefinition(term: string, paragraphs: EbookParagraph[]): string {
    // Look for paragraphs that seem to define the term
    // This is a simple heuristic - could be improved with NLP
    const definitionKeywords = ['là', 'được hiểu', 'được định nghĩa', 'có nghĩa', 'nghĩa là'];
    
    for (const paragraph of paragraphs) {
      const text = paragraph.text.toLowerCase();
      const termLower = term.toLowerCase();
      
      if (text.includes(termLower)) {
        // Check if this paragraph contains definition patterns
        for (const keyword of definitionKeywords) {
          if (text.includes(keyword)) {
            // Return the first sentence that contains the term and definition keyword
            const sentences = paragraph.text.split(/[.!?]/);
            for (const sentence of sentences) {
              if (sentence.toLowerCase().includes(termLower) && 
                  sentence.toLowerCase().includes(keyword)) {
                return sentence.trim();
              }
            }
          }
        }
      }
    }
    
    // Fallback: return the first paragraph that contains the term
    const firstMatch = paragraphs.find(p => 
      p.text.toLowerCase().includes(term.toLowerCase())
    );
    
    return firstMatch ? firstMatch.text : 'Không tìm thấy định nghĩa';
  }

  /**
   * Get all available terms for autocomplete/suggestion
   */
  async getAllTerms(): Promise<string[]> {
    const index = await this.ebookService.buildSearchIndex();
    return Array.from(index.termIndex.keys())
      .filter(term => term.length > 3) // Filter out very short terms
      .sort();
  }

  /**
   * Get chapter and heading structure for navigation
   */
  async getBookStructure() {
    const toc = await this.ebookService.getTOC();
    const index = await this.ebookService.buildSearchIndex();
    
    return {
      chapters: toc.chapters.map(chapter => ({
        ...chapter,
        paragraphCount: Array.from(index.paragraphs.values())
          .filter(p => p.chapterId === chapter.chapterId).length
      }))
    };
  }

  /**
   * Public method to get paragraph ID
   */
  getParagraphId(paragraph: EbookParagraph): string {
    return this.ebookService.getParagraphId(paragraph);
  }

  /**
   * Public method to get chapter by ID
   */
  async getChapterById(chapterId: string) {
    return this.ebookService.getChapterById(chapterId);
  }

  /**
   * Public method to get heading by ID
   */
  async getHeadingById(headingId: string) {
    return this.ebookService.getHeadingById(headingId);
  }
}

export default EbookAIService;