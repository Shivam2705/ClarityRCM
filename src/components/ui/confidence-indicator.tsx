import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceIndicator({
  value,
  size = "md",
  showLabel = true,
  className,
}: ConfidenceIndicatorProps) {
  const getColor = () => {
    if (value >= 80) return "text-success";
    if (value >= 60) return "text-warning";
    return "text-destructive";
  };

  const getBgColor = () => {
    if (value >= 80) return "bg-success";
    if (value >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const sizeClasses = {
    sm: "h-1 w-12",
    md: "h-1.5 w-16",
    lg: "h-2 w-24",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("rounded-full bg-muted overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBgColor())}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("font-medium", getColor(), textSizes[size])}>
          {value}%
        </span>
      )}
    </div>
  );
}
