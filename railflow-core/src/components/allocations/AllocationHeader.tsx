import { ChevronDown, RotateCw, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AllocationHeader() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState("Central Zone - Delhi Division");
  const navigate = useNavigate();

  const handleSync = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  const segments = [
    "Central Zone - Delhi Division",
    "Western Zone - Mumbai Division", 
    "Southern Zone - Chennai Division",
    "Eastern Zone - Kolkata Division"
  ];

  return (
    <div className="bg-card-elevated border-b border-border/30 p-4">
      <div className="flex items-center justify-between">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-between">
                {selectedSegment}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {segments.map((segment) => (
                <DropdownMenuItem
                  key={segment}
                  onClick={() => setSelectedSegment(segment)}
                  className={selectedSegment === segment ? "bg-accent" : ""}
                >
                  {segment}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSync}
                  disabled={isLoading}
                >
                  <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Syncing...' : 'Real-time Sync'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Sync with live railway systems for real-time platform status
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Platform Allocation Help: Drag trains to available platforms, 
                check constraints, and use AI optimization for best results
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}