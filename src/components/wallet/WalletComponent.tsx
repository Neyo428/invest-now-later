
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Download, 
  CreditCard,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletComponentProps {
  walletData: any;
  onTransactionComplete: () => void;
}

export const WalletComponent = ({ walletData, onTransactionComplete }: WalletComponentProps) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(withdrawAmount) > (walletData?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    // Simulate withdrawal processing
    toast.success(`Withdrawal of R${withdrawAmount} initiated successfully!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    onTransactionComplete();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'bonus':
      case 'cashback':
      case 'milestone':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
      case 'investment':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'bonus':
      case 'cashback':
      case 'milestone':
        return 'text-green-600';
      case 'withdrawal':
      case 'investment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Use real wallet data or defaults
  const balance = walletData ? (walletData.balance / 100) : 0;
  const points = walletData ? walletData.points : 0;
  const pointsValue = points * 20; // 1 point = R20
  const transactions = walletData?.transactions || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Wallet</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your balance, points, and transaction history. Withdraw your earnings or use them for investments.
        </p>
      </div>

      {/* Wallet Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Available Balance</p>
                <p className="text-2xl font-bold">R{balance.toFixed(2)}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Points</p>
                <p className="text-2xl font-bold">{points}</p>
              </div>
              <Target className="h-8 w-8 text-purple-100" />
            </div>
            <p className="text-sm text-purple-100 mt-2">≈ R{pointsValue}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Pending</p>
                <p className="text-2xl font-bold">R0</p>
              </div>
              <Download className="h-8 w-8 text-blue-100" />
            </div>
            <p className="text-sm text-blue-100 mt-2">Withdrawals</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Total Withdrawn</p>
                <p className="text-2xl font-bold">R0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Wallet Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setShowWithdrawModal(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-12"
            >
              <Download className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
            
            <Button 
              variant="outline"
              className="h-12"
              onClick={() => toast.info('Use points during investment payment')}
            >
              <Target className="h-4 w-4 mr-2" />
              Use Points for Investment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet. Start investing to see your transaction history!</p>
            ) : (
              transactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-semibold">{transaction.description}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}R{Math.abs(transaction.amount / 100).toFixed(2)}
                    </p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Withdraw Funds
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold">Available Balance</p>
              <p className="text-2xl font-bold text-blue-600">R{balance.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Withdrawal Method</Label>
              <select 
                value={withdrawMethod} 
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="bank">Bank Transfer</option>
                <option value="usdt">USDT TRC20</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleWithdraw}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
