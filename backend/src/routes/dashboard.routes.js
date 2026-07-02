import express from 'express';
import { getDashboardStats, getStudentDashboard } from '../controllers/dashboard.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', verifyAdmin, getDashboardStats);
router.get('/student', verifyToken, getStudentDashboard);

export default router;
