import React, { useState, useEffect } from 'react';
import { FaEye, FaChartLine } from 'react-icons/fa';
import { totalVisitsService } from '../services/totalVisitsService';

interface TotalVisitsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme?: 'light' | 'dark' | 'gradient';
  showIcon?: boolean;
}

const TotalVisits: React.FC<TotalVisitsProps> = ({
  position = 'bottom-right',
  theme = 'gradient',
  showIcon = true
}) => {
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const recordAndShow = async () => {
      try {
        // Record visit và lấy total count
        const count = await totalVisitsService.recordVisit();
        setTotalVisits(count);
      } catch (error) {
        console.warn('Error recording visit:', error);
        setTotalVisits(1000); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    recordAndShow();
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-800 border border-gray-200 shadow-lg';
      case 'dark':
        return 'bg-gray-900 text-white border border-gray-700 shadow-lg';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border border-blue-500/30';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border border-blue-500/30';
    }
  };

  if (isLoading) {
    return (
      <div
        className={`
          fixed z-40 ${getPositionClasses()} 
          ${getThemeClasses()}
          px-3 py-2 rounded-xl backdrop-blur-sm
          transition-all duration-300
          flex items-center space-x-2 text-sm font-medium
          min-w-[140px] opacity-50
        `}
      >
        <div className="animate-spin">⭮</div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`
        fixed z-40 ${getPositionClasses()} 
        ${getThemeClasses()}
        px-3 py-2 rounded-xl backdrop-blur-sm
        transition-all duration-300 hover:scale-105
        flex items-center space-x-2 text-sm font-medium
        min-w-[140px]
      `}
    >
      {showIcon && (
        <FaChartLine size={12} />
      )}
      
      <div className="flex items-center space-x-1">
        <FaEye size={12} />
        <span className="font-bold">
          {totalVisits.toLocaleString()}
        </span>
      </div>
      
      <span className="text-xs opacity-80 hidden sm:inline">
        visits
      </span>
    </div>
  );
};

export default TotalVisits;