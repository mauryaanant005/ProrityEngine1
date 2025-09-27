import { TrendingUp, Clock, Activity, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

function KPICard({ title, value, change, trend, icon, color, progress }: KPICardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="elevated-card hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-4 w-4 ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs">
          <span className={getTrendColor()}>
            {trend === 'up' && '↗'} 
            {trend === 'down' && '↘'} 
            {trend === 'stable' && '→'} 
            {change}
          </span>
          <span className="text-muted-foreground">from last hour</span>
        </div>
        {progress !== undefined && (
          <div className="mt-3">
            <Progress 
              value={progress} 
              className="h-2" 
              // @ts-ignore
              indicatorClassName={
                progress >= 90 ? 'bg-success' : 
                progress >= 70 ? 'bg-warning' : 
                'bg-destructive'
              }
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Target: 95%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const kpiData = [
    {
      title: "Punctuality Rate",
      value: "87.3%",
      change: "+2.1%",
      trend: 'up' as const,
      icon: <Clock className="h-4 w-4" />,
      color: "text-primary",
      progress: 87.3,
    },
    {
      title: "Average Delay",
      value: "8.5 min",
      change: "-1.2 min",
      trend: 'up' as const,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-warning",
    },
    {
      title: "Throughput",
      value: "142 trains/hr",
      change: "+5 trains",
      trend: 'up' as const,
      icon: <Activity className="h-4 w-4" />,
      color: "text-success",
    },
    {
      title: "Resource Utilization",
      value: "78.2%",
      change: "+3.4%",
      trend: 'up' as const,
      icon: <Gauge className="h-4 w-4" />,
      color: "text-secondary",
      progress: 78.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
}