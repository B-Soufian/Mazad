import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const variants = {
    active: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    draft: "bg-gray-100 text-gray-700 border-gray-200",
  };

  // Normalize status string or default to 'draft'
  const normalizedStatus = status?.toLowerCase() || 'draft';
  
  // Use matched variant or default to 'draft' styling if not found
  const badgeStyle = variants[normalizedStatus] || variants.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge;
