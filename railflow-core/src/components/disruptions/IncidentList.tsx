import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, Train, MapPin, Cloud, Wrench, AlertCircle } from "lucide-react";

interface Incident {
  id: string;
  title: string;
  type: "breakdown" | "weather" | "maintenance" | "accident";
  severity: "high" | "medium" | "low";
  location: string;
  timestamp: string;
  affectedTrains: string[];
  description: string;
  estimatedImpact: string;
}

const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Signal Equipment Breakdown",
    type: "breakdown",
    severity: "high",
    location: "Track 2, Junction A",
    timestamp: "2024-01-15 14:30",
    affectedTrains: ["12345", "67890", "11111"],
    description: "Primary signaling system failure affecting automatic train protection",
    estimatedImpact: "15-20 min delay on all affected routes"
  },
  {
    id: "2", 
    title: "Heavy Rain Alert",
    type: "weather",
    severity: "medium",
    location: "Section B-C",
    timestamp: "2024-01-15 13:45",
    affectedTrains: ["22222", "33333"],
    description: "Reduced visibility and speed restrictions due to heavy rainfall",
    estimatedImpact: "5-10 min delay, speed reduced to 60 km/h"
  },
  {
    id: "3",
    title: "Track Maintenance",
    type: "maintenance",
    severity: "low",
    location: "Platform 3",
    timestamp: "2024-01-15 12:00",
    affectedTrains: ["44444"],
    description: "Scheduled track maintenance causing platform unavailability",
    estimatedImpact: "Reroute to Platform 4, minimal delay expected"
  }
];

export const IncidentList = () => {
  const [incidents] = useState(mockIncidents);
  const [sortBy, setSortBy] = useState("severity");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "breakdown": return <AlertTriangle className="h-4 w-4" />;
      case "weather": return <Cloud className="h-4 w-4" />;
      case "maintenance": return <Wrench className="h-4 w-4" />;
      case "accident": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortBy === "severity") {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground">Active Incidents</CardTitle>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-background/50 border-border/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Sort by Severity</SelectItem>
              <SelectItem value="time">Sort by Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {sortedIncidents.map((incident) => (
            <AccordionItem key={incident.id} value={incident.id} className="border border-border/30 rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-background/20 rounded-lg">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(incident.type)}
                    <Badge className={`${getSeverityColor(incident.severity)} text-white text-xs`}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium">{incident.title}</div>
                    <div className="text-sm text-muted-foreground">{incident.location}</div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {incident.timestamp}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Affected Trains:</h4>
                      <div className="flex flex-wrap gap-1">
                        {incident.affectedTrains.map((trainId) => (
                          <Badge key={trainId} variant="outline" className="text-xs">
                            <Train className="h-3 w-3 mr-1" />
                            {trainId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Estimated Impact:</h4>
                      <p className="text-sm text-orange-400">{incident.estimatedImpact}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="hover:bg-blue-500/20">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-green-500/20">
                      Mitigate
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};