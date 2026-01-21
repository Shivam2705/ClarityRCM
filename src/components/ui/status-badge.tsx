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
        new: "bg-muted-foreground text-white",
        eligible: "bg-success text-white",
        "eligible-pa-req": "bg-warning text-white",
        "not-eligible": "bg-destructive text-white",
        "pa-review": "bg-warning text-white",
        "pa-submitted": "bg-success text-white",
        "pa-denied": "bg-destructive text-white",
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
            variant === "new" && "bg-white",
            variant === "eligible" && "bg-white",
            variant === "eligible-pa-req" && "bg-white",
            variant === "not-eligible" && "bg-white",
            variant === "pa-review" && "bg-white",
            variant === "pa-submitted" && "bg-white",
            variant === "pa-denied" && "bg-white",
            (!variant || variant === "default") && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}
