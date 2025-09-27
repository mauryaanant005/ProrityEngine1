import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface KPI {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  color: string;
}

const mockKPIs: KPI[] = [
  { label: "Active Incidents", value: "3", change: -2, trend: "down", color: "text-green-400" },
  { label: "Avg Delay", value: "12 min", change: 8, trend: "up", color: "text-red-400" },
  { label: "System Efficiency", value: "78%", change: -5, trend: "down", color: "text-orange-400" },
  { label: "Recovery ETA", value: "45 min", change: -15, trend: "down", color: "text-green-400" }
];

export const DisruptionFooter = () => {
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleResolveIncident = () => {
    setIsResolving(true);
    // Simulate API call
    setTimeout(() => {
      setIsResolving(false);
      setResolutionNotes("");
    }, 2000);
  };

  return (
    <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      {/* KPI Dashboard */}
      <div className="p-4 border-b border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockKPIs.map((kpi, index) => (
            <Card key={index} className="p-3 bg-background/20 border-border/30">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                  <div className={`flex items-center justify-center gap-1 text-xs ${kpi.color}`}>
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(kpi.change)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delay Spike Graph (Simplified) */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground">Delay Trend (Last Hour)</h4>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Real-time
          </Badge>
        </div>
        <div className="h-16 bg-background/20 rounded border border-border/30 relative overflow-hidden">
          {/* Simplified chart visualization */}
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="delayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <polyline
              fill="url(#delayGradient)"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
              points="0,50 100,45 200,55 300,40 400,35 500,30 600,25"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-muted-foreground">Peak delay: 25 min at 14:30</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-muted-foreground">3 Active Disruptions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Auto-mitigation enabled</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                disabled={isResolving}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve Incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resolve Incident</DialogTitle>
                <DialogDescription>
                  Confirm incident resolution and add final notes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                  <Textarea
                    placeholder="Describe the resolution steps, root cause, and preventive measures..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleResolveIncident}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirm Resolution
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};