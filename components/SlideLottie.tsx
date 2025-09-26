import React from 'react';
import Lottie from 'lottie-react';
import vietnamUnityAnim from '../assets/vietnam_unity.json';

const SlideLottie: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="w-64 h-64 bg-gradient-to-br from-red-500 via-yellow-300 to-red-700 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-400">
        <Lottie animationData={vietnamUnityAnim} loop={true} />
      </div>
    </div>
  );
};

export default SlideLottie;
