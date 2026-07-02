import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { dashboardService } from '../services';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

export const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getStudentDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Here's your academic summary</p>
        </div>

        {dashboard && (
          <>
            {/* Student Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="text-lg font-semibold text-gray-800">{dashboard.student_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-800">{dashboard.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Major</p>
                  <p className="text-lg font-semibold text-gray-800">{dashboard.major}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class Group</p>
                  <p className="text-lg font-semibold text-gray-800">{dashboard.class_group}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card title="Curriculum" value={dashboard.curriculum} icon={BookOpen} color="primary" />
              <Card title="GPA" value={dashboard.gpa?.toFixed(2)} icon={Award} color="green" />
              <Card title="Progress" value={`${dashboard.progress}%`} icon={TrendingUp} color="orange" />
              <Card title="Total Credits" value={dashboard.total_credit} icon={Users} color="primary" />
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Curriculum Progress</h2>
              <ProgressBar value={dashboard.progress} label="Overall Progress" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
