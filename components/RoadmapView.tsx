import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import vietnamBg from "../assets/vietnam-bg.jpg";
import vietnamUnityAnim from "../assets/vietnam_unity.json";
import { SparklesIcon } from "./IconComponents";
import { useIsMobile } from "../hooks/useIsMobile";

interface RoadmapNode {
  id: number;
  title: string;
  subtitle: string;
  position: { x: number; y: number };
  completed?: boolean;
}

const roadmapNodes: RoadmapNode[] = [
  // Left column (1-5)
  {
    id: 1,
    title: "Giới thiệu vấn đề dân tộc",
    subtitle: "Khái niệm & đặc trưng",
    position: { x: 47, y: 6 },
  }, // TP.HCM region (left)
  {
    id: 2,
    title: "Đặc điểm dân tộc ở Việt Nam",
    subtitle: "54 dân tộc anh em",
    position: { x: 49, y: 16 },
  }, // Đồng bằng sông Cửu Long (left)
  {
    id: 3,
    title: "Mở đầu",
    subtitle: "Khởi nguồn lịch sử",
    position: { x: 48, y: 27 },
  }, // Tây Nguyên (left)
  {
    id: 4,
    title: "Cơ sở lý luận",
    subtitle: "Quan điểm Mác-Lênin",
    position: { x: 52, y: 38 },
  }, // Nha Trang - Khánh Hòa (left)
  {
    id: 5,
    title: "Bối cảnh lịch sử",
    subtitle: "Thời kỳ thực dân",
    position: { x: 78, y: 44 },
  }, // Quy Nhon - Bình Định (left)
  // Right column (6-11)
  {
    id: 6,
    title: "Thực trạng phân biệt vùng miền",
    subtitle: "Biểu hiện hiện tại",
    position: { x: 63, y: 52 },
  }, // Đà Nẵng - Quảng Nam (right)
  {
    id: 7,
    title: "Nguyên nhân phân biệt",
    subtitle: "Gốc rễ vấn đề",
    position: { x: 64, y: 67 },
  }, // Huế - Thừa Thiên Huế (right)
  {
    id: 8,
    title: "Hệ quả phân biệt",
    subtitle: "Tác động tiêu cực",
    position: { x: 78, y: 80 },
  }, // Vinh - Nghệ An (right)
  {
    id: 9,
    title: "Quan điểm Đảng và Nhà nước",
    subtitle: "Chính sách dân tộc",
    position: { x: 55, y: 78 },
  }, // Hà Nội - Red River Delta (right)
  {
    id: 10,
    title: "Giải pháp khắc phục",
    subtitle: "Hướng giải quyết",
    position: { x: 49, y: 83 },
  }, // Lạng Sơn - Cao Bằng (right)
  {
    id: 11,
    title: "Kết luận",
    subtitle: "Tóm tắt & định hướng",
    position: { x: 44, y: 91 },
  }, // Lào Cai - Sapa (right)
];

interface RoadmapViewProps {
  onSelectSlide: (slideId: number) => void;
  onStartPresentation: () => void;
  currentSlide?: number;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({
  onSelectSlide,
  onStartPresentation,
  currentSlide = 0,
}) => {
  // Use an SVG with a viewBox so nodes and lines scale responsively across screen sizes.
  // The background map is embedded as an <image> inside the SVG. Tooltips are
  // rendered as HTML absolutely positioned using percentage coordinates so they
  // remain correctly anchored while responsive.

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const isMobile = useIsMobile(768);

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col bg-gradient-to-br from-red-900 via-red-800 to-yellow-600">
      {/* Decorative elements for visual appeal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-red-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300/5 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-600/8 rounded-full blur-xl animate-pulse delay-1500"></div>

        {/* Sparkles decorations */}
        <SparklesIcon className="absolute top-32 right-16 w-8 h-8 text-yellow-300/40 animate-bounce" />
        <SparklesIcon className="absolute bottom-32 left-16 w-6 h-6 text-red-300/50 animate-pulse delay-700" />
        <SparklesIcon
          className="absolute top-1/3 left-8 w-5 h-5 text-yellow-400/30 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <SparklesIcon className="absolute bottom-1/3 right-8 w-7 h-7 text-red-400/40 animate-bounce delay-300" />

        {/* Lottie animation in top right */}
        <div className="absolute top-4 right-4 w-24 h-24 opacity-60">
          <Lottie animationData={vietnamUnityAnim} loop={true} />
        </div>
      </div>
      {/* Header - Mobile responsive */}
      <div
        className="relative w-full py-2 md:py-3 px-3 md:px-4 bg-red-800/90 backdrop-blur-sm border-b-2 border-yellow-400 shadow-lg"
        style={{ zIndex: 2000 }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-black text-white drop-shadow-lg truncate">
              <span className="hidden md:inline">
                Bản đồ học tập Chương 6 - MLN131
              </span>
              <span className="md:hidden">Bản đồ học tập</span>
            </h1>
          </div>

          <button
            onClick={onStartPresentation}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-3 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-xl hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Đến Slide hiện tại</span>
            <span className="sm:hidden">Bắt đầu</span>
          </button>
        </div>

        <div className="text-center mt-1 md:mt-2">
          <p className="text-yellow-200 text-sm md:text-lg font-semibold drop-shadow">
            <span className="hidden md:inline">
              Click vào các điểm trên bản đồ Việt Nam để nhảy đến slide tương
              ứng
            </span>
            <span className="md:hidden">
              Chọn điểm trên bản đồ để xem slide
            </span>
          </p>
        </div>
      </div>

      {/* Roadmap container - place SVG inside a responsive wrapper */}
      <div className="flex-1 relative flex items-center justify-center pt-4 pb-8">
        {/* Decorative text elements - Mobile responsive */}
        <div className="absolute top-6 md:top-10 left-3 md:left-10 text-yellow-200/60 text-lg md:text-2xl font-bold rotate-12 pointer-events-none hidden sm:block">
          Đại đoàn kết
        </div>
        <div className="absolute bottom-16 md:bottom-20 right-3 md:right-10 text-red-200/60 text-base md:text-xl font-semibold -rotate-12 pointer-events-none hidden sm:block">
          Dân tộc Việt Nam
        </div>
        <div className="absolute top-1/3 right-2 md:right-5 text-yellow-300/40 text-sm md:text-lg font-medium rotate-6 pointer-events-none hidden md:block">
          54 dân tộc anh em
        </div>
        <div className="absolute bottom-1/4 left-2 md:left-5 text-red-300/50 text-xs md:text-base font-semibold -rotate-6 pointer-events-none hidden md:block">
          Đoàn kết và phát triển
        </div>
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 text-yellow-400/30 text-xs md:text-sm font-bold pointer-events-none hidden lg:block">
          Học tập về dân tộc
        </div>
        <div
          ref={containerRef}
          className="relative w-full max-w-6xl mx-auto"
          style={{ height: "min(78vh, 900px)" }}
        >
          {/* Decorative frame around the map */}
          <div className="absolute inset-0 rounded-2xl border-4 border-yellow-400/30 shadow-2xl bg-gradient-to-br from-red-900/20 to-yellow-600/20 backdrop-blur-sm"></div>

          {/* Responsive SVG. viewBox 0 0 100 100 lets us use percentage-like coords for nodes */}
          <svg
            className="absolute inset-0 w-full h-full z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Bản đồ học tập"
          >
            {/* background map image embedded inside SVG so it scales with viewBox */}
            <image
              href={vietnamBg}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Connection lines removed - only show numbered nodes */}

            {/* Nodes as numbered circles - sizes expressed in viewBox units so they scale */}
            {roadmapNodes.map((node) => (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectSlide(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() =>
                  setHoveredNodeId((id) => (id === node.id ? null : id))
                }
                aria-label={`${node.title} - ${node.subtitle}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onSelectSlide(node.id);
                }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={currentSlide === node.id ? 2.2 : 1.8}
                  fill={currentSlide === node.id ? "#FDE68A" : "#B91C1C"}
                  stroke="#FCD34D"
                  strokeWidth={0.4}
                />
                {/* Number text */}
                <text
                  x={0}
                  y={0.3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={currentSlide === node.id ? "1.2" : "1"}
                  fontWeight="bold"
                  fill={currentSlide === node.id ? "#B91C1C" : "#FDE68A"}
                >
                  {node.id}
                </text>
                {/* subtle hit area for easier hover/click on small screens */}
                <circle cx={0} cy={0} r={2.8} fill="transparent" />
              </g>
            ))}
          </svg>

          {/* HTML tooltips rendered absolutely using percentage coords so they remain responsive */}
          {roadmapNodes.map((node) => (
            <div
              key={`tooltip-${node.id}`}
              className={`absolute pointer-events-none z-20 transition-opacity duration-150 ${
                hoveredNodeId === node.id ? "opacity-100" : "opacity-0"
              }`}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: "translate(-50%, 140%)",
                minWidth: window?.innerWidth < 640 ? 120 : 160,
              }}
            >
              <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-yellow-400/50">
                <h3 className="font-bold text-yellow-300 text-xs mb-1 leading-tight">
                  {node.title}
                </h3>
                <p className="text-yellow-100 text-xs leading-tight">
                  {node.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating back button - Hidden on mobile */}
      {!isMobile && (
        <button
          onClick={() => onSelectSlide(currentSlide || 1)}
          className="fixed bottom-4 md:bottom-8 left-4 md:left-8 z-50 bg-red-700 hover:bg-yellow-400 text-yellow-200 hover:text-red-900 rounded-full shadow-lg p-3 md:p-4 transition-all duration-300 hover:scale-110 font-bold border-2 border-yellow-400"
          title="Quay lại presentation"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RoadmapView;
