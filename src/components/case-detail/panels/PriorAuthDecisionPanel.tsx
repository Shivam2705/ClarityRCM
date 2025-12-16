import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { CheckCircle2, XCircle, FileText, Award, AlertTriangle } from "lucide-react";

export function PriorAuthDecisionPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Prior Auth Required Decision</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Critical determination based on payer policy analysis and gold card status.
        </p>
      </div>

      {/* Agent Status */}
      <AgentStatus name="Policy Agent" state="completed" />

      {/* Decision Result - EMPHASIZED */}
      <div className="rounded-2xl border-2 border-warning/50 bg-warning-light p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground">Prior Authorization Required</h4>
            <p className="text-sm text-muted-foreground">Based on payer policy and procedure type</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Decision Confidence</span>
          </div>
          <ConfidenceIndicator value={95} size="lg" />
        </div>
      </div>

      {/* Decision Tree Details */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Decision Tree Analysis</h4>
        </div>

        <div className="space-y-4">
          {/* Policy Reference */}
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Payer Policy Reference</p>
            <p className="text-sm font-medium text-foreground">BCBS Medical Policy #TKR-2024-001</p>
            <p className="text-xs text-muted-foreground mt-1">Total Knee Arthroplasty – Prior Authorization Required</p>
          </div>

          {/* Policy Match */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Procedure in PA-required list</span>
              </div>
              <StatusBadge variant="success" dot={false}>Match</StatusBadge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Inpatient setting requires authorization</span>
              </div>
              <StatusBadge variant="success" dot={false}>Match</StatusBadge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-foreground">Gold Card exemption</span>
              </div>
              <StatusBadge variant="destructive" dot={false}>Not Eligible</StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Gold Card Status */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-warning" />
          <h4 className="font-medium text-foreground">Gold Card Status</h4>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foreground">Provider Gold Card Status</span>
            <StatusBadge variant="warning">Not Enrolled</StatusBadge>
          </div>
          <p className="text-xs text-muted-foreground">
            Dr. Michael Chen is not currently enrolled in the BCBS Gold Card program. 
            Provider must have 90%+ approval rate for 6 consecutive months to qualify.
          </p>
        </div>
      </div>

      {/* Clear Output */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border-2 border-muted p-5 opacity-60">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Prior Auth NOT Required</span>
          </div>
          <p className="text-xs text-muted-foreground">Would proceed directly to scheduling</p>
        </div>
        
        <div className="rounded-xl border-2 border-warning bg-warning-light p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            <span className="font-medium text-foreground">Prior Auth Required</span>
          </div>
          <p className="text-xs text-muted-foreground">Proceed to document retrieval and submission</p>
        </div>
      </div>
    </div>
  );
}
