import React from 'react';

export const ProgressBar = ({ value, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-700 font-medium">{label}</span>
        <span className="text-sm text-primary font-bold">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
