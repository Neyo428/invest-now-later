
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Copy, 
  Share2, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Calendar,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface ReferralSystemProps {
  userData: any;
}

export const ReferralSystem = ({ userData }: ReferralSystemProps) => {
  const [referralLink] = useState(`https://platform.com/ref/${userData.referralCode}`);
  
  const referralData = {
    classA: [
      { name: 'John Doe', email: 'john@example.com', invested: 500, earned: 35, status: 'Active', joinDate: '2024-01-15' },
      { name: 'Jane Smith', email: 'jane@example.com', invested: 1000, earned: 70, status: 'Active', joinDate: '2024-01-10' },
      { name: 'Mike Johnson', email: 'mike@example.com', invested: 250, earned: 17.5, status: 'Pending', joinDate: '2024-01-20' }
    ],
    classB: [
      { name: 'Sarah Wilson', email: 'sarah@example.com', invested: 750, earned: 15, status: 'Active', joinDate: '2024-01-12' },
      { name: 'Tom Brown', email: 'tom@example.com', invested: 300, earned: 6, status: 'Active', joinDate: '2024-01-18' }
    ],
    classC: [
      { name: 'Lisa Davis', email: 'lisa@example.com', invested: 500, earned: 5, status: 'Active', joinDate: '2024-01-14' }
    ]
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Investment Platform',
          text: 'Start investing with flexible payment options and earn great returns!',
          url: referralLink
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  const calculateTotalEarnings = () => {
    return userData.classAEarnings + userData.classBEarnings + userData.classCEarnings;
  };

  const getReferralStats = () => {
    return {
      classA: referralData.classA.length,
      classB: referralData.classB.length,
      classC: referralData.classC.length,
      totalActive: referralData.classA.filter(r => r.status === 'Active').length +
                   referralData.classB.filter(r => r.status === 'Active').length +
                   referralData.classC.filter(r => r.status === 'Active').length
    };
  };

  const stats = getReferralStats();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Referral System</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn from your referrals across three levels: 7% from Class A, 2% from Class B, and 1% from Class C
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Class A</p>
                <p className="text-2xl font-bold">{stats.classA}</p>
              </div>
              <Users className="h-8 w-8 text-blue-100" />
            </div>
            <p className="text-sm text-blue-100 mt-2">7% commission</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Class B</p>
                <p className="text-2xl font-bold">{stats.classB}</p>
              </div>
              <Users className="h-8 w-8 text-green-100" />
            </div>
            <p className="text-sm text-green-100 mt-2">2% commission</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Class C</p>
                <p className="text-2xl font-bold">{stats.classC}</p>
              </div>
              <Users className="h-8 w-8 text-purple-100" />
            </div>
            <p className="text-sm text-purple-100 mt-2">1% commission</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Total Earned</p>
                <p className="text-2xl font-bold">R{calculateTotalEarnings()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-100" />
            </div>
            <p className="text-sm text-orange-100 mt-2">All commissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                onClick={() => copyToClipboard(referralLink)}
                variant="outline"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={shareReferral}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Your referral code: <strong>{userData.referralCode}</strong></span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(userData.referralCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Referral Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classA">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="classA">Class A ({stats.classA})</TabsTrigger>
              <TabsTrigger value="classB">Class B ({stats.classB})</TabsTrigger>
              <TabsTrigger value="classC">Class C ({stats.classC})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="classA" className="mt-4">
              <div className="space-y-3">
                {referralData.classA.map((referral, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {referral.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{referral.name}</p>
                        <p className="text-sm text-gray-600">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R{referral.invested}</p>
                      <p className="text-sm text-gray-600">Invested</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">R{referral.earned}</p>
                      <p className="text-sm text-gray-600">You earned</p>
                    </div>
                    <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="classB" className="mt-4">
              <div className="space-y-3">
                {referralData.classB.map((referral, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {referral.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{referral.name}</p>
                        <p className="text-sm text-gray-600">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R{referral.invested}</p>
                      <p className="text-sm text-gray-600">Invested</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">R{referral.earned}</p>
                      <p className="text-sm text-gray-600">You earned</p>
                    </div>
                    <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="classC" className="mt-4">
              <div className="space-y-3">
                {referralData.classC.map((referral, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {referral.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{referral.name}</p>
                        <p className="text-sm text-gray-600">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R{referral.invested}</p>
                      <p className="text-sm text-gray-600">Invested</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">R{referral.earned}</p>
                      <p className="text-sm text-gray-600">You earned</p>
                    </div>
                    <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
