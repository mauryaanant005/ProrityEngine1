import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="elevated-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist in the Railway AI Control System.
          </p>
          <p className="text-sm text-muted-foreground">
            Route: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
          <Button asChild className="btn-primary-gradient w-full">
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
