import { CheckCircle, XCircle, Info, Clock, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface Recommendation {
  id: string;
  title: string;
  type: 'optimization' | 'safety' | 'efficiency';
  impact: 'high' | 'medium' | 'low';
  description: string;
  details: {
    expectedImprovement: string;
    affectedTrains: number;
    timeToImplement: string;
    safetyBuffer: string;
    constraints: string[];
  };
  confidence: number;
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Optimize Track 2 Scheduling",
    type: "optimization",
    impact: "high", 
    description: "Adjust signal timing to reduce overall delay by 8 minutes",
    details: {
      expectedImprovement: "12% reduction in average delay",
      affectedTrains: 7,
      timeToImplement: "2 minutes",
      safetyBuffer: "3.2 minutes maintained",
      constraints: ["Freight priority", "Signal maintenance window", "Platform availability"]
    },
    confidence: 94
  },
  {
    id: "2", 
    title: "Reroute Express Train 12345",
    type: "efficiency",
    impact: "medium",
    description: "Use alternate route via Junction A to avoid congestion",
    details: {
      expectedImprovement: "6 minute time saving",
      affectedTrains: 3,
      timeToImplement: "5 minutes",
      safetyBuffer: "4.1 minutes maintained", 
      constraints: ["Platform capacity", "Crew schedule alignment"]
    },
    confidence: 87
  },
  {
    id: "3",
    title: "Platform Reallocation",
    type: "safety",
    impact: "high",
    description: "Move freight operations to Platform 7 for safety compliance",
    details: {
      expectedImprovement: "Enhanced safety clearance",
      affectedTrains: 2,
      timeToImplement: "8 minutes", 
      safetyBuffer: "5.5 minutes maintained",
      constraints: ["Platform electrification", "Loading equipment availability"]
    },
    confidence: 96
  }
];

export function RecommendationPanel() {
  const [recommendations] = useState<Recommendation[]>(mockRecommendations);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'efficiency': return <Clock className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'text-primary bg-primary/10';
      case 'safety': return 'text-destructive bg-destructive/10';
      case 'efficiency': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground'; 
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAccept = (id: string) => {
    // Implementation for accepting recommendation
    console.log(`Accepting recommendation: ${id}`);
  };

  const handleOverride = (id: string) => {
    // Implementation for overriding recommendation  
    console.log(`Overriding recommendation: ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {recommendations.length} Active
        </Badge>
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${getTypeColor(recommendation.type)}`}>
                    {getTypeIcon(recommendation.type)}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-foreground">
                      {recommendation.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getImpactColor(recommendation.impact)}>
                    {recommendation.impact}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {recommendation.confidence}% confidence
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex gap-2 mb-3">
                <Button 
                  size="sm" 
                  onClick={() => handleAccept(recommendation.id)}
                  className="flex-1 btn-primary-gradient text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleOverride(recommendation.id)}
                  className="flex-1 text-xs"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Override
                </Button>
              </div>

              <Collapsible 
                open={expandedId === recommendation.id}
                onOpenChange={() => 
                  setExpandedId(expandedId === recommendation.id ? null : recommendation.id)
                }
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                    {expandedId === recommendation.id ? 'Hide Details' : 'Show Details'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-2">
                  <div className="rounded-lg bg-muted/20 p-3 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Improvement:</span>
                      <span className="font-medium text-success">{recommendation.details.expectedImprovement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Affected Trains:</span>
                      <span className="font-medium">{recommendation.details.affectedTrains}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Implementation Time:</span>
                      <span className="font-medium">{recommendation.details.timeToImplement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Safety Buffer:</span>
                      <span className="font-medium text-success">{recommendation.details.safetyBuffer}</span>
                    </div>
                    <div className="pt-2 border-t border-muted">
                      <p className="text-muted-foreground mb-1">Constraints:</p>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.details.constraints.map((constraint, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {constraint}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-muted">
        <div className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">ML Model Status</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last optimization: 2 minutes ago • Next update: 3 minutes
        </p>
      </div>
    </div>
  );
}