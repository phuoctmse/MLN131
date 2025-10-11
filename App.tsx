
import React, { useState, useCallback } from 'react';
import PresentationView from './components/PresentationView';
import SmartLookupPopup from './components/SmartLookupPopup';
import EbookView from './components/EbookView';
import EbookHTMLViewer from './components/EbookHTMLViewer';
import IntroSequence from './components/IntroSequence';
import RoadmapView from './components/RoadmapView';
import VisitorCounter from './components/VisitorCounter';
import TotalVisits from './components/TotalVisits';
import { useIsMobile } from './hooks/useIsMobile';
import { Citation } from './types';

export enum View {
  Intro = 'INTRO',
  Roadmap = 'ROADMAP',
  Presentation = 'PRESENTATION',
  Ebook = 'EBOOK',
  HTML_EBOOK = 'HTML_EBOOK',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Intro);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [highlightParagraphId, setHighlightParagraphId] = useState<string | undefined>(undefined);
  const [showChat, setShowChat] = useState(false);
  const [chatTerm, setChatTerm] = useState<string | null>(null);
  const [currentSlideId, setCurrentSlideId] = useState<number>(1);
  const isMobile = useIsMobile(768);

  const handleIntroComplete = useCallback(() => {
    setCurrentView(View.Roadmap);
  }, []);

  const handleSelectSlide = useCallback((slideId: number) => {
    setCurrentSlideId(slideId);
    setCurrentView(View.Presentation);
  }, []);

  const handleStartPresentation = useCallback(() => {
    setCurrentSlideId(1);
    setCurrentView(View.Presentation);
  }, []);

  const handleShowRoadmap = useCallback(() => {
    setCurrentView(View.Roadmap);
  }, []);

  const handlePresentationSlideChange = useCallback((slideId: number) => {
    setCurrentSlideId(slideId);
  }, []);

  const handleShowIntro = useCallback(() => {
    setCurrentView(View.Intro);
  }, []);

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
      {currentView === View.Intro && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}
      
      {currentView === View.Roadmap && (
        <RoadmapView 
          onSelectSlide={handleSelectSlide}
          onStartPresentation={handleStartPresentation}
          currentSlide={currentSlideId}
        />
      )}
      
      {currentView === View.Presentation && (
        <PresentationView 
          onNavigateToEbook={handleNavigateToEbook} 
          onNavigateToPDF={handleNavigateToHTMLEbook}
          onOpenChat={handleOpenChat}
          onShowRoadmap={handleShowRoadmap}
          onShowIntro={handleShowIntro}
          initialSlideId={currentSlideId}
          onSlideChange={handlePresentationSlideChange}
        />
      )}
      
      {currentView === View.Ebook && activeCitation && (
        <EbookView citation={activeCitation} onBack={handleBackToPresentation} />
      )}
      
      {currentView === View.HTML_EBOOK && (
        <EbookHTMLViewer onBack={handleBackToPresentation} highlightParagraphId={highlightParagraphId} onOpenChat={handleOpenChat} />
      )}
      {/* Global SmartLookupPopup - Only show on desktop */}
      {!isMobile && (
        <SmartLookupPopup
          term={chatTerm}
          isVisible={showChat}
          onClose={handleCloseChat}
          onNavigateToEbook={handleNavigateToEbook}
          onNavigateToHTMLParagraph={handleNavigateToHTMLEbook}
        />
      )}
      
      {/* Visitor Counter */}
      <VisitorCounter 
        position="bottom-left"
        theme="gradient"
        showIcon={true}
        animated={true}
      />
    </div>
  );
};

export default App;
