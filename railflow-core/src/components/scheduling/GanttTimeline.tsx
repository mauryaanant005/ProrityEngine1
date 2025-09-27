import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ZoomIn, ZoomOut, RotateCcw, Clock, AlertCircle } from "lucide-react";

interface TrainBlock {
  id: string;
  trainId: string;
  trackId: string;
  startTime: number;
  duration: number;
  type: "express" | "local" | "freight";
  priority: "high" | "medium" | "low";
  speed: number;
  eta: string;
  status: "scheduled" | "active" | "delayed" | "completed";
  hasConflict?: boolean;
  isDragging?: boolean;
}

const mockTrains: TrainBlock[] = [
  {
    id: "1",
    trainId: "12345",
    trackId: "Track 1",
    startTime: 0,
    duration: 120,
    type: "express",
    priority: "high",
    speed: 110,
    eta: "14:30",
    status: "active"
  },
  {
    id: "2",
    trainId: "67890",
    trackId: "Track 1",
    startTime: 90,
    duration: 90,
    type: "local",
    priority: "medium",
    speed: 80,
    eta: "15:15",
    status: "delayed",
    hasConflict: true
  },
  {
    id: "3",
    trainId: "11111",
    trackId: "Track 2",
    startTime: 30,
    duration: 150,
    type: "freight",
    priority: "low",
    speed: 60,
    eta: "16:00",
    status: "scheduled"
  },
  {
    id: "4",
    trainId: "22222",
    trackId: "Track 3",
    startTime: 180,
    duration: 80,
    type: "express",
    priority: "high",
    speed: 120,
    eta: "17:00",
    status: "completed"
  },
  {
    id: "5",
    trainId: "33333",
    trackId: "Track 4",
    startTime: 240,
    duration: 100,
    type: "local",
    priority: "medium",
    speed: 85,
    eta: "18:20",
    status: "scheduled"
  }
];

const tracks = ["Track 1", "Track 2", "Track 3", "Track 4"];

export const GanttTimeline = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [trains, setTrains] = useState(mockTrains);
  const [draggedTrain, setDraggedTrain] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const timelineWidth = 1200 * zoomLevel;
  const timeSlots = Math.max(24, Math.floor(48 * zoomLevel)); // More granular at higher zoom

  const getTrainColor = (train: TrainBlock) => {
    const { type, status, hasConflict, isDragging } = train;
    
    if (isDragging) return "bg-neon-blue/80 ring-2 ring-neon-blue shadow-lg shadow-neon-blue/50";
    if (hasConflict) return "bg-gradient-to-r from-red-600 to-red-500 ring-2 ring-red-400";
    
    const baseColors = {
      express: status === "completed" ? "bg-gradient-to-r from-red-400 to-red-300" : 
               status === "active" ? "bg-gradient-to-r from-red-600 to-red-500 shadow-md shadow-red-500/30" :
               status === "delayed" ? "bg-gradient-to-r from-red-700 to-orange-600" : 
               "bg-gradient-to-r from-red-500 to-red-400",
      local: status === "completed" ? "bg-gradient-to-r from-blue-400 to-blue-300" :
             status === "active" ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/30" :
             status === "delayed" ? "bg-gradient-to-r from-blue-700 to-purple-600" :
             "bg-gradient-to-r from-blue-500 to-blue-400",
      freight: status === "completed" ? "bg-gradient-to-r from-yellow-400 to-yellow-300" :
               status === "active" ? "bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-md shadow-yellow-500/30" :
               status === "delayed" ? "bg-gradient-to-r from-yellow-700 to-orange-600" :
               "bg-gradient-to-r from-yellow-500 to-yellow-400"
    };
    
    return baseColors[type] || "bg-gradient-to-r from-gray-500 to-gray-400";
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-500 text-white shadow-md",
      medium: "bg-yellow-500 text-white shadow-md", 
      low: "bg-green-500 text-white shadow-md"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return "🟢";
      case "delayed": return "🔴";
      case "completed": return "✅";
      default: return "⏱️";
    }
  };

  const handleDragStart = useCallback((trainId: string) => {
    setDraggedTrain(trainId);
    setTrains(prev => prev.map(t => 
      t.id === trainId ? { ...t, isDragging: true } : t
    ));
  }, []);

  const handleDragEnd = useCallback(() => {
    if (draggedTrain && dropTarget && draggedTrain !== dropTarget) {
      setTrains(prev => prev.map(train => {
        if (train.id === draggedTrain) {
          return { ...train, trackId: dropTarget, isDragging: false };
        }
        return { ...train, isDragging: false };
      }));
    } else {
      setTrains(prev => prev.map(t => ({ ...t, isDragging: false })));
    }
    setDraggedTrain(null);
    setDropTarget(null);
  }, [draggedTrain, dropTarget]);

  const handleTrackDrop = useCallback((trackId: string) => {
    setDropTarget(trackId);
  }, []);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev * 1.5, 3));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  const resetZoom = () => setZoomLevel(1);

  return (
    <TooltipProvider>
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neon-blue flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Timeline
            </h3>
            <p className="text-sm text-muted-foreground">
              Interactive Gantt chart with drag-and-drop scheduling
            </p>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              className="hover:bg-neon-blue/10"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              className="hover:bg-neon-blue/10"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetZoom}
              className="hover:bg-neon-blue/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-x-auto" ref={timelineRef}>
          {/* Enhanced Time axis */}
          <div className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b border-border/30 pb-3 mb-4">
            <div className="flex">
              <div className="w-32 flex-shrink-0 px-2">
                <div className="text-xs font-medium text-muted-foreground mb-1">Track / Time</div>
              </div>
              <div className="flex" style={{ width: timelineWidth }}>
                {Array.from({ length: timeSlots }, (_, i) => {
                  const hour = Math.floor((i * 24) / timeSlots);
                  const minute = Math.floor(((i * 24) / timeSlots - hour) * 60);
                  const isHourMark = minute === 0;
                  
                  return (
                    <div 
                      key={i} 
                      className={`
                        flex-1 text-center text-xs border-l first:border-l-0
                        ${isHourMark ? 'border-border/40 text-foreground font-medium' : 'border-border/20 text-muted-foreground'}
                      `}
                    >
                      {isHourMark ? (
                        <div className="py-1">
                          <div className="font-semibold">{String(hour).padStart(2, '0')}:00</div>
                          {zoomLevel > 1.5 && <div className="text-xs opacity-60">Hour {hour + 1}</div>}
                        </div>
                      ) : (
                        zoomLevel > 2 && (
                          <div className="py-1 opacity-60">
                            :{String(minute).padStart(2, '0')}
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Tracks and train blocks */}
          <div className="space-y-4">
            {tracks.map((track, trackIndex) => (
              <div key={track} className="flex items-center group">
                <div className="w-32 flex-shrink-0 px-2">
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {track}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trains.filter(t => t.trackId === track).length} trains
                  </div>
                </div>
                <div 
                  className={`
                    relative h-16 border-2 rounded-lg transition-all duration-200
                    ${dropTarget === track ? 'border-neon-blue bg-neon-blue/10' : 'border-border/30 bg-background/20'}
                    hover:bg-background/30
                  `}
                  style={{ width: timelineWidth }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleTrackDrop(track)}
                >
                  {trains
                    .filter(train => train.trackId === track)
                    .map(train => (
                      <Tooltip key={train.id}>
                        <TooltipTrigger asChild>
                          <div
                            draggable
                            onDragStart={() => handleDragStart(train.id)}
                            onDragEnd={handleDragEnd}
                            className={`
                              absolute top-2 h-12 rounded-lg shadow-lg cursor-move select-none
                              transition-all duration-300 hover:scale-105 hover:z-10
                              ${getTrainColor(train)}
                              ${train.hasConflict ? 'animate-pulse ring-4 ring-red-400/50' : ''}
                              active:scale-110 active:rotate-2
                            `}
                            style={{
                              left: `${(train.startTime / 1440) * 100}%`,
                              width: `${Math.max((train.duration / 1440) * 100, 8)}%`,
                              zIndex: train.isDragging ? 50 : 10
                            }}
                          >
                            {/* Train Block Content */}
                            <div className="h-full flex items-center justify-between p-2 text-white">
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm truncate flex items-center gap-1">
                                  <span className="text-xs">{getStatusIcon(train.status)}</span>
                                  {train.trainId}
                                </div>
                                <div className="text-xs opacity-90 flex items-center gap-1">
                                  <span>{train.speed} km/h</span>
                                  {train.hasConflict && <AlertCircle className="h-3 w-3" />}
                                </div>
                              </div>
                              
                              {/* Priority Badge */}
                              <Badge 
                                className={`text-xs px-1 py-0 ${getPriorityBadge(train.priority)}`}
                              >
                                {train.priority.charAt(0).toUpperCase()}
                              </Badge>
                            </div>
                            
                            {/* Progress indicator for active trains */}
                            {train.status === "active" && (
                              <div className="absolute bottom-0 left-0 h-1 bg-white/60 rounded-full">
                                <div className="h-full w-1/3 bg-white rounded-full animate-pulse" />
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="space-y-2">
                            <div className="font-semibold border-b border-border/20 pb-1">
                              Train {train.trainId} ({train.type})
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><strong>Status:</strong> {train.status}</div>
                              <div><strong>Priority:</strong> {train.priority}</div>
                              <div><strong>Speed:</strong> {train.speed} km/h</div>
                              <div><strong>ETA:</strong> {train.eta}</div>
                            </div>
                            
                            <div className="text-xs">
                              <strong>Duration:</strong> {Math.floor(train.duration / 60)}h {train.duration % 60}m
                            </div>
                            
                            {train.hasConflict && (
                              <div className="text-red-400 text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Scheduling conflict detected - requires immediate attention
                              </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground pt-1 border-t border-border/20">
                              💡 Drag to reschedule or click for details
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))
                  }

                  {/* Enhanced AI Suggestions for conflicts */}
                  {trains.some(t => t.trackId === track && t.hasConflict) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute top-2 h-12 border-2 border-dashed border-neon-blue rounded-lg bg-neon-blue/10 cursor-pointer hover:bg-neon-blue/20 transition-colors"
                          style={{
                            left: `${((trains.find(t => t.hasConflict)?.startTime || 0) + 30) / 1440 * 100}%`,
                            width: `${Math.max((90 / 1440) * 100, 8)}%`
                          }}
                        >
                          <div className="h-full flex items-center justify-center text-neon-blue text-xs font-medium">
                            <div className="text-center">
                              <div className="flex items-center gap-1">
                                <span>🤖</span>
                                <span>AI Fix</span>
                              </div>
                              <div className="opacity-80">Click to apply</div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-medium">AI Optimization Suggestion</div>
                          <div className="text-xs">Reschedule to reduce delay by 12 minutes</div>
                          <div className="text-xs text-muted-foreground">
                            Based on OR-Tools optimization engine
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Status Legend */}
          <div className="mt-6 p-4 bg-background/30 rounded-lg border border-border/30">
            <h4 className="text-sm font-medium text-foreground mb-3">Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-gradient-to-r from-red-600 to-red-500 rounded shadow-md shadow-red-500/30"></div>
                <span>Express (Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded shadow-md shadow-blue-500/30"></div>
                <span>Local (Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded shadow-md shadow-yellow-500/30"></div>
                <span>Freight (Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 border-2 border-dashed border-neon-blue bg-neon-blue/10 rounded"></div>
                <span>AI Suggestion</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/20">
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>🟢 Active</span>
                <span>🔴 Delayed</span>
                <span>✅ Completed</span>
                <span>⏱️ Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};