import { useState } from "react";
import { Save, Download, Trash2, Edit3, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SimulationResult {
  id: string;
  name: string;
  timestamp: Date;
  totalDelay: number;
  throughput: number;
  utilization: number;
  improvements: number;
  status: 'completed' | 'running' | 'failed';
}

const mockResults: SimulationResult[] = [
  {
    id: "sim-001",
    name: "Weather Impact - Dense Fog",
    timestamp: new Date(2024, 0, 1, 14, 30),
    totalDelay: 24,
    throughput: 127,
    utilization: 73.2,
    improvements: 2,
    status: 'completed'
  },
  {
    id: "sim-002", 
    name: "Rajdhani Delay Scenario",
    timestamp: new Date(2024, 0, 1, 14, 15),
    totalDelay: 18,
    throughput: 134,
    utilization: 76.8,
    improvements: 4,
    status: 'completed'
  },
  {
    id: "sim-003",
    name: "Platform Reallocation Test",
    timestamp: new Date(2024, 0, 1, 13, 45),
    totalDelay: 12,
    throughput: 142,
    utilization: 81.5,
    improvements: 6,
    status: 'completed'
  },
  {
    id: "sim-004",
    name: "Emergency Reroute Analysis",
    timestamp: new Date(2024, 0, 1, 13, 20),
    totalDelay: 31,
    throughput: 118,
    utilization: 68.9,
    improvements: 1,
    status: 'failed'
  }
];

interface ResultsTableProps {
  results?: SimulationResult[];
  onSelectResult?: (result: SimulationResult) => void;
}

export function ResultsTable({ results = mockResults, onSelectResult }: ResultsTableProps) {
  const [scenarios, setScenarios] = useState<SimulationResult[]>(results);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveRename = () => {
    if (editingId && editName.trim()) {
      setScenarios(prev => 
        prev.map(scenario => 
          scenario.id === editingId 
            ? { ...scenario, name: editName.trim() }
            : scenario
        )
      );
    }
    setEditingId(null);
    setEditName("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = (id: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success">Completed</Badge>;
      case 'running': 
        return <Badge className="bg-primary/10 text-primary">Running</Badge>;
      case 'failed':
        return <Badge className="bg-destructive/10 text-destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPerformanceColor = (value: number, type: 'delay' | 'throughput' | 'utilization') => {
    switch (type) {
      case 'delay':
        return value < 15 ? 'text-success' : value < 25 ? 'text-warning' : 'text-destructive';
      case 'throughput':
        return value > 135 ? 'text-success' : value > 120 ? 'text-warning' : 'text-destructive';
      case 'utilization':
        return value > 75 ? 'text-success' : value > 65 ? 'text-warning' : 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Scenario Name', 'Timestamp', 'Total Delay (min)', 'Throughput', 'Utilization (%)', 'Improvements', 'Status'].join(','),
      ...scenarios.map(s => [
        s.name,
        s.timestamp.toISOString(),
        s.totalDelay,
        s.throughput,
        s.utilization,
        s.improvements,
        s.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Simulation Results
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="w-[30%]">Scenario Name</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Total Delay</TableHead>
                <TableHead className="text-right">Throughput</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
                <TableHead className="text-right">Improvements</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow 
                  key={scenario.id} 
                  className="hover:bg-muted/10 cursor-pointer transition-colors"
                  onClick={() => onSelectResult?.(scenario)}
                >
                  <TableCell>
                    {editingId === scenario.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename();
                            if (e.key === 'Escape') cancelRename();
                          }}
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveRename}>
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-foreground">{scenario.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {scenario.id}</div>
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {scenario.timestamp.toLocaleDateString()} <br />
                    {scenario.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  
                  <TableCell className={`text-right font-medium ${getPerformanceColor(scenario.totalDelay, 'delay')}`}>
                    {scenario.totalDelay}m
                  </TableCell>
                  
                  <TableCell className={`text-right font-medium ${getPerformanceColor(scenario.throughput, 'throughput')}`}>
                    {scenario.throughput}/hr
                  </TableCell>
                  
                  <TableCell className={`text-right font-medium ${getPerformanceColor(scenario.utilization, 'utilization')}`}>
                    {scenario.utilization}%
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-success/10 text-success">
                      +{scenario.improvements}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(scenario.status)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(scenario.id, scenario.name);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{scenario.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(scenario.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {scenarios.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No simulation results yet</p>
            <p className="text-sm text-muted-foreground">Run your first simulation to see results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}