import { useState } from "react";
import { Play, Plus, MapPin, Cloud, Clock, Train as TrainIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface ScenarioData {
  delayTrain?: {
    trainId: string;
    minutes: number;
  };
  rerouteTrain?: {
    trainId: string;
    newRoute: string;
  };
  newTrain?: {
    type: 'express' | 'freight' | 'local';
    priority: 'high' | 'medium' | 'low';
    time: string;
  };
  weatherImpact?: {
    severity: number;
    type: 'fog' | 'rain' | 'storm';
  };
}

interface ScenarioInputPanelProps {
  onRunSimulation: (scenario: ScenarioData) => void;
  isRunning: boolean;
  progress: number;
}

const trains = [
  { id: "12345", name: "Rajdhani Express", type: "express" },
  { id: "23456", name: "Goods Train", type: "freight" },
  { id: "34567", name: "Local Passenger", type: "local" },
  { id: "45678", name: "Shatabdi Express", type: "express" },
];

const routes = [
  { id: "route-1", name: "Main Line via Junction A", distance: "45 km" },
  { id: "route-2", name: "Alternate via Junction B", distance: "52 km" },
  { id: "route-3", name: "Express Route", distance: "41 km" },
];

export function ScenarioInputPanel({ onRunSimulation, isRunning, progress }: ScenarioInputPanelProps) {
  const [scenario, setScenario] = useState<ScenarioData>({});
  const [delayMinutes, setDelayMinutes] = useState([10]);
  const [weatherSeverity, setWeatherSeverity] = useState([3]);

  const handleRunSimulation = () => {
    const simulationData: ScenarioData = {
      ...scenario,
      delayTrain: scenario.delayTrain ? {
        ...scenario.delayTrain,
        minutes: delayMinutes[0]
      } : undefined,
      weatherImpact: scenario.weatherImpact ? {
        ...scenario.weatherImpact,
        severity: weatherSeverity[0]
      } : undefined
    };
    
    onRunSimulation(simulationData);
  };

  const isValid = () => {
    return Object.keys(scenario).length > 0;
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
          <Play className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Scenario Builder</h3>
          <p className="text-sm text-muted-foreground">Configure simulation parameters</p>
        </div>
      </div>

      <div className="space-y-6 overflow-auto max-h-[calc(100vh-300px)]">
        {/* Add Delay Section */}
        <Card className="glass-card border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Add Train Delay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Select Train</Label>
              <Select onValueChange={(value) => 
                setScenario(prev => ({ 
                  ...prev, 
                  delayTrain: { trainId: value, minutes: delayMinutes[0] }
                }))
              }>
                <SelectTrigger className="mt-1 bg-background border-orange-500/30">
                  <SelectValue placeholder="Choose train to delay" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {trains.map(train => (
                    <SelectItem key={train.id} value={train.id}>
                      <div className="flex items-center gap-2">
                        <TrainIcon className="h-3 w-3" />
                        <span>{train.name}</span>
                        <span className="text-xs text-muted-foreground">({train.id})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs font-medium">Delay Duration</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={delayMinutes}
                  onValueChange={setDelayMinutes}
                  max={60}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 min</span>
                  <span className="font-medium text-orange-500">{delayMinutes[0]} minutes</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reroute Train Section */}
        <Card className="glass-card border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              Reroute Train
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Select Train</Label>
              <Select onValueChange={(value) => 
                setScenario(prev => ({ 
                  ...prev, 
                  rerouteTrain: { trainId: value, newRoute: '' }
                }))
              }>
                <SelectTrigger className="mt-1 bg-background border-orange-500/30">
                  <SelectValue placeholder="Choose train to reroute" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {trains.map(train => (
                    <SelectItem key={train.id} value={train.id}>
                      {train.name} ({train.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium">New Route</Label>
              <Select onValueChange={(value) => 
                setScenario(prev => ({ 
                  ...prev, 
                  rerouteTrain: prev.rerouteTrain ? { ...prev.rerouteTrain, newRoute: value } : undefined
                }))
              }>
                <SelectTrigger className="mt-1 bg-background border-orange-500/30">
                  <SelectValue placeholder="Select alternate route" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      <div>
                        <div className="font-medium">{route.name}</div>
                        <div className="text-xs text-muted-foreground">{route.distance}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mini Route Preview */}
            <div className="mt-2 p-2 rounded bg-muted/20 border border-orange-500/20">
              <div className="text-xs text-muted-foreground mb-1">Route Preview</div>
              <svg width="100%" height="40" className="border border-muted rounded">
                <line x1="10" y1="20" x2="90" y2="20" stroke="hsl(var(--orange-500))" strokeWidth="2" />
                <circle cx="10" cy="20" r="3" fill="hsl(var(--primary))" />
                <circle cx="50" cy="20" r="2" fill="hsl(var(--orange-500))" />
                <circle cx="90" cy="20" r="3" fill="hsl(var(--success))" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Insert Unscheduled Train */}
        <Card className="glass-card border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plus className="h-4 w-4 text-orange-500" />
              Insert Unscheduled Train
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-medium">Train Type</Label>
                <Select onValueChange={(value: 'express' | 'freight' | 'local') => 
                  setScenario(prev => ({ 
                    ...prev, 
                    newTrain: { type: value, priority: 'medium', time: '' }
                  }))
                }>
                  <SelectTrigger className="mt-1 bg-background border-orange-500/30">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="freight">Freight</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium">Priority</Label>
                <Select onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setScenario(prev => ({ 
                    ...prev, 
                    newTrain: prev.newTrain ? { ...prev.newTrain, priority: value } : undefined
                  }))
                }>
                  <SelectTrigger className="mt-1 bg-background border-orange-500/30">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">Departure Time</Label>
              <Input 
                type="time"
                className="mt-1 bg-background border-orange-500/30"
                onChange={(e) => 
                  setScenario(prev => ({ 
                    ...prev, 
                    newTrain: prev.newTrain ? { ...prev.newTrain, time: e.target.value } : undefined
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Weather Impact */}
        <Card className="glass-card border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cloud className="h-4 w-4 text-orange-500" />
              Weather Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Weather Type</Label>
              <Select onValueChange={(value: 'fog' | 'rain' | 'storm') => 
                setScenario(prev => ({ 
                  ...prev, 
                  weatherImpact: { type: value, severity: weatherSeverity[0] }
                }))
              }>
                <SelectTrigger className="mt-1 bg-background border-orange-500/30">
                  <SelectValue placeholder="Select weather condition" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="fog">Dense Fog</SelectItem>
                  <SelectItem value="rain">Heavy Rain</SelectItem>
                  <SelectItem value="storm">Storm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium">Severity Level</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={weatherSeverity}
                  onValueChange={setWeatherSeverity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span className="font-medium text-orange-500">Level {weatherSeverity[0]}</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Run Simulation Button */}
      <div className="pt-4 border-t border-orange-500/20">
        <Button 
          onClick={handleRunSimulation}
          disabled={!isValid() || isRunning}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
        >
          {isRunning ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
              Running Simulation...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run Simulation
            </div>
          )}
        </Button>

        {isRunning && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-orange-500 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!isValid() && (
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Add at least one scenario parameter to run simulation
          </p>
        )}
      </div>
    </div>
  );
}