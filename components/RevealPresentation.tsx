import React, { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/serif.css";

import { slides } from "@/data/slides";

interface RevealPresentationProps {
  onSelectTerm?: (term: string) => void;
}

const RevealPresentation: React.FC<RevealPresentationProps> = ({
  onSelectTerm,
}) => {
  const deckRef = useRef<HTMLDivElement | null>(null);

  // Danh sách các slide ID được phép click để chat (có nội dung trong giáo trình)
  const allowedChatSlides = [1, 2, 4, 9]; // Giới thiệu, Đặc điểm, Cơ sở lý luận, Quan điểm Đảng

  useEffect(() => {
    if (!deckRef.current) return;

    // Add small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      if (!deckRef.current) return;

      // Use any to avoid typing friction with Reveal's constructor signature
      const deck = new (Reveal as any)(deckRef.current, {
        width: "100%",
        height: "100%",
        margin: window.innerWidth < 768 ? 0.02 : 0.06, // Smaller margin on mobile
        hash: true,
        slideNumber: true,
        keyboard: false, // Disable built-in keyboard navigation to prevent double navigation
        center: true, // Ensure slides are centered
        transition: "slide", // Smooth slide transition
        transitionSpeed: "default",
        backgroundTransition: "fade",
        initialSlide: 0, // Start from first slide
        plugins: [],
        // Mobile-specific configurations
        touch: true,
        loop: false,
        rtl: false,
        navigationMode: "default",
        shuffle: false,
        fragments: true,
        fragmentInURL: false,
        embedded: false,
        help: true,
        showNotes: false,
        autoPlayMedia: null,
        preloadIframes: null,
        autoAnimate: true,
        autoAnimateMatcher: null,
        autoAnimateEasing: "ease",
        autoAnimateDuration: 1.0,
        autoAnimateUnmatched: true,
        autoAnimateStyles: [
          "opacity",
          "color",
          "background-color",
          "padding",
          "font-size",
          "line-height",
          "letter-spacing",
          "border-width",
          "border-color",
          "border-radius",
          "outline",
          "outline-offset",
        ],
        autoSlide: 0,
        autoSlideStoppable: true,
        autoSlideMethod: null,
        defaultTiming: null,
        mouseWheel: false,
        previewLinks: false,
        postMessage: true,
        postMessageEvents: false,
        focusBodyOnPageVisibilityChange: true,
        minScale: 0.2,
        maxScale: window.innerWidth < 768 ? 1.5 : 2.0, // Lower max scale on mobile
        disableLayout: false,
        parallaxBackgroundImage: "",
        parallaxBackgroundSize: "",
        parallaxBackgroundRepeat: "",
        parallaxBackgroundPosition: "",
        parallaxBackgroundHorizontal: null,
        parallaxBackgroundVertical: null,
        display: "block",
        hideInactiveCursor: true,
        hideCursorTime: 5000,
      });

      deck.initialize();

      // expose for external control (PresentationView can call next()/prev())
      try {
        (window as any).__REVEAL_DECK = deck;
      } catch (e) {
        // ignore in non-browser envs
      }
    }, 100); // 100ms delay

    return () => {
      clearTimeout(initTimer);
      // reveal.js doesn't expose a full destroy API in all versions; try to cleanup classes
      try {
        const el = deckRef.current;
        if (el) {
          el.querySelectorAll(".reveal .slides > section").forEach((s) =>
            s.remove()
          );
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <>
      <style>{`
        /* Import Vietnamese-optimized fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans:wght@400;500;600;700;800;900&display=swap');
        
        /* Mobile-specific Reveal.js overrides */
        @media (max-width: 768px) {
          .reveal .slides {
            width: 100% !important;
            height: 100% !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .reveal .slides > section {
            width: 100% !important;
            height: 100% !important;
            padding: 10px !important;
            margin: 0 !important;
            min-height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .reveal .slides > section > div {
            width: 100% !important;
            max-width: 95vw !important;
            margin: 0 auto !important;
            padding: 5px !important;
          }
          
          .reveal .progress {
            height: 2px !important;
          }
          
          .reveal .slide-number {
            font-size: 12px !important;
            padding: 3px 6px !important;
          }
        }
        
        /* FHD and desktop optimizations */
        @media (min-width: 1920px) {
          .reveal .slides > section {
            padding: 20px !important;
          }
          
          .reveal .slides > section > div {
            max-height: 90vh !important;
            overflow-y: auto !important;
          }
        }
        
        /* General desktop optimizations for better content fitting */
        @media (min-width: 769px) {
          .reveal .slides > section {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
            padding-top: 50px !important;
            padding-bottom: 30px !important;
          }
          
          .reveal .slides > section > div {
            max-height: 88vh !important;
            overflow-y: hidden !important;
            overflow-x: hidden !important;
          }
          
          /* Hide scrollbar completely but keep functionality */
          .reveal .slides > section > div {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .reveal .slides > section > div::-webkit-scrollbar {
            display: none !important;
          }
        }
        
        /* Compact layout for content-heavy slides */
        .reveal .slides > section > div > div > div {
          margin-bottom: 0.5rem !important;
        }
        
        /* Better text wrapping */
        .reveal .slides > section li {
          word-wrap: break-word !important;
          hyphens: auto !important;
        }
        
        /* Shimmer animation for h2 */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Enhanced h2 styling */
        .reveal h2 {
          position: relative !important;
          overflow: hidden !important;
        }
        
        /* Optimized font sizes for better readability */
        @media (min-width: 768px) {
          .reveal h2 {
            font-size: 24px !important;
            color: black !important;
          }
          
          .reveal h3 {
            font-size: 18px !important;
            color: #FEF3C7 !important;
          }
          
          .reveal p, .reveal li {
            font-size: 10px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .reveal h2 {
            font-size: 48px !important;
            color: black !important;
          }
          
          .reveal h3 {
            font-size: 36px !important;
            color: #FEF3C7 !important;
          }
          
          .reveal p, .reveal li {
            font-size: 16px !important;
          }
        }
        
        @media (min-width: 1920px) {
          .reveal h2 {
            font-size: 80px !important;
            color: black !important;
          }
          
          .reveal h3 {
            font-size: 56px !important;
            color: #FEF3C7 !important;
          }
          
          .reveal p, .reveal li {
            font-size: 24px !important;
          }
        }
        
        /* Ensure proper scaling on all devices */
        .reveal {
          font-family: 'Inter', 'Segoe UI', 'Roboto', 'Noto Sans', 'Arial', sans-serif !important;
        }
        
        /* Vietnamese font optimization */
        .reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6 {
          font-family: 'Inter', 'Segoe UI', 'Roboto', 'Noto Sans Vietnamese', 'Arial', sans-serif !important;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        .reveal p, .reveal li, .reveal span {
          font-family: 'Inter', 'Segoe UI', 'Roboto', 'Noto Sans Vietnamese', 'Arial', sans-serif !important;
          font-feature-settings: 'kern' 1, 'liga' 1 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        .reveal .slides > section {
          text-align: center !important;
        }
        
        /* Better mobile touch handling */
        .reveal .slides {
          touch-action: pan-y !important;
        }
        
        /* Prevent content from being cut off */
        .reveal .slides > section {
          overflow: visible !important;
        }
      `}</style>
      <div ref={deckRef} className="reveal h-full w-full">
        <div
          className="slides"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {slides.map((slide) => (
            <section
              key={slide.id}
              data-background={slide.image || undefined}
              data-background-size={slide.image ? "cover" : undefined}
              aria-label={slide.title}
            >
              <div className="px-2 sm:px-3 md:px-4 lg:px-4 py-1 sm:py-2 md:py-2 lg:py-2 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center">
                <h2
                  className="font-extrabold mb-3 tracking-tight inline-block text-black drop-shadow-2xl relative"
                  style={{
                    fontSize: "32px",
                    fontFamily:
                      "'Inter', 'Segoe UI', 'Roboto', 'Noto Sans', 'Arial', sans-serif",
                    fontWeight: "800",
                    letterSpacing: "-0.02em",
                    textShadow:
                      "0 0 30px rgba(255, 255, 255, 1), 0 6px 16px rgba(255, 255, 255, 0.9), 2px 2px 4px rgba(255, 255, 255, 0.8)",
                    lineHeight: "1.2",
                    background:
                      "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "3px solid #D97706",
                    boxShadow:
                      "0 8px 32px rgba(217, 119, 6, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <svg
                      className="w-8 h-8 text-amber-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {slide.title}
                    <svg
                      className="w-8 h-8 text-amber-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <div
                    className="absolute inset-0 rounded-xl opacity-20"
                    style={{
                      background:
                        "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  />
                </h2>
                <div className="space-y-1 sm:space-y-1 md:space-y-1 lg:space-y-1 text-left">
                  {slide.content &&
                    slide.content.map((point: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-red-900/95 to-red-800/95 backdrop-blur-sm p-2 sm:p-2 md:p-3 lg:p-3 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-xl shadow-lg sm:shadow-xl md:shadow-2xl border border-yellow-400/70 sm:border-2 hover:border-yellow-300 transition-all duration-300"
                      >
                        {typeof point === "string" ? (
                          <p
                            className="text-yellow-200 leading-snug font-medium"
                            style={{ fontSize: "14px" }}
                          >
                            {point}
                          </p>
                        ) : (
                          <>
                            <h3
                              className="font-bold mb-1 cursor-pointer hover:text-yellow-100 hover:scale-105 transition-all duration-200 border-l-4 border-yellow-400 pl-3 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-r-lg py-2 hover:from-yellow-400/40 hover:shadow-lg"
                              style={{
                                fontSize: "28px",
                                fontFamily:
                                  "'Inter', 'Segoe UI', 'Roboto', 'Noto Sans', 'Arial', sans-serif",
                                fontWeight: "700",
                                letterSpacing: "-0.01em",
                                color: "#FEF3C7",
                                textShadow:
                                  "0 0 20px rgba(255, 255, 255, 0.9), 0 3px 10px rgba(0, 0, 0, 0.9), 1px 1px 3px rgba(0, 0, 0, 0.8)",
                                lineHeight: "1.3",
                              }}
                              title="Click để chat với AI về nội dung này"
                              onClick={() =>
                                onSelectTerm &&
                                onSelectTerm(
                                  point.chatQuery ||
                                    `Slide ${slide.id}: ${slide.title} - ${point.text}. Hãy giải thích chi tiết về nội dung này.`
                                )
                              }
                            >
                              <span className="flex items-center gap-2">
                                {point.text}
                                <svg
                                  className="w-5 h-5 opacity-70"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                </svg>
                              </span>
                            </h3>
                            {Array.isArray(point.subPoints) && (
                              <div
                                className={`${
                                  point.subPoints.length > 4
                                    ? "grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1"
                                    : ""
                                }`}
                              >
                                <ul
                                  className={`list-disc pl-2 sm:pl-3 md:pl-3 lg:pl-3 space-y-0.5 sm:space-y-0.5 md:space-y-1 ${
                                    point.subPoints.length > 4
                                      ? "col-span-full"
                                      : ""
                                  }`}
                                >
                                  {point.subPoints.map(
                                    (sub: string, sidx: number) => (
                                      <li
                                        key={sidx}
                                        className={`text-yellow-200 leading-snug break-words ${
                                          point.subPoints.length > 4 &&
                                          sidx >=
                                            Math.ceil(
                                              point.subPoints.length / 2
                                            )
                                            ? "md:ml-4"
                                            : ""
                                        }`}
                                        style={{ fontSize: "12px" }}
                                      >
                                        {sub}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default RevealPresentation;
