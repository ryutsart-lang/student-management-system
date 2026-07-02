import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { dashboardService, studentService } from '../services';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getAdminStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const COLORS = ['#0066CC', '#4CAF50', '#FF9800', '#F44336'];

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System Overview and Statistics</p>
        </div>

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card title="Total Students" value={stats.stats.totalStudents} icon={Users} color="primary" />
              <Card title="Total Curriculum" value={stats.stats.totalCurriculums} icon={BookOpen} color="green" />
              <Card title="Average GPA" value={stats.stats.averageGPA} icon={Award} color="orange" />
              <Card title="Completed" value={stats.stats.completedStudents} icon={TrendingUp} color="red" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* GPA Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">GPA Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.charts.gpaDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0066CC" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Class Group Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Class Group Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.charts.classGroupDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.charts.classGroupDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Curriculum Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Students per Curriculum</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.charts.curriculumDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="curriculum_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#0066CC" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
