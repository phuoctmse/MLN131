
import React, { useState, useCallback } from 'react';
import PresentationView from './components/PresentationView';
import EbookView from './components/EbookView';
import { Citation } from './types';

export enum View {
  Presentation = 'PRESENTATION',
  Ebook = 'EBOOK',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Presentation);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const handleNavigateToEbook = useCallback((citation: Citation) => {
    setActiveCitation(citation);
    setCurrentView(View.Ebook);
  }, []);


  const handleBackToPresentation = useCallback(() => {
    setActiveCitation(null);
    setCurrentView(View.Presentation);
  }, []);



  return (
    <div className="w-full h-screen bg-gray-900">
      {currentView === View.Presentation && (
        <PresentationView onNavigateToEbook={handleNavigateToEbook} />
      )}
      {currentView === View.Ebook && activeCitation && (
        <EbookView citation={activeCitation} onBack={handleBackToPresentation} />
      )}
    </div>
  );
};

export default App;
