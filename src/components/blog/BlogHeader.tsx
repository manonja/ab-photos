import React from 'react';

const BlogHeader: React.FC = () => {
  // Gradient classes for the grid cells
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-violet-600'
  ];

  return (
    <div className="w-full relative mb-10">
      {/* Main header title overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Photographic Journal
        </h1>
      </div>
      
      {/* Photo grid using gradients as placeholders */}
      <div className="grid grid-cols-5 h-64 md:h-80 lg:h-96">
        {gradients.map((gradient, index) => (
          <div key={index} className="relative overflow-hidden">
            <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
            {/* Overlay to unify the look */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogHeader; 