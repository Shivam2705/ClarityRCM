import { CheckCircle2, Circle, AlertCircle, Clock, Edit3, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type StepStatus = "completed" | "active" | "pending" | "warning" | "needs-review";

export type AgentEligibilityStatus = "new" | "eligible" | "eligible-pa-req" | "not-eligible" | "pa-review" | "pa-submitted" | "pa-denied";

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  status: StepStatus;
  agentName?: string;
  agentStatus?: AgentEligibilityStatus;
  hasCorrections?: boolean;
  canEdit?: boolean;
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  onEditStep?: (stepId: string) => void;
  className?: string;
}

const statusConfig: Record<StepStatus, { icon: typeof Circle; color: string; bgColor: string; ringColor: string }> = {
  completed: { 
    icon: CheckCircle2, 
    color: "text-success", 
    bgColor: "bg-success/20", 
    ringColor: "ring-success/30" 
  },
  active: { 
    icon: Circle, 
    color: "text-primary", 
    bgColor: "bg-primary/20", 
    ringColor: "ring-primary/50" 
  },
  pending: { 
    icon: Circle, 
    color: "text-muted-foreground", 
    bgColor: "bg-muted", 
    ringColor: "ring-muted" 
  },
  warning: { 
    icon: AlertCircle, 
    color: "text-warning", 
    bgColor: "bg-warning/20", 
    ringColor: "ring-warning/30" 
  },
  "needs-review": { 
    icon: AlertCircle, 
    color: "text-destructive", 
    bgColor: "bg-destructive/20", 
    ringColor: "ring-destructive/30" 
  },
};

const agentStatusConfig: Record<AgentEligibilityStatus, { label: string; className: string }> = {
  "new": { label: "New", className: "bg-muted text-muted-foreground border-muted" },
  "eligible": { label: "Eligible", className: "bg-success/20 text-success border-success/30" },
  "eligible-pa-req": { label: "Eligible PA Req", className: "bg-warning/20 text-warning border-warning/30" },
  "not-eligible": { label: "Not Eligible", className: "bg-destructive/20 text-destructive border-destructive/30" },
  "pa-review": { label: "PA Review", className: "bg-warning/20 text-warning border-warning/30" },
  "pa-submitted": { label: "PA Submitted", className: "bg-success/20 text-success border-success/30" },
  "pa-denied": { label: "PA Denied", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function WorkflowSteps({ steps, currentStep, onStepClick, onEditStep, className }: WorkflowStepsProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {steps.map((step, index) => {
        const config = statusConfig[step.status];
        const Icon = config.icon;
        const isActive = step.id === currentStep;
        const isClickable = !!onStepClick;
        const canEdit = step.canEdit && step.status === "completed" && onEditStep;

        return (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-[18px] top-12 h-[calc(100%-12px)] w-0.5",
                  step.status === "completed" ? "bg-gradient-to-b from-success/50 to-success/20" : "bg-border"
                )}
              />
            )}

            <div
              className={cn(
                "relative flex items-start gap-3 rounded-xl p-3 transition-all duration-200",
                isActive && "bg-primary/10 ring-1 ring-primary/30",
                isClickable && !isActive && "hover:bg-secondary/50 cursor-pointer",
                step.hasCorrections && "ring-1 ring-warning/50"
              )}
            >
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={!isClickable}
                className="flex items-start gap-3 flex-1 text-left"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all",
                    config.bgColor,
                    isActive && "ring-2 ring-offset-2 ring-offset-background",
                    isActive && config.ringColor
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "text-sm font-medium leading-tight",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {step.title}
                    </p>
                    {step.hasCorrections && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning font-medium">
                        Modified
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                  {step.agentStatus && (
                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0.5 h-4 mt-1", agentStatusConfig[step.agentStatus].className)}>
                      {agentStatusConfig[step.agentStatus].label}
                    </Badge>
                  )}
                </div>
              </button>

              <div className="flex items-center gap-1 pt-1">
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditStep?.(step.id);
                    }}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                )}
                {isActive && (
                  <div className="flex items-center gap-1 text-primary">
                    <Clock className="h-3.5 w-3.5 animate-pulse-soft" />
                  </div>
                )}
                {isClickable && !isActive && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}