
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

export { db, run, get, all };

export async function initDatabase() {
  console.log('Initializing database...');

  // Users table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      referral_code TEXT UNIQUE NOT NULL,
      referred_by INTEGER,
      blocked BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referred_by) REFERENCES users (id)
    )
  `);

  // Investment packages table
  await run(`
    CREATE TABLE IF NOT EXISTS investment_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      daily_return INTEGER NOT NULL,
      duration_days INTEGER DEFAULT 30,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User investments table
  await run(`
    CREATE TABLE IF NOT EXISTS user_investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      package_id INTEGER NOT NULL,
      payment_type TEXT NOT NULL CHECK(payment_type IN ('pay_now', 'pay_later')),
      amount_invested INTEGER NOT NULL,
      amount_paid INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'completed', 'cancelled')),
      start_date DATETIME,
      end_date DATETIME,
      initial_payment_deadline DATETIME,
      full_payment_deadline DATETIME,
      last_return_processed DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (package_id) REFERENCES investment_packages (id)
    )
  `);

  // Wallet table
  await run(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      balance INTEGER DEFAULT 0,
      points REAL DEFAULT 0,
      total_withdrawn INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Transactions table
  await run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('bonus', 'cashback', 'withdrawal', 'investment', 'milestone', 'daily_return')),
      amount INTEGER NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'failed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Referral bonuses table
  await run(`
    CREATE TABLE IF NOT EXISTS referral_bonuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_id INTEGER NOT NULL,
      referred_id INTEGER NOT NULL,
      investment_id INTEGER NOT NULL,
      class TEXT NOT NULL CHECK(class IN ('A', 'B', 'C')),
      percentage REAL NOT NULL,
      amount INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrer_id) REFERENCES users (id),
      FOREIGN KEY (referred_id) REFERENCES users (id),
      FOREIGN KEY (investment_id) REFERENCES user_investments (id)
    )
  `);

  // Notifications table
  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Investment packages seed data
  await run(`
    INSERT OR IGNORE INTO investment_packages (id, amount, daily_return) VALUES
    (1, 10000, 1500),
    (2, 25000, 3750),
    (3, 50000, 7500),
    (4, 100000, 15000),
    (5, 250000, 37500),
    (6, 500000, 75000)
  `);

  console.log('Database initialized successfully');
}
