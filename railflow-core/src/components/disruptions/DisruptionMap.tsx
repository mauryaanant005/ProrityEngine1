import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface DisruptionPin {
  id: string;
  x: number;
  y: number;
  title: string;
  severity: "high" | "medium" | "low";
  affectedTrains: number;
  estimatedDelay: number;
}

const mockDisruptions: DisruptionPin[] = [
  { id: "1", x: 45, y: 30, title: "Signal Breakdown", severity: "high", affectedTrains: 3, estimatedDelay: 20 },
  { id: "2", x: 65, y: 50, title: "Weather Delay", severity: "medium", affectedTrains: 2, estimatedDelay: 10 },
  { id: "3", x: 25, y: 70, title: "Maintenance", severity: "low", affectedTrains: 1, estimatedDelay: 5 }
];

export const DisruptionMap = () => {
  const [selectedPin, setSelectedPin] = useState<DisruptionPin | null>(null);
  const [zoom, setZoom] = useState(1);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "fill-red-500 animate-pulse";
      case "medium": return "fill-orange-500";
      case "low": return "fill-yellow-500";
      default: return "fill-gray-500";
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground">Network Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-background/20 rounded-lg border border-border/30 overflow-hidden">
          <svg 
            width="100%" 
            height="400" 
            viewBox="0 0 100 100" 
            className="cursor-pointer"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Railway Network Background */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            
            {/* Railway Tracks */}
            <g stroke="hsl(var(--muted-foreground))" strokeWidth="1" fill="none">
              <line x1="10" y1="20" x2="90" y2="20" />
              <line x1="10" y1="40" x2="90" y2="40" />
              <line x1="10" y1="60" x2="90" y2="60" />
              <line x1="10" y1="80" x2="90" y2="80" />
              
              {/* Junctions */}
              <line x1="30" y1="20" x2="30" y2="80" />
              <line x1="70" y1="20" x2="70" y2="80" />
            </g>

            {/* Station Markers */}
            <g fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1">
              <circle cx="20" cy="20" r="2" />
              <circle cx="50" cy="20" r="2" />
              <circle cx="80" cy="20" r="2" />
              <circle cx="20" cy="60" r="2" />
              <circle cx="80" cy="60" r="2" />
            </g>

            {/* Disruption Pins */}
            {mockDisruptions.map((pin) => (
              <g key={pin.id}>
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="3"
                  className={`${getSeverityColor(pin.severity)} cursor-pointer stroke-white stroke-2 hover:r-4 transition-all`}
                  onClick={() => setSelectedPin(pin)}
                />
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="8"
                  fill="transparent"
                  stroke={pin.severity === 'high' ? '#ef4444' : '#f97316'}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.6"
                  className="animate-ping"
                />
              </g>
            ))}

            {/* Train Icons (simplified) */}
            <g fill="hsl(var(--neon-blue))" stroke="white" strokeWidth="0.5">
              <rect x="35" y="18" width="4" height="2" rx="1" />
              <rect x="55" y="38" width="4" height="2" rx="1" />
              <rect x="75" y="58" width="4" height="2" rx="1" />
            </g>
          </svg>

          {/* Pin Details Overlay */}
          {selectedPin && (
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedPin.title}</h4>
                  <Badge className={getSeverityColor(selectedPin.severity).replace('fill-', 'bg-').replace(' animate-pulse', '')}>
                    {selectedPin.severity}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div>Affected Trains: {selectedPin.affectedTrains}</div>
                  <div>Est. Delay: {selectedPin.estimatedDelay} min</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedPin(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">High Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Medium Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Low Severity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};