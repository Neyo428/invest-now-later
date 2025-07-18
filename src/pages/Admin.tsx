
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Ban,
  CheckCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers?: number;
  totalInvestments?: number;
  activeInvestments?: number;
  pendingPayments?: number;
  totalRevenue?: number;
  totalWithdrawals?: number;
  pendingPaymentAmount?: number;
  activeUsers?: number;
  blockedUsers?: number;
  usersWithInvestments?: number;
}

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState<AdminStats>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const usersData = await apiClient.get('/api/admin/users');
      const investmentsData = await apiClient.get('/api/admin/investments');
      const transactionsData = await apiClient.get('/api/admin/transactions');
      const statsData = await apiClient.get('/api/admin/stats');
      
      setUsers(usersData);
      setInvestments(investmentsData);
      setTransactions(transactionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      await apiClient.post(`/api/admin/users/${userId}/block`);
      toast.success('User blocked successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await apiClient.post(`/api/admin/users/${userId}/unblock`);
      toast.success('User unblocked successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  const filteredUsers = users.filter((user: any) => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Platform
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Investments</p>
                  <p className="text-2xl font-bold">R{stats.totalInvestments ? (stats.totalInvestments / 100).toFixed(0) : '0'}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Active Investments</p>
                  <p className="text-2xl font-bold">{stats.activeInvestments || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Pending Payments</p>
                  <p className="text-2xl font-bold">{stats.pendingPayments || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">{user.email}</p>
                            <p className="text-sm text-gray-600">ID: {user.id} • Code: {user.referral_code}</p>
                            <p className="text-sm text-gray-600">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Wallet Balance</p>
                            <p className="font-semibold">R{user.wallet_balance ? (user.wallet_balance / 100).toFixed(2) : '0.00'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.blocked ? 'destructive' : 'default'}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </Badge>
                        {user.blocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnblockUser(user.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBlockUser(user.id)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Investment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.map((investment: any) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">Investment #{investment.id}</p>
                            <p className="text-sm text-gray-600">User: {investment.user_email}</p>
                            <p className="text-sm text-gray-600">Amount: R{(investment.amount_invested / 100).toFixed(2)}</p>
                          </div>
                          <div>
                            <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                              {investment.status}
                            </Badge>
                            <Badge variant={investment.payment_type === 'pay_now' ? 'default' : 'outline'} className="ml-2">
                              {investment.payment_type === 'pay_now' ? 'Pay Now' : 'Pay Later'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-semibold">{new Date(investment.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <p className="text-sm text-gray-600">User: {transaction.user_email}</p>
                            <p className="text-sm text-gray-600">Type: {transaction.type}</p>
                          </div>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}R{Math.abs(transaction.amount / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Financial Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Platform Revenue:</span>
                        <span className="font-semibold">R{stats.totalRevenue ? (stats.totalRevenue / 100).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Withdrawals:</span>
                        <span className="font-semibold">R{stats.totalWithdrawals ? (stats.totalWithdrawals / 100).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Payments:</span>
                        <span className="font-semibold">R{stats.pendingPaymentAmount ? (stats.pendingPaymentAmount / 100).toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">User Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <span className="font-semibold">{stats.activeUsers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blocked Users:</span>
                        <span className="font-semibold">{stats.blockedUsers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Users with Investments:</span>
                        <span className="font-semibold">{stats.usersWithInvestments || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
