import pool from '../config/database.js';

// Admin Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Total students
    const [totalStudents] = await connection.query('SELECT COUNT(*) as count FROM students');

    // Total curriculums
    const [totalCurriculums] = await connection.query('SELECT COUNT(*) as count FROM curriculums');

    // Average GPA
    const [avgGPA] = await connection.query('SELECT AVG(gpa) as avg FROM students');

    // Students completed (progress = 100)
    const [completedStudents] = await connection.query(
      'SELECT COUNT(*) as count FROM students WHERE progress = 100'
    );

    // GPA Distribution
    const [gpaDistribution] = await connection.query(`
      SELECT 
        CASE 
          WHEN gpa >= 3.5 THEN '3.5-4.0'
          WHEN gpa >= 3.0 THEN '3.0-3.49'
          WHEN gpa >= 2.5 THEN '2.5-2.99'
          WHEN gpa >= 2.0 THEN '2.0-2.49'
          ELSE 'Below 2.0'
        END as range,
        COUNT(*) as count
      FROM students
      GROUP BY range
    `);

    // Class group distribution
    const [classGroupDistribution] = await connection.query(`
      SELECT class_group, COUNT(*) as count FROM students GROUP BY class_group
    `);

    // Curriculum distribution
    const [curriculumDistribution] = await connection.query(`
      SELECT c.curriculum_name, COUNT(s.student_id) as count 
      FROM curriculums c 
      LEFT JOIN students s ON c.id = s.curriculum_id 
      GROUP BY c.id, c.curriculum_name
    `);

    connection.release();

    res.json({
      stats: {
        totalStudents: totalStudents[0].count,
        totalCurriculums: totalCurriculums[0].count,
        averageGPA: (avgGPA[0].avg || 0).toFixed(2),
        completedStudents: completedStudents[0].count
      },
      charts: {
        gpaDistribution,
        classGroupDistribution,
        curriculumDistribution
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Student Dashboard
export const getStudentDashboard = async (req, res) => {
  try {
    const { student_id } = req.user;
    const connection = await pool.getConnection();

    const [students] = await connection.query(
      `SELECT s.*, c.curriculum_name, c.total_credit FROM students s 
       LEFT JOIN curriculums c ON s.curriculum_id = c.id 
       WHERE s.student_id = ?`,
      [student_id]
    );

    connection.release();

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = students[0];
    res.json({
      student_id: student.student_id,
      name: `${student.first_name} ${student.last_name}`,
      major: student.major,
      class_group: student.class_group,
      curriculum: student.curriculum_name || 'N/A',
      gpa: student.gpa,
      progress: student.progress,
      total_credit: student.total_credit
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};
