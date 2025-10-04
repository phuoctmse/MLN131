import React from 'react';
import vietnamBg from '../assets/vietnam-bg.jpg';

interface RoadmapNode {
  id: number;
  title: string;
  subtitle: string;
  position: { x: number; y: number };
  completed?: boolean;
}

const roadmapNodes: RoadmapNode[] = [
  // Left column (1-5)
  { id: 1, title: "Giới thiệu vấn đề dân tộc", subtitle: "Khái niệm & đặc trưng", position: { x: 47, y: 4 } }, // TP.HCM region (left)
  { id: 2, title: "Đặc điểm dân tộc ở Việt Nam", subtitle: "54 dân tộc anh em", position: { x: 49, y: 15 } }, // Đồng bằng sông Cửu Long (left)
  { id: 3, title: "Mở đầu", subtitle: "Khởi nguồn lịch sử", position: { x: 48, y: 27 } }, // Tây Nguyên (left)
  { id: 4, title: "Cơ sở lý luận", subtitle: "Quan điểm Mác-Lênin", position: { x: 52, y: 38 } }, // Nha Trang - Khánh Hòa (left)
  { id: 5, title: "Bối cảnh lịch sử", subtitle: "Thời kỳ thực dân", position: { x: 68, y: 45 } }, // Quy Nhon - Bình Định (left)
  // Right column (6-11)
  { id: 6, title: "Thực trạng phân biệt vùng miền", subtitle: "Biểu hiện hiện tại", position: { x: 58, y: 52 } }, // Đà Nẵng - Quảng Nam (right)
  { id: 7, title: "Nguyên nhân phân biệt", subtitle: "Gốc rễ vấn đề", position: { x: 59, y: 67 } }, // Huế - Thừa Thiên Huế (right)
  { id: 8, title: "Hệ quả phân biệt", subtitle: "Tác động tiêu cực", position: { x: 68, y: 86 } }, // Vinh - Nghệ An (right)
  { id: 9, title: "Quan điểm Đảng và Nhà nước", subtitle: "Chính sách dân tộc", position: { x: 53, y: 83 } }, // Hà Nội - Red River Delta (right)
  { id: 10, title: "Giải pháp khắc phục", subtitle: "Hướng giải quyết", position: { x: 49, y: 87 } }, // Lạng Sơn - Cao Bằng (right)
  { id: 11, title: "Kết luận", subtitle: "Tóm tắt & định hướng", position: { x: 46, y: 95 } } // Lào Cai - Sapa (right)
];

interface RoadmapViewProps {
  onSelectSlide: (slideId: number) => void;
  onStartPresentation: () => void;
  currentSlide?: number;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ onSelectSlide, onStartPresentation, currentSlide = 0 }) => {
  // We use a static background image for the roadmap view (no Google Maps)
  // all nodes will be rendered as small dim dots for a cleaner roadmap layout

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col">
      {/* Header - luôn hiển thị (non-absolute so it doesn't cover the image) */}
  <div className="relative w-full py-3 px-4 bg-red-800/90 backdrop-blur-sm border-b-2 border-yellow-400 shadow-lg" style={{ zIndex: 2000 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-white drop-shadow-lg">
              Bản đồ học tập MLN131 - Việt Nam
            </h1>
          </div>
          
          <button
            onClick={onStartPresentation}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-6 py-3 rounded-full font-bold text-lg shadow-xl hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300"
          >
            Bắt đầu từ slide đầu
          </button>
        </div>
        
  <div className="text-center mt-2">
          <p className="text-yellow-200 text-lg font-semibold drop-shadow">
            Click vào các điểm trên bản đồ Việt Nam để nhảy đến slide tương ứng
          </p>
        </div>
      </div>

      {/* Roadmap container - background placed under nodes, below header */}
  <div className="flex-1 relative flex items-center justify-center pt-4 pb-8">
          {/* Static Vietnam background image (show full image) placed inside content area */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${vietnamBg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top',
              backgroundColor: '#fff6e0',
              zIndex: 0
            }}
            aria-hidden={false}
          />
          <div className="relative w-full h-full max-w-6xl mx-auto">
        <div className="relative w-full h-full max-w-6xl mx-auto">
          {/* Connection lines trên Google Maps */}
          <svg className="absolute inset-0 w-full h-full z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            {roadmapNodes.slice(0, -1).map((node, index) => {
              const nextNode = roadmapNodes[index + 1];
              return (
                <line
                  key={`line-${node.id}`}
                  x1={node.position.x}
                  y1={node.position.y}
                  x2={nextNode.position.x}
                  y2={nextNode.position.y}
                  stroke="#FCD34D"
                  strokeWidth="0.5"
                  strokeDasharray="3,2"
                  className="opacity-80 drop-shadow-lg"
                />
              );
            })}
          </svg>

          {/* Roadmap nodes: render as small dim dots */}
          {roadmapNodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-40"
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`
              }}
              onClick={() => onSelectSlide(node.id)}
            >
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-200 ${currentSlide === node.id ? 'bg-yellow-400 scale-110' : 'bg-red-600/70'} border-2 border-yellow-400/30 shadow-sm`} />

              {/* Tooltip (shown on hover) */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-yellow-400/50 min-w-40">
                  <h3 className="font-bold text-yellow-300 text-xs mb-1">{node.title}</h3>
                  <p className="text-yellow-100 text-xxs">{node.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

      </div>
      </div>
    </div>

      {/* Floating back button */}
      <button
        onClick={() => onSelectSlide(currentSlide || 1)}
        className="fixed bottom-8 left-8 z-50 bg-red-700 hover:bg-yellow-400 text-yellow-200 hover:text-red-900 rounded-full shadow-lg p-4 transition-all duration-300 hover:scale-110 font-bold border-2 border-yellow-400"
        title="Quay lại presentation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
    </div>
  );
};

export default RoadmapView;