import express from 'express';
import { logActivity, getActivities, getTodayActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, logActivity)
  .get(protect, getActivities);

router.get('/today', protect, getTodayActivity);

export default router;
