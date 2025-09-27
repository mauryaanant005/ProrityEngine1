import { useState } from "react";
import { Filter, BarChart3, Lock, Unlock, FileDown, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ResourceFilter {
  type: 'all' | 'platforms' | 'tracks' | 'signals';
  availability: 'all' | 'available' | 'occupied' | 'maintenance';
  electrification: 'all' | 'electric' | 'diesel';
}

export function ResourceSidebar() {
  const [filters, setFilters] = useState<ResourceFilter>({
    type: 'all',
    availability: 'all',
    electrification: 'all'
  });
  const [lockedResources, setLockedResources] = useState<Set<string>>(new Set());
  const [auditNote, setAuditNote] = useState("");

  const utilizationData = [
    { resource: "Platform 1", utilization: 85, status: "high" },
    { resource: "Platform 2", utilization: 42, status: "low" },
    { resource: "Platform 3", utilization: 78, status: "medium" },
    { resource: "Platform 4", utilization: 0, status: "maintenance" },
    { resource: "Track A", utilization: 92, status: "high" },
    { resource: "Track B", utilization: 67, status: "medium" },
  ];

  const auditHistory = [
    { time: "14:23", user: "Controller A", action: "Platform 2 assigned to EXP-102" },
    { time: "14:15", user: "AI System", action: "Auto-optimization applied" },
    { time: "14:10", user: "Controller B", action: "Platform 4 locked for maintenance" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      case 'maintenance': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      case 'maintenance': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const toggleResourceLock = (resourceId: string) => {
    setLockedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const exportReport = () => {
    // Mock CSV export
    const csvData = utilizationData.map(item => 
      `${item.resource},${item.utilization}%,${item.status}`
    ).join('\n');
    
    const blob = new Blob([`Resource,Utilization,Status\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resource_allocation_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Resource Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resource Type</label>
            <Select 
              value={filters.type} 
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="platforms">Platforms Only</SelectItem>
                <SelectItem value="tracks">Tracks Only</SelectItem>
                <SelectItem value="signals">Signals Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Availability</label>
            <Select 
              value={filters.availability} 
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, availability: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Power Type</label>
            <Select 
              value={filters.electrification} 
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, electrification: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="electric">Electric Only</SelectItem>
                <SelectItem value="diesel">Diesel Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Utilization Charts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Resource Utilization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {utilizationData.map((item) => (
            <div key={item.resource} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.resource}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.utilization}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleResourceLock(item.resource)}
                  >
                    {lockedResources.has(item.resource) ? (
                      <Lock className="h-3 w-3 text-warning" />
                    ) : (
                      <Unlock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getStatusBg(item.status)}`}
                  style={{ width: `${item.utilization}%` }}
                />
              </div>
            </div>
          ))}
          
          <Separator />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall Efficiency</span>
            <Badge variant="secondary">74% Optimal</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Override Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Override Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Audit Note</label>
            <Textarea 
              placeholder="Enter reason for manual override..."
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="emergency" />
            <label htmlFor="emergency" className="text-sm">
              Emergency Override
            </label>
          </div>

          <Button className="w-full" variant="outline">
            Apply Override
          </Button>
        </CardContent>
      </Card>

      {/* Audit History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditHistory.map((entry, index) => (
              <div key={index} className="text-xs border-l-2 border-border/30 pl-3 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">{entry.time}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{entry.user}</span>
                </div>
                <div className="text-muted-foreground mt-1">{entry.action}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Controls */}
      <Button 
        onClick={exportReport} 
        variant="outline" 
        className="w-full"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Export Report (CSV)
      </Button>
    </div>
  );
}