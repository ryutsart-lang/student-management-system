import express from 'express';
import { importStudents, exportStudents } from '../controllers/import.controller.js';
import { verifyAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/students', verifyAdmin, upload.single('file'), importStudents);
router.get('/students/export', verifyAdmin, exportStudents);

export default router;
