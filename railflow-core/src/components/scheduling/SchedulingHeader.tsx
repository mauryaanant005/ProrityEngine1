import { ArrowLeft, Search, Filter, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export const SchedulingHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="hover:bg-neon-blue/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search train ID..."
              className="pl-10 w-64 bg-background/50 border-neon-blue/20 focus:border-neon-blue"
            />
          </div>

          <Select>
            <SelectTrigger className="w-32 bg-background/50 border-neon-blue/20">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="express">Express</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="freight">Freight</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32 bg-background/50 border-neon-blue/20">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-36 bg-background/50 border-neon-blue/20">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Next Hour</SelectItem>
              <SelectItem value="day">Next Day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          {/* Integration Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">TMS</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Signals</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">Weather</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};