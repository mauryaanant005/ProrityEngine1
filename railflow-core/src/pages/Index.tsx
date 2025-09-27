import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RailwayMap } from "@/components/dashboard/RailwayMap";
import { KPICards } from "@/components/dashboard/KPICards";
import { AlertsTicker } from "@/components/dashboard/AlertsTicker";
import { RecommendationPanel } from "@/components/dashboard/RecommendationPanel";
import railwayControlHero from "@/assets/railway-control-hero.jpg";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl">
          <div 
            className="h-32 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${railwayControlHero})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>
            <div className="relative z-10 p-6 flex items-center h-full">
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">Railway Control Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Real-time monitoring and AI-powered decision support for Indian Railways operations
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-success font-medium">Live System</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Railway Map - Takes up 3 columns */}
          <div className="lg:col-span-3">
            <RailwayMap />
          </div>

          {/* Recommendation Panel - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-lg p-4 h-full">
              <RecommendationPanel />
            </div>
          </div>
        </div>

        {/* Alerts Ticker */}
        <div className="mt-6">
          <AlertsTicker />
        </div>

        {/* System Status Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="elevated-card rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success animate-pulse"></div>
              <div>
                <p className="font-medium text-foreground">Train Management System</p>
                <p className="text-xs text-muted-foreground">Connected • Last update: 2s ago</p>
              </div>
            </div>
          </div>

          <div className="elevated-card rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success animate-pulse"></div>
              <div>
                <p className="font-medium text-foreground">Signaling System</p>
                <p className="text-xs text-muted-foreground">Operational • All signals active</p>
              </div>
            </div>
          </div>

          <div className="elevated-card rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success animate-pulse"></div>
              <div>
                <p className="font-medium text-foreground">AI Decision Engine</p>
                <p className="text-xs text-muted-foreground">Learning • Processing 847 data points/min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
