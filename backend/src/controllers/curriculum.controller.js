import pool from '../config/database.js';

// Get all curriculums
export const getCurriculums = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [curriculums] = await connection.query('SELECT * FROM curriculums ORDER BY id ASC');
    connection.release();

    res.json(curriculums);
  } catch (error) {
    console.error('Get curriculums error:', error);
    res.status(500).json({ error: 'Failed to fetch curriculums' });
  }
};

// Create curriculum (Admin)
export const createCurriculum = async (req, res) => {
  try {
    const { curriculum_name, total_credit } = req.body;

    if (!curriculum_name || !total_credit) {
      return res.status(400).json({ error: 'Curriculum name and total credit are required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO curriculums (curriculum_name, total_credit) VALUES (?, ?)',
      [curriculum_name, total_credit]
    );
    connection.release();

    res.status(201).json({ message: 'Curriculum created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create curriculum error:', error);
    res.status(500).json({ error: 'Failed to create curriculum' });
  }
};

// Update curriculum (Admin)
export const updateCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const { curriculum_name, total_credit } = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE curriculums SET curriculum_name = ?, total_credit = ? WHERE id = ?',
      [curriculum_name, total_credit, id]
    );
    connection.release();

    res.json({ message: 'Curriculum updated successfully' });
  } catch (error) {
    console.error('Update curriculum error:', error);
    res.status(500).json({ error: 'Failed to update curriculum' });
  }
};

// Delete curriculum (Admin)
export const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM curriculums WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Curriculum deleted successfully' });
  } catch (error) {
    console.error('Delete curriculum error:', error);
    res.status(500).json({ error: 'Failed to delete curriculum' });
  }
};
