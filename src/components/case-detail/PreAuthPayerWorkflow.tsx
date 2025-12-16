import { useState } from "react";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { Button } from "@/components/ui/button";
import { 
  FileText, User, Shield, CheckCircle2, AlertCircle, 
  Clock, FileCheck, XCircle, MessageSquare 
} from "lucide-react";

const payerSteps: WorkflowStep[] = [
  { id: "incoming", title: "Incoming Request", description: "Auth request received", status: "completed" },
  { id: "assignment", title: "UM Coordinator Assignment", description: "Case assignment", status: "completed" },
  { id: "eligibility", title: "Member Eligibility", description: "Verification", status: "completed" },
  { id: "document-review", title: "Document Review", description: "Clinical review", status: "completed" },
  { id: "policy-lookup", title: "Policy & Guidelines", description: "LCD/NCD check", status: "active" },
  { id: "medical-necessity", title: "Medical Necessity", description: "Evidence check", status: "pending" },
  { id: "decision", title: "Final Decision", description: "Approve/Deny", status: "pending" },
];

export function PreAuthPayerWorkflow() {
  const [currentStep, setCurrentStep] = useState("policy-lookup");

  const renderIncomingRequest = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Incoming Prior Auth Request</h3>
      <div className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div><p className="text-xs text-muted-foreground">Request ID</p><p className="text-sm font-medium">PA-2024-00847</p></div>
          <div><p className="text-xs text-muted-foreground">Received</p><p className="text-sm font-medium">Jan 15, 2024 10:35 AM</p></div>
          <div><p className="text-xs text-muted-foreground">Provider</p><p className="text-sm font-medium">Metro General Hospital</p></div>
          <div><p className="text-xs text-muted-foreground">Member</p><p className="text-sm font-medium">Sarah Johnson (XWB987654321)</p></div>
          <div><p className="text-xs text-muted-foreground">Procedure</p><p className="text-sm font-medium">Total Knee Replacement (27447)</p></div>
          <div><p className="text-xs text-muted-foreground">Setting</p><p className="text-sm font-medium">Inpatient</p></div>
        </div>
      </div>
    </div>
  );

  const renderAssignment = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">UM Coordinator Assignment</h3>
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Dr. Amanda Richards, RN</p>
            <p className="text-sm text-muted-foreground">Utilization Management Coordinator</p>
          </div>
          <StatusBadge variant="success" className="ml-auto">Assigned</StatusBadge>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted">
          <p className="text-xs text-muted-foreground">Queue Position: 3 of 12 pending reviews</p>
        </div>
      </div>
    </div>
  );

  const renderEligibility = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Member Eligibility Verification</h3>
      <AgentStatus name="Eligibility Agent" state="completed" />
      <div className="rounded-xl border-2 border-success/30 bg-success-light p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-success" />
          <h4 className="font-medium text-foreground">Member Verified</h4>
          <StatusBadge variant="success">Active Coverage</StatusBadge>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>PPO Gold Plan</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Effective</span><span>Jan 1, 2024 - Dec 31, 2024</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Surgery Benefit</span><span>Covered with PA</span></div>
        </div>
      </div>
    </div>
  );

  const renderDocumentReview = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Document Review Panel</h3>
      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium text-foreground mb-4">Submitted Documentation</h4>
        {["Clinical Notes", "MRI Report", "X-Ray Report", "PT Records"].map((doc) => (
          <div key={doc} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm">{doc}</span>
            </div>
            <StatusBadge variant="success" size="sm">Reviewed</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPolicyLookup = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Policy & Clinical Guideline Lookup</h3>
      <AgentStatus name="Policy Agent" state="reasoning" />
      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium text-foreground mb-4">Applicable Policies</h4>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm font-medium">BCBS Medical Policy #TKR-2024-001</p>
            <p className="text-xs text-muted-foreground">Total Knee Arthroplasty Coverage Criteria</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm font-medium">CMS LCD L33967</p>
            <p className="text-xs text-muted-foreground">Total Knee Arthroplasty - Local Coverage</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm font-medium">InterQual 2024 Criteria</p>
            <p className="text-xs text-muted-foreground">Inpatient Admission - Orthopedic Surgery</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalNecessity = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Medical Necessity Evidence Check</h3>
      <div className="rounded-xl border bg-card p-5">
        {[
          { criterion: "Failed conservative treatment", met: true },
          { criterion: "Radiographic evidence Grade III/IV OA", met: true },
          { criterion: "Functional impairment (WOMAC)", met: false },
          { criterion: "BMI < 40", met: true },
        ].map((item) => (
          <div key={item.criterion} className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="flex items-center gap-3">
              {item.met ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertCircle className="h-5 w-5 text-warning" />}
              <span className="text-sm">{item.criterion}</span>
            </div>
            <StatusBadge variant={item.met ? "success" : "warning"}>{item.met ? "Met" : "Gap"}</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDecision = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Final Decision Panel</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="success" size="lg" className="h-auto py-6 flex-col">
          <CheckCircle2 className="h-8 w-8 mb-2" />
          <span>Approve</span>
        </Button>
        <Button variant="warning" size="lg" className="h-auto py-6 flex-col">
          <Clock className="h-8 w-8 mb-2" />
          <span>Pend for Info</span>
        </Button>
        <Button variant="outline" size="lg" className="h-auto py-6 flex-col border-destructive text-destructive hover:bg-destructive-light">
          <XCircle className="h-8 w-8 mb-2" />
          <span>Deny</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium mb-3">Decision Rationale (Required)</h4>
        <textarea className="w-full p-3 rounded-lg border bg-background text-sm min-h-24" placeholder="Enter decision rationale..." />
        <Button className="mt-4">Submit Decision</Button>
      </div>
    </div>
  );

  const renderPanel = () => {
    switch (currentStep) {
      case "incoming": return renderIncomingRequest();
      case "assignment": return renderAssignment();
      case "eligibility": return renderEligibility();
      case "document-review": return renderDocumentReview();
      case "policy-lookup": return renderPolicyLookup();
      case "medical-necessity": return renderMedicalNecessity();
      case "decision": return renderDecision();
      default: return renderIncomingRequest();
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-72 shrink-0">
        <div className="sticky top-24 rounded-xl border bg-card p-4">
          <h4 className="text-sm font-semibold text-foreground mb-4">Payer Workflow</h4>
          <WorkflowSteps steps={payerSteps} currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>
      </div>
      <div className="flex-1 min-w-0">{renderPanel()}</div>
    </div>
  );
}
