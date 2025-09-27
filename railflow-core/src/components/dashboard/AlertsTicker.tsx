import { useState, useEffect } from "react";
import { AlertTriangle, X, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  location?: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    message: "Weather delay affecting Track 3 - Visibility reduced due to fog",
    location: "Delhi Junction",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    priority: "high"
  },
  {
    id: "2", 
    type: "error",
    message: "Signal failure at Junction Point A7 - Manual control activated",
    location: "Ghaziabad",
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    priority: "high"
  },
  {
    id: "3",
    type: "info",
    message: "Platform 4 maintenance scheduled - Trains rerouted to Platform 5",
    location: "New Delhi",
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    priority: "medium"
  },
  {
    id: "4",
    type: "warning",
    message: "Passenger train running 12 minutes behind schedule",
    location: "Meerut",
    timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
    priority: "medium"
  }
];

export function AlertsTicker() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (alerts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % alerts.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  const dismissAlert = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (currentIndex >= alerts.length - 1) {
      setCurrentIndex(0);
    }
  };

  const getAlertStyle = (type: string, priority: string) => {
    const baseStyle = "flex items-center justify-between p-4 rounded-lg border transition-all duration-300";
    
    if (priority === 'high') {
      return type === 'error' 
        ? `${baseStyle} bg-destructive/10 border-destructive/20 text-destructive`
        : `${baseStyle} bg-warning/10 border-warning/20 text-warning`;
    }
    
    return `${baseStyle} bg-primary/10 border-primary/20 text-primary`;
  };

  const getAlertIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-success/20 bg-success/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-success flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-success-foreground"></div>
          </div>
          <span className="text-success font-medium">All systems operational - No active alerts</span>
        </div>
      </div>
    );
  }

  const currentAlert = alerts[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Alert Display */}
      <div className={getAlertStyle(currentAlert.type, currentAlert.priority)}>
        <div className="flex items-start gap-3 flex-1">
          {getAlertIcon(currentAlert.type)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">LIVE ALERT</span>
              <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
            </div>
            <p className="text-sm font-medium mb-2">{currentAlert.message}</p>
            <div className="flex items-center gap-4 text-xs opacity-80">
              {currentAlert.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{currentAlert.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(currentAlert.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => dismissAlert(currentAlert.id, e)}
          className="text-current hover:bg-current/10 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Alert Counter */}
      {alerts.length > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{alerts.length} active alerts</span>
          <div className="flex gap-1">
            {alerts.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-6 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}