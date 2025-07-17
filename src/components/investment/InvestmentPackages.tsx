
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  CreditCard,
  Wallet,
  Timer
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface InvestmentPackagesProps {
  onInvestmentCreated?: () => void;
}

const packages = [
  {
    id: 1,
    amount: 100,
    dailyReturn: 15,
    totalReturn: 450,
    duration: 30,
    popular: false
  },
  {
    id: 2,
    amount: 250,
    dailyReturn: 37.5,
    totalReturn: 1125,
    duration: 30,
    popular: false
  },
  {
    id: 3,
    amount: 500,
    dailyReturn: 75,
    totalReturn: 2250,
    duration: 30,
    popular: true
  },
  {
    id: 4,
    amount: 1000,
    dailyReturn: 150,
    totalReturn: 4500,
    duration: 30,
    popular: false
  },
  {
    id: 5,
    amount: 2500,
    dailyReturn: 375,
    totalReturn: 11250,
    duration: 30,
    popular: false
  },
  {
    id: 6,
    amount: 5000,
    dailyReturn: 750,
    totalReturn: 22500,
    duration: 30,
    popular: false
  }
];

export const InvestmentPackages = ({ onInvestmentCreated }: InvestmentPackagesProps) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentType, setPaymentType] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleInvestment = (pkg: any, type: string) => {
    setSelectedPackage(pkg);
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (onInvestmentCreated) {
      onInvestmentCreated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Packages</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose your investment package and payment method. Earn 15% daily returns over 30 days with flexible payment options.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${pkg.popular ? 'ring-2 ring-purple-500' : ''}`}>
            {pkg.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className={`text-center ${pkg.popular ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-gray-50'} rounded-t-lg`}>
              <CardTitle className="text-2xl font-bold text-gray-900">
                R{pkg.amount}
              </CardTitle>
              <p className="text-gray-600">Investment Package</p>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Daily Return</span>
                  </div>
                  <span className="font-semibold text-green-600">R{pkg.dailyReturn}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <span className="font-semibold">{pkg.duration} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Total Return</span>
                  </div>
                  <span className="font-semibold text-purple-600">R{pkg.totalReturn}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">10% cashback on Pay Now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-600">20% initial for Pay Later</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button 
                  onClick={() => handleInvestment(pkg, 'Pay Now')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
                
                <Button 
                  onClick={() => handleInvestment(pkg, 'Pay Later')}
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Pay Later
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        package={selectedPackage}
        paymentType={paymentType}
      />
    </div>
  );
};
