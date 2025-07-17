
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private token: string | null = null;

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

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post('/api/auth/login', { email, password });
  }

  async register(email: string, password: string, referralCode?: string) {
    return this.post('/api/auth/register', { email, password, referralCode });
  }

  async getProfile() {
    return this.get('/api/auth/profile');
  }

  // Investment methods
  async getInvestmentPackages() {
    return this.get('/api/investments/packages');
  }

  async createInvestment(packageId: number, paymentType: string) {
    return this.post('/api/investments', { packageId, paymentType });
  }

  async getUserInvestments() {
    return this.get('/api/investments/user');
  }

  async makePayment(investmentId: number, amount: number, usePoints: boolean = false) {
    return this.post('/api/investments/payment', { investmentId, amount, usePoints });
  }

  // Wallet methods
  async getWallet() {
    return this.get('/api/wallet');
  }

  async getTransactions() {
    return this.get('/api/wallet/transactions');
  }

  async withdraw(amount: number, method: string) {
    return this.post('/api/wallet/withdraw', { amount, method });
  }

  // Referral methods
  async getReferrals() {
    return this.get('/api/referrals');
  }

  async getReferralStats() {
    return this.get('/api/referrals/stats');
  }

  // Notification methods
  async getNotifications() {
    return this.get('/api/notifications');
  }

  async markNotificationRead(id: number) {
    return this.patch(`/api/notifications/${id}/read`);
  }
}

export const apiClient = new ApiClient();
