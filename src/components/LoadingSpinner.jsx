import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="relative w-16 h-16">
        {/* Outer circle */}
        <div className="absolute w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin"></div>
        {/* Inner pulse */}
        <div className="absolute top-2 left-2 right-2 bottom-2 bg-blue-500 rounded-full animate-ping opacity-30"></div>
      </div>
      <p className="mt-6 text-blue-600 font-semibold text-lg animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingSpinner;
