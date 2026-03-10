import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { revenueCycleAgents } from "@/data/agents";
import { useNavigate } from "react-router-dom";

const tools = revenueCycleAgents;

const EssentialTools = () => {
  const navigate = useNavigate();
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            AI Agent Suites for Intelligent Healthcare Revenue Cycle Management
          </h2>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="relative p-6 bg-gradient-to-br from-card to-card/50 border-border/50 flex flex-col items-center text-center gap-4 hover:border-primary/40 transition-colors"
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl text-white",
                  tool.iconColor
                )}
              >
                {tool.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground">
                {tool.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              {/* Visit Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
                className="w-fit mt-auto"
              >
                Visit
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EssentialTools;
