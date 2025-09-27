import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DisruptionBanner } from "@/components/disruptions/DisruptionBanner";
import { IncidentList } from "@/components/disruptions/IncidentList";
import { DisruptionMap } from "@/components/disruptions/DisruptionMap";
import { MitigationOptions } from "@/components/disruptions/MitigationOptions";
import { DisruptionSidebar } from "@/components/disruptions/DisruptionSidebar";
import { DisruptionFooter } from "@/components/disruptions/DisruptionFooter";

const Disruptions = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/10 flex flex-col">
      {/* Header with Back Button */}
      <div className="bg-card-elevated border-b border-border/30 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="h-6 w-px bg-border/50" />
          <h1 className="text-lg font-semibold">Disruption Management</h1>
        </div>
      </div>
      
      {/* Top Alert Banner */}
      <div className="p-4">
        <DisruptionBanner />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="grid lg:grid-cols-2 gap-4">
            <IncidentList />
            <DisruptionMap />
          </div>
          <MitigationOptions />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 p-4 border-l border-border/30 overflow-auto">
          <DisruptionSidebar />
        </div>
      </div>

      {/* Footer */}
      <DisruptionFooter />
    </div>
  );
};

export default Disruptions;