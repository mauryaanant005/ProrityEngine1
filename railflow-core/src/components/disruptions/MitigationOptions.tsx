import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Route, Clock, ArrowRight } from "lucide-react";

interface MitigationOption {
  id: string;
  title: string;
  description: string;
  estimatedImpact: string;
  confidence: number;
  pros: string[];
  cons: string[];
  type: "reroute" | "delay" | "priority" | "resource";
}

const mockOptions: MitigationOption[] = [
  {
    id: "1",
    title: "Reroute via Alternative Track",
    description: "Redirect affected trains through Track 3 to bypass the disruption",
    estimatedImpact: "Reduce delay by 15 min",
    confidence: 85,
    pros: ["Minimal passenger impact", "Quick implementation", "Maintains schedule integrity"],
    cons: ["Increased congestion on Track 3", "Slight fuel cost increase"],
    type: "reroute"
  },
  {
    id: "2",
    title: "Implement Hold Strategy",
    description: "Hold trains at previous stations until disruption is resolved",
    estimatedImpact: "Reduce system-wide delay by 8 min",
    confidence: 72,
    pros: ["Prevents cascade delays", "Passenger safety maintained", "Resource optimization"],
    cons: ["Station crowding", "Passenger inconvenience", "Platform utilization"],
    type: "delay"
  },
  {
    id: "3",
    title: "Priority Adjustment",
    description: "Increase priority for express services, delay freight trains",
    estimatedImpact: "Reduce passenger delay by 20 min",
    confidence: 90,
    pros: ["Passenger service priority", "Revenue protection", "Schedule recovery"],
    cons: ["Freight delay impact", "Cargo delivery delays"],
    type: "priority"
  }
];

export const MitigationOptions = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [holdDuration, setHoldDuration] = useState([10]);
  const [rerouteOption, setRerouteOption] = useState("");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reroute": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "delay": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "priority": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "resource": return "bg-green-500/20 text-green-300 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mockOptions.map((option) => (
              <Card key={option.id} className="p-4 bg-background/20 border-border/30 hover:bg-background/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-foreground">{option.title}</h4>
                        <Badge className={getTypeColor(option.type)}>
                          {option.type}
                        </Badge>
                        <span className={`text-sm font-medium ${getConfidenceColor(option.confidence)}`}>
                          {option.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                      <div className="text-sm font-medium text-green-400">{option.estimatedImpact}</div>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setSelectedOption(option.id)}
                    >
                      Apply
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-green-400 mb-1 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Pros
                      </h5>
                      <ul className="space-y-1">
                        {option.pros.map((pro, index) => (
                          <li key={index} className="text-muted-foreground">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-400 mb-1 flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        Cons
                      </h5>
                      <ul className="space-y-1">
                        {option.cons.map((con, index) => (
                          <li key={index} className="text-muted-foreground">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Controls */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Manual Adjustments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hold Duration (minutes)
            </label>
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
            <label className="text-sm font-medium flex items-center gap-2">
              <Route className="h-4 w-4" />
              Reroute Option
            </label>
            <Select value={rerouteOption} onValueChange={setRerouteOption}>
              <SelectTrigger className="bg-background/50 border-border/30">
                <SelectValue placeholder="Select alternative route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="track3">Track 3 (via Junction B)</SelectItem>
                <SelectItem value="track4">Track 4 (express route)</SelectItem>
                <SelectItem value="bypass">Emergency bypass route</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Apply Manual Override
            </Button>
            <Button variant="outline" className="flex-1">
              Preview Impact
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mini Timeline Preview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Impact Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Before</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">After</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-background/20 p-2 rounded">
                <span className="text-sm">Average Delay</span>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">25 min</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-green-400">10 min</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-background/20 p-2 rounded">
                <span className="text-sm">Affected Trains</span>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">8</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-green-400">3</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-background/20 p-2 rounded">
                <span className="text-sm">System Efficiency</span>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">65%</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-green-400">85%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};