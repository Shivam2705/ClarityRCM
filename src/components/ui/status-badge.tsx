import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-success-light text-success",
        warning: "bg-warning-light text-warning",
        destructive: "bg-destructive-light text-destructive",
        info: "bg-info-light text-info",
        primary: "bg-primary-light text-primary",
        new: "bg-muted text-muted-foreground",
        eligible: "bg-success-light text-success",
        "eligible-pa-req": "bg-warning-light text-warning",
        "not-eligible": "bg-destructive-light text-destructive",
        "pa-review": "bg-warning-light text-warning",
        "pa-submitted": "bg-success-light text-success",
        "pa-denied": "bg-destructive-light text-destructive",
      },
      size: {
        default: "px-2.5 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  variant,
  size,
  dot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant, size, className }))}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "destructive" && "bg-destructive",
            variant === "info" && "bg-info",
            variant === "primary" && "bg-primary",
            variant === "new" && "bg-muted-foreground",
            variant === "eligible" && "bg-success",
            variant === "eligible-pa-req" && "bg-warning",
            variant === "not-eligible" && "bg-destructive",
            variant === "pa-review" && "bg-warning",
            variant === "pa-submitted" && "bg-success",
            variant === "pa-denied" && "bg-destructive",
            (!variant || variant === "default") && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}
