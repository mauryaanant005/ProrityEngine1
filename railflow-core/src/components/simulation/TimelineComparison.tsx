import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface TrainSchedule {
  id: string;
  name: string;
  type: 'express' | 'freight' | 'local';
  startTime: Date;
  endTime: Date;
  delay?: number;
  status: 'on-time' | 'delayed' | 'improved';
}

interface TimelineComparisonProps {
  originalSchedule: TrainSchedule[];
  simulatedSchedule: TrainSchedule[];
  isAnimating: boolean;
}

const mockOriginalSchedule: TrainSchedule[] = [
  {
    id: "12345",
    name: "Rajdhani Express",
    type: "express",
    startTime: new Date(2024, 0, 1, 14, 0),
    endTime: new Date(2024, 0, 1, 16, 30),
    status: "on-time"
  },
  {
    id: "23456", 
    name: "Goods Train",
    type: "freight",
    startTime: new Date(2024, 0, 1, 13, 30),
    endTime: new Date(2024, 0, 1, 15, 45),
    status: "on-time"
  },
  {
    id: "34567",
    name: "Local Passenger",
    type: "local", 
    startTime: new Date(2024, 0, 1, 15, 15),
    endTime: new Date(2024, 0, 1, 17, 0),
    status: "on-time"
  },
  {
    id: "45678",
    name: "Shatabdi Express", 
    type: "express",
    startTime: new Date(2024, 0, 1, 14, 45),
    endTime: new Date(2024, 0, 1, 16, 15),
    status: "on-time"
  }
];

const mockSimulatedSchedule: TrainSchedule[] = [
  {
    id: "12345",
    name: "Rajdhani Express",
    type: "express", 
    startTime: new Date(2024, 0, 1, 14, 12),
    endTime: new Date(2024, 0, 1, 16, 42),
    delay: 12,
    status: "delayed"
  },
  {
    id: "23456",
    name: "Goods Train", 
    type: "freight",
    startTime: new Date(2024, 0, 1, 13, 25),
    endTime: new Date(2024, 0, 1, 15, 40),
    status: "improved"
  },
  {
    id: "34567",
    name: "Local Passenger",
    type: "local",
    startTime: new Date(2024, 0, 1, 15, 20),
    endTime: new Date(2024, 0, 1, 17, 5),
    delay: 5,
    status: "delayed"
  },
  {
    id: "45678", 
    name: "Shatabdi Express",
    type: "express",
    startTime: new Date(2024, 0, 1, 14, 40),
    endTime: new Date(2024, 0, 1, 16, 10),
    status: "improved"
  }
];

export function TimelineComparison({ 
  originalSchedule = mockOriginalSchedule, 
  simulatedSchedule = mockSimulatedSchedule, 
  isAnimating 
}: TimelineComparisonProps) {
  const originalRef = useRef<SVGSVGElement>(null);
  const simulatedRef = useRef<SVGSVGElement>(null);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);

  const getTrainColor = (type: string, status?: string) => {
    if (status === 'delayed') return '#ef4444';
    if (status === 'improved') return '#10b981';
    
    switch (type) {
      case 'express': return '#3b82f6';
      case 'freight': return '#f59e0b'; 
      case 'local': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const renderTimeline = (svgRef: React.RefObject<SVGSVGElement>, schedule: TrainSchedule[], title: string) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 60, left: 120 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Time scale
    const timeExtent = d3.extent([...schedule.map(d => d.startTime), ...schedule.map(d => d.endTime)]) as [Date, Date];
    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, width]);

    // Train scale
    const yScale = d3.scaleBand()
      .domain(schedule.map(d => d.id))
      .range([0, height])
      .padding(0.1);

    // Add title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-semibold")
      .attr("fill", "hsl(var(--foreground))")
      .text(title);

    // Add time axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M")))
      .selectAll("text")
      .attr("fill", "hsl(var(--muted-foreground))");

    // Add train labels
    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d => {
        const train = schedule.find(t => t.id === d);
        return train ? train.name : d;
      }))
      .selectAll("text")
      .attr("fill", "hsl(var(--muted-foreground))");

    // Add train bars
    const bars = g.selectAll(".train-bar")
      .data(schedule)
      .enter()
      .append("rect")
      .attr("class", "train-bar")
      .attr("x", d => xScale(d.startTime))
      .attr("y", d => yScale(d.id)!)
      .attr("width", d => xScale(d.endTime) - xScale(d.startTime))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => getTrainColor(d.type, d.status))
      .attr("stroke", d => selectedTrain === d.id ? "#fff" : "none")
      .attr("stroke-width", 2)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.8)
          .attr("transform", "scale(1.02)");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("transform", "scale(1)");
      })
      .on("click", (event, d) => {
        setSelectedTrain(selectedTrain === d.id ? null : d.id);
      });

    // Add delay indicators
    schedule.forEach(train => {
      if (train.delay) {
        g.append("text")
          .attr("x", xScale(train.endTime) + 5)
          .attr("y", yScale(train.id)! + yScale.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("class", "text-xs")
          .attr("fill", "#ef4444")
          .text(`+${train.delay}m`);
      }
    });

    // Animation for simulated timeline
    if (isAnimating && title.includes("Simulated")) {
      bars.style("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .style("opacity", 1)
        .attr("transform", "scale(1)");
    }
  };

  useEffect(() => {
    renderTimeline(originalRef, originalSchedule, "Original Schedule");
  }, [originalSchedule, selectedTrain]);

  useEffect(() => {
    renderTimeline(simulatedRef, simulatedSchedule, "Simulated Schedule");
  }, [simulatedSchedule, selectedTrain, isAnimating]);

  const getImprovementStats = () => {
    const delayed = simulatedSchedule.filter(t => t.status === 'delayed').length;
    const improved = simulatedSchedule.filter(t => t.status === 'improved').length;
    const totalDelay = simulatedSchedule.reduce((sum, t) => sum + (t.delay || 0), 0);
    
    return { delayed, improved, totalDelay };
  };

  const stats = getImprovementStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Schedule Comparison</h3>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary">
            <Clock className="h-3 w-3 mr-1" />
            Live Simulation
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Delayed</span>
          </div>
          <div className="text-lg font-bold text-destructive">{stats.delayed}</div>
        </div>
        
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Improved</span>
          </div>
          <div className="text-lg font-bold text-success">{stats.improved}</div>
        </div>
        
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Total Delay</span>
          </div>
          <div className="text-lg font-bold text-warning">{stats.totalDelay}m</div>
        </div>
      </div>

      {/* Timeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="elevated-card">
          <CardContent className="p-4">
            <svg ref={originalRef} width="400" height="300" className="w-full"></svg>
          </CardContent>
        </Card>
        
        <Card className="elevated-card">
          <CardContent className="p-4">
            <svg ref={simulatedRef} width="400" height="300" className="w-full"></svg>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Express</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>Freight</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-purple-500"></div>
          <span>Local</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Delayed</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Improved</span>
        </div>
      </div>

      {/* Selected Train Details */}
      {selectedTrain && (
        <Card className="glass-card border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Train Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const original = originalSchedule.find(t => t.id === selectedTrain);
              const simulated = simulatedSchedule.find(t => t.id === selectedTrain);
              
              if (!original || !simulated) return null;
              
              return (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{original.name}</p>
                      <p className="text-muted-foreground">ID: {original.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        simulated.status === 'delayed' ? 'bg-destructive/10 text-destructive' :
                        simulated.status === 'improved' ? 'bg-success/10 text-success' :
                        'bg-muted text-muted-foreground'
                      }>
                        {simulated.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-muted">
                    <div>
                      <p className="text-muted-foreground">Original Time</p>
                      <p>{d3.timeFormat("%H:%M")(original.startTime)} - {d3.timeFormat("%H:%M")(original.endTime)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Simulated Time</p>
                      <p>{d3.timeFormat("%H:%M")(simulated.startTime)} - {d3.timeFormat("%H:%M")(simulated.endTime)}</p>
                    </div>
                  </div>
                  
                  {simulated.delay && (
                    <div className="pt-2 border-t border-muted">
                      <p className="text-destructive">Delay: +{simulated.delay} minutes</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}