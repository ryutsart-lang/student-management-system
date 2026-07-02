import React from 'react';

export const Modal = ({ isOpen, title, children, onClose, onSubmit, submitText = 'Save' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          {onSubmit && (
            <button onClick={onSubmit} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
              {submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
