import { cn } from "@/lib/utils";
import { Stethoscope, Building2 } from "lucide-react";

export type Persona = "provider" | "payer";

interface PersonaToggleProps {
  value: Persona;
  onChange: (value: Persona) => void;
  className?: string;
}

export function PersonaToggle({ value, onChange, className }: PersonaToggleProps) {
  return (
    <div className={cn("inline-flex items-center rounded-xl bg-muted p-1", className)}>
      <button
        onClick={() => onChange("provider")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
          value === "provider"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Stethoscope className="h-4 w-4" />
        Provider
      </button>
      <button
        onClick={() => onChange("payer")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
          value === "payer"
            ? "bg-card text-info shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Building2 className="h-4 w-4" />
        Payer
      </button>
    </div>
  );
}
