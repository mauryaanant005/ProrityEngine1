import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, ChevronDown, Clock, MapPin, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TrainDetails {
  trainId: string;
  type: "express" | "local" | "freight";
  priority: "high" | "medium" | "low";
  currentStatus: string;
  schedule: {
    departure: string;
    arrival: string;
    route: string[];
  };
  constraints: {
    safety: string[];
    signals: string[];
    gradients: string[];
  };
  overrides: {
    holdDuration: number;
    rerouteOption: string;
  };
}

const mockTrainDetails: TrainDetails = {
  trainId: "12345",
  type: "express",
  priority: "high",
  currentStatus: "On Time",
  schedule: {
    departure: "14:00",
    arrival: "16:30",
    route: ["Mumbai Central", "Borivali", "Virar", "Vapi"]
  },
  constraints: {
    safety: ["Speed limit: 110 km/h", "Buffer time: 5 min"],
    signals: ["Signal clear on Track 1", "Automatic block system active"],
    gradients: ["Steep gradient: km 45-52", "Restricted speed: 80 km/h"]
  },
  overrides: {
    holdDuration: 0,
    rerouteOption: "primary"
  }
};

export const TrainDetailsSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [trainDetails] = useState(mockTrainDetails);
  const [holdDuration, setHoldDuration] = useState([trainDetails.overrides.holdDuration]);
  const [rerouteOption, setRerouteOption] = useState(trainDetails.overrides.rerouteOption);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on time": return "bg-green-500";
      case "delayed": return "bg-red-500";
      case "early": return "bg-blue-500";
      default: return "bg-yellow-500";
    }
  };

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'} flex-shrink-0`}>
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-neon-blue transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              Train Details
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-neon-blue/20"
            >
              {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-90" />}
            </Button>
          </div>
        </CardHeader>

        {isOpen && (
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{trainDetails.trainId}</span>
                <Badge className={`text-white ${getStatusColor(trainDetails.currentStatus)}`}>
                  {trainDetails.currentStatus}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline" className="justify-center">
                  {trainDetails.type}
                </Badge>
                <Badge variant="outline" className="justify-center">
                  {trainDetails.priority} priority
                </Badge>
              </div>
            </div>

            {/* Schedule */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="h-4 w-4" />
                    Schedule
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span>{trainDetails.schedule.departure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival:</span>
                    <span>{trainDetails.schedule.arrival}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium">Route:</span>
                  {trainDetails.schedule.route.map((station, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-neon-blue" />
                      <span>{station}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Constraints */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    Constraints
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                {Object.entries(trainDetails.constraints).map(([category, items]) => (
                  <div key={category}>
                    <span className="text-sm font-medium capitalize">{category}:</span>
                    <ul className="text-sm space-y-1 mt-1">
                      {items.map((item, index) => (
                        <li key={index} className="text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Override Controls */}
            <div className="space-y-4 pt-4 border-t border-border/30">
              <h4 className="font-medium text-foreground">Override Controls</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Hold Duration (minutes)</label>
                <Slider
                  value={holdDuration}
                  onValueChange={setHoldDuration}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">
                  {holdDuration[0]} minutes
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reroute Option</label>
                <Select value={rerouteOption} onValueChange={setRerouteOption}>
                  <SelectTrigger className="bg-background/50 border-neon-blue/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary Route</SelectItem>
                    <SelectItem value="alternate1">Alternate Route 1</SelectItem>
                    <SelectItem value="alternate2">Alternate Route 2</SelectItem>
                    <SelectItem value="emergency">Emergency Route</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-neon-blue hover:bg-neon-blue/80">
                Apply Overrides
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};