import { useState } from "react";
import { Clock, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  time: string;
  conflicts: number;
  utilization: number;
  status: 'normal' | 'busy' | 'critical';
}

export function TimelineSlider() {
  const [currentTime, setCurrentTime] = useState([0]);
  const [timeRange] = useState(2); // 2 hours ahead
  
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date();
    
    for (let i = 0; i < timeRange * 4; i++) { // 15-minute intervals
      const time = new Date(startTime.getTime() + i * 15 * 60 * 1000);
      const conflicts = Math.floor(Math.random() * 3);
      const utilization = Math.floor(Math.random() * 100);
      
      let status: 'normal' | 'busy' | 'critical' = 'normal';
      if (conflicts > 1 || utilization > 80) status = 'critical';
      else if (conflicts > 0 || utilization > 60) status = 'busy';
      
      slots.push({
        time: time.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        conflicts,
        utilization,
        status
      });
    }
    
    return slots;
  };

  const [timeSlots] = useState(generateTimeSlots());
  const selectedSlot = timeSlots[Math.floor((currentTime[0] / 100) * (timeSlots.length - 1))];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive';
      case 'busy': return 'bg-warning'; 
      case 'normal': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string, conflicts: number) => {
    if (conflicts > 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          {conflicts} Conflict{conflicts > 1 ? 's' : ''}
        </Badge>
      );
    }
    
    switch (status) {
      case 'critical': return <Badge variant="destructive" className="text-xs">High Load</Badge>;
      case 'busy': return <Badge variant="secondary" className="text-xs">Busy</Badge>;
      case 'normal': return <Badge className="bg-success/20 text-success border-success/30 text-xs">Normal</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Resource Timeline - Next {timeRange} Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Current View Time</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{selectedSlot?.time || '00:00'}</span>
            </div>
          </div>
          
          <Slider
            value={currentTime}
            onValueChange={setCurrentTime}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Now</span>
            <span>+{timeRange}h</span>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <span>Platform Utilization Timeline</span>
            {selectedSlot && getStatusBadge(selectedSlot.status, selectedSlot.conflicts)}
          </div>
          
          <div className="grid grid-cols-8 gap-1 h-8">
            {timeSlots.map((slot, index) => {
              const isSelected = index === Math.floor((currentTime[0] / 100) * (timeSlots.length - 1));
              
              return (
                <div
                  key={index}
                  className={`
                    relative rounded transition-all duration-200 border-2
                    ${getStatusColor(slot.status)} 
                    ${isSelected ? 'border-primary shadow-primary/50 shadow-sm scale-110' : 'border-transparent'}
                    ${slot.conflicts > 0 ? 'animate-pulse' : ''}
                  `}
                  style={{ 
                    opacity: slot.utilization / 100 * 0.8 + 0.2,
                  }}
                  title={`${slot.time}: ${slot.utilization}% utilization${slot.conflicts > 0 ? `, ${slot.conflicts} conflicts` : ''}`}
                >
                  {slot.conflicts > 0 && (
                    <AlertTriangle className="h-3 w-3 text-white absolute top-0.5 right-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            {timeSlots.filter((_, i) => i % 2 === 0).map((slot, i) => (
              <span key={i}>{slot.time}</span>
            ))}
          </div>
        </div>

        {/* Current Selection Details */}
        {selectedSlot && (
          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time Slot: {selectedSlot.time}</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedSlot.status, selectedSlot.conflicts)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Platform Utilization:</span>
                <div className="font-mono font-medium">{selectedSlot.utilization}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Conflicts:</span>
                <div className="font-mono font-medium">
                  {selectedSlot.conflicts === 0 ? 'None' : selectedSlot.conflicts}
                </div>
              </div>
            </div>
            
            {selectedSlot.conflicts > 0 && (
              <Button size="sm" variant="outline" className="w-full mt-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Conflict Details
              </Button>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}