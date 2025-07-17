import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Clock, 
  Trophy, 
  Target,
  DollarSign,
  Gift,
  Timer,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { InvestmentPackages } from '@/components/investment/InvestmentPackages';
import { ReferralSystem } from '@/components/referral/ReferralSystem';
import { AffiliateMilestones } from '@/components/affiliate/AffiliateMilestones';
import { WalletComponent } from '@/components/wallet/WalletComponent';
import { TimerComponent } from '@/components/timers/TimerComponent';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const Index = () => {
  const { user, logout, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletData, setWalletData] = useState(null);
  const [investmentsData, setInvestmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !isLoading) {
      fetchUserData();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [user, isLoading]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [wallet, investments] = await Promise.all([
        apiClient.getWallet(),
        apiClient.getUserInvestments()
      ]);
      setWalletData(wallet);
      setInvestmentsData(investments);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = () => {
    setShowAuthModal(false);
    fetchUserData();
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Investment & Referral Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Grow your wealth with flexible investment options and earn through referrals
            </p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <TrendingUp className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <CardTitle className="text-green-600">Pay Now / Pay Later</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Flexible investment options with 15% daily returns over 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <CardTitle className="text-blue-600">Multi-Level Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn 7% from Class A, 2% from Class B, and 1% from Class C referrals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Trophy className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                <CardTitle className="text-purple-600">Affiliate Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Unlock instant wallet rewards up to R1,000 through milestone achievements
                </p>
              </CardContent>
            </Card>
          </div>

          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuth}
          />
        </div>
      </div>
    );
  }

  const calculateProgress = (investment: any) => {
    if (!investment.start_date) return 0;
    const startDate = new Date(investment.start_date);
    const now = new Date();
    const totalDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const elapsed = now.getTime() - startDate.getTime();
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const calculateTimeRemaining = (investment: any) => {
    if (!investment.start_date) return 'Not started';
    const startDate = new Date(investment.start_date);
    const endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const remaining = endDate.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Completed';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Investment Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <NotificationCenter />
              <Button 
                variant="outline" 
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Wallet Balance</p>
                      <p className="text-2xl font-bold">R{walletData ? (walletData.balance / 100).toFixed(2) : '0.00'}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-green-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Active Investments</p>
                      <p className="text-2xl font-bold">{investmentsData.filter((inv: any) => inv.status === 'active').length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Points</p>
                      <p className="text-2xl font-bold">{walletData ? walletData.points.toFixed(1) : '0.0'}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Referral Code</p>
                      <p className="text-xl font-bold">{user.referralCode}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-100" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Investments */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentsData.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No investments yet. Start investing to see your portfolio here!</p>
                  ) : (
                    investmentsData.map((investment: any) => (
                      <div key={investment.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">R{(investment.amount_invested / 100).toFixed(0)} Package</h3>
                            <Badge variant={investment.payment_type === 'pay_now' ? 'default' : 'secondary'}>
                              {investment.payment_type === 'pay_now' ? 'Pay Now' : 'Pay Later'}
                            </Badge>
                            <Badge variant={investment.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                              {investment.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Daily Return</p>
                            <p className="font-semibold text-green-600">R{(investment.daily_return / 100).toFixed(0)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateProgress(investment).toFixed(0)}% • {calculateTimeRemaining(investment)}</span>
                          </div>
                          <Progress value={calculateProgress(investment)} className="h-2" />
                          
                          {investment.payment_type === 'pay_later' && investment.amount_paid < investment.amount_invested && (
                            <div className="flex items-center gap-2 text-amber-600 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              <span>Pending payment: R{((investment.amount_invested - investment.amount_paid) / 100).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <InvestmentPackages />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralSystem />
          </TabsContent>

          <TabsContent value="milestones">
            <AffiliateMilestones />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletComponent walletData={walletData} onTransactionComplete={fetchUserData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
