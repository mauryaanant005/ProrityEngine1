import { useState } from "react";
import { Bot, Sparkles, CheckCircle, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OptimizationSuggestion {
  id: string;
  type: 'reallocation' | 'efficiency' | 'conflict_resolution';
  description: string;
  impact: number;
  confidence: number;
  platforms: string[];
}

export function AIOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [acceptanceThreshold, setAcceptanceThreshold] = useState([75]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const mockSuggestions: OptimizationSuggestion[] = [
    {
      id: "opt_1",
      type: "reallocation",
      description: "Move FRT-340 to Platform 4 to reduce congestion",
      impact: 15,
      confidence: 92,
      platforms: ["Platform 3", "Platform 4"]
    },
    {
      id: "opt_2", 
      type: "efficiency",
      description: "Optimize EXP-101 departure by 5 minutes",
      impact: 8,
      confidence: 85,
      platforms: ["Platform 1"]
    },
    {
      id: "opt_3",
      type: "conflict_resolution", 
      description: "Resolve potential conflict between LOC-205 and incoming EXP-102",
      impact: 23,
      confidence: 95,
      platforms: ["Platform 2"]
    }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setSuggestions([]);

    // Simulate optimization algorithm
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }

    // Filter suggestions by confidence threshold
    const filteredSuggestions = mockSuggestions.filter(
      s => s.confidence >= acceptanceThreshold[0]
    );
    
    setSuggestions(filteredSuggestions);
    setIsOptimizing(false);
  };

  const applySuggestion = (suggestionId: string) => {
    setAppliedSuggestions(prev => new Set(prev).add(suggestionId));
    // Here you would apply the actual changes to the allocation
  };

  const applyAllSuggestions = () => {
    suggestions.forEach(suggestion => {
      if (suggestion.confidence >= acceptanceThreshold[0]) {
        applySuggestion(suggestion.id);
      }
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'reallocation': return "🔄";
      case 'efficiency': return "⚡";
      case 'conflict_resolution': return "⚠️";
      default: return "💡";
    }
  };

  const getSuggestionColor = (impact: number) => {
    if (impact >= 20) return "text-success";
    if (impact >= 10) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-neon-blue/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <Sparkles className="h-4 w-4 text-neon-blue animate-pulse" />
          </div>
          AI Optimization Engine
          <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
            PuLP Algorithm
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Acceptance Threshold</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Minimum confidence level for auto-applying suggestions
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-2">
            <Slider
              value={acceptanceThreshold}
              onValueChange={setAcceptanceThreshold}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50% (Low)</span>
              <span className="font-medium">{acceptanceThreshold[0]}%</span>
              <span>100% (High)</span>
            </div>
          </div>
        </div>

        {/* Run Optimization Button */}
        <Button 
          onClick={runOptimization} 
          disabled={isOptimizing}
          className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Optimizing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Optimization
            </>
          )}
        </Button>

        {/* Progress Bar */}
        {isOptimizing && (
          <div className="space-y-2">
            <Progress value={optimizationProgress} className="w-full" />
            <div className="text-xs text-center text-muted-foreground">
              Analyzing constraints and computing optimal allocations...
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Optimization Suggestions</h4>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={applyAllSuggestions}
                className="text-xs"
              >
                Apply All ({suggestions.filter(s => s.confidence >= acceptanceThreshold[0]).length})
              </Button>
            </div>

            {suggestions.map((suggestion) => {
              const isApplied = appliedSuggestions.has(suggestion.id);
              const meetsThreshold = suggestion.confidence >= acceptanceThreshold[0];
              
              return (
                <div 
                  key={suggestion.id}
                  className={`p-3 rounded-lg border transition-all ${
                    meetsThreshold
                      ? 'bg-neon-blue/5 border-neon-blue/30 shadow-neon-blue/10 shadow-sm'
                      : 'bg-muted/20 border-border/30'
                  } ${isApplied ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                        <span className="text-sm font-medium">
                          {suggestion.description}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Platforms: {suggestion.platforms.join(", ")}</span>
                        <span className={getSuggestionColor(suggestion.impact)}>
                          +{suggestion.impact}% efficiency
                        </span>
                        <span>Confidence: {suggestion.confidence}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isApplied ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Button
                          size="sm"
                          variant={meetsThreshold ? "default" : "outline"}
                          onClick={() => applySuggestion(suggestion.id)}
                          disabled={suggestion.confidence < 60}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Status */}
        <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border/30">
          Last optimization: {new Date().toLocaleTimeString()} • 
          AI Model: Neural Network v2.1
        </div>
      </CardContent>
    </Card>
  );
}