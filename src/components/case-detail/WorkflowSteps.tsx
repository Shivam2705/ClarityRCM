import { CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "completed" | "active" | "pending" | "warning";

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  status: StepStatus;
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
}

const statusConfig: Record<StepStatus, { icon: typeof Circle; color: string; bgColor: string }> = {
  completed: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success" },
  active: { icon: Circle, color: "text-primary", bgColor: "bg-primary" },
  pending: { icon: Circle, color: "text-muted-foreground", bgColor: "bg-muted" },
  warning: { icon: AlertCircle, color: "text-warning", bgColor: "bg-warning" },
};

export function WorkflowSteps({ steps, currentStep, onStepClick, className }: WorkflowStepsProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {steps.map((step, index) => {
        const config = statusConfig[step.status];
        const Icon = config.icon;
        const isActive = step.id === currentStep;
        const isClickable = !!onStepClick;

        return (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-4 top-10 h-full w-0.5 -translate-x-1/2",
                  step.status === "completed" ? "bg-success/30" : "bg-border"
                )}
              />
            )}

            <button
              onClick={() => onStepClick?.(step.id)}
              disabled={!isClickable}
              className={cn(
                "relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                isActive && "bg-primary-light",
                isClickable && "hover:bg-muted cursor-pointer",
                !isClickable && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  step.status === "completed" && "bg-success-light",
                  step.status === "active" && "bg-primary-light ring-2 ring-primary",
                  step.status === "pending" && "bg-muted",
                  step.status === "warning" && "bg-warning-light"
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {step.description}
                  </p>
                )}
              </div>

              {step.status === "active" && (
                <Clock className="h-4 w-4 text-primary animate-pulse-soft" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
