import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  RotateCcw, 
  Download, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  impact?: string;
}

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:22",
    user: "Controller A",
    action: "Priority Changed",
    details: "Train 12345 priority changed from Medium to High",
    impact: "Reduced delay by 8 minutes"
  },
  {
    id: "2", 
    timestamp: "2024-01-15 14:28:15",
    user: "AI System",
    action: "Auto Optimization",
    details: "Applied ML model recommendations for Track 2 schedule",
    impact: "Overall throughput improved by 12%"
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:25:10",
    user: "Controller B",
    action: "Manual Override",
    details: "Hold applied to Train 67890 for 10 minutes",
    impact: "Prevented conflict with Express service"
  }
];

export const SchedulingFooter = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [auditLog] = useState(mockAuditLog);

  const handleApplyChanges = () => {
    setShowConfirmation(true);
    // Simulate API call
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  return (
    <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between">
        {/* Integration Status */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">System Status:</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">TMS Connected</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Signaling System</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Weather API</span>
            </div>
          </div>
        </div>

        {/* Audit Log Mini Viewer */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-neon-blue/10">
              <FileText className="h-4 w-4 mr-2" />
              Audit Log
              <Badge variant="secondary" className="ml-2">
                {auditLog.length}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Audit Trail</DialogTitle>
              <DialogDescription>
                Recent scheduling changes and system actions
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {auditLog.map((entry) => (
                  <Card key={entry.id} className="p-3">
                    <CardContent className="p-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{entry.action}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {entry.details}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          By: {entry.user}
                        </span>
                        {entry.impact && (
                          <Badge variant="outline" className="text-xs">
                            {entry.impact}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hover:bg-neon-blue/10">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Original
          </Button>

          <Button variant="outline" size="sm" className="hover:bg-neon-blue/10">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                disabled={showConfirmation}
              >
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Schedule Changes</DialogTitle>
                <DialogDescription>
                  Review the impact of your changes before applying them to the live system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">-12%</div>
                      <div className="text-sm text-muted-foreground">Average Delay</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">+8%</div>
                      <div className="text-sm text-muted-foreground">Throughput</div>
                    </div>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Affected Trains:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Train 12345: Priority increased, delay reduced by 8 min</li>
                    <li>• Train 67890: Rescheduled, new ETA 15:45</li>
                    <li>• Train 11111: Route optimized via alternate track</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleApplyChanges}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirm & Apply
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};