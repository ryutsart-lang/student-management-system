import api from './api';

export const authService = {
  login: (student_id, password) =>
    api.post('/auth/login', { student_id, password }),

  register: (student_id, password, phone, class_group) =>
    api.post('/auth/register', { student_id, password, phone, class_group }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const studentService = {
  getProfile: () => api.get('/students/profile'),
  getAllStudents: (search, sort) =>
    api.get('/students', { params: { search, sort } }),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (student_id, data) =>
    api.put(`/students/${student_id}`, data),
  deleteStudent: (student_id) => api.delete(`/students/${student_id}`),
};

export const curriculumService = {
  getCurriculums: () => api.get('/curriculums'),
  createCurriculum: (data) => api.post('/curriculums', data),
  updateCurriculum: (id, data) => api.put(`/curriculums/${id}`, data),
  deleteCurriculum: (id) => api.delete(`/curriculums/${id}`),
};

export const dashboardService = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getStudentDashboard: () => api.get('/dashboard/student'),
};
