import React from 'react';

export const Sidebar = ({ items, active, onItemClick }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <h2 className="text-lg font-bold text-primary mb-8">Menu</h2>
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                active === item.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
