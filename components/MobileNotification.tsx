import React from 'react';
import { FaDesktop, FaLaptop, FaExclamationTriangle } from 'react-icons/fa';

interface MobileNotificationProps {
  onShowRoadmap?: () => void;
  onShowIntro?: () => void;
}

const MobileNotification: React.FC<MobileNotificationProps> = ({ 
  onShowRoadmap, 
  onShowIntro 
}) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-red-900 via-red-800 to-yellow-800 flex items-center justify-center relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-red-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-yellow-300/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-red-300/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-red-800/90 border-b-2 border-yellow-400 shadow-lg">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="#FFD600" strokeWidth="3" fill="#B71C1C" />
            <circle cx="16" cy="16" r="7" stroke="#FFD600" strokeWidth="2" fill="none" />
            <path d="M16 9v14M9 16h14" stroke="#FFD600" strokeWidth="2" />
          </svg>
          <span className="text-lg font-bold text-yellow-300 drop-shadow">MLN131</span>
        </div>
        
        <nav className="flex items-center gap-4">
          {onShowIntro && (
            <button
              onClick={onShowIntro}
              className="text-yellow-300 hover:text-yellow-100 transition-colors duration-300 font-semibold text-sm border-b-2 border-transparent hover:border-yellow-300 pb-1"
            >
              Giới thiệu
            </button>
          )}
          
          {onShowRoadmap && (
            <button
              onClick={onShowRoadmap}
              className="text-yellow-300 hover:text-yellow-100 transition-colors duration-300 font-semibold text-sm border-b-2 border-transparent hover:border-yellow-300 pb-1"
            >
              Bản đồ
            </button>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="text-center px-6 py-8 max-w-md mx-auto mt-16">
        {/* Warning icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-400 text-red-900 rounded-full flex items-center justify-center shadow-lg">
            <FaExclamationTriangle size={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-white mb-4 drop-shadow-2xl leading-tight">
          Trải nghiệm tốt nhất trên máy tính
        </h1>

        {/* Message */}
        <div className="bg-white/95 rounded-2xl p-6 border-2 border-yellow-400 text-red-900 mb-6 shadow-lg">
          <p className="text-lg font-bold mb-4">
            Vui lòng sử dụng máy tính để có trải nghiệm đầy đủ tính năng
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <FaDesktop className="text-red-700 flex-shrink-0" />
              <span>Xem slide bài giảng tương tác</span>
            </div>
            <div className="flex items-center gap-3">
              <FaLaptop className="text-red-700 flex-shrink-0" />
              <span>Chat AI hỗ trợ học tập</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-red-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Đọc giáo trình điện tử</span>
            </div>
          </div>
        </div>

        {/* Device icons */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="text-yellow-300 opacity-80">
            <FaDesktop size={24} />
          </div>
          <div className="text-yellow-300 opacity-80">
            <FaLaptop size={24} />
          </div>
        </div>

        {/* Footer message */}
        <p className="text-yellow-200 text-sm opacity-80">
          Hệ thống được tối ưu cho màn hình lớn để đảm bảo chất lượng học tập tốt nhất
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-4 text-yellow-200/40 text-lg font-bold rotate-12 pointer-events-none">
        MLN131
      </div>
      <div className="absolute bottom-1/4 right-4 text-red-200/40 text-base font-semibold -rotate-12 pointer-events-none">
        Học tập thông minh
      </div>
    </div>
  );
};

export default MobileNotification;