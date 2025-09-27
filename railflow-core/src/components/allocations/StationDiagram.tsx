import { useState } from "react";
import { Train, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TrainIcon {
  id: string;
  type: 'express' | 'local' | 'freight';
  platformId?: string;
  x: number;
  y: number;
}

interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  occupied: boolean;
  constraints: string[];
}

export function StationDiagram() {
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<string>("");
  
  const [trains, setTrains] = useState<TrainIcon[]>([
    { id: "EXP101", type: "express", platformId: "P1", x: 150, y: 80 },
    { id: "LOC205", type: "local", x: 50, y: 200 },
    { id: "FRT340", type: "freight", platformId: "P3", x: 350, y: 160 },
  ]);

  const platforms: Platform[] = [
    { id: "P1", x: 100, y: 60, width: 120, occupied: true, constraints: ["Electric", "Length: 400m"] },
    { id: "P2", x: 100, y: 120, width: 120, occupied: false, constraints: ["Diesel", "Length: 300m"] },
    { id: "P3", x: 300, y: 140, width: 120, occupied: true, constraints: ["Electric", "Length: 500m"] },
    { id: "P4", x: 300, y: 200, width: 120, occupied: false, constraints: ["Electric", "Length: 600m"] },
  ];

  const handleTrainDrag = (trainId: string, newX: number, newY: number) => {
    // Find nearest platform
    const platform = platforms.find(p => 
      newX >= p.x && newX <= p.x + p.width &&
      newY >= p.y - 20 && newY <= p.y + 40
    );

    if (platform) {
      if (platform.occupied) {
        setConflictDetails(`Platform ${platform.id} is already occupied. Please choose another platform.`);
        setConflictModalOpen(true);
        return;
      }

      // Update train position and assignment
      setTrains(prev => prev.map(train => 
        train.id === trainId 
          ? { ...train, x: platform.x + 50, y: platform.y, platformId: platform.id }
          : train
      ));
    } else {
      // Move to unassigned area
      setTrains(prev => prev.map(train =>
        train.id === trainId 
          ? { ...train, x: newX, y: newY, platformId: undefined }
          : train
      ));
    }
  };

  const getTrainColor = (type: string) => {
    switch (type) {
      case 'express': return '#ef4444'; // red
      case 'local': return '#3b82f6';   // blue  
      case 'freight': return '#eab308'; // yellow
      default: return '#6b7280';        // gray
    }
  };

  return (
    <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg border border-border/30 p-4 h-[400px]">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Train className="h-5 w-5 text-primary" />
        Interactive Station Layout
      </h3>

      <div className="relative w-full h-full bg-slate-800/20 rounded border-2 border-dashed border-border/50">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Draw tracks */}
          <g>
            {/* Main tracks */}
            <line x1="50" y1="100" x2="450" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="4" />
            <line x1="50" y1="180" x2="450" y2="180" stroke="hsl(var(--muted-foreground))" strokeWidth="4" />
            
            {/* Junction lines */}
            <line x1="250" y1="100" x2="250" y2="180" stroke="hsl(var(--muted-foreground))" strokeWidth="3" />
          </g>

          {/* Draw platforms */}
          {platforms.map((platform) => (
            <g key={platform.id}>
              <rect
                x={platform.x}
                y={platform.y}
                width={platform.width}
                height={20}
                fill={platform.occupied ? "hsl(var(--warning))" : "hsl(var(--success))"}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                rx="4"
                className="drop-shadow-sm"
              />
              <text
                x={platform.x + platform.width / 2}
                y={platform.y + 14}
                textAnchor="middle"
                className="fill-white text-sm font-medium"
              >
                {platform.id}
              </text>
              
              {/* Constraint indicators */}
              {platform.constraints.includes("Electric") && (
                <circle
                  cx={platform.x + platform.width - 10}
                  cy={platform.y - 10}
                  r="4"
                  fill="hsl(var(--neon-blue))"
                  className="drop-shadow-sm"
                />
              )}
            </g>
          ))}

          {/* Draw trains */}
          {trains.map((train) => (
            <g
              key={train.id}
              style={{ cursor: 'grab' }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startY = e.clientY;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  const deltaY = e.clientY - startY;
                  handleTrainDrag(train.id, train.x + deltaX, train.y + deltaY);
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <rect
                x={train.x - 15}
                y={train.y - 8}
                width={30}
                height={16}
                fill={getTrainColor(train.type)}
                stroke="white"
                strokeWidth="2"
                rx="3"
                className="drop-shadow-lg"
              />
              <text
                x={train.x}
                y={train.y + 2}
                textAnchor="middle"
                className="fill-white text-xs font-bold"
              >
                {train.id.slice(-3)}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border/30 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Express</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Local</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Freight</span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            Live Tracking Active
          </Badge>
        </div>
      </div>

      {/* Conflict Modal */}
      <Dialog open={conflictModalOpen} onOpenChange={setConflictModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Platform Conflict Detected
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">{conflictDetails}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConflictModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConflictModalOpen(false)}>
              Override Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}