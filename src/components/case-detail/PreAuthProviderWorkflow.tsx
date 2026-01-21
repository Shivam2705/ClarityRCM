import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuditLogsDialog } from "@/components/ui/audit-logs-dialog";
import { 
  FileText, 
  Shield, 
  GitBranch, 
  FileSearch, 
  AlertTriangle, 
  Send,
  ArrowRight,
  Edit3,
  CheckCircle2,
  XCircle,
  Bot,
  Sparkles,
  Mail,
  FileWarning,
  Play,
  RefreshCw,
  Eye,
  Loader2,
  FileUp,
  ThumbsUp,
  ThumbsDown,
  ClipboardList
} from "lucide-react";

// Simplified 4-step provider journey with always-enabled eligibility
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
    id: "document-analysis", 
    title: "Document Analysis", 
    description: "Document summary & review", 
    status: "completed",
    agentName: "Document Agent",
    canEdit: true
  },
  { 
    id: "prior-auth-decision", 
    title: "Prior Auth Decision", 
    description: "Pre-certification & policy check", 
    status: "completed",
    agentName: "Policy Agent",
    canEdit: true
  },
  { 
    id: "gap-analysis", 
    title: "Gap Analysis & Review", 
    description: "Clinical audit & gaps", 
    status: "active",
    agentName: "Clinical Audit Agent"
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
  const [currentStep, setCurrentStep] = useState("eligibility");
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
      case "document-analysis":
        return <DocumentAnalysisSection isEditing={editingStep === "document-analysis"} onSave={() => handleSaveCorrection("document-analysis")} onCancel={handleCancelEdit} />;
      case "prior-auth-decision":
        return <PriorAuthDecisionSection isEditing={editingStep === "prior-auth-decision"} onSave={() => handleSaveCorrection("prior-auth-decision")} onCancel={handleCancelEdit} />;
      case "gap-analysis":
        return <GapAnalysisSection onProceed={handleProceedToSubmit} onEditStep={handleEditStep} corrections={corrections} />;
      case "submit-to-payer":
        return <SubmitToPayerSection />;
      default:
        return <EligibilitySection isEditing={false} />;
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

function AgentHeader({ name, status, showRunButton, onRun, isRunning }: { 
  name: string; 
  status: "active" | "complete" | "idle";
  showRunButton?: boolean;
  onRun?: () => void;
  isRunning?: boolean;
}) {
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
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Agent</p>
        <p className="text-sm font-medium text-foreground">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        {showRunButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : status === "complete" ? (
              <RefreshCw className="h-4 w-4 mr-1" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {status === "complete" ? "Run Again" : "Run Check"}
          </Button>
        )}
        <AuditLogsDialog agentName={name} />
        <Badge variant={status === "active" ? "default" : status === "complete" ? "outline" : "secondary"}>
          {status === "active" ? "Processing" : status === "complete" ? "Complete" : "Idle"}
        </Badge>
      </div>
    </div>
  );
}

function EligibilitySection({ isEditing, onSave, onCancel }: SectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const handleRunCheck = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader 
        name="Eligibility Agent" 
        status={hasResults ? "complete" : "idle"}
        showRunButton
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Insurance & Eligibility Verification</h3>
      
      {hasResults ? (
        <div className="grid gap-4">
          <Card className="p-4 bg-success/10 border-success/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Eligibility Verified</span>
            </div>
            <p className="text-xs text-muted-foreground">Member is active with valid coverage for requested procedure</p>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <InfoCard icon={<Shield className="h-4 w-4" />} label="Payer" value="Blue Cross Blue Shield" editable={isEditing} />
            <InfoCard icon={<Shield className="h-4 w-4" />} label="Plan Type" value="PPO" editable={isEditing} />
          </div>
          
          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-2">Member Benefits</h4>
            <div className="space-y-2 text-sm">
              <DataRow label="Member ID" value="BCB-987654321" />
              <DataRow label="Group Number" value="GRP-12345" />
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
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">Click "Run Check" to verify member eligibility and benefits</p>
        </Card>
      )}
      
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

function DocumentAnalysisSection({ isEditing, onSave, onCancel }: SectionProps) {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true);

  const documents = [
    { name: "Clinical Notes - Dr. Chen", date: "2024-01-15", status: "analyzed" },
    { name: "X-Ray Report - Right Knee", date: "2024-01-10", status: "analyzed" },
    { name: "MRI Report - Right Knee", date: "2024-01-08", status: "analyzed" },
    { name: "Physical Therapy Progress Notes", date: "2024-01-05", status: "analyzed" },
    { name: "Injection Records (3x)", date: "2023-12-15", status: "analyzed" },
  ];

  const documentSummary = `Patient documentation includes comprehensive clinical notes from Dr. Chen dated January 15, 2024, documenting progressive knee osteoarthritis with failed conservative management. Imaging studies (X-ray and MRI) confirm Kellgren-Lawrence Grade IV changes with complete joint space narrowing. Physical therapy records show 12 weeks of treatment with limited improvement. Three corticosteroid injections administered over 6 months provided temporary relief only. All documentation supports medical necessity for Total Knee Replacement.`;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
    }, 2000);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader 
        name="Document Agent" 
        status={hasAnalysis ? "complete" : "idle"}
        showRunButton
        onRun={handleAnalyze}
        isRunning={isAnalyzing}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Analysis & Summary</h3>
      
      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/case/${caseId}/documents`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Documents
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/case/${caseId}/documents`)}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Analyze Documents
        </Button>
      </div>

      {hasAnalysis ? (
        <div className="grid gap-4">
          {/* AI Document Summary */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">AI Document Summary</h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{documentSummary}</p>
              </div>
            </div>
          </Card>

          {/* Retrieved Documents */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Retrieved Documents ({documents.length})</h4>
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background cursor-pointer" onClick={() => navigate(`/case/${caseId}/documents`)}>
                  <FileSearch className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-success border-success/30">
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">Upload documents and click "Analyze Documents" to generate summary</p>
        </Card>
      )}
      
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
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const handleRunCheck = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader 
        name="Policy Agent" 
        status={hasResults ? "complete" : "idle"}
        showRunButton
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Prior Authorization Decision</h3>
      
      {hasResults ? (
        <div className="grid gap-4">
          {/* Agent 1: Pre-certification List Analysis */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <ClipboardList className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Agent 1: Pre-certification List Analysis</h4>
              <Badge variant="outline" className="ml-auto text-xs">CPT: 27447</Badge>
            </div>
            <div className="space-y-2 text-sm ml-8">
              <DataRow label="CPT Code Lookup" value="27447 - Total Knee Arthroplasty" />
              <DataRow label="Pre-cert Required" value="Yes - Per BCBS Guidelines" highlight />
              <DataRow label="Service Category" value="Major Orthopedic Surgery" />
              <DataRow label="Payer Specific Rule" value="Requires medical necessity documentation" />
            </div>
          </Card>

          {/* Agent 2: State Policy Analysis */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <GitBranch className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Agent 2: State Policy Analysis</h4>
              <Badge variant="outline" className="ml-auto text-xs">Illinois</Badge>
            </div>
            <div className="space-y-2 text-sm ml-8">
              <DataRow label="State" value="Illinois" />
              <DataRow label="State Mandate" value="No additional state requirements" />
              <DataRow label="Timely Filing" value="Within 14 days of service" />
              <DataRow label="Appeal Rights" value="2 levels internal, external review available" />
            </div>
          </Card>

          {/* Decision Tree Evaluation */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Decision Tree Evaluation</h4>
            <div className="space-y-2">
              <DecisionNode label="a. Identify Member's Health Plan" result="BCBS PPO" status="pass" />
              <DecisionNode label="b. Check CPT Code Against Prior Authorization List" result="27447 - Requires PA" status="warn" />
              <DecisionNode label="c. Verify Place of Service" result="Outpatient Hospital" status="pass" />
              <DecisionNode label="d. Review Diagnosis Codes (ICD-10)" result="M17.11 - Primary OA Right Knee" status="pass" />
              <DecisionNode label="e. Apply Medical Policy Guidelines" result="Meets Criteria" status="pass" />
              <DecisionNode label="f. Check Provider & Facility Network Status" result="In-Network" status="pass" />
              <DecisionNode label="g. Review Authorization History" result="No Prior Auths" status="pass" />
              <DecisionNode label="h. Final Determination" result="PA Required" status="warn" />
            </div>
          </Card>

          {/* Final Decision */}
          <Card className="p-4 bg-warning/10 border-warning/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <span className="text-base font-semibold text-warning">Prior Authorization Required</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on CPT code 27447 (Total Knee Arthroplasty), BCBS pre-certification list, and medical policy guidelines. Procedure requires prior authorization with supporting clinical documentation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">Click "Run Check" to analyze prior authorization requirements</p>
        </Card>
      )}
      
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
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  
  const gaps = [
    { 
      id: 1, 
      title: "WOMAC Score Missing", 
      description: "Functional assessment score not documented",
      severity: "high",
      step: "document-analysis",
      recommendation: "Add WOMAC or KOOS score to clinical documentation"
    },
    { 
      id: 2, 
      title: "BMI Documentation", 
      description: "Current BMI not recorded in clinical notes",
      severity: "medium",
      step: "document-analysis",
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

  // Prediction based on gap analysis
  const approvalPrediction = {
    prediction: "Likely Approved",
    confidence: 85,
    reason: "Clinical documentation strongly supports medical necessity. Minor gaps identified are addressable."
  };

  const handleRunCheck = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader 
        name="Clinical Audit Agent" 
        status={hasResults ? "complete" : "idle"}
        showRunButton
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Gap Analysis & Review</h3>
      
      {hasResults ? (
        <>
          {/* Agent: Clinical Policy Fetch */}
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <ClipboardList className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Clinical Audit Agent - Policy Fetch</h4>
              <Badge variant="outline" className="ml-auto text-xs text-success border-success/30">Complete</Badge>
            </div>
            <div className="space-y-2 text-sm ml-8">
              <DataRow label="Policy ID" value="BCBS-ORTHO-2024-TKA-001" />
              <DataRow label="Policy Name" value="Total Knee Arthroplasty Medical Necessity" />
              <DataRow label="Criteria Checked" value="12 requirements evaluated" />
              <DataRow label="Match Score" value="10/12 (83%)" highlight />
            </div>
          </Card>

          {/* Agent: Gap Analysis */}
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <FileSearch className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Gap Analysis Agent</h4>
              <Badge variant="outline" className="ml-auto text-xs text-warning border-warning/30">{gaps.length} Gaps Found</Badge>
            </div>
          </Card>

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
                        Edit {gap.step === "document-analysis" ? "Document Analysis" : gap.step}
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

          {/* Approval/Deny Prediction */}
          <Card className={`p-4 mb-6 ${approvalPrediction.prediction === "Likely Approved" ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"}`}>
            <div className="flex items-center gap-3 mb-2">
              {approvalPrediction.prediction === "Likely Approved" ? (
                <ThumbsUp className="h-5 w-5 text-success" />
              ) : (
                <ThumbsDown className="h-5 w-5 text-destructive" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-base font-semibold ${approvalPrediction.prediction === "Likely Approved" ? "text-success" : "text-destructive"}`}>
                    {approvalPrediction.prediction}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {approvalPrediction.confidence}% confidence
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-8">{approvalPrediction.reason}</p>
          </Card>

          {/* Draft Email to Physician */}
          <Card className="p-4 bg-primary/10 border-primary/30 mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Draft Email to Physician
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Send an email to the ordering physician requesting the missing clinical documents and gap corrections.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const subject = encodeURIComponent("Prior Authorization - Additional Documentation Required");
                const body = encodeURIComponent(`Dear Dr. Chen,\n\nWe are processing a prior authorization request for patient Sarah Johnson (MRN: PT-78234) for Total Knee Replacement (CPT: 27447).\n\nThe following items are required to complete the authorization:\n\nMISSING DOCUMENTS:\n${missingDocuments.map((d, i) => `${i + 1}. ${d.title} - ${d.description}`).join('\n')}\n\nDOCUMENTATION GAPS:\n${gaps.map((g, i) => `${i + 1}. ${g.title} - ${g.recommendation}`).join('\n')}\n\nPlease provide these items at your earliest convenience to avoid delays in authorization.\n\nThank you for your prompt attention to this matter.`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Draft Email with Missing Details
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
        </>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">Click "Run Check" to perform clinical audit and gap analysis</p>
        </Card>
      )}
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
              <DataRow label="Payer" value="Blue Cross Blue Shield" />
              <DataRow label="Submission Method" value="API - Real-time" />
              <DataRow label="Request Type" value="Prior Authorization - Elective Surgery" />
              <DataRow label="Expected Response" value="5 business days" />
            </div>
          </Card>
          
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Included Documents</h4>
            <div className="space-y-2">
              <DocumentItem name="Clinical Summary (AI-Generated)" date="Today" status="attached" />
              <DocumentItem name="X-Ray & MRI Reports" date="2024-01" status="attached" />
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
              Prior authorization request has been submitted to Blue Cross Blue Shield via API.
            </p>
          </Card>
          
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Details</h4>
            <div className="space-y-2 text-sm">
              <DataRow label="Reference Number" value="PA-2024-0115-78456" highlight />
              <DataRow label="Submitted At" value={new Date().toLocaleString()} />
              <DataRow label="Status" value="Pending Review" />
              <DataRow label="Expected Decision" value="Jan 22, 2024" />
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

function DecisionNode({ label, result, status }: { label: string; result: string; status?: "pass" | "warn" | "fail" }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
      {status === "pass" ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : status === "warn" ? (
        <AlertTriangle className="h-4 w-4 text-warning" />
      ) : status === "fail" ? (
        <XCircle className="h-4 w-4 text-destructive" />
      ) : (
        <GitBranch className="h-4 w-4 text-primary" />
      )}
      <span className="text-sm text-foreground flex-1">{label}</span>
      <Badge variant="outline" className={`text-xs ${
        status === "pass" ? "border-success/30 text-success" :
        status === "warn" ? "border-warning/30 text-warning" :
        status === "fail" ? "border-destructive/30 text-destructive" : ""
      }`}>{result}</Badge>
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
