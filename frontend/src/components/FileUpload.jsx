import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';

export const FileUpload = ({ onUpload, onDownload, loading }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await onUpload(formData);
      setUploadStatus('Upload successful!');
      setFile(null);
    } catch (error) {
      setUploadStatus(error.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Import/Export Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-primary rounded-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <Upload className="text-primary" size={32} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Import from Excel</h3>
          <p className="text-sm text-gray-600 mb-4">Upload .xlsx file to import students</p>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="w-full mb-2" />
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          {uploadStatus && (
            <div className={`mt-2 p-2 rounded text-sm ${uploadStatus.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {uploadStatus}
            </div>
          )}
        </div>
        <div className="border-2 border-dashed border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <Download className="text-green-600" size={32} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Export to Excel</h3>
          <p className="text-sm text-gray-600 mb-4">Download all students data</p>
          <button
            onClick={onDownload}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Downloading...' : 'Download Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};
