import { AllocationHeader } from "@/components/allocations/AllocationHeader";
import { StationDiagram } from "@/components/allocations/StationDiagram";
import { AllocationTable } from "@/components/allocations/AllocationTable";
import { AIOptimizer } from "@/components/allocations/AIOptimizer";
import { ResourceSidebar } from "@/components/allocations/ResourceSidebar";
import { TimelineSlider } from "@/components/allocations/TimelineSlider";

const Allocations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <AllocationHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Top Section - Station Diagram */}
          <StationDiagram />
          
          {/* Middle Section - Allocation Table and AI Optimizer */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AllocationTable />
            </div>
            <div>
              <AIOptimizer />
            </div>
          </div>
          
          {/* Bottom Section - Timeline */}
          <TimelineSlider />
        </div>
        
        {/* Right Sidebar */}
        <div className="border-l border-border/30 overflow-auto">
          <ResourceSidebar />
        </div>
      </div>
    </div>
  );
};

export default Allocations;