import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { studentService } from '../services';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { ArrowLeft } from 'lucide-react';

export const StudentProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { student_id } = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentService.getStudent(student_id);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    if (student_id) {
      fetchStudent();
    }
  }, [student_id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!student) {
    return <div className="flex items-center justify-center h-screen">Student not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          Back to Management
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {student.first_name} {student.last_name}
              </h1>
              <p className="text-gray-600">Student ID: {student.student_id}</p>
              <p className="text-primary font-semibold">{student.curriculum_name || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Academic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Major</p>
                  <p className="font-semibold text-gray-800">{student.major || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class Group</p>
                  <p className="font-semibold text-gray-800">{student.class_group || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Curriculum</p>
                  <p className="font-semibold text-gray-800">{student.curriculum_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credits</p>
                  <p className="font-semibold text-gray-800">{student.total_credit || 0}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Performance</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">GPA</p>
                  <p className="text-2xl font-bold text-primary">{student.gpa?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="font-bold text-primary">{student.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Curriculum Progress</h2>
            <ProgressBar value={student.progress} label="Overall Completion" />
          </div>
        </div>
      </div>
    </div>
  );
};
