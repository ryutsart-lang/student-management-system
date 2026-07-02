import React from 'react';

export const Card = ({ title, value, icon: Icon, color = 'primary' }) => {
  const bgColors = {
    primary: 'bg-blue-50 text-primary',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        {Icon && (
          <div className={`${bgColors[color]} p-3 rounded-lg`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </div>
  );
};
