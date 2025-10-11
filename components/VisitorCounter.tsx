import React, { useState, useEffect } from "react";
import { FaEye, FaChartLine } from "react-icons/fa";
import { totalVisitsService } from "../services/totalVisitsService";

interface VisitorCounterProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  theme?: "light" | "dark" | "gradient";
  showIcon?: boolean;
  animated?: boolean;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({
  position = "top-right",
  theme = "gradient",
  showIcon = true,
  animated = true,
}) => {
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const recordAndShowVisits = async () => {
      try {
        // Xóa localStorage cũ nếu có
        localStorage.removeItem("mln131-total-visits");
        
        // Gọi Supabase để record visit và lấy total count
        console.log("📊 Recording visit via Supabase...");
        const count = await totalVisitsService.recordVisit();
        
        setTotalVisits(count);
        setIsLoaded(true);
        console.log(`✅ Total visits loaded: ${count}`);
        
      } catch (error) {
        console.error("❌ Error loading visits:", error);
        // Fallback: start từ 1 visit
        setTotalVisits(1);
        setIsLoaded(true);
      }
    };

    // Delay nhỏ để tạo hiệu ứng loading
    const timer = setTimeout(() => {
      recordAndShowVisits();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white text-gray-800 border border-gray-200 shadow-lg";
      case "dark":
        return "bg-gray-900 text-white border border-gray-700 shadow-lg";
      case "gradient":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl border border-red-500/30";
      default:
        return "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl border border-red-500/30";
    }
  };

  if (!isLoaded) {
    // Show loading indicator while initializing
    return (
      <div
        className={`
          fixed z-50 ${getPositionClasses()} 
          bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-xl border border-gray-500/30
          px-3 py-2 rounded-xl backdrop-blur-sm
          flex items-center space-x-2 text-sm font-medium
          min-w-[120px]
        `}
      >
        <div className="flex items-center space-x-1">
          <div className="text-yellow-400">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <span className="text-xs opacity-80">Đang tải...</span>
      </div>
    );
  }

  return (
    <div
      className={`
        fixed z-50 ${getPositionClasses()} 
        ${getThemeClasses()}
        px-3 py-2 rounded-xl backdrop-blur-sm
        transition-all duration-300 hover:scale-105
        flex items-center space-x-2 text-sm font-medium
        min-w-[160px]
      `}
    >
      {showIcon && (
        <div className="flex items-center space-x-1">
          <div className="text-yellow-400">
            <FaChartLine size={12} />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-1">
        <FaEye size={12} />
        <span className="font-bold">{totalVisits.toLocaleString()}</span>
      </div>

      <span className="text-xs opacity-80">lượt truy cập</span>
    </div>
  );
};

export default VisitorCounter;
