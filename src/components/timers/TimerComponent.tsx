
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Timer 
} from 'lucide-react';

interface TimerComponentProps {
  title: string;
  timeRemaining: string;
  type: 'warning' | 'success' | 'info';
  description: string;
}

export const TimerComponent = ({ title, timeRemaining, type, description }: TimerComponentProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          cardClass: 'border-amber-200 bg-amber-50',
          iconClass: 'text-amber-500',
          textClass: 'text-amber-700',
          badgeClass: 'bg-amber-500 text-white',
          icon: AlertTriangle
        };
      case 'success':
        return {
          cardClass: 'border-green-200 bg-green-50',
          iconClass: 'text-green-500',
          textClass: 'text-green-700',
          badgeClass: 'bg-green-500 text-white',
          icon: CheckCircle
        };
      default:
        return {
          cardClass: 'border-blue-200 bg-blue-50',
          iconClass: 'text-blue-500',
          textClass: 'text-blue-700',
          badgeClass: 'bg-blue-500 text-white',
          icon: Clock
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  return (
    <Card className={`border-0 shadow-lg ${styles.cardClass}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${styles.textClass}`}>
          <IconComponent className={`h-5 w-5 ${styles.iconClass}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className={`text-3xl font-bold font-mono ${styles.textClass}`}>
              {timeRemaining}
            </div>
            <Badge className={styles.badgeClass}>
              <Timer className="h-3 w-3 mr-1" />
              Live Timer
            </Badge>
          </div>
          
          <p className={`text-sm ${styles.textClass} text-center`}>
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
