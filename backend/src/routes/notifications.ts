
import express from 'express';
import { run, get, all } from '../database/init';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await all(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
    `, [req.userId]);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await run(`
      UPDATE notifications 
      SET read = 1 
      WHERE id = ? AND user_id = ?
    `, [req.params.id, req.userId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
