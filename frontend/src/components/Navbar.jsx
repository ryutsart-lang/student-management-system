import React from 'react';

export const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">SMS</h1>
            <span className="ml-2 text-gray-600 text-sm">Student Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.name || user?.student_id}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
