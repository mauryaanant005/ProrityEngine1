import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, X } from "lucide-react";

interface ActiveDisruption {
  id: string;
  title: string;
  location: string;
  estimatedResolution: number; // minutes
  severity: "high" | "medium" | "low";
  type: "breakdown" | "weather" | "maintenance" | "accident";
}

const mockDisruption: ActiveDisruption = {
  id: "1",
  title: "Signal Equipment Breakdown",
  location: "Track 2, Junction A",
  estimatedResolution: 30,
  severity: "high",
  type: "breakdown"
};

export const DisruptionBanner = () => {
  const [disruption] = useState<ActiveDisruption | null>(mockDisruption);
  const [timeRemaining, setTimeRemaining] = useState(disruption?.estimatedResolution || 0);

  useEffect(() => {
    if (!disruption) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1/60)); // Update every second
    }, 1000);

    return () => clearInterval(timer);
  }, [disruption]);

  if (!disruption) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/90 border-red-500";
      case "medium": return "bg-orange-500/90 border-orange-500"; 
      case "low": return "bg-yellow-500/90 border-yellow-500";
      default: return "bg-red-500/90 border-red-500";
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <Alert className={`${getSeverityColor(disruption.severity)} text-white animate-pulse border-2`}>
      <AlertTriangle className="h-5 w-5" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="font-semibold">
              Active Disruption: {disruption.title}
            </div>
            <div className="text-sm opacity-90">
              {disruption.location}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg">
              Est. Resolution: {formatTime(timeRemaining)}
            </span>
          </div>

          <Badge variant="outline" className="border-white text-white">
            {disruption.type.toUpperCase()}
          </Badge>
        </div>

        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};