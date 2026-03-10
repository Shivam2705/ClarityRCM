import { LogOut, Settings, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img alt="EXL logo" className="h-7" src="/lovable-uploads/839f6e7a-47b4-4683-b09f-b439c68af2fe.png" />
          <span className="text-xl font-bold text-foreground">RevFlow.AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <LogOut className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
