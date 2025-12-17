import { useState, useCallback } from "react";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, User, Shield, CheckCircle2, AlertCircle, 
  Clock, XCircle, Send, Bot, Sparkles, FileSearch,
  GitBranch, ArrowRight, Scale
} from "lucide-react";

const initialPayerSteps: WorkflowStep[] = [
  { 
    id: "incoming", 
    title: "Incoming Request", 
    description: "PA request received via API", 
    status: "completed",
    agentName: "Intake Agent"
  },
  { 
    id: "assignment", 
    title: "UM Coordinator", 
    description: "Case assignment & triage", 
    status: "completed",
    agentName: "Routing Agent"
  },
  { 
    id: "eligibility", 
    title: "Member Eligibility", 
    description: "Verification & benefits check", 
    status: "completed",
    agentName: "Eligibility Agent"
  },
  { 
    id: "document-review", 
    title: "Document Review", 
    description: "Clinical documentation review", 
    status: "completed",
    agentName: "Document Agent"
  },
  { 
    id: "policy-lookup", 
    title: "Policy & Guidelines", 
    description: "LCD/NCD & criteria lookup", 
    status: "active",
    agentName: "Policy Agent"
  },
  { 
    id: "medical-necessity", 
    title: "Medical Necessity", 
    description: "Evidence-based assessment", 
    status: "pending",
    agentName: "Clinical Reasoning Agent"
  },
  { 
    id: "decision", 
    title: "Final Decision", 
    description: "Approve / Pend / Deny", 
    status: "pending",
    agentName: "Decision Agent"
  },
];

export function PreAuthPayerWorkflow() {
  const [currentStep, setCurrentStep] = useState("policy-lookup");
  const [steps, setSteps] = useState<WorkflowStep[]>(initialPayerSteps);

  const advanceStep = useCallback((nextStep: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === currentStep) return { ...s, status: "completed" as const };
      if (s.id === nextStep) return { ...s, status: "active" as const };
      return s;
    }));
    setCurrentStep(nextStep);
  }, [currentStep]);

  const renderPanel = () => {
    switch (currentStep) {
      case "incoming":
        return <IncomingRequestSection />;
      case "assignment":
        return <AssignmentSection />;
      case "eligibility":
        return <EligibilitySection />;
      case "document-review":
        return <DocumentReviewSection />;
      case "policy-lookup":
        return <PolicyLookupSection onProceed={() => advanceStep("medical-necessity")} />;
      case "medical-necessity":
        return <MedicalNecessitySection onProceed={() => advanceStep("decision")} />;
      case "decision":
        return <DecisionSection />;
      default:
        return <IncomingRequestSection />;
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-80 shrink-0">
        <div className="sticky top-24">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Scale className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Payer Journey</h4>
                <p className="text-xs text-muted-foreground">Medical Necessity Review</p>
              </div>
            </div>
            <WorkflowSteps
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </Card>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        {renderPanel()}
      </div>
    </div>
  );
}

// Agent Header Component
function AgentHeader({ name, status }: { name: string; status: "active" | "complete" | "idle" }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
        status === "active" ? "bg-primary/20 ring-2 ring-primary/30" :
        status === "complete" ? "bg-success/20" : "bg-muted"
      }`}>
        <Sparkles className={`h-5 w-5 ${
          status === "active" ? "text-primary animate-pulse-soft" :
          status === "complete" ? "text-success" : "text-muted-foreground"
        }`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Agent</p>
        <p className="text-sm font-medium text-foreground">{name}</p>
      </div>
      <Badge variant={status === "active" ? "default" : status === "complete" ? "outline" : "secondary"} className="ml-auto">
        {status === "active" ? "Processing" : status === "complete" ? "Complete" : "Idle"}
      </Badge>
    </div>
  );
}

// Section Components
function IncomingRequestSection() {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Intake Agent" status="complete" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Incoming Prior Authorization Request</h3>
      
      <Card className="p-4 bg-primary/10 border-primary/30 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Request Received via API</span>
        </div>
        <p className="text-xs text-muted-foreground">Automated intake from Metro General Hospital EHR system</p>
      </Card>
      
      <div className="grid gap-4">
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Request Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DataRow label="Request ID" value="PA-2024-1215-78456" />
            <DataRow label="Received" value="Dec 15, 2024 10:35 AM" />
            <DataRow label="Source" value="API - Real-time" />
            <DataRow label="Priority" value="Standard" />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Provider Information</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Provider" value="Metro General Hospital" />
            <DataRow label="Ordering Physician" value="Dr. Michael Chen, MD" />
            <DataRow label="NPI" value="1234567890" />
            <DataRow label="Network Status" value="In-Network" highlight />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Service Requested</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Procedure" value="Total Knee Arthroplasty" />
            <DataRow label="CPT Code" value="27447" />
            <DataRow label="Setting" value="Inpatient" />
            <DataRow label="Estimated LOS" value="2 days" />
          </div>
        </Card>
      </div>
    </Card>
  );
}

function AssignmentSection() {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Routing Agent" status="complete" />
      <h3 className="text-lg font-semibold text-foreground mb-4">UM Coordinator Assignment</h3>
      
      <Card className="p-4 bg-success/10 border-success/30 mb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
            <User className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Dr. Amanda Richards, RN</p>
            <p className="text-sm text-muted-foreground">Utilization Management Coordinator</p>
          </div>
          <Badge className="bg-success/20 text-success border-success/30">Assigned</Badge>
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Assignment Logic</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">Specialty match: Orthopedic Surgery</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">Workload balanced: 3 active cases</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">SLA within target: 5 business days</span>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-2">Queue Status</h4>
        <div className="space-y-2 text-sm">
          <DataRow label="Position" value="3 of 12 pending reviews" />
          <DataRow label="Estimated Review" value="Dec 17, 2024" />
          <DataRow label="SLA Deadline" value="Dec 22, 2024" />
        </div>
      </Card>
    </Card>
  );
}

function EligibilitySection() {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Eligibility Agent" status="complete" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Member Eligibility Verification</h3>
      
      <Card className="p-4 bg-success/10 border-success/30 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-success" />
          <span className="text-base font-medium text-success">Member Verified - Active Coverage</span>
        </div>
        <p className="text-sm text-muted-foreground">All eligibility checks passed</p>
      </Card>
      
      <div className="grid gap-4">
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Member Information</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Member" value="Robert Anderson" />
            <DataRow label="Member ID" value="AET-789456123" />
            <DataRow label="DOB" value="03/15/1959" />
            <DataRow label="Group" value="GRP-2024-0847" />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Coverage Details</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Plan" value="PPO Gold Plan" />
            <DataRow label="Effective" value="01/01/2024 - 12/31/2024" />
            <DataRow label="Surgical Benefit" value="Covered with PA" highlight />
            <DataRow label="Inpatient Benefit" value="80% after deductible" />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Cost Share</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Deductible" value="$500 (Met)" highlight />
            <DataRow label="Out-of-Pocket" value="$1,200 / $3,000" />
            <DataRow label="Copay" value="$250 per admission" />
          </div>
        </Card>
      </div>
    </Card>
  );
}

function DocumentReviewSection() {
  const documents = [
    { name: "Clinical Summary (AI-Generated)", status: "extracted", pages: 3 },
    { name: "X-Ray Report - Right Knee", status: "extracted", pages: 2 },
    { name: "MRI Report - Right Knee", status: "extracted", pages: 4 },
    { name: "Physical Therapy Progress Notes", status: "extracted", pages: 8 },
    { name: "Injection Records (3x)", status: "extracted", pages: 3 },
    { name: "Physician Orders", status: "extracted", pages: 1 },
  ];
  
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Document Agent" status="complete" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Review Panel</h3>
      
      <Card className="p-4 bg-primary/10 border-primary/30 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <FileSearch className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">21 pages extracted & indexed</span>
        </div>
        <p className="text-xs text-muted-foreground">All submitted documentation processed via OCR</p>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Submitted Documentation</h4>
        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.pages} pages</p>
              </div>
              <Badge variant="outline" className="text-xs text-success border-success/30">
                {doc.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3">Key Clinical Findings (Extracted)</h4>
        <div className="space-y-2 text-sm">
          <DataRow label="Diagnosis" value="Primary OA, Right Knee (M17.11)" />
          <DataRow label="Kellgren-Lawrence" value="Grade 4 - Severe" highlight />
          <DataRow label="Conservative Tx Duration" value="18 months" />
          <DataRow label="Failed Treatments" value="PT, NSAIDs, 3x Injections" />
        </div>
      </Card>
    </Card>
  );
}

interface PolicyLookupSectionProps {
  onProceed: () => void;
}

function PolicyLookupSection({ onProceed }: PolicyLookupSectionProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Policy Agent" status="active" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Policy & Clinical Guideline Lookup</h3>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Applicable Policies</h4>
        <div className="space-y-3">
          <PolicyCard 
            id="AETNA-ORTHO-2024-001"
            name="Total Knee Arthroplasty Coverage Criteria"
            type="Medical Policy"
          />
          <PolicyCard 
            id="CMS LCD L33967"
            name="Total Knee Arthroplasty - Local Coverage"
            type="LCD/NCD"
          />
          <PolicyCard 
            id="InterQual 2024"
            name="Inpatient Admission - Orthopedic Surgery"
            type="Clinical Criteria"
          />
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Decision Tree Evaluation</h4>
        <div className="space-y-3">
          <DecisionNode label="Procedure requires PA" result="Yes" variant="info" />
          <DecisionNode label="Documentation complete" result="Yes" variant="success" />
          <DecisionNode label="Network provider" result="Yes" variant="success" />
          <DecisionNode label="Meets basic criteria" result="Pending Review" variant="warning" />
        </div>
      </Card>
      
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Policy Lookup Complete</p>
            <p className="text-xs text-muted-foreground">Proceed to medical necessity assessment</p>
          </div>
          <Button onClick={onProceed}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </Card>
  );
}

interface MedicalNecessitySectionProps {
  onProceed: () => void;
}

function MedicalNecessitySection({ onProceed }: MedicalNecessitySectionProps) {
  const criteria = [
    { name: "Failed conservative treatment (≥6 months)", met: true, evidence: "18 months documented" },
    { name: "Radiographic evidence Grade III/IV OA", met: true, evidence: "KL Grade 4 confirmed" },
    { name: "Functional impairment documented", met: false, evidence: "WOMAC score missing" },
    { name: "BMI documented and within limits", met: true, evidence: "BMI 28.5" },
    { name: "No contraindications present", met: true, evidence: "Cleared by cardiology" },
  ];
  
  const metCount = criteria.filter(c => c.met).length;
  
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Clinical Reasoning Agent" status="active" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Medical Necessity Evidence Check</h3>
      
      <Card className={`p-4 mb-4 ${metCount === criteria.length ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
        <div className="flex items-center gap-2 mb-1">
          {metCount === criteria.length ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <AlertCircle className="h-4 w-4 text-warning" />
          )}
          <span className={`text-sm font-medium ${metCount === criteria.length ? 'text-success' : 'text-warning'}`}>
            {metCount} of {criteria.length} criteria met
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {metCount === criteria.length 
            ? "All medical necessity criteria satisfied"
            : "Additional information may be required"
          }
        </p>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Criteria Assessment</h4>
        <div className="space-y-3">
          {criteria.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              {item.met ? (
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.evidence}</p>
              </div>
              <Badge variant={item.met ? "outline" : "secondary"} className={item.met ? "text-success border-success/30" : "text-warning"}>
                {item.met ? "Met" : "Gap"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Assessment Complete</p>
            <p className="text-xs text-muted-foreground">Proceed to final decision</p>
          </div>
          <Button onClick={onProceed}>
            Make Decision
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </Card>
  );
}

function DecisionSection() {
  const [decision, setDecision] = useState<"approve" | "pend" | "deny" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [rationale, setRationale] = useState("");
  
  if (submitted) {
    return (
      <Card className="p-6 bg-card border-border">
        <AgentHeader name="Decision Agent" status="complete" />
        <h3 className="text-lg font-semibold text-foreground mb-4">Decision Submitted</h3>
        
        <Card className={`p-4 mb-4 ${
          decision === "approve" ? "bg-success/10 border-success/30" :
          decision === "pend" ? "bg-warning/10 border-warning/30" :
          "bg-destructive/10 border-destructive/30"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {decision === "approve" && <CheckCircle2 className="h-5 w-5 text-success" />}
            {decision === "pend" && <Clock className="h-5 w-5 text-warning" />}
            {decision === "deny" && <XCircle className="h-5 w-5 text-destructive" />}
            <span className={`text-base font-medium ${
              decision === "approve" ? "text-success" :
              decision === "pend" ? "text-warning" : "text-destructive"
            }`}>
              {decision === "approve" ? "Approved" :
               decision === "pend" ? "Pended for Additional Information" : "Denied"
              }
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{rationale}</p>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Decision Details</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Decision Date" value={new Date().toLocaleDateString()} />
            <DataRow label="Effective Date" value={decision === "approve" ? "Immediate" : "N/A"} />
            <DataRow label="Authorization #" value={decision === "approve" ? "AUTH-2024-78456" : "N/A"} />
            <DataRow label="Valid Through" value={decision === "approve" ? "Mar 15, 2025" : "N/A"} />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">Notifications Sent</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span className="text-muted-foreground">Provider notified via API</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span className="text-muted-foreground">Member notified via portal & mail</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span className="text-muted-foreground">Decision logged in audit trail</span>
            </div>
          </div>
        </Card>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Decision Agent" status="active" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Final Decision Panel</h3>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <button
          onClick={() => setDecision("approve")}
          className={`p-6 rounded-xl border-2 transition-all ${
            decision === "approve" 
              ? "border-success bg-success/20 ring-2 ring-success/30" 
              : "border-border hover:border-success/50 hover:bg-success/10"
          }`}
        >
          <CheckCircle2 className={`h-8 w-8 mx-auto mb-2 ${decision === "approve" ? "text-success" : "text-muted-foreground"}`} />
          <span className={`block text-sm font-medium ${decision === "approve" ? "text-success" : "text-foreground"}`}>Approve</span>
        </button>
        
        <button
          onClick={() => setDecision("pend")}
          className={`p-6 rounded-xl border-2 transition-all ${
            decision === "pend" 
              ? "border-warning bg-warning/20 ring-2 ring-warning/30" 
              : "border-border hover:border-warning/50 hover:bg-warning/10"
          }`}
        >
          <Clock className={`h-8 w-8 mx-auto mb-2 ${decision === "pend" ? "text-warning" : "text-muted-foreground"}`} />
          <span className={`block text-sm font-medium ${decision === "pend" ? "text-warning" : "text-foreground"}`}>Pend for Info</span>
        </button>
        
        <button
          onClick={() => setDecision("deny")}
          className={`p-6 rounded-xl border-2 transition-all ${
            decision === "deny" 
              ? "border-destructive bg-destructive/20 ring-2 ring-destructive/30" 
              : "border-border hover:border-destructive/50 hover:bg-destructive/10"
          }`}
        >
          <XCircle className={`h-8 w-8 mx-auto mb-2 ${decision === "deny" ? "text-destructive" : "text-muted-foreground"}`} />
          <span className={`block text-sm font-medium ${decision === "deny" ? "text-destructive" : "text-foreground"}`}>Deny</span>
        </button>
      </div>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Decision Rationale (Required)</h4>
        <Textarea 
          placeholder="Enter decision rationale based on clinical evidence and policy criteria..."
          className="min-h-24 bg-background border-border"
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
        />
      </Card>
      
      <Button 
        onClick={() => setSubmitted(true)} 
        disabled={!decision || !rationale.trim()}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        Submit Decision & Notify Parties
      </Button>
    </Card>
  );
}

// Helper Components
function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-primary font-medium" : "text-foreground"}>{value}</span>
    </div>
  );
}

function PolicyCard({ id, name, type }: { id: string; name: string; type: string }) {
  return (
    <div className="p-3 rounded-lg bg-background/50">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-primary font-medium">{id}</span>
        <Badge variant="outline" className="text-xs">{type}</Badge>
      </div>
      <p className="text-sm text-foreground">{name}</p>
    </div>
  );
}

function DecisionNode({ label, result, variant }: { label: string; result: string; variant: "success" | "warning" | "info" }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
      <GitBranch className="h-4 w-4 text-primary" />
      <span className="text-sm text-foreground flex-1">{label}</span>
      <Badge variant="outline" className={`text-xs ${
        variant === "success" ? "text-success border-success/30" :
        variant === "warning" ? "text-warning border-warning/30" :
        "text-info border-info/30"
      }`}>{result}</Badge>
    </div>
  );
}