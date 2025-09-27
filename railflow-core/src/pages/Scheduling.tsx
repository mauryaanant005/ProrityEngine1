import { SchedulingHeader } from "@/components/scheduling/SchedulingHeader";
import { GanttTimeline } from "@/components/scheduling/GanttTimeline";
import { PrecedencePanel } from "@/components/scheduling/PrecedencePanel";
import { TrainDetailsSidebar } from "@/components/scheduling/TrainDetailsSidebar";
import { SchedulingFooter } from "@/components/scheduling/SchedulingFooter";

const Scheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <SchedulingHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Main Timeline */}
          <div className="flex-1 overflow-hidden">
            <GanttTimeline />
          </div>
          
          {/* Precedence Panel */}
          <div className="h-80 overflow-hidden">
            <PrecedencePanel />
          </div>
        </div>
        
        {/* Right Sidebar */}
        <TrainDetailsSidebar />
      </div>
      
      <SchedulingFooter />
    </div>
  );
};

export default Scheduling;