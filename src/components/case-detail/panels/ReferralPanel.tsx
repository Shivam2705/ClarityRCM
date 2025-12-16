import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, AlertTriangle, TrendingUp } from "lucide-react";

export function ReferralPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Referral & Prioritization</h3>
        <p className="text-sm text-muted-foreground mb-6">
          AI-generated priority scoring based on clinical urgency and payer SLA requirements.
        </p>
      </div>

      {/* Priority Score Card */}
      <div className="rounded-xl border-2 border-destructive/30 bg-destructive-light p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Priority Assessment</h4>
          <StatusBadge variant="destructive">High Priority</StatusBadge>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Clinical Urgency Score</span>
              <span className="font-medium text-foreground">85/100</span>
            </div>
            <ConfidenceIndicator value={85} size="lg" showLabel={false} />
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Pain Level: Severe</p>
                <p className="text-xs text-muted-foreground">Patient reports 8/10 pain affecting daily activities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Progression Risk</p>
                <p className="text-xs text-muted-foreground">Bone-on-bone contact observed, further delay may cause complications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Timer */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-warning" />
          <h4 className="font-medium text-foreground">SLA Tracking</h4>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Payer SLA</p>
            <p className="text-lg font-semibold text-foreground">48 hours</p>
          </div>
          <div className="p-3 rounded-lg bg-warning-light">
            <p className="text-xs text-warning mb-1">Time Remaining</p>
            <p className="text-lg font-semibold text-warning">32 hours</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
            <p className="text-lg font-semibold text-foreground">Jennifer A.</p>
          </div>
        </div>
      </div>

      {/* Referral Coordinator View */}
      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium text-foreground mb-4">Referral Coordinator Notes</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Referral Source</span>
            <span className="text-foreground">Primary Care – Dr. Smith</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Date Received</span>
            <span className="text-foreground">January 12, 2024</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Authorization Type</span>
            <span className="text-foreground">Urgent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
