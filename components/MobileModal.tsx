import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToRoadmap: () => void;
}

const MobileModal: React.FC<MobileModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToRoadmap 
}) => {
  if (!isOpen) return null;

  const handleOkClick = () => {
    onClose();
    onBackToRoadmap();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Modal overlay */}
      <div 
        className="absolute inset-0" 
        onClick={handleOkClick}
      />
      
      {/* Modal content */}
      <div className="relative bg-gradient-to-br from-red-900 to-red-800 rounded-2xl p-6 mx-4 max-w-sm w-full border-2 border-yellow-400 shadow-2xl">
        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-400 text-red-900 rounded-full flex items-center justify-center shadow-lg">
            <FaExclamationTriangle size={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center mb-4 drop-shadow-lg">
          Thông báo
        </h2>

        {/* Message */}
        <div className="bg-white/95 rounded-xl p-4 mb-6 border border-yellow-400">
          <p className="text-red-900 font-semibold text-center leading-relaxed">
            Vui lòng sử dụng máy tính để có trải nghiệm đầy đủ tính năng
          </p>
        </div>

        {/* OK Button */}
        <button
          onClick={handleOkClick}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all duration-300 border-2 border-yellow-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MobileModal;