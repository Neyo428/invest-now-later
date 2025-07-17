
import express from 'express';
import { run, get, all } from '../database/init';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get user referrals
router.get('/', auth, async (req, res) => {
  try {
    const referrals = await all(`
      SELECT 
        u.id,
        u.email,
        u.created_at,
        COALESCE(SUM(CASE WHEN ui.status = 'active' THEN ui.amount_invested ELSE 0 END), 0) as total_invested,
        COUNT(CASE WHEN ui.status = 'active' THEN 1 END) as active_investments
      FROM users u
      LEFT JOIN user_investments ui ON u.id = ui.user_id
      WHERE u.referred_by = ?
      GROUP BY u.id, u.email, u.created_at
      ORDER BY u.created_at DESC
    `, [req.userId]);

    // Calculate referral earnings
    const earnings = await all(`
      SELECT 
        class,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM referral_bonuses
      WHERE referrer_id = ?
      GROUP BY class
    `, [req.userId]);

    const earningsMap = earnings.reduce((acc, item) => {
      acc[item.class] = {
        amount: item.total_amount,
        count: item.count
      };
      return acc;
    }, {});

    res.json({
      referrals,
      earnings: {
        classA: earningsMap.A || { amount: 0, count: 0 },
        classB: earningsMap.B || { amount: 0, count: 0 },
        classC: earningsMap.C || { amount: 0, count: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get referral statistics for milestones
router.get('/stats', auth, async (req, res) => {
  try {
    const classACount = await get(`
      SELECT COUNT(*) as count
      FROM users u
      JOIN user_investments ui ON u.id = ui.user_id
      WHERE u.referred_by = ? AND ui.status = 'active'
    `, [req.userId]);

    const userInvestments = await get(`
      SELECT COALESCE(SUM(amount_invested), 0) as total
      FROM user_investments
      WHERE user_id = ? AND status = 'active'
    `, [req.userId]);

    res.json({
      classAActiveReferrals: classACount.count,
      userTotalInvestment: userInvestments.total
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
