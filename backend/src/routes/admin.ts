
import express from 'express';
import { run, get, all } from '../database/init';
import { auth } from '../middleware/auth';

const router = express.Router();

// Admin middleware (simple check - in production, you'd want proper role-based auth)
const adminAuth = async (req: any, res: any, next: any) => {
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [req.userId]);
    // For demo purposes, make first user admin or check email
    if (user.id === 1 || user.email.includes('admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await all(`
      SELECT 
        u.*,
        w.balance as wallet_balance,
        w.points,
        COUNT(ui.id) as investment_count
      FROM users u
      LEFT JOIN wallet w ON u.id = w.user_id
      LEFT JOIN user_investments ui ON u.id = ui.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all investments
router.get('/investments', auth, adminAuth, async (req, res) => {
  try {
    const investments = await all(`
      SELECT 
        ui.*,
        u.email as user_email,
        ip.daily_return
      FROM user_investments ui
      JOIN users u ON ui.user_id = u.id
      JOIN investment_packages ip ON ui.package_id = ip.id
      ORDER BY ui.created_at DESC
    `);

    res.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all transactions
router.get('/transactions', auth, adminAuth, async (req, res) => {
  try {
    const transactions = await all(`
      SELECT 
        t.*,
        u.email as user_email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 100
    `);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get admin statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await get('SELECT COUNT(*) as count FROM users');
    const totalInvestments = await get('SELECT COALESCE(SUM(amount_invested), 0) as total FROM user_investments');
    const activeInvestments = await get('SELECT COUNT(*) as count FROM user_investments WHERE status = "active"');
    const pendingPayments = await get('SELECT COUNT(*) as count FROM user_investments WHERE payment_type = "pay_later" AND amount_paid < amount_invested');
    const totalWithdrawals = await get('SELECT COALESCE(SUM(ABS(amount)), 0) as total FROM transactions WHERE type = "withdrawal"');
    const activeUsers = await get('SELECT COUNT(*) as count FROM users WHERE blocked != 1 OR blocked IS NULL');
    const blockedUsers = await get('SELECT COUNT(*) as count FROM users WHERE blocked = 1');
    const usersWithInvestments = await get('SELECT COUNT(DISTINCT user_id) as count FROM user_investments');

    res.json({
      totalUsers: totalUsers.count,
      totalInvestments: totalInvestments.total,
      activeInvestments: activeInvestments.count,
      pendingPayments: pendingPayments.count,
      totalWithdrawals: totalWithdrawals.total,
      activeUsers: activeUsers.count,
      blockedUsers: blockedUsers.count,
      usersWithInvestments: usersWithInvestments.count
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Block user
router.post('/users/:id/block', auth, adminAuth, async (req, res) => {
  try {
    await run('UPDATE users SET blocked = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unblock user
router.post('/users/:id/unblock', auth, adminAuth, async (req, res) => {
  try {
    await run('UPDATE users SET blocked = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
