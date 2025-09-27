import { useState } from "react";
import { ArrowUpDown, Edit3, CheckCircle, XCircle, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AllocationData {
  platformId: string;
  currentTrain: string | null;
  availability: 'available' | 'occupied' | 'maintenance';
  constraints: {
    length: number;
    electrification: boolean;
    accessibility: boolean;
  };
  nextAvailable: string;
  utilizationRate: number;
}

export function AllocationTable() {
  const [sortField, setSortField] = useState<keyof AllocationData>('platformId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingRow, setEditingRow] = useState<string | null>(null);

  const [allocations, setAllocations] = useState<AllocationData[]>([
    {
      platformId: "Platform 1",
      currentTrain: "EXP-101",
      availability: 'occupied',
      constraints: { length: 400, electrification: true, accessibility: true },
      nextAvailable: "14:30",
      utilizationRate: 85
    },
    {
      platformId: "Platform 2", 
      currentTrain: null,
      availability: 'available',
      constraints: { length: 300, electrification: false, accessibility: true },
      nextAvailable: "Now",
      utilizationRate: 42
    },
    {
      platformId: "Platform 3",
      currentTrain: "FRT-340", 
      availability: 'occupied',
      constraints: { length: 500, electrification: true, accessibility: false },
      nextAvailable: "16:15",
      utilizationRate: 78
    },
    {
      platformId: "Platform 4",
      currentTrain: null,
      availability: 'maintenance',
      constraints: { length: 600, electrification: true, accessibility: true },
      nextAvailable: "Tomorrow",
      utilizationRate: 0
    }
  ]);

  const handleSort = (field: keyof AllocationData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-success/20 text-success border-success/30">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getConstraintIcons = (constraints: AllocationData['constraints']) => (
    <div className="flex gap-1">
      <Zap className="h-4 w-4 text-neon-blue" />
      <CheckCircle className="h-4 w-4 text-success" />
      {constraints.length < 400 && (
        <AlertTriangle className="h-4 w-4 text-warning" />
      )}
    </div>
  );

  const handleTrainAssignment = (platformId: string, trainId: string | null) => {
    setAllocations(prev => prev.map(allocation =>
      allocation.platformId === platformId
        ? {
            ...allocation,
            currentTrain: trainId,
            availability: trainId ? 'occupied' : 'available'
          }
        : allocation
    ));
    setEditingRow(null);
  };

  const sortedAllocations = [...allocations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier;
    }
    return 0;
  });

  return (
    <div className="bg-card rounded-lg border border-border/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Platform Allocation Table</h3>
        <Button variant="outline" size="sm">
          <Edit3 className="h-4 w-4 mr-2" />
          Bulk Edit
        </Button>
      </div>

      <div className="border border-border/20 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="cursor-pointer" onClick={() => handleSort('platformId')}>
                <div className="flex items-center gap-2">
                  Platform ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Current Train</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('availability')}>
                <div className="flex items-center gap-2">
                  Availability
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Constraints</TableHead>
              <TableHead>Length (m)</TableHead>
              <TableHead>Next Available</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('utilizationRate')}>
                <div className="flex items-center gap-2">
                  Utilization %
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAllocations.map((allocation) => (
              <TableRow key={allocation.platformId} className="hover:bg-muted/20">
                <TableCell className="font-medium">{allocation.platformId}</TableCell>
                <TableCell>
                  {editingRow === allocation.platformId ? (
                    <Select 
                      value={allocation.currentTrain || ""} 
                      onValueChange={(value) => handleTrainAssignment(allocation.platformId, value || null)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select train" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="EXP-101">EXP-101</SelectItem>
                        <SelectItem value="LOC-205">LOC-205</SelectItem>
                        <SelectItem value="FRT-340">FRT-340</SelectItem>
                        <SelectItem value="EXP-102">EXP-102</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="font-mono text-sm">
                      {allocation.currentTrain || '-'}
                    </span>
                  )}
                </TableCell>
                <TableCell>{getAvailabilityBadge(allocation.availability)}</TableCell>
                <TableCell>{getConstraintIcons(allocation.constraints)}</TableCell>
                <TableCell>{allocation.constraints.length}m</TableCell>
                <TableCell className="font-mono text-sm">{allocation.nextAvailable}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`h-2 w-16 rounded-full overflow-hidden ${
                        allocation.utilizationRate > 80 ? 'bg-destructive/20' : 
                        allocation.utilizationRate > 60 ? 'bg-warning/20' : 'bg-success/20'
                      }`}
                    >
                      <div 
                        className={`h-full rounded-full ${
                          allocation.utilizationRate > 80 ? 'bg-destructive' :
                          allocation.utilizationRate > 60 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${allocation.utilizationRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{allocation.utilizationRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingRow(
                      editingRow === allocation.platformId ? null : allocation.platformId
                    )}
                  >
                    {editingRow === allocation.platformId ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}