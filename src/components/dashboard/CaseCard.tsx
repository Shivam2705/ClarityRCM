import { Case } from "@/data/mockCases";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, User, Building2, Stethoscope } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CaseCardProps {
  caseData: Case;
  onClick: () => void;
}

const statusVariant: Record<Case["status"], "new" | "eligible" | "eligible-pa-req" | "not-eligible" | "pa-review" | "pa-submitted" | "pa-denied"> = {
  "New": "new",
  "Eligible": "eligible",
  "Eligible PA Req": "eligible-pa-req",
  "Not Eligible": "not-eligible",
  "PA Review": "pa-review",
  "PA Submitted": "pa-submitted",
  "PA Denied": "pa-denied",
};

const priorityColors: Record<Case["priority"], string> = {
  "High": "text-destructive",
  "Medium": "text-warning",
  "Low": "text-muted-foreground",
};

export function CaseCard({ caseData, onClick }: CaseCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-elevated hover:border-primary/30"
    >
      {/* Priority indicator */}
      <div className={`absolute top-0 left-0 h-full w-1 rounded-l-xl ${
        caseData.priority === "High" ? "bg-destructive" :
        caseData.priority === "Medium" ? "bg-warning" : "bg-muted"
      }`} />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {caseData.patientName}
            </h3>
            <p className="text-sm text-muted-foreground">{caseData.patientId}</p>
          </div>
          <StatusBadge variant={statusVariant[caseData.status]}>
            {caseData.status}
          </StatusBadge>
        </div>

        {/* Procedure info */}
        {caseData.procedureName && (
          <div className="mb-4 p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-foreground">{caseData.procedureName}</p>
            <p className="text-xs text-muted-foreground">{caseData.procedureCode}</p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            <span>{caseData.orderingProvider}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{caseData.payerName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{caseData.encounterType}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(caseData.lastUpdated), { addSuffix: true })}</span>
          </div>
          <span className={`text-xs font-medium ${priorityColors[caseData.priority]}`}>
            {caseData.priority} Priority
          </span>
        </div>
      </div>
    </div>
  );
}
