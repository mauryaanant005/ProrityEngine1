import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MessageCircle, 
  Camera, 
  RefreshCw, 
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

const mockLog: LogEntry[] = [
  {
    id: "1",
    timestamp: "14:32:15",
    user: "Controller A",
    action: "Incident Reported",
    details: "Signal breakdown reported on Track 2"
  },
  {
    id: "2",
    timestamp: "14:33:02",
    user: "AI System",
    action: "Mitigation Suggested",
    details: "Auto-generated reroute via Track 3"
  },
  {
    id: "3",
    timestamp: "14:34:45",
    user: "Controller B",
    action: "Override Applied",
    details: "Manual hold implemented for 15 minutes"
  }
];

export const DisruptionSidebar = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [incidentNotes, setIncidentNotes] = useState("");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const handleSendNotification = () => {
    // Handle notification sending
    setNotificationMessage("");
  };

  const handleLogIncident = () => {
    // Handle incident logging
    setIncidentNotes("");
  };

  return (
    <div className="space-y-4">
      {/* Stakeholder Notifications */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Quick Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Type notification message..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="bg-background/50 border-border/30 resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSendNotification}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleSendNotification}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Recipients: Operations Team, Station Masters, Emergency Services
          </div>
        </CardContent>
      </Card>

      {/* Incident Logging */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Incident Logging</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Add incident notes, observations, or updates..."
            value={incidentNotes}
            onChange={(e) => setIncidentNotes(e.target.value)}
            className="bg-background/50 border-border/30 resize-none"
            rows={4}
          />
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={handleLogIncident}
            >
              <FileText className="h-4 w-4 mr-2" />
              Log Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Updates */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Live Updates</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isAutoRefresh ? "default" : "secondary"} className="text-xs">
                {isAutoRefresh ? "LIVE" : "PAUSED"}
              </Badge>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {mockLog.map((entry) => (
                <div key={entry.id} className="p-2 bg-background/20 rounded border-l-2 border-neon-blue">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{entry.action}</span>
                    <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{entry.details}</p>
                  <span className="text-xs text-neon-blue">{entry.user}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">WebSocket Connection</span>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-neon-blue" />
                <span className="text-xs text-muted-foreground">2 sec ago</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Refresh</span>
              <Badge variant={isAutoRefresh ? "default" : "secondary"} className="text-xs">
                {isAutoRefresh ? "ON" : "OFF"}
              </Badge>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-neon-blue/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Force Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};