import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { FileUpload } from '../components/FileUpload';
import { studentService, curriculumService } from '../services';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../services/api';

export const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('student_id');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Manage Students' },
    { id: 'curriculum', label: 'Manage Curriculum' },
  ];

  useEffect(() => {
    if (activeMenu === 'students') {
      fetchStudents();
    } else if (activeMenu === 'curriculum') {
      fetchCurriculums();
    }
  }, [activeMenu, searchTerm, sortBy]);

  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await studentService.getAllStudents(searchTerm, sortBy);
      setStudents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const response = await curriculumService.getCurriculums();
      setCurriculums(response.data);
    } catch (error) {
      console.error('Error fetching curriculums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.student_id || item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        if (activeMenu === 'students') {
          await studentService.deleteStudent(id);
        } else {
          await curriculumService.deleteCurriculum(id);
        }
        if (activeMenu === 'students') {
          fetchStudents();
        } else {
          fetchCurriculums();
        }
      } catch (error) {
        alert('Error deleting: ' + error.response?.data?.error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (activeMenu === 'students') {
        if (editingId) {
          await studentService.updateStudent(editingId, formData);
        } else {
          await studentService.createStudent(formData);
        }
        fetchStudents();
      } else {
        if (editingId) {
          await curriculumService.updateCurriculum(editingId, formData);
        } else {
          await curriculumService.createCurriculum(formData);
        }
        fetchCurriculums();
      }
      setShowModal(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error: ' + error.response?.data?.error);
    }
  };

  const handleUpload = async (formData) => {
    setLoading(true);
    try {
      await api.post('/import/students', formData);
      fetchStudents();
      alert('Import successful!');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await api.get('/import/students/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      alert('Download failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentColumns = [
    { key: 'student_id', label: 'Student ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'major', label: 'Major' },
    { key: 'class_group', label: 'Class' },
    { key: 'gpa', label: 'GPA' },
    { key: 'progress', label: 'Progress' },
  ];

  const curriculumColumns = [
    { key: 'id', label: 'ID' },
    { key: 'curriculum_name', label: 'Name' },
    { key: 'total_credit', label: 'Total Credit' },
  ];

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar items={menuItems} active={activeMenu} onItemClick={setActiveMenu} />
        <div className="flex-1 p-8">
          {activeMenu === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
              <FileUpload onUpload={handleUpload} onDownload={handleDownload} loading={loading} />
            </div>
          )}

          {activeMenu === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
                <button
                  onClick={() => {
                    setFormData({});
                    setEditingId(null);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Add Student
                </button>
              </div>

              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="student_id">Sort by ID</option>
                  <option value="name">Sort by Name</option>
                  <option value="gpa">Sort by GPA</option>
                  <option value="progress">Sort by Progress</option>
                </select>
              </div>

              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <DataTable columns={studentColumns} data={students} onEdit={handleEdit} onDelete={handleDelete} />
                  {pagination.pages > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                      {Array.from({ length: pagination.pages }, (_, i) => (
                        <button
                          key={i + 1}
                          className={`px-3 py-1 rounded ${pagination.page === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                          onClick={() => fetchStudents(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeMenu === 'curriculum' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Curriculum</h1>
                <button
                  onClick={() => {
                    setFormData({});
                    setEditingId(null);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Add Curriculum
                </button>
              </div>
              {loading ? <div>Loading...</div> : <DataTable columns={curriculumColumns} data={curriculums} onEdit={handleEdit} onDelete={handleDelete} />}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        title={editingId ? 'Edit' : 'Add New'}
        onClose={() => {
          setShowModal(false);
          setFormData({});
          setEditingId(null);
        }}
        onSubmit={handleSubmit}
      >
        {activeMenu === 'students' ? (
          <>
            <FormField label="Student ID" name="student_id" value={formData.student_id || ''} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} required disabled={!!editingId} />
            <FormField label="First Name" name="first_name" value={formData.first_name || ''} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
            <FormField label="Last Name" name="last_name" value={formData.last_name || ''} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
            <FormField label="Major" name="major" value={formData.major || ''} onChange={(e) => setFormData({ ...formData, major: e.target.value })} />
            <FormField label="Class Group" name="class_group" value={formData.class_group || ''} onChange={(e) => setFormData({ ...formData, class_group: e.target.value })} />
            <FormField label="GPA" type="number" name="gpa" value={formData.gpa || ''} onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })} />
            <FormField label="Progress" type="number" name="progress" value={formData.progress || ''} onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })} />
          </>
        ) : (
          <>
            <FormField label="Curriculum Name" name="curriculum_name" value={formData.curriculum_name || ''} onChange={(e) => setFormData({ ...formData, curriculum_name: e.target.value })} required />
            <FormField label="Total Credit" type="number" name="total_credit" value={formData.total_credit || ''} onChange={(e) => setFormData({ ...formData, total_credit: parseInt(e.target.value) })} required />
          </>
        )}
      </Modal>
    </div>
  );
};
