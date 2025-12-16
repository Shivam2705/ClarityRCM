import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { Shield, CreditCard, Calendar, Building2 } from "lucide-react";

export function EligibilityPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Insurance & Eligibility</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Real-time eligibility verification performed via payer API integration.
        </p>
      </div>

      {/* Agent Status */}
      <AgentStatus name="Eligibility Agent" state="completed" />

      {/* Insurance Details */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Insurance Information</h4>
          </div>
          <StatusBadge variant="success">Active</StatusBadge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Payer Name</p>
            <p className="text-sm font-medium text-foreground">Blue Cross Blue Shield</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Plan Type</p>
            <p className="text-sm font-medium text-foreground">PPO - Gold Plan</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Member ID</p>
            <p className="text-sm font-medium text-foreground">XWB987654321</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Group Number</p>
            <p className="text-sm font-medium text-foreground">GRP-12345</p>
          </div>
        </div>
      </div>

      {/* Eligibility Status */}
      <div className="rounded-xl border-2 border-success/30 bg-success-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-success" />
          <h4 className="font-medium text-foreground">Eligibility Status</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Coverage Status</span>
            <StatusBadge variant="success">Active</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Effective Date</span>
            <span className="text-sm font-medium text-foreground">January 1, 2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Term Date</span>
            <span className="text-sm font-medium text-foreground">December 31, 2024</span>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Confidence Score</span>
            </div>
            <ConfidenceIndicator value={98} size="lg" />
          </div>
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-info" />
          <h4 className="font-medium text-foreground">Benefits Summary</h4>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Deductible</span>
            <span className="text-sm text-foreground">$1,500 met / $2,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Out of Pocket Max</span>
            <span className="text-sm text-foreground">$3,200 / $6,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Inpatient Coverage</span>
            <span className="text-sm text-foreground">80% after deductible</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Surgery Coverage</span>
            <span className="text-sm text-foreground">Covered with prior auth</span>
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-sm">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Source:</span>
        <span className="text-foreground font-medium">BCBS Payer API</span>
        <span className="text-muted-foreground">• Verified 2 minutes ago</span>
      </div>
    </div>
  );
}
