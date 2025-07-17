
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Lock, 
  Target,
  Gift,
  Star
} from 'lucide-react';

interface AffiliateMilestonesProps {
  userData: any;
}

const milestones = [
  {
    tier: 'A',
    name: 'Bronze Affiliate',
    requirements: '5 Class A referrals with active investments',
    investmentRequired: false,
    investmentAmount: 0,
    reward: 100,
    color: 'from-amber-500 to-amber-600',
    icon: Trophy
  },
  {
    tier: 'B',
    name: 'Silver Affiliate',
    requirements: '9+ Class A referrals with active investments',
    investmentRequired: false,
    investmentAmount: 0,
    reward: 150,
    color: 'from-gray-400 to-gray-500',
    icon: Trophy
  },
  {
    tier: 'C',
    name: 'Gold Affiliate',
    requirements: '15+ Class A referrals with active investments',
    investmentRequired: false,
    investmentAmount: 0,
    reward: 250,
    color: 'from-yellow-400 to-yellow-500',
    icon: Trophy
  },
  {
    tier: 'D',
    name: 'Platinum Affiliate',
    requirements: '20+ Class A referrals',
    investmentRequired: true,
    investmentAmount: 200,
    reward: 500,
    color: 'from-purple-500 to-purple-600',
    icon: Star
  },
  {
    tier: 'E',
    name: 'Diamond Affiliate',
    requirements: '25+ Class A referrals',
    investmentRequired: true,
    investmentAmount: 500,
    reward: 1000,
    color: 'from-blue-500 to-blue-600',
    icon: Gift
  }
];

export const AffiliateMilestones = ({ userData }: AffiliateMilestonesProps) => {
  const { classAReferrals, currentTier } = userData.milestoneProgress;
  const userInvestment = userData.totalInvestments;

  const checkMilestoneStatus = (milestone: any) => {
    const referralsNeeded = parseInt(milestone.requirements.split(' ')[0].replace('+', ''));
    const hasEnoughReferrals = classAReferrals >= referralsNeeded;
    const hasEnoughInvestment = !milestone.investmentRequired || userInvestment >= milestone.investmentAmount;
    
    return {
      completed: hasEnoughReferrals && hasEnoughInvestment,
      canClaim: hasEnoughReferrals && hasEnoughInvestment && milestone.tier > currentTier,
      referralsProgress: (classAReferrals / referralsNeeded) * 100,
      investmentProgress: milestone.investmentRequired ? (userInvestment / milestone.investmentAmount) * 100 : 100
    };
  };

  const claimReward = (tier: string) => {
    console.log(`Claiming reward for tier ${tier}`);
    // Implementation for claiming reward
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Affiliate Milestones</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Achieve milestones to unlock instant wallet rewards. Higher tiers require both referrals and personal investments.
        </p>
      </div>

      {/* Current Progress Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{classAReferrals}</div>
              <div className="text-sm text-gray-600">Class A Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">R{userInvestment}</div>
              <div className="text-sm text-gray-600">Personal Investment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{currentTier}</div>
              <div className="text-sm text-gray-600">Current Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.map((milestone) => {
          const status = checkMilestoneStatus(milestone);
          const IconComponent = milestone.icon;
          
          return (
            <Card key={milestone.tier} className={`border-0 shadow-lg ${status.completed ? 'ring-2 ring-green-500' : ''}`}>
              <CardHeader className={`bg-gradient-to-r ${milestone.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    <span>Tier {milestone.tier}</span>
                  </div>
                  {status.completed && <CheckCircle className="h-5 w-5" />}
                </CardTitle>
                <p className="text-sm opacity-90">{milestone.name}</p>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <p className="text-sm text-gray-600">{milestone.requirements}</p>
                    
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Referrals Progress</span>
                        <span>{Math.min(status.referralsProgress, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(status.referralsProgress, 100)} className="h-2" />
                    </div>
                    
                    {milestone.investmentRequired && (
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Investment Progress</span>
                          <span>{Math.min(status.investmentProgress, 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={Math.min(status.investmentProgress, 100)} className="h-2" />
                        <p className="text-xs text-gray-500">
                          Minimum investment: R{milestone.investmentAmount}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">Reward</span>
                      </div>
                      <span className="font-bold text-green-600">R{milestone.reward}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    {status.completed && milestone.tier === currentTier ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </Badge>
                    ) : status.canClaim ? (
                      <Button 
                        onClick={() => claimReward(milestone.tier)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Claim Reward
                      </Button>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-4 w-4" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Checklist */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Next Milestone Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const status = checkMilestoneStatus(milestone);
              const referralsNeeded = parseInt(milestone.requirements.split(' ')[0].replace('+', ''));
              const referralsLeft = Math.max(0, referralsNeeded - classAReferrals);
              
              if (status.completed) return null;
              
              return (
                <div key={milestone.tier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${milestone.color} text-white flex items-center justify-center font-semibold text-sm`}>
                      {milestone.tier}
                    </div>
                    <div>
                      <p className="font-semibold">{milestone.name}</p>
                      <p className="text-sm text-gray-600">
                        {referralsLeft > 0 ? `${referralsLeft} more referrals needed` : 'Referrals complete'}
                        {milestone.investmentRequired && userInvestment < milestone.investmentAmount && 
                          ` • R${milestone.investmentAmount - userInvestment} more investment needed`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R{milestone.reward}</p>
                    <p className="text-sm text-gray-600">Reward</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
