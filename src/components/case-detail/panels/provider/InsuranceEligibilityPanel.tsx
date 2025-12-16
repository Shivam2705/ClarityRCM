import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { 
  Shield, CreditCard, Building2, CheckCircle2, 
  Globe, Database, User, FileText, AlertCircle 
} from "lucide-react";

export function InsuranceEligibilityPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Insurance & Eligibility Lookup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Patient info and insurance details from registration portal, member benefits and eligibility via payer API/portal
        </p>
      </div>

      <AgentStatus name="Eligibility Agent" state="completed" />

      {/* Patient Registration Info */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Patient Registration Portal</h4>
          <StatusBadge variant="success" size="sm">Verified</StatusBadge>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Patient Name</p>
            <p className="text-sm font-medium">Sarah Johnson</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">DOB</p>
            <p className="text-sm font-medium">March 15, 1962</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">MRN</p>
            <p className="text-sm font-medium">MRN-789456123</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">SSN (Last 4)</p>
            <p className="text-sm font-medium">***-**-4521</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm font-medium">1234 Oak Street, Austin, TX</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">(512) 555-0198</p>
          </div>
        </div>
      </div>

      {/* Insurance Card Info */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">Insurance Information</h4>
          </div>
          <StatusBadge variant="success">Active Coverage</StatusBadge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Primary Payer</p>
              <p className="text-sm font-medium">Blue Cross Blue Shield of Texas</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Plan Name</p>
              <p className="text-sm font-medium">PPO Gold Plan - Employer Sponsored</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Member ID</p>
              <p className="text-sm font-medium font-mono">XWB987654321</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Group Number</p>
              <p className="text-sm font-medium font-mono">GRP-TXE-12345</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Policy Holder</p>
              <p className="text-sm font-medium">Self (Primary)</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Payer Phone</p>
              <p className="text-sm font-medium">(800) 555-BCBS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Verification Result */}
      <div className="rounded-xl border-2 border-success/30 bg-success-light p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Eligibility Verified</h4>
            <p className="text-sm text-muted-foreground">Real-time verification via Payer API</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <span className="text-sm text-muted-foreground">Coverage Status</span>
            <StatusBadge variant="success">Active</StatusBadge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <span className="text-sm text-muted-foreground">Effective Date</span>
            <span className="text-sm font-medium">Jan 1, 2024</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <span className="text-sm text-muted-foreground">Term Date</span>
            <span className="text-sm font-medium">Dec 31, 2024</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <span className="text-sm text-muted-foreground">Network Status</span>
            <StatusBadge variant="success">In-Network</StatusBadge>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Verification Confidence</span>
          </div>
          <ConfidenceIndicator value={98} size="lg" />
        </div>
      </div>

      {/* Member Benefits */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-warning" />
          <h4 className="font-medium text-foreground">Member Benefits Summary</h4>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Annual Deductible</p>
              <p className="text-xs text-muted-foreground">Individual In-Network</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">$1,500 / $2,000</p>
              <p className="text-xs text-success">75% Met</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Out-of-Pocket Maximum</p>
              <p className="text-xs text-muted-foreground">Individual In-Network</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">$3,200 / $6,000</p>
              <p className="text-xs text-info">53% Met</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Inpatient Surgery</p>
              <p className="text-xs text-muted-foreground">After Deductible</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">80% Covered</p>
              <StatusBadge variant="warning" size="sm">PA Required</StatusBadge>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Skilled Nursing / Rehab</p>
              <p className="text-xs text-muted-foreground">Post-surgical</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">60 days covered</p>
              <StatusBadge variant="success" size="sm">Included</StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Verification */}
      <div className="rounded-xl border bg-muted p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Data Sources</h4>
        <div className="grid gap-2 md:grid-cols-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
            <Database className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs font-medium">Patient Portal</p>
              <p className="text-xs text-muted-foreground">Epic MyChart</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
            <Globe className="h-4 w-4 text-info" />
            <div>
              <p className="text-xs font-medium">Payer API</p>
              <p className="text-xs text-muted-foreground">BCBS 270/271</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
            <Building2 className="h-4 w-4 text-warning" />
            <div>
              <p className="text-xs font-medium">Payer Portal</p>
              <p className="text-xs text-muted-foreground">Availity</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Last verified: Jan 15, 2024 at 10:42 AM</p>
      </div>
    </div>
  );
}
