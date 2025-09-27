import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, PieChart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Performance Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights and performance metrics for railway operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
            <Button className="btn-primary-gradient">
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="elevated-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Punctuality Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-success">87.3%</div>
                <p className="text-sm text-muted-foreground">
                  Average on-time performance this month
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success">+2.1% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="elevated-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Throughput Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-primary">142</div>
                <p className="text-sm text-muted-foreground">
                  Trains per hour (peak time average)
                </p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-4/5"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="elevated-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-secondary" />
                Resource Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-secondary">78.2%</div>
                <p className="text-sm text-muted-foreground">
                  Overall infrastructure usage
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Tracks: 85%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>Platforms: 71%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="elevated-card">
            <CardHeader>
              <CardTitle>Delay Cause Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weather Conditions</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning w-1/3"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Signal Issues</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive w-1/4"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Track Maintenance</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/5"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-1/6"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="elevated-card">
            <CardHeader>
              <CardTitle>AI Insights & Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="font-medium text-foreground mb-1">Forecasted Peak Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Expected 15% increase in traffic between 4-6 PM today
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="font-medium text-foreground mb-1">Weather Impact Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Rain predicted tomorrow may cause 5-8 minute delays
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="font-medium text-foreground mb-1">Optimization Opportunity</p>
                  <p className="text-sm text-muted-foreground">
                    Adjusting signal timing could improve throughput by 12%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;