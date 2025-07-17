import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard, 
  Wallet, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Copy,
  Target,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  package: any;
  paymentType: string;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess, package: pkg, paymentType }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  if (!pkg) return null;

  const paymentAmount = paymentType === 'Pay Now' ? pkg.amount : pkg.amount * 0.2;
  const walletBalance = 1250.50;
  const pointsBalance = 12.5;
  const pointsValue = pointsBalance * 20; // 1 point = R20

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Investment of R${pkg.amount} initiated successfully!`);
      onSuccess();
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {paymentType} - R{pkg.amount} Package
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Package Amount:</span>
                  <span className="font-semibold">R{pkg.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Required:</span>
                  <span className="font-semibold text-green-600">R{paymentAmount}</span>
                </div>
                {paymentType === 'Pay Now' && (
                  <div className="flex justify-between text-green-600">
                    <span>Cashback Bonus:</span>
                    <span className="font-semibold">R{pkg.amount * 0.1}</span>
                  </div>
                )}
                {paymentType === 'Pay Later' && (
                  <div className="flex justify-between text-amber-600">
                    <span>Remaining Balance:</span>
                    <span className="font-semibold">R{pkg.amount * 0.8}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Bank Deposit / EFT
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="usdt" id="usdt" />
                  <Label htmlFor="usdt" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" />
                    USDT TRC20
                  </Label>
                </div>
                {paymentType === 'Pay Later' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-4 w-4" />
                        Wallet Balance (R{walletBalance})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="points" id="points" />
                      <Label htmlFor="points" className="flex items-center gap-2 cursor-pointer">
                        <Target className="h-4 w-4" />
                        Points ({pointsBalance} points ≈ R{pointsValue})
                      </Label>
                    </div>
                  </>
                )}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details */}
          {paymentMethod === 'bank' && (
            <Card>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bank</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono">FNB</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard('FNB')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono">1234567890</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard('1234567890')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Account Name</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono">Investment Platform Ltd</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Investment Platform Ltd')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Reference</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono">INV-{pkg.id}-{Date.now()}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`INV-${pkg.id}-${Date.now()}`)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === 'usdt' && (
            <Card>
              <CardHeader>
                <CardTitle>USDT TRC20 Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-sm break-all">TQn9Y2khEsLJW1ChVWFMSMeGdDvGmHGz42</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard('TQn9Y2khEsLJW1ChVWFMSMeGdDvGmHGz42')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Amount (USDT)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono">{(paymentAmount / 18.5).toFixed(2)} USDT</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard((paymentAmount / 18.5).toFixed(2))}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pay Later Warning */}
          {paymentType === 'Pay Later' && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-800">Payment Deadline Notice</p>
                    <p className="text-sm text-amber-700">
                      You have 3 hours to complete the initial 20% payment (R{paymentAmount}). 
                      After confirmation, you'll have 14 days to pay the remaining 80% (R{pkg.amount * 0.8}).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Payment
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
