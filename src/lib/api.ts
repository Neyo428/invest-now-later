
// Mock API client for frontend-only functionality
class MockApiClient {
  private token: string | null = null;
  private mockUsers: any[] = [
    {
      id: 1,
      email: 'admin@test.com',
      referralCode: 'INV-ADMIN1',
      createdAt: new Date().toISOString()
    }
  ];
  private mockInvestments: any[] = [];
  private mockWallet = {
    balance: 150000, // R1,500.00 in cents
    points: 25.5,
    transactions: [
      {
        id: 1,
        type: 'bonus',
        amount: 5000,
        description: 'Referral bonus from John Doe',
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2,
        type: 'daily_return',
        amount: 15000,
        description: 'Daily return from R1000 investment',
        status: 'completed',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  };
  private mockPackages = [
    { id: 1, amount: 10000, daily_return: 1500, duration_days: 30, active: true },
    { id: 2, amount: 25000, daily_return: 3750, duration_days: 30, active: true },
    { id: 3, amount: 50000, daily_return: 7500, duration_days: 30, active: true },
    { id: 4, amount: 100000, daily_return: 15000, duration_days: 30, active: true },
    { id: 5, amount: 250000, daily_return: 37500, duration_days: 30, active: true },
    { id: 6, amount: 500000, daily_return: 75000, duration_days: 30, active: true }
  ];

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password: string) {
    await this.delay();
    
    if (email === 'admin@test.com' && password === 'admin123') {
      const user = this.mockUsers[0];
      return {
        token: 'mock-jwt-token',
        user
      };
    }
    
    // Create new user for any other email/password combo
    const newUser = {
      id: this.mockUsers.length + 1,
      email,
      referralCode: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    this.mockUsers.push(newUser);
    
    return {
      token: 'mock-jwt-token',
      user: newUser
    };
  }

  async register(email: string, password: string, referralCode?: string) {
    await this.delay();
    
    const newUser = {
      id: this.mockUsers.length + 1,
      email,
      referralCode: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    this.mockUsers.push(newUser);
    
    return {
      token: 'mock-jwt-token',
      user: newUser
    };
  }

  async getProfile() {
    await this.delay();
    return this.mockUsers[0];
  }

  async getInvestmentPackages() {
    await this.delay();
    return this.mockPackages;
  }

  async createInvestment(packageId: number, paymentType: string) {
    await this.delay();
    
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (!pkg) throw new Error('Package not found');
    
    const newInvestment = {
      id: this.mockInvestments.length + 1,
      package_id: packageId,
      payment_type: paymentType,
      amount_invested: pkg.amount,
      amount_paid: paymentType === 'pay_now' ? pkg.amount : Math.floor(pkg.amount * 0.2),
      daily_return: pkg.daily_return,
      status: paymentType === 'pay_now' ? 'active' : 'pending',
      start_date: paymentType === 'pay_now' ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    };
    
    this.mockInvestments.push(newInvestment);
    return newInvestment;
  }

  async getUserInvestments() {
    await this.delay();
    return this.mockInvestments;
  }

  async makePayment(investmentId: number, amount: number, usePoints: boolean = false) {
    await this.delay();
    
    const investment = this.mockInvestments.find(inv => inv.id === investmentId);
    if (!investment) throw new Error('Investment not found');
    
    investment.amount_paid += amount;
    if (investment.amount_paid >= investment.amount_invested) {
      investment.status = 'active';
      investment.start_date = new Date().toISOString();
    }
    
    return { success: true };
  }

  async getWallet() {
    await this.delay();
    return this.mockWallet;
  }

  async getTransactions() {
    await this.delay();
    return this.mockWallet.transactions;
  }

  async withdraw(amount: number, method: string) {
    await this.delay();
    
    this.mockWallet.balance -= amount;
    this.mockWallet.transactions.unshift({
      id: this.mockWallet.transactions.length + 1,
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrawal via ${method}`,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    return { success: true };
  }

  async getReferrals() {
    await this.delay();
    return {
      classA: [
        { id: 1, email: 'user1@test.com', joinDate: new Date(Date.now() - 86400000).toISOString(), earnings: 7000 },
        { id: 2, email: 'user2@test.com', joinDate: new Date(Date.now() - 172800000).toISOString(), earnings: 3500 }
      ],
      classB: [
        { id: 3, email: 'user3@test.com', joinDate: new Date(Date.now() - 259200000).toISOString(), earnings: 2000 }
      ],
      classC: []
    };
  }

  async getReferralStats() {
    await this.delay();
    return {
      classA: 2,
      classB: 1,
      classC: 0,
      earnings: {
        classA: 10500,
        classB: 2000,
        classC: 0
      }
    };
  }

  async getNotifications() {
    await this.delay();
    return [
      {
        id: 1,
        type: 'bonus',
        title: 'Referral Bonus Received',
        message: 'You earned R70 from a Class A referral',
        priority: 'medium',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        type: 'investment',
        title: 'Investment Activated',
        message: 'Your R1,000 investment is now active and earning daily returns',
        priority: 'high',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  async markNotificationRead(id: number) {
    await this.delay();
    return { success: true };
  }

  // Admin methods (mock data)
  async get(endpoint: string): Promise<any> {
    await this.delay();
    
    if (endpoint.includes('/admin/users')) {
      return this.mockUsers.map(user => ({
        ...user,
        wallet_balance: this.mockWallet.balance,
        blocked: false
      }));
    }
    
    if (endpoint.includes('/admin/investments')) {
      return this.mockInvestments.map(inv => ({
        ...inv,
        user_email: this.mockUsers.find(u => u.id === 1)?.email || 'admin@test.com'
      }));
    }
    
    if (endpoint.includes('/admin/transactions')) {
      return this.mockWallet.transactions.map(trans => ({
        ...trans,
        user_email: 'admin@test.com'
      }));
    }
    
    if (endpoint.includes('/admin/stats')) {
      return {
        totalUsers: this.mockUsers.length,
        totalInvestments: this.mockInvestments.reduce((sum, inv) => sum + inv.amount_invested, 0),
        activeInvestments: this.mockInvestments.filter(inv => inv.status === 'active').length,
        pendingPayments: this.mockInvestments.filter(inv => inv.status === 'pending').length,
        totalRevenue: 50000,
        totalWithdrawals: 25000,
        pendingPaymentAmount: 15000,
        activeUsers: this.mockUsers.length,
        blockedUsers: 0,
        usersWithInvestments: 1
      };
    }
    
    return [];
  }

  async post(endpoint: string, data?: any) {
    await this.delay();
    return { success: true };
  }

  async patch(endpoint: string, data?: any) {
    await this.delay();
    return { success: true };
  }
}

export const apiClient = new MockApiClient();
