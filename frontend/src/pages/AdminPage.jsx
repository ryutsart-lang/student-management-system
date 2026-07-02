import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DataTable } from '../components/DataTable';
import { studentService, curriculumService } from '../services';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState('students');
  const [students, setStudents] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'students', label: 'Manage Students' },
    { id: 'curriculum', label: 'Manage Curriculum' },
  ];

  useEffect(() => {
    if (activeMenu === 'students') {
      fetchStudents();
    } else {
      fetchCurriculums();
    }
  }, [activeMenu]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentService.getAllStudents();
      setStudents(response.data);
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
    if (window.confirm('Are you sure?')) {
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
        console.error('Error deleting:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const columns = activeMenu === 'students'
    ? [
        { key: 'student_id', label: 'Student ID' },
        { key: 'first_name', label: 'First Name' },
        { key: 'last_name', label: 'Last Name' },
        { key: 'major', label: 'Major' },
        { key: 'class_group', label: 'Class' },
        { key: 'gpa', label: 'GPA' },
        { key: 'progress', label: 'Progress' },
      ]
    : [
        { key: 'id', label: 'ID' },
        { key: 'curriculum_name', label: 'Curriculum Name' },
        { key: 'total_credit', label: 'Total Credit' },
      ];

  const data = activeMenu === 'students' ? students : curriculums;

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar items={menuItems} active={activeMenu} onItemClick={setActiveMenu} />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {activeMenu === 'students' ? 'Manage Students' : 'Manage Curriculum'}
          </h1>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchPlaceholder="Search..."
            />
          )}
        </div>
      </div>
    </div>
  );
};
