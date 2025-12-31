import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Shield, 
  GitBranch, 
  FileSearch, 
  AlertTriangle, 
  Send,
  ArrowRight,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  XCircle,
  Bot,
  Sparkles,
  Mail,
  FileWarning
} from "lucide-react";

// Simplified 6-step provider journey
const initialSteps: WorkflowStep[] = [
  { 
    id: "eligibility", 
    title: "Eligibility & Benefits", 
    description: "Insurance verification", 
    status: "completed",
    agentName: "Eligibility Agent",
    canEdit: true
  },
  { 
    id: "prior-auth-decision", 
    title: "Prior Auth Decision", 
    description: "Policy lookup & decision tree", 
    status: "completed",
    agentName: "Policy Agent",
    canEdit: true
  },
  { 
    id: "document-prep", 
    title: "Document Preparation", 
    description: "Medical record summary", 
    status: "completed",
    agentName: "Document Agent",
    canEdit: true
  },
  { 
    id: "gap-analysis", 
    title: "Gap Analysis & Review", 
    description: "Guidelines comparison & corrections", 
    status: "active",
    agentName: "Clinical Reasoning Agent"
  },
  { 
    id: "submit-to-payer", 
    title: "Submit to Payer", 
    description: "Final submission & notification", 
    status: "pending",
    agentName: "Submission Agent"
  },
];

export function PreAuthProviderWorkflow() {
  const [currentStep, setCurrentStep] = useState("gap-analysis");
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Record<string, boolean>>({});

  const handleEditStep = useCallback((stepId: string) => {
    setEditingStep(stepId);
    setCurrentStep(stepId);
  }, []);

  const handleSaveCorrection = useCallback((stepId: string) => {
    setCorrections(prev => ({ ...prev, [stepId]: true }));
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, hasCorrections: true } : s
    ));
    setEditingStep(null);
    // Return to gap analysis after correction
    setCurrentStep("gap-analysis");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingStep(null);
    setCurrentStep("gap-analysis");
  }, []);

  const handleProceedToSubmit = useCallback(() => {
    setSteps(prev => prev.map(s => 
      s.id === "gap-analysis" ? { ...s, status: "completed" as const } :
      s.id === "submit-to-payer" ? { ...s, status: "active" as const } : s
    ));
    setCurrentStep("submit-to-payer");
  }, []);

  const renderPanel = () => {
    switch (currentStep) {
      case "eligibility":
        return <EligibilitySection isEditing={editingStep === "eligibility"} onSave={() => handleSaveCorrection("eligibility")} onCancel={handleCancelEdit} />;
      case "prior-auth-decision":
        return <PriorAuthDecisionSection isEditing={editingStep === "prior-auth-decision"} onSave={() => handleSaveCorrection("prior-auth-decision")} onCancel={handleCancelEdit} />;
      case "document-prep":
        return <DocumentPrepSection isEditing={editingStep === "document-prep"} onSave={() => handleSaveCorrection("document-prep")} onCancel={handleCancelEdit} />;
      case "gap-analysis":
        return <GapAnalysisSection onProceed={handleProceedToSubmit} onEditStep={handleEditStep} corrections={corrections} />;
      case "submit-to-payer":
        return <SubmitToPayerSection />;
      default:
        return <GapAnalysisSection onProceed={handleProceedToSubmit} onEditStep={handleEditStep} corrections={corrections} />;
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-80 shrink-0">
        <div className="sticky top-24">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Provider Journey</h4>
                <p className="text-xs text-muted-foreground">Pre-Authorization Workflow</p>
              </div>
            </div>
            <WorkflowSteps
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              onEditStep={handleEditStep}
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

// Section Components
interface SectionProps {
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

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

function ClinicalIntakeSection({ isEditing, onSave, onCancel }: SectionProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Clinical Agent" status={isEditing ? "active" : "complete"} />
      <h3 className="text-lg font-semibold text-foreground mb-4">Clinical Intake & EHR Order</h3>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={<FileText className="h-4 w-4" />} label="Order Type" value="Knee Arthroplasty" editable={isEditing} />
          <InfoCard icon={<FileText className="h-4 w-4" />} label="CPT Code" value="27447" editable={isEditing} />
        </div>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-2">Clinical Documentation</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Diagnosis" value="Primary Osteoarthritis, Right Knee (M17.11)" highlight />
            <DataRow label="Duration" value="18+ months conservative treatment" />
            <DataRow label="Conservative Care" value="PT, NSAIDs, Cortisone injections (3x)" />
            <DataRow label="Imaging" value="X-ray shows bone-on-bone, MRI confirms" />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-2">Functional Assessment</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Pain Level" value="8/10 with activity" />
            <DataRow label="Mobility" value="Limited to 100m walking distance" />
            <DataRow label="ADL Impact" value="Cannot climb stairs, difficulty sleeping" />
          </div>
        </Card>
      </div>
      
      {isEditing && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}

function EligibilitySection({ isEditing, onSave, onCancel }: SectionProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Eligibility Agent" status={isEditing ? "active" : "complete"} />
      <h3 className="text-lg font-semibold text-foreground mb-4">Insurance & Eligibility Verification</h3>
      
      <div className="grid gap-4">
        <Card className="p-4 bg-success/10 border-success/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">Eligibility Verified</span>
          </div>
          <p className="text-xs text-muted-foreground">Member is active with valid coverage for requested procedure</p>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={<Shield className="h-4 w-4" />} label="Payer" value="Aetna Commercial" editable={isEditing} />
          <InfoCard icon={<Shield className="h-4 w-4" />} label="Plan Type" value="PPO" editable={isEditing} />
        </div>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-2">Member Benefits</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Member ID" value="AET-789456123" />
            <DataRow label="Group Number" value="GRP-2024-0847" />
            <DataRow label="Effective Date" value="01/01/2024" />
            <DataRow label="In-Network Deductible" value="$500 (Met)" highlight />
            <DataRow label="Out-of-Pocket Max" value="$3,000 / $6,000" />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/30 border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-2">Coverage Details</h4>
          <div className="space-y-2 text-sm">
            <DataRow label="Surgical Coverage" value="80% after deductible" />
            <DataRow label="Prior Auth Required" value="Yes - Orthopedic Surgery" highlight />
            <DataRow label="Network Status" value="In-Network Provider" />
          </div>
        </Card>
      </div>
      
      {isEditing && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}

function PriorAuthDecisionSection({ isEditing, onSave, onCancel }: SectionProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Policy Agent" status={isEditing ? "active" : "complete"} />
      <h3 className="text-lg font-semibold text-foreground mb-4">Prior Authorization Decision Tree</h3>
      
      <Card className="p-4 bg-warning/10 border-warning/30 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium text-warning">Prior Authorization Required</span>
        </div>
        <p className="text-xs text-muted-foreground">Based on payer policy and procedure type</p>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Decision Tree Evaluation</h4>
        <div className="space-y-3">
          <DecisionNode label="Procedure Type: Joint Replacement" result="Requires PA" />
          <DecisionNode label="Gold Card Status" result="Not Eligible" />
          <DecisionNode label="Network Status: In-Network" result="Standard Review" />
          <DecisionNode label="Medical Necessity Documentation" result="Required" />
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-2">Applicable Policies</h4>
        <div className="space-y-2 text-sm">
          <DataRow label="Policy ID" value="AETNA-ORTHO-2024-001" />
          <DataRow label="Effective Date" value="01/01/2024" />
          <DataRow label="Review Timeline" value="5 business days (standard)" />
        </div>
      </Card>
      
      {isEditing && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}

function DocumentPrepSection({ isEditing, onSave, onCancel }: SectionProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Document Agent" status={isEditing ? "active" : "complete"} />
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Preparation & Summary</h3>
      
      <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3">AI-Generated Clinical Summary</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          65-year-old male with 18-month history of progressive right knee osteoarthritis. 
          Failed conservative management including physical therapy (12 weeks), NSAIDs, 
          and three corticosteroid injections. Imaging confirms Kellgren-Lawrence Grade 4 
          changes with complete joint space narrowing. Functional impairment includes 
          inability to ambulate beyond 100 meters and significant ADL limitations.
        </p>
      </Card>
      
      <h4 className="text-sm font-medium text-foreground mb-3">Retrieved Documents</h4>
      <div className="space-y-2">
        <DocumentItem name="Clinical Notes - Dr. Smith" date="2024-11-15" status="extracted" />
        <DocumentItem name="X-Ray Report - Right Knee" date="2024-10-20" status="extracted" />
        <DocumentItem name="MRI Report - Right Knee" date="2024-11-01" status="extracted" />
        <DocumentItem name="Physical Therapy Progress Notes" date="2024-09-30" status="extracted" />
        <DocumentItem name="Injection Records (3x)" date="2024-08-15" status="extracted" />
      </div>
      
      {isEditing && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}

interface GapAnalysisSectionProps {
  onProceed: () => void;
  onEditStep: (stepId: string) => void;
  corrections: Record<string, boolean>;
}

function GapAnalysisSection({ onProceed, onEditStep, corrections }: GapAnalysisSectionProps) {
  const navigate = useNavigate();
  
  const gaps = [
    { 
      id: 1, 
      title: "WOMAC Score Missing", 
      description: "Functional assessment score not documented",
      severity: "high",
      step: "clinical-intake",
      recommendation: "Add WOMAC or KOOS score to clinical documentation"
    },
    { 
      id: 2, 
      title: "BMI Documentation", 
      description: "Current BMI not recorded in clinical notes",
      severity: "medium",
      step: "clinical-intake",
      recommendation: "Document current BMI (recommended < 40 for elective TKA)"
    },
  ];

  const missingDocuments = [
    {
      id: 1,
      title: "Physical Therapy Discharge Summary",
      description: "Final PT evaluation documenting treatment completion and outcomes",
      severity: "high"
    },
    {
      id: 2,
      title: "Recent Lab Results (CBC, BMP)",
      description: "Pre-operative lab work within 30 days required",
      severity: "high"
    },
    {
      id: 3,
      title: "Cardiology Clearance Letter",
      description: "Required for patients over 65 with cardiac history",
      severity: "medium"
    }
  ];

  const completedChecks = [
    "Diagnosis code matches procedure indication",
    "Conservative treatment duration meets requirements (>6 months)",
    "Imaging confirms surgical indication",
    "Provider is in-network with valid credentials",
    "Member eligibility verified and active",
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Clinical Reasoning Agent" status="active" />
      <h3 className="text-lg font-semibold text-foreground mb-4">Gap Analysis & Review</h3>
      
      {/* Identified Gaps */}
      {gaps.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Identified Gaps ({gaps.length})
          </h4>
          <div className="space-y-3">
            {gaps.map((gap) => (
              <Card key={gap.id} className={`p-4 border-warning/30 ${corrections[gap.step] ? 'bg-success/10 border-success/30' : 'bg-warning/10'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{gap.title}</p>
                    <p className="text-xs text-muted-foreground">{gap.description}</p>
                  </div>
                  {corrections[gap.step] ? (
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Corrected
                    </Badge>
                  ) : (
                    <Badge variant={gap.severity === "high" ? "destructive" : "secondary"}>
                      {gap.severity} priority
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-primary mb-3">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  {gap.recommendation}
                </p>
                {!corrections[gap.step] && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditStep(gap.step)}
                    className="text-xs"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit {gap.step === "clinical-intake" ? "Clinical Intake" : gap.step}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Missing Clinical Documents */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <FileWarning className="h-4 w-4 text-destructive" />
          Missing Clinical Documents ({missingDocuments.length})
        </h4>
        <div className="space-y-3">
          {missingDocuments.map((doc) => (
            <Card key={doc.id} className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                </div>
                <Badge variant={doc.severity === "high" ? "destructive" : "secondary"}>
                  {doc.severity} priority
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Checks */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          Completed Checks ({completedChecks.length})
        </h4>
        <Card className="p-4 bg-secondary/30 border-border/50">
          <div className="space-y-2">
            {completedChecks.map((check, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">{check}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Next Best Action */}
      <Card className="p-4 bg-primary/10 border-primary/30 mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Next Best Action
        </h4>
        <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Request for Missing Documents</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send an email to the provider requesting the missing clinical documents to complete the prior authorization submission.
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            const subject = encodeURIComponent("Document Request - Prior Authorization");
            const body = encodeURIComponent(`Dear Provider,\n\nWe are processing a prior authorization request and require the following documents:\n\n${missingDocuments.map((d, i) => `${i + 1}. ${d.title} - ${d.description}`).join('\n')}\n\nPlease provide these documents at your earliest convenience to avoid delays in authorization.\n\nThank you.`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
          }}
        >
          <Mail className="h-4 w-4 mr-2" />
          Request for Documents
        </Button>
      </Card>
      
      {/* Proceed Section */}
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ready for Submission</p>
            <p className="text-xs text-muted-foreground">
              {Object.keys(corrections).length > 0 
                ? `${Object.keys(corrections).length} correction(s) applied` 
                : "Review complete, proceed to submit"
              }
            </p>
          </div>
          <Button onClick={onProceed}>
            Submit to Payer
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </Card>
  );
}

function SubmitToPayerSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Submission Agent" status={submitted ? "complete" : "active"} />
      <h3 className="text-lg font-semibold text-foreground mb-4">Submit to Payer</h3>
      
      {!submitted ? (
        <>
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Summary</h4>
            <div className="space-y-2 text-sm">
              <DataRow label="Payer" value="Aetna Commercial" />
              <DataRow label="Submission Method" value="API - Real-time" />
              <DataRow label="Request Type" value="Prior Authorization - Elective Surgery" />
              <DataRow label="Expected Response" value="5 business days" />
            </div>
          </Card>
          
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Included Documents</h4>
            <div className="space-y-2">
              <DocumentItem name="Clinical Summary (AI-Generated)" date="Today" status="attached" />
              <DocumentItem name="X-Ray & MRI Reports" date="2024-11" status="attached" />
              <DocumentItem name="Conservative Treatment History" date="2024" status="attached" />
              <DocumentItem name="Functional Assessment" date="Today" status="attached" />
            </div>
          </Card>
          
          <div className="flex gap-3">
            <Button onClick={() => setSubmitted(true)} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Submit Prior Authorization Request
            </Button>
          </div>
        </>
      ) : (
        <>
          <Card className="p-4 bg-success/10 border-success/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-base font-medium text-success">Successfully Submitted</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Prior authorization request has been submitted to Aetna via API.
            </p>
          </Card>
          
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Details</h4>
            <div className="space-y-2 text-sm">
              <DataRow label="Reference Number" value="PA-2024-1215-78456" highlight />
              <DataRow label="Submitted At" value={new Date().toLocaleString()} />
              <DataRow label="Status" value="Pending Review" />
              <DataRow label="Expected Decision" value="Dec 22, 2024" />
            </div>
          </Card>
          
          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Notifications Sent</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Provider notified via EHR workflow</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Patient notified via patient portal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Case logged in audit trail</span>
              </div>
            </div>
          </Card>
          
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-sm text-foreground">
              <Sparkles className="h-4 w-4 inline mr-1 text-primary" />
              This case will now move to the <strong>Payer workflow</strong> for medical necessity review.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

// Helper Components
function InfoCard({ icon, label, value, editable }: { icon: React.ReactNode; label: string; value: string; editable?: boolean }) {
  return (
    <Card className={`p-3 bg-secondary/30 border-border/50 ${editable ? 'ring-1 ring-primary/30' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </Card>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-primary font-medium" : "text-foreground"}>{value}</span>
    </div>
  );
}

function DecisionNode({ label, result }: { label: string; result: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
      <GitBranch className="h-4 w-4 text-primary" />
      <span className="text-sm text-foreground flex-1">{label}</span>
      <Badge variant="outline" className="text-xs">{result}</Badge>
    </div>
  );
}

function DocumentItem({ name, date, status }: { name: string; date: string; status: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
      <FileSearch className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <Badge variant="outline" className="text-xs text-success border-success/30">
        {status}
      </Badge>
    </div>
  );
}