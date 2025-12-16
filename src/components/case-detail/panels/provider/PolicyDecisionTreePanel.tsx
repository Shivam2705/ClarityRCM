import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, FileText, Award, CheckCircle2, XCircle, 
  AlertTriangle, ArrowRight, Shield, Zap, Info 
} from "lucide-react";

export function PolicyDecisionTreePanel() {
  const [decisionResult] = useState<"required" | "not-required">("required");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Prior Auth Decision Tree</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Critical determination: Payer policy lookup, Gold Card status, and decision validation
        </p>
      </div>

      <AgentStatus name="Policy Decision Agent" state="completed" />

      {/* CRITICAL DECISION BANNER */}
      <div className={`rounded-2xl border-2 p-6 ${
        decisionResult === "required" 
          ? "border-warning/50 bg-warning-light" 
          : "border-success/50 bg-success-light"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
            decisionResult === "required" ? "bg-warning/20" : "bg-success/20"
          }`}>
            {decisionResult === "required" ? (
              <AlertTriangle className="h-8 w-8 text-warning" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-success" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-foreground">
              {decisionResult === "required" 
                ? "Prior Authorization REQUIRED" 
                : "Prior Authorization NOT REQUIRED"}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {decisionResult === "required"
                ? "Proceed to document retrieval and gap analysis"
                : "Direct path to scheduling - no PA submission needed"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Decision Confidence</p>
            <p className="text-3xl font-bold text-foreground">95%</p>
          </div>
        </div>
      </div>

      {/* Decision Tree Visualization */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Decision Tree Evaluation</h4>
        </div>

        <div className="space-y-4">
          {/* Step 1: Procedure Check */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Procedure in PA-Required List?</p>
                <StatusBadge variant="destructive">Yes - Required</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                CPT 27447 (Total Knee Arthroplasty) is on BCBS prior authorization required list
              </p>
              <div className="mt-2 p-2 rounded bg-card text-xs">
                <span className="text-muted-foreground">Policy Reference:</span> BCBS Medical Policy TKR-2024-001
              </div>
            </div>
          </div>

          {/* Step 2: Gold Card Check */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Provider Gold Card Exemption?</p>
                <StatusBadge variant="warning">Not Eligible</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Dr. Michael Chen is not enrolled in Gold Card program
              </p>
              <div className="mt-2 p-2 rounded bg-card text-xs">
                <span className="text-muted-foreground">Requirement:</span> 90%+ approval rate for 6 consecutive months
              </div>
            </div>
          </div>

          {/* Step 3: Service Setting */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Service Setting Requires PA?</p>
                <StatusBadge variant="destructive">Yes - Inpatient</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Inpatient surgical procedures require prior authorization
              </p>
            </div>
          </div>

          {/* Step 4: Emergency Override */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Emergency/Urgent Override?</p>
                <StatusBadge variant="success">No - Elective</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Elective procedure - no emergency override applicable
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payer Policy Details */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-info" />
          <h4 className="font-medium text-foreground">Applicable Payer Policies</h4>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-info/30 bg-info-light">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">BCBS Medical Policy #TKR-2024-001</p>
              <StatusBadge variant="info" size="sm">Primary</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              Total Knee Arthroplasty - Prior Authorization Required for all inpatient procedures
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Effective: Jan 1, 2024</span>
              <span>•</span>
              <span>Last Updated: Dec 15, 2023</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">CMS LCD L33967</p>
              <StatusBadge variant="default" size="sm">Reference</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              Local Coverage Determination - Total Knee Arthroplasty criteria
            </p>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">InterQual 2024 Inpatient Criteria</p>
              <StatusBadge variant="default" size="sm">Clinical</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              Evidence-based clinical criteria for admission necessity
            </p>
          </div>
        </div>
      </div>

      {/* Gold Card Status Detail */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-warning" />
          <h4 className="font-medium text-foreground">Gold Card Program Status</h4>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Dr. Michael Chen, MD</p>
              <p className="text-sm text-muted-foreground">Orthopedic Surgery</p>
            </div>
            <StatusBadge variant="warning">Not Enrolled</StatusBadge>
          </div>
          
          <div className="grid gap-3 md:grid-cols-3 mt-4">
            <div className="p-3 rounded-lg bg-card text-center">
              <p className="text-2xl font-bold text-foreground">82%</p>
              <p className="text-xs text-muted-foreground">Current Approval Rate</p>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <p className="text-2xl font-bold text-foreground">90%</p>
              <p className="text-xs text-muted-foreground">Required for Gold Card</p>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <p className="text-2xl font-bold text-warning">4</p>
              <p className="text-xs text-muted-foreground">Months at Current Rate</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            <Info className="h-3 w-3 inline mr-1" />
            Provider needs 8% improvement and 2 more consecutive months to qualify for Gold Card exemption
          </p>
        </div>
      </div>

      {/* Final Decision Output */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={`rounded-xl border-2 p-5 ${
          decisionResult === "not-required" 
            ? "border-success bg-success-light" 
            : "border-muted opacity-50"
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className={`h-6 w-6 ${
              decisionResult === "not-required" ? "text-success" : "text-muted-foreground"
            }`} />
            <span className={`font-medium ${
              decisionResult === "not-required" ? "text-foreground" : "text-muted-foreground"
            }`}>Prior Auth NOT Required</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Proceed directly to scheduling without PA submission
          </p>
        </div>

        <div className={`rounded-xl border-2 p-5 ${
          decisionResult === "required" 
            ? "border-warning bg-warning-light" 
            : "border-muted opacity-50"
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className={`h-6 w-6 ${
              decisionResult === "required" ? "text-warning" : "text-muted-foreground"
            }`} />
            <span className={`font-medium ${
              decisionResult === "required" ? "text-foreground" : "text-muted-foreground"
            }`}>Prior Auth Required</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Proceed to document retrieval and gap analysis
          </p>
        </div>
      </div>

      {/* Next Action */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary-light border border-primary/20">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Next Step: Document Retrieval</p>
            <p className="text-sm text-muted-foreground">Gather and summarize medical records for PA submission</p>
          </div>
        </div>
        <Button className="gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
