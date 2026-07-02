import pool from '../config/database.js';

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const { student_id } = req.user;
    const connection = await pool.getConnection();

    const [students] = await connection.query(
      `SELECT s.*, c.curriculum_name, c.total_credit 
       FROM students s 
       LEFT JOIN curriculums c ON s.curriculum_id = c.id 
       WHERE s.student_id = ?`,
      [student_id]
    );

    connection.release();

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(students[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Get all students (Admin)
export const getAllStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { search, sort, filter } = req.query;

    let query = `SELECT s.*, c.curriculum_name FROM students s LEFT JOIN curriculums c ON s.curriculum_id = c.id`;
    const params = [];

    if (search) {
      query += ` WHERE s.student_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ?`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (sort) {
      query += ` ORDER BY ${sort}`;
    } else {
      query += ` ORDER BY s.student_id ASC`;
    }

    const [students] = await connection.query(query, params);
    connection.release();

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Create student (Admin)
export const createStudent = async (req, res) => {
  try {
    const { student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress } = req.body;

    if (!student_id || !first_name || !last_name) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO students (student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, first_name, last_name, major, class_group, curriculum_id, gpa || 0, progress || 0]
    );
    connection.release();

    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// Update student (Admin)
export const updateStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { first_name, last_name, major, class_group, curriculum_id, gpa, progress } = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      `UPDATE students SET first_name = ?, last_name = ?, major = ?, class_group = ?, curriculum_id = ?, gpa = ?, progress = ? 
       WHERE student_id = ?`,
      [first_name, last_name, major, class_group, curriculum_id, gpa, progress, student_id]
    );
    connection.release();

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete student (Admin)
export const deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const connection = await pool.getConnection();

    // Delete user first
    await connection.query('DELETE FROM users WHERE student_id = ?', [student_id]);
    // Delete student
    await connection.query('DELETE FROM students WHERE student_id = ?', [student_id]);

    connection.release();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
