import { cn } from "@/lib/utils";
import { Bot, Loader2, CheckCircle2, Brain, Search, FileText } from "lucide-react";

type AgentState = "idle" | "parsing" | "reasoning" | "decisioning" | "completed";

interface AgentStatusProps {
  name: string;
  state: AgentState;
  className?: string;
}

const stateConfig: Record<AgentState, { icon: typeof Bot; label: string; color: string }> = {
  idle: { icon: Bot, label: "Idle", color: "text-muted-foreground" },
  parsing: { icon: Search, label: "Parsing", color: "text-info" },
  reasoning: { icon: Brain, label: "Reasoning", color: "text-warning" },
  decisioning: { icon: FileText, label: "Decisioning", color: "text-primary" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-success" },
};

export function AgentStatus({ name, state, className }: AgentStatusProps) {
  const config = stateConfig[state];
  const Icon = config.icon;
  const isActive = state !== "idle" && state !== "completed";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm",
        isActive && "border-primary/30 bg-primary-light",
        className
      )}
    >
      <div className={cn("relative", config.color)}>
        {isActive ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{name}</span>
        <span className={cn("text-xs", config.color)}>{config.label}</span>
      </div>
    </div>
  );
}
