import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScenarioInputPanel } from "@/components/simulation/ScenarioInputPanel";
import { TimelineComparison } from "@/components/simulation/TimelineComparison";
import { ResultsTable } from "@/components/simulation/ResultsTable";
import { AnalysisSidebar } from "@/components/simulation/AnalysisSidebar";
import { PlayCircle, Save, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScenarioData {
  delayTrain?: {
    trainId: string;
    minutes: number;
  };
  rerouteTrain?: {
    trainId: string;
    newRoute: string;
  };
  newTrain?: {
    type: 'express' | 'freight' | 'local';
    priority: 'high' | 'medium' | 'low';
    time: string;
  };
  weatherImpact?: {
    severity: number;
    type: 'fog' | 'rain' | 'storm';
  };
}

const Simulations = () => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<string[]>([]);

  const handleRunSimulation = async (scenario: ScenarioData) => {
    setIsSimulationRunning(true);
    setSimulationProgress(0);
    setIsAnimating(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSimulationRunning(false);
          setIsAnimating(true);
          toast.success("Simulation completed! Analyzing results...", {
            description: "New timeline and impact analysis are ready."
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Log the scenario for debugging
    console.log("Running simulation with scenario:", scenario);
  };

  const handleSaveScenario = () => {
    const scenarioName = `Scenario ${Date.now()}`;
    setSavedScenarios(prev => [...prev, scenarioName]);
    toast.success("Scenario saved!", {
      description: `Saved as "${scenarioName}"`
    });
  };

  const handleExportResults = () => {
    toast.success("Exporting simulation results...", {
      description: "Charts and data will be downloaded shortly."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">What-If Simulations</h1>
            <p className="text-muted-foreground mt-2">
              Advanced scenario testing with real-time impact analysis and optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleSaveScenario}>
              <Save className="h-4 w-4 mr-2" />
              Save Scenario
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Simulation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Scenario Input (30%) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="glass-card rounded-lg p-6 h-full">
              <ScenarioInputPanel
                onRunSimulation={handleRunSimulation}
                isRunning={isSimulationRunning}
                progress={simulationProgress}
              />
            </div>
          </div>

          {/* Central Area - Timeline Comparison (50%) */}
          <div className="lg:col-span-5 xl:col-span-6">
            <div className="space-y-6 h-full">
              {/* Timeline Visualization */}
              <div className="flex-1">
                <TimelineComparison
                  originalSchedule={[]}
                  simulatedSchedule={[]}
                  isAnimating={isAnimating}
                />
              </div>

              {/* Results Table */}
              <div className="h-80">
                <ResultsTable />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Analysis (20%) */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="glass-card rounded-lg p-4 h-full">
              <AnalysisSidebar />
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">12</div>
            <div className="text-sm text-muted-foreground">Active Scenarios</div>
          </div>
          
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-success">94.7%</div>
            <div className="text-sm text-muted-foreground">Model Accuracy</div>
          </div>
          
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">2.3s</div>
            <div className="text-sm text-muted-foreground">Avg Simulation Time</div>
          </div>
          
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-warning">847</div>
            <div className="text-sm text-muted-foreground">Operations/min</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Simulations;