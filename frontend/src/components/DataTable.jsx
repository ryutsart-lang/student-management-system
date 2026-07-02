import React, { useState } from 'react';

export const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onSearch,
  searchPlaceholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch?.(term);
  };

  const handleSort = (key) => {
    setSortConfig({ key, direction: sortConfig?.direction === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  {col.label} {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.student_id || row.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
