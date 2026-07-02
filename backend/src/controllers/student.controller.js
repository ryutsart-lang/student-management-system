import pool from '../config/database.js';

export const getProfile = async (req, res) => {
  try {
    const { student_id } = req.user;
    const connection = await pool.getConnection();

    const [students] = await connection.query(
      'SELECT s.*, c.curriculum_name, c.total_credit FROM students s LEFT JOIN curriculums c ON s.curriculum_id = c.id WHERE s.student_id = ?',
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

export const getAllStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { search, sort, page = 1, limit = 10 } = req.query;

    let query = 'SELECT s.*, c.curriculum_name FROM students s LEFT JOIN curriculums c ON s.curriculum_id = c.id WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (s.student_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const sortMap = {
      'student_id': 's.student_id ASC',
      'name': 's.first_name ASC',
      'gpa': 's.gpa DESC',
      'progress': 's.progress DESC',
    };
    const orderBy = sortMap[sort] || 's.student_id ASC';
    query += ` ORDER BY ${orderBy}`;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [students] = await connection.query(query, params);

    let countQuery = 'SELECT COUNT(*) as count FROM students s LEFT JOIN curriculums c ON s.curriculum_id = c.id WHERE 1=1';
    const countParams = [];
    if (search) {
      countQuery += ' AND (s.student_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    const [countResult] = await connection.query(countQuery, countParams);
    const total = countResult[0].count;

    connection.release();

    res.json({
      data: students,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const connection = await pool.getConnection();

    const [students] = await connection.query(
      'SELECT s.*, c.curriculum_name, c.total_credit FROM students s LEFT JOIN curriculums c ON s.curriculum_id = c.id WHERE s.student_id = ?',
      [student_id]
    );

    connection.release();

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(students[0]);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress } = req.body;

    if (!student_id || !first_name || !last_name) {
      return res.status(400).json({ error: 'Student ID, First Name, and Last Name are required' });
    }

    const connection = await pool.getConnection();
    const [existing] = await connection.query('SELECT student_id FROM students WHERE student_id = ?', [student_id]);

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Student already exists' });
    }

    await connection.query(
      'INSERT INTO students (student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [student_id, first_name, last_name, major, class_group, curriculum_id, gpa || 0, progress || 0]
    );
    connection.release();

    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { first_name, last_name, major, class_group, curriculum_id, gpa, progress } = req.body;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE students SET first_name = ?, last_name = ?, major = ?, class_group = ?, curriculum_id = ?, gpa = ?, progress = ? WHERE student_id = ?',
      [first_name, last_name, major, class_group, curriculum_id, gpa, progress, student_id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const connection = await pool.getConnection();

    await connection.query('DELETE FROM users WHERE student_id = ?', [student_id]);
    const [result] = await connection.query('DELETE FROM students WHERE student_id = ?', [student_id]);

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
