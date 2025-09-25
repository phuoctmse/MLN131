
import React, { useState, useCallback } from 'react';
import PresentationView from './components/PresentationView';
import SmartLookupPopup from './components/SmartLookupPopup';
import EbookView from './components/EbookView';
import EbookHTMLViewer from './components/EbookHTMLViewer';
import { Citation } from './types';

export enum View {
  Presentation = 'PRESENTATION',
  Ebook = 'EBOOK',
  HTML_EBOOK = 'HTML_EBOOK',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Presentation);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [highlightParagraphId, setHighlightParagraphId] = useState<string | undefined>(undefined);
  const [showChat, setShowChat] = useState(false);
  const [chatTerm, setChatTerm] = useState<string | null>(null);

  const handleNavigateToEbook = useCallback((citation: Citation) => {
    setActiveCitation(citation);
    setCurrentView(View.Ebook);
  }, []);


  const handleNavigateToHTMLEbook = useCallback((paragraphId?: string) => {
    setHighlightParagraphId(paragraphId);
    setCurrentView(View.HTML_EBOOK);
  }, []);



  const handleBackToPresentation = useCallback(() => {
    setActiveCitation(null);
    setHighlightParagraphId(undefined);
    setCurrentView(View.Presentation);
  }, []);



  // Global chat open handler
  const handleOpenChat = (term?: string) => {
    setShowChat(true);
    if (term) setChatTerm(term);
  };
  const handleCloseChat = () => {
    setShowChat(false);
    // Do not clear chatTerm, so popup can open empty if needed
  };

  return (
    <div className="w-full h-screen bg-gray-900">
      {currentView === View.Presentation && (
        <PresentationView 
          onNavigateToEbook={handleNavigateToEbook} 
          onNavigateToPDF={handleNavigateToHTMLEbook}
          onOpenChat={handleOpenChat}
        />
      )}
      {currentView === View.Ebook && activeCitation && (
        <EbookView citation={activeCitation} onBack={handleBackToPresentation} />
      )}
      {currentView === View.HTML_EBOOK && (
        <EbookHTMLViewer onBack={handleBackToPresentation} highlightParagraphId={highlightParagraphId} onOpenChat={handleOpenChat} />
      )}
      {/* Global SmartLookupPopup */}
      <SmartLookupPopup
        term={chatTerm}
        isVisible={showChat}
        onClose={handleCloseChat}
        onNavigateToEbook={handleNavigateToEbook}
        onNavigateToHTMLParagraph={handleNavigateToHTMLEbook}
      />
    </div>
  );
};

export default App;
