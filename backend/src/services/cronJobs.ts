
import { run, get, all } from '../database/init';

export async function processInvestmentReturns() {
  console.log('Processing daily investment returns...');
  
  try {
    // Get all active investments that haven't been processed today
    const investments = await all(`
      SELECT ui.*, ip.daily_return
      FROM user_investments ui
      JOIN investment_packages ip ON ui.package_id = ip.id
      WHERE ui.status = 'active'
      AND ui.start_date IS NOT NULL
      AND (ui.last_return_processed IS NULL OR DATE(ui.last_return_processed) < DATE('now'))
      AND DATE(ui.start_date) <= DATE('now')
    `);

    for (const investment of investments) {
      const startDate = new Date(investment.start_date);
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only process if within 30 days
      if (daysSinceStart < 30) {
        // Add daily return to wallet
        await run('UPDATE wallet SET balance = balance + ? WHERE user_id = ?', 
          [investment.daily_return, investment.user_id]);
        
        // Record transaction
        await run(`
          INSERT INTO transactions (user_id, type, amount, description)
          VALUES (?, 'daily_return', ?, ?)
        `, [
          investment.user_id,
          investment.daily_return,
          `Daily return for investment #${investment.id}`
        ]);
        
        // Update last processed date
        await run('UPDATE user_investments SET last_return_processed = ? WHERE id = ?',
          [now.toISOString(), investment.id]);
      } else if (daysSinceStart >= 30) {
        // Complete the investment
        await run('UPDATE user_investments SET status = "completed", end_date = ? WHERE id = ?',
          [now.toISOString(), investment.id]);
        
        // Add notification
        await run(`
          INSERT INTO notifications (user_id, type, title, message, priority)
          VALUES (?, 'investment_completed', 'Investment Completed', ?, 'medium')
        `, [
          investment.user_id,
          `Your R${(investment.amount_invested / 100).toFixed(0)} investment has completed its 30-day cycle.`
        ]);
      }
    }
    
    console.log(`Processed returns for ${investments.length} investments`);
  } catch (error) {
    console.error('Error processing investment returns:', error);
  }
}

export async function checkPaymentDeadlines() {
  console.log('Checking payment deadlines...');
  
  try {
    const now = new Date();
    
    // Check for missed initial payments (3 hours)
    const missedInitialPayments = await all(`
      SELECT * FROM user_investments
      WHERE payment_type = 'pay_later'
      AND amount_paid = 0
      AND initial_payment_deadline < ?
      AND status = 'pending'
    `, [now.toISOString()]);
    
    for (const investment of missedInitialPayments) {
      // Check if this is user's first investment
      const userInvestmentCount = await get(`
        SELECT COUNT(*) as count FROM user_investments
        WHERE user_id = ? AND status IN ('active', 'completed')
      `, [investment.user_id]);
      
      if (userInvestmentCount.count === 0) {
        // Block user if this is their first investment
        await run('UPDATE users SET blocked = 1 WHERE id = ?', [investment.user_id]);
        
        await run(`
          INSERT INTO notifications (user_id, type, title, message, priority)
          VALUES (?, 'account_blocked', 'Account Blocked', ?, 'high')
        `, [
          investment.user_id,
          'Your account has been blocked due to missed initial payment deadline.'
        ]);
      } else {
        // Delete the investment
        await run('UPDATE user_investments SET status = "cancelled" WHERE id = ?', [investment.id]);
      }
    }
    
    // Check for missed full payments (14 days)
    const missedFullPayments = await all(`
      SELECT * FROM user_investments
      WHERE payment_type = 'pay_later'
      AND amount_paid < amount_invested
      AND full_payment_deadline < ?
      AND status = 'active'
    `, [now.toISOString()]);
    
    for (const investment of missedFullPayments) {
      // Reset to pending, require full payment again
      await run(`
        UPDATE user_investments 
        SET status = 'pending', amount_paid = 0, start_date = NULL
        WHERE id = ?
      `, [investment.id]);
      
      await run(`
        INSERT INTO notifications (user_id, type, title, message, priority)
        VALUES (?, 'payment_deadline_missed', 'Payment Deadline Missed', ?, 'high')
      `, [
        investment.user_id,
        `Your 14-day payment deadline for investment #${investment.id} has been missed. Full payment is now required.`
      ]);
    }
    
    console.log(`Processed ${missedInitialPayments.length} missed initial payments and ${missedFullPayments.length} missed full payments`);
  } catch (error) {
    console.error('Error checking payment deadlines:', error);
  }
}
