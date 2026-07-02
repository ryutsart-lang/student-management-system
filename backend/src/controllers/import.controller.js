import pool from '../config/database.js';
import XLSX from 'xlsx';
import fs from 'fs';

export const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const connection = await pool.getConnection();
    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      try {
        const { student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress } = row;

        if (!student_id || !first_name || !last_name) {
          errorCount++;
          continue;
        }

        const [existing] = await connection.query(
          'SELECT student_id FROM students WHERE student_id = ?',
          [student_id]
        );

        if (existing.length > 0) {
          await connection.query(
            'UPDATE students SET first_name = ?, last_name = ?, major = ?, class_group = ?, curriculum_id = ?, gpa = ?, progress = ? WHERE student_id = ?',
            [first_name, last_name, major, class_group, curriculum_id, gpa || 0, progress || 0, student_id]
          );
        } else {
          await connection.query(
            'INSERT INTO students (student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [student_id, first_name, last_name, major, class_group, curriculum_id, gpa || 0, progress || 0]
          );
        }

        successCount++;
      } catch (error) {
        console.error('Error importing row:', error);
        errorCount++;
      }
    }

    connection.release();
    fs.unlinkSync(filePath);

    res.json({ message: 'Import completed', successCount, errorCount, totalRows: data.length });
  } catch (error) {
    console.error('Import error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Import failed' });
  }
};

export const exportStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query(
      'SELECT s.*, c.curriculum_name FROM students s LEFT JOIN curriculums c ON s.curriculum_id = c.id ORDER BY s.student_id ASC'
    );
    connection.release();

    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const fileName = `students_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, `uploads/${fileName}`);

    res.download(`uploads/${fileName}`, fileName, (err) => {
      if (err) console.error('Download error:', err);
      fs.unlinkSync(`uploads/${fileName}`);
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
};
