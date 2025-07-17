
import express from 'express';
import { run, get, all } from '../database/init';
import { auth } from '../middleware/auth';
import { addHours, addDays } from '../utils/helpers';

const router = express.Router();

// Get all investment packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await all('SELECT * FROM investment_packages WHERE active = 1');
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new investment
router.post('/', auth, async (req, res) => {
  try {
    const { packageId, paymentType } = req.body;
    const userId = req.userId;

    const package_ = await get('SELECT * FROM investment_packages WHERE id = ? AND active = 1', [packageId]);
    if (!package_) {
      return res.status(404).json({ message: 'Investment package not found' });
    }

    const now = new Date();
    let initialPaymentDeadline = null;
    let fullPaymentDeadline = null;

    if (paymentType === 'pay_later') {
      initialPaymentDeadline = addHours(now, 3);
      fullPaymentDeadline = addDays(now, 14);
    }

    const result = await run(`
      INSERT INTO user_investments 
      (user_id, package_id, payment_type, amount_invested, initial_payment_deadline, full_payment_deadline)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, packageId, paymentType, package_.amount, initialPaymentDeadline?.toISOString(), fullPaymentDeadline?.toISOString()]);

    res.status(201).json({
      id: result.lastID,
      packageId,
      paymentType,
      amount: package_.amount,
      initialPaymentDeadline,
      fullPaymentDeadline
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user investments
router.get('/user', auth, async (req, res) => {
  try {
    const investments = await all(`
      SELECT ui.*, ip.daily_return, ip.duration_days
      FROM user_investments ui
      JOIN investment_packages ip ON ui.package_id = ip.id
      WHERE ui.user_id = ?
      ORDER BY ui.created_at DESC
    `, [req.userId]);

    res.json(investments);
  } catch (error) {
    console.error('Error fetching user investments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Make payment for investment
router.post('/payment', auth, async (req, res) => {
  try {
    const { investmentId, amount, usePoints } = req.body;
    const userId = req.userId;

    const investment = await get(
      'SELECT * FROM user_investments WHERE id = ? AND user_id = ?',
      [investmentId, userId]
    );

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    const wallet = await get('SELECT * FROM wallet WHERE user_id = ?', [userId]);
    const amountInCents = Math.round(amount * 100);

    // Check if user has sufficient funds
    if (usePoints) {
      const pointsNeeded = amount / 20; // 1 point = R20
      if (wallet.points < pointsNeeded) {
        return res.status(400).json({ message: 'Insufficient points' });
      }
    } else {
      if (wallet.balance < amountInCents) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    }

    // Process payment
    if (usePoints) {
      const pointsUsed = amount / 20;
      await run('UPDATE wallet SET points = points - ? WHERE user_id = ?', [pointsUsed, userId]);
    } else {
      await run('UPDATE wallet SET balance = balance - ? WHERE user_id = ?', [amountInCents, userId]);
    }

    // Update investment
    const newAmountPaid = investment.amount_paid + amountInCents;
    const isFullyPaid = newAmountPaid >= investment.amount_invested;

    await run(`
      UPDATE user_investments 
      SET amount_paid = ?, status = ?, start_date = ?
      WHERE id = ?
    `, [
      newAmountPaid,
      isFullyPaid ? 'active' : 'pending',
      isFullyPaid ? new Date().toISOString() : investment.start_date,
      investmentId
    ]);

    // Record transaction
    await run(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, 'investment', ?, ?)
    `, [userId, -amountInCents, `Payment for investment #${investmentId}`]);

    res.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
