
import { useState } from 'react';
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

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock user data
  const userData = {
    walletBalance: 1250.50,
    totalInvestments: 2500,
    classAEarnings: 175,
    classBEarnings: 40,
    classCEarnings: 12,
    referralCode: 'INV-789ABC',
    points: 12.5,
    activeInvestments: [
      {
        id: 1,
        package: 'R1000',
        type: 'Pay Now',
        progress: 65,
        daysRemaining: 11,
        dailyReturn: 150,
        totalReturn: 975
      },
      {
        id: 2,
        package: 'R500',
        type: 'Pay Later',
        progress: 20,
        daysRemaining: 24,
        dailyReturn: 75,
        totalReturn: 150,
        pendingPayment: 400,
        paymentDeadline: '2 days'
      }
    ],
    milestoneProgress: {
      currentTier: 'B',
      classAReferrals: 12,
      nextTierRequirement: 15,
      rewardEarned: 250
    }
  };

  const handleAuth = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  if (!isLoggedIn) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Investment Dashboard</h1>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <Button 
                variant="outline" 
                onClick={() => setIsLoggedIn(false)}
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
                      <p className="text-2xl font-bold">R{userData.walletBalance.toFixed(2)}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-green-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Investments</p>
                      <p className="text-2xl font-bold">R{userData.totalInvestments}</p>
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
                      <p className="text-2xl font-bold">{userData.points}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Referral Earnings</p>
                      <p className="text-2xl font-bold">R{userData.classAEarnings + userData.classBEarnings + userData.classCEarnings}</p>
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
                  {userData.activeInvestments.map((investment) => (
                    <div key={investment.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{investment.package} Package</h3>
                          <Badge variant={investment.type === 'Pay Now' ? 'default' : 'secondary'}>
                            {investment.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Daily Return</p>
                          <p className="font-semibold text-green-600">R{investment.dailyReturn}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{investment.progress}% • {investment.daysRemaining} days left</span>
                        </div>
                        <Progress value={investment.progress} className="h-2" />
                        
                        {investment.pendingPayment && (
                          <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>Pending payment: R{investment.pendingPayment} (Due in {investment.paymentDeadline})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timers */}
            <div className="grid md:grid-cols-2 gap-6">
              <TimerComponent 
                title="Pay Later Deadline"
                timeRemaining="2:15:30"
                type="warning"
                description="Complete your R400 payment for R500 package"
              />
              <TimerComponent 
                title="Investment Maturity"
                timeRemaining="10:23:45:12"
                type="success"
                description="R1000 package completing in 11 days"
              />
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <InvestmentPackages />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralSystem userData={userData} />
          </TabsContent>

          <TabsContent value="milestones">
            <AffiliateMilestones userData={userData} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletComponent userData={userData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
