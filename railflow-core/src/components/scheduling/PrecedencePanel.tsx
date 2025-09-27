import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, RotateCcw, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface Train {
  id: string;
  trainId: string;
  type: "express" | "local" | "freight";
  priority: "high" | "medium" | "low";
  currentDelay: number;
  optimizationImpact: number;
}

const mockTrains: Train[] = [
  { id: "1", trainId: "12345", type: "express", priority: "high", currentDelay: 5, optimizationImpact: -12 },
  { id: "2", trainId: "67890", type: "local", priority: "medium", currentDelay: 15, optimizationImpact: 8 },
  { id: "3", trainId: "11111", type: "freight", priority: "low", currentDelay: 2, optimizationImpact: -5 },
  { id: "4", trainId: "22222", type: "express", priority: "high", currentDelay: 0, optimizationImpact: 0 },
];

export const PrecedencePanel = () => {
  const [trains, setTrains] = useState(mockTrains);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const moveUp = (index: number) => {
    if (index > 0) {
      const newTrains = [...trains];
      [newTrains[index - 1], newTrains[index]] = [newTrains[index], newTrains[index - 1]];
      setTrains(newTrains);
    }
  };

  const moveDown = (index: number) => {
    if (index < trains.length - 1) {
      const newTrains = [...trains];
      [newTrains[index], newTrains[index + 1]] = [newTrains[index + 1], newTrains[index]];
      setTrains(newTrains);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOptimizing(false);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      express: "bg-red-500/20 text-red-300 border-red-500/30",
      local: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      freight: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500/20";
  };

  return (
    <TooltipProvider>
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neon-blue">Train Precedence</h3>
            <p className="text-sm text-muted-foreground">Drag to reorder or use controls</p>
          </div>
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-neon-blue hover:bg-neon-blue/80"
          >
            {isOptimizing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Optimize
          </Button>
        </div>

        <div className="space-y-2">
          {trains.map((train, index) => (
            <Tooltip key={train.id}>
              <TooltipTrigger asChild>
                <div className="flex items-center p-3 border border-border/30 rounded-lg bg-background/20 hover:bg-background/40 transition-colors group">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-lg font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="font-medium text-foreground">{train.trainId}</div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getTypeColor(train.type)}`}>
                          {train.type}
                        </Badge>
                        <Badge 
                          className={`text-xs text-white ${getPriorityColor(train.priority)}`}
                        >
                          {train.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-sm">
                      <div className="text-muted-foreground">
                        Delay: {train.currentDelay}min
                      </div>
                      <div className={`${
                        train.optimizationImpact > 0 ? 'text-red-400' : 
                        train.optimizationImpact < 0 ? 'text-green-400' : 'text-muted-foreground'
                      }`}>
                        Impact: {train.optimizationImpact > 0 ? '+' : ''}{train.optimizationImpact}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8 p-0 hover:bg-neon-blue/20"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveDown(index)}
                      disabled={index === trains.length - 1}
                      className="h-8 w-8 p-0 hover:bg-neon-blue/20"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div>This precedence minimizes overall delay by {Math.abs(train.optimizationImpact)}%</div>
                  <div className="text-xs opacity-75">(based on OR-Tools optimization)</div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </Card>
    </TooltipProvider>
  );
};