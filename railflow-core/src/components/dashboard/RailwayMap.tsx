import { useState, useEffect } from "react";
import { MapPin, Train, AlertTriangle } from "lucide-react";

interface TrainPosition {
  id: string;
  name: string;
  type: 'express' | 'freight' | 'local';
  x: number;
  y: number;
  speed: number;
  status: 'on-time' | 'delayed' | 'stopped';
  delay?: number;
}

const mockTrains: TrainPosition[] = [
  { id: "12345", name: "Rajdhani Express", type: "express", x: 150, y: 200, speed: 95, status: "on-time" },
  { id: "23456", name: "Goods Train", type: "freight", x: 300, y: 150, speed: 45, status: "delayed", delay: 15 },
  { id: "34567", name: "Local Passenger", type: "local", x: 450, y: 250, speed: 60, status: "on-time" },
  { id: "45678", name: "Shatabdi Express", type: "express", x: 200, y: 100, speed: 0, status: "stopped", delay: 25 },
];

const railwayPaths = [
  "M 50 200 L 600 200", // Main horizontal line
  "M 150 50 L 150 350", // Vertical junction 1
  "M 300 50 L 300 350", // Vertical junction 2  
  "M 450 50 L 450 350", // Vertical junction 3
  "M 50 100 L 600 100", // Upper horizontal line
  "M 50 300 L 600 300", // Lower horizontal line
];

const stations = [
  { name: "New Delhi", x: 100, y: 200 },
  { name: "Ghaziabad", x: 200, y: 200 },
  { name: "Meerut", x: 300, y: 200 },
  { name: "Muzaffarnagar", x: 400, y: 200 },
  { name: "Saharanpur", x: 500, y: 200 },
];

export function RailwayMap() {
  const [trains, setTrains] = useState<TrainPosition[]>(mockTrains);
  const [selectedTrain, setSelectedTrain] = useState<TrainPosition | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prev => 
        prev.map(train => ({
          ...train,
          x: train.status === 'stopped' ? train.x : (train.x + (train.speed * 0.1)) % 650,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTrainColor = (type: string, status: string) => {
    if (status === 'delayed' || status === 'stopped') return '#ef4444'; // red
    switch (type) {
      case 'express': return '#3b82f6'; // blue
      case 'freight': return '#f59e0b'; // yellow
      case 'local': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };

  const handleTrainClick = (train: TrainPosition) => {
    setSelectedTrain(train);
  };

  return (
    <div className="relative h-full w-full rounded-lg bg-gradient-to-br from-muted/20 to-muted/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Live Railway Network</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Express</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span>Freight</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Local</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      <div className="relative h-96 overflow-hidden rounded-lg border border-border bg-card">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 650 400"
          className="absolute inset-0"
        >
          {/* Railway Tracks */}
          {railwayPaths.map((path, index) => (
            <path
              key={index}
              d={path}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
          ))}

          {/* Stations */}
          {stations.map((station, index) => (
            <g key={index}>
              <circle
                cx={station.x}
                cy={station.y}
                r="8"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="2"
              />
              <text
                x={station.x}
                y={station.y - 15}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="10"
                fontWeight="500"
              >
                {station.name}
              </text>
            </g>
          ))}

          {/* Trains */}
          {trains.map((train) => (
            <g
              key={train.id}
              onClick={() => handleTrainClick(train)}
              className="cursor-pointer"
            >
              <circle
                cx={train.x}
                cy={train.y}
                r="6"
                fill={getTrainColor(train.type, train.status)}
                stroke="white"
                strokeWidth="2"
                className={train.status === 'delayed' ? 'animate-pulse' : ''}
              />
              {train.status === 'delayed' && (
                <circle
                  cx={train.x + 8}
                  cy={train.y - 8}
                  r="4"
                  fill="#ef4444"
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
        </svg>

        {/* Train Info Tooltip */}
        {selectedTrain && (
          <div className="absolute top-4 right-4 rounded-lg bg-popover p-4 shadow-elevated border border-border">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{selectedTrain.name}</h4>
              <button
                onClick={() => setSelectedTrain(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">ID:</span> {selectedTrain.id}</p>
              <p><span className="font-medium">Speed:</span> {selectedTrain.speed} km/h</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-1 font-medium ${
                  selectedTrain.status === 'on-time' ? 'text-success' :
                  selectedTrain.status === 'delayed' ? 'text-warning' :
                  'text-destructive'
                }`}>
                  {selectedTrain.status}
                </span>
              </p>
              {selectedTrain.delay && (
                <p><span className="font-medium">Delay:</span> {selectedTrain.delay} min</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}