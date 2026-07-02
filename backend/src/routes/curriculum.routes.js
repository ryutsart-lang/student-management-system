import express from 'express';
import { getCurriculums, createCurriculum, updateCurriculum, deleteCurriculum } from '../controllers/curriculum.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCurriculums);
router.post('/', verifyAdmin, createCurriculum);
router.put('/:id', verifyAdmin, updateCurriculum);
router.delete('/:id', verifyAdmin, deleteCurriculum);

export default router;
