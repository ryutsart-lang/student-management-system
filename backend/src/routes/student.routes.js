import express from 'express';
import { getProfile, getAllStudents, createStudent, updateStudent, deleteStudent } from '../controllers/student.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.get('/', verifyAdmin, getAllStudents);
router.post('/', verifyAdmin, createStudent);
router.put('/:student_id', verifyAdmin, updateStudent);
router.delete('/:student_id', verifyAdmin, deleteStudent);

export default router;
