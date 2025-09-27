import { useState } from "react";
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  ChevronDown, 
  ChevronRight, 
  Train as TrainIcon,
  Clock,
  MapPin,
  Zap,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AffectedTrain {
  id: string;
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  delayChange: number;
  reason: string;
}

interface ConstraintViolation {
  id: string;
  type: 'safety' | 'capacity' | 'maintenance' | 'regulatory';
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedResource: string;
  suggestedFix: string;
}

interface OptimizationLog {
  timestamp: Date;
  action: string;
  confidence: number;
  reasoning: string;
  status: 'applied' | 'suggested' | 'rejected';
}

const mockAffectedTrains: AffectedTrain[] = [
  {
    id: "12345",
    name: "Rajdhani Express",
    impact: "negative",
    delayChange: +12,
    reason: "Direct delay injection"
  },
  {
    id: "23456", 
    name: "Goods Train",
    impact: "positive",
    delayChange: -5,
    reason: "Optimized routing"
  },
  {
    id: "34567",
    name: "Local Passenger", 
    impact: "negative",
    delayChange: +3,
    reason: "Cascading delay effect"
  },
  {
    id: "45678",
    name: "Shatabdi Express",
    impact: "positive", 
    delayChange: -8,
    reason: "Priority reallocation"
  }
];

const mockConstraints: ConstraintViolation[] = [
  {
    id: "cv-001",
    type: "safety",
    description: "Minimum headway violation on Track 2",
    severity: "high",
    affectedResource: "Track 2 - Junction A7",
    suggestedFix: "Increase signal spacing by 2 minutes"
  },
  {
    id: "cv-002",
    type: "capacity", 
    description: "Platform 4 over-utilization (95%)",
    severity: "medium",
    affectedResource: "Platform 4",
    suggestedFix: "Redirect freight to Platform 7"
  },
  {
    id: "cv-003",
    type: "maintenance",
    description: "Maintenance window overlap",
    severity: "low", 
    affectedResource: "Signal Box B",
    suggestedFix: "Reschedule maintenance to 2:00 AM"
  }
];

const mockOptimizationLogs: OptimizationLog[] = [
  {
    timestamp: new Date(Date.now() - 30000),
    action: "Applied priority boost for Express trains",
    confidence: 94,
    reasoning: "Reduces overall network delay by 8%",
    status: "applied"
  },
  {
    timestamp: new Date(Date.now() - 120000),
    action: "Suggested platform reallocation",
    confidence: 87,
    reasoning: "Optimizes platform utilization efficiency",
    status: "suggested"
  },
  {
    timestamp: new Date(Date.now() - 180000), 
    action: "Rejected route via Junction C",
    confidence: 23,
    reasoning: "Insufficient safety buffer",
    status: "rejected"
  },
  {
    timestamp: new Date(Date.now() - 240000),
    action: "Applied weather speed adjustment",
    confidence: 91,
    reasoning: "Compensates for fog visibility issues",
    status: "applied"
  }
];

export function AnalysisSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['impact']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'negative': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground'; 
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConstraintIcon = (type: string) => {
    switch (type) {
      case 'safety': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'capacity': return <Activity className="h-4 w-4 text-warning" />;
      case 'maintenance': return <MapPin className="h-4 w-4 text-primary" />;
      case 'regulatory': return <CheckCircle2 className="h-4 w-4 text-secondary" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <CheckCircle2 className="h-3 w-3 text-success" />;
      case 'suggested': return <Clock className="h-3 w-3 text-warning" />;
      case 'rejected': return <XCircle className="h-3 w-3 text-destructive" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4 h-full overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold text-foreground">Impact Analysis</h3>
      </div>

      {/* Impact Analysis Section */}
      <Card className="glass-card border-orange-500/20">
        <Collapsible 
          open={expandedSections.includes('impact')}
          onOpenChange={() => toggleSection('impact')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/10 transition-colors pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  Affected Trains
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500/10 text-orange-500">{mockAffectedTrains.length}</Badge>
                  {expandedSections.includes('impact') ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {mockAffectedTrains.map(train => (
                <div key={train.id} className="p-3 rounded-lg bg-muted/20 border border-muted">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrainIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{train.name}</span>
                    </div>
                    {getImpactIcon(train.impact)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2">{train.reason}</div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>Delay Change:</span>
                    <span className={`font-medium ${
                      train.delayChange > 0 ? 'text-destructive' : 'text-success'
                    }`}>
                      {train.delayChange > 0 ? '+' : ''}{train.delayChange} min
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Constraint Violations Section */}
      <Card className="glass-card border-orange-500/20">
        <Collapsible 
          open={expandedSections.includes('constraints')}
          onOpenChange={() => toggleSection('constraints')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/10 transition-colors pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Constraint Violations
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-destructive/10 text-destructive">{mockConstraints.length}</Badge>
                  {expandedSections.includes('constraints') ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {mockConstraints.map(constraint => (
                <div key={constraint.id} className="p-3 rounded-lg bg-muted/20 border border-muted">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getConstraintIcon(constraint.type)}
                      <Badge className={getSeverityColor(constraint.severity)}>
                        {constraint.severity}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium mb-1">{constraint.description}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Resource: {constraint.affectedResource}
                  </div>
                  
                  <div className="p-2 rounded bg-success/10 border border-success/20">
                    <div className="text-xs font-medium text-success mb-1">Suggested Fix:</div>
                    <div className="text-xs text-muted-foreground">{constraint.suggestedFix}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* AI Optimization Log Section */}
      <Card className="glass-card border-orange-500/20">
        <Collapsible 
          open={expandedSections.includes('optimization')}
          onOpenChange={() => toggleSection('optimization')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/10 transition-colors pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  AI Optimization Log
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary">Live</Badge>
                  {expandedSections.includes('optimization') ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3 max-h-64 overflow-auto">
              {mockOptimizationLogs.map((log, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/20 border border-muted">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">{log.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium mb-1">{log.action}</div>
                  <div className="text-xs text-muted-foreground mb-2">{log.reasoning}</div>
                  
                  <div className="mt-2">
                    <Progress value={log.confidence} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Model Status */}
      <Card className="glass-card border-orange-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">ML Model Status</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model Version:</span>
              <span className="font-medium">v2.4.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Training:</span>
              <span className="font-medium">2h ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium text-success">94.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing:</span>
              <span className="font-medium">847 ops/min</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-muted">
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Force Re-optimization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}