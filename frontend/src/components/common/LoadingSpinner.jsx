import React from 'react';

export default function LoadingSpinner({ height = "h-64", size = "h-12 w-12", color = "border-[#D71939]" }) {
  return (
    <div className={`flex justify-center items-center ${height}`}>
      <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}></div>
    </div>
  );
}
