
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
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
    const url = `${this.baseUrl}${endpoint}`;
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
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, referralCode?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, referralCode }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Investment endpoints
  async getInvestmentPackages() {
    return this.request('/investments/packages');
  }

  async createInvestment(packageId: number, paymentType: 'pay_now' | 'pay_later') {
    return this.request('/investments', {
      method: 'POST',
      body: JSON.stringify({ packageId, paymentType }),
    });
  }

  async getUserInvestments() {
    return this.request('/investments/user');
  }

  async makePayment(investmentId: number, amount: number, usePoints?: boolean) {
    return this.request('/investments/payment', {
      method: 'POST',
      body: JSON.stringify({ investmentId, amount, usePoints }),
    });
  }

  // Referral endpoints
  async getReferralData() {
    return this.request('/referrals');
  }

  async getMilestones() {
    return this.request('/referrals/milestones');
  }

  // Wallet endpoints
  async getWalletData() {
    return this.request('/wallet');
  }

  async getTransactions() {
    return this.request('/wallet/transactions');
  }

  async withdrawFunds(amount: number, method: string) {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, method }),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(notificationId: number) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();
