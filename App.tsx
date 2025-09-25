
import React, { useState, useCallback } from 'react';
import PresentationView from './components/PresentationView';
import EbookView from './components/EbookView';
import PDFViewer from './components/PDFViewer';
import { Citation } from './types';

export enum View {
  Presentation = 'PRESENTATION',
  Ebook = 'EBOOK',
  PDF = 'PDF',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.PDF);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const handleNavigateToEbook = useCallback((citation: Citation) => {
    setActiveCitation(citation);
    setCurrentView(View.Ebook);
  }, []);

  const handleNavigateToPDF = useCallback(() => {
    setCurrentView(View.PDF);
  }, []);


  const handleBackToPresentation = useCallback(() => {
    setActiveCitation(null);
    setCurrentView(View.Presentation);
  }, []);



  return (
    <div className="w-full h-screen bg-gray-900">
      {currentView === View.Presentation && (
        <PresentationView 
          onNavigateToEbook={handleNavigateToEbook} 
          onNavigateToPDF={handleNavigateToPDF}
        />
      )}
      {/* Tạm thời ẩn EbookView để tập trung vào PDF */}
      {/* {currentView === View.Ebook && activeCitation && (
        <EbookView citation={activeCitation} onBack={handleBackToPresentation} />
      )} */}
      {currentView === View.PDF && (
        <PDFViewer 
          pdfUrl="/ebook/giao-trinh-chu-nghia-xa-hoi-khoa-hoc-2021_compressed.pdf"
          onBack={handleBackToPresentation}
        />
      )}
    </div>
  );
};

export default App;
