import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Login
export const login = async (req, res) => {
  try {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({ error: 'Student ID and password are required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT u.id, u.student_id, u.password, u.role, s.first_name, s.last_name FROM users u LEFT JOIN students s ON u.student_id = s.student_id WHERE u.student_id = ?',
      [student_id]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid student ID or password' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid student ID or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        student_id: user.student_id,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user.id,
        student_id: user.student_id,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Register
export const register = async (req, res) => {
  try {
    const { student_id, password, phone, class_group } = req.body;

    if (!student_id || !password || !phone || !class_group) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const connection = await pool.getConnection();

    // Check if student exists in students table
    const [students] = await connection.query(
      'SELECT student_id FROM students WHERE student_id = ?',
      [student_id]
    );

    if (students.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'ไม่พบข้อมูลนักศึกษา กรุณาติดต่อผู้ดูแลระบบ' });
    }

    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE student_id = ?',
      [student_id]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await connection.query(
      'INSERT INTO users (student_id, password, phone, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [student_id, hashedPassword, phone, 'student']
    );

    // Update student with class_group
    await connection.query(
      'UPDATE students SET class_group = ? WHERE student_id = ?',
      [class_group, student_id]
    );

    connection.release();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
