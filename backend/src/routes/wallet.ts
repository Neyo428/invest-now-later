
import express from 'express';
import { run, get, all } from '../database/init';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get wallet details
router.get('/', auth, async (req, res) => {
  try {
    const wallet = await get('SELECT * FROM wallet WHERE user_id = ?', [req.userId]);
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      await run('INSERT INTO wallet (user_id) VALUES (?)', [req.userId]);
      const newWallet = await get('SELECT * FROM wallet WHERE user_id = ?', [req.userId]);
      return res.json(newWallet);
    }

    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await all(`
      SELECT * FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.userId]);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Process withdrawal
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, method } = req.body;
    const amountInCents = Math.round(amount * 100);

    const wallet = await get('SELECT * FROM wallet WHERE user_id = ?', [req.userId]);
    
    if (wallet.balance < amountInCents) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update wallet balance
    await run('UPDATE wallet SET balance = balance - ? WHERE user_id = ?', [amountInCents, req.userId]);

    // Record transaction
    await run(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, 'withdrawal', ?, ?)
    `, [req.userId, -amountInCents, `Withdrawal via ${method}`]);

    res.json({ success: true, message: 'Withdrawal processed successfully' });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
