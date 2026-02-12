import { useState, useCallback, useEffect } from "react";
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
  ClipboardList,
  HelpCircle,
  Scale,
  Gavel,
  Target,
  CircleDot,
} from "lucide-react";

// Mock agent response data
const priorAuthAgentResponse = {
  summary: {
    cpt_code: "29881",
    procedure_description: "Arthroscopy, knee, surgical; with meniscectomy (medial OR lateral, including any meniscal shaving)",
    payer: "UnitedHealthcare",
    overall_recommendation: "SUBMIT",
  },
  pre_certification_analysis: {
    pa_required: true,
    authorization_type: "Standard Prior Authorization",
    estimated_tat_days: "7-15",
  },
  state_policy_analysis: {
    state: "Florida",
    applicable_laws: [
      {
        law_name: "FL Electronic Prior Authorization Mandate",
        description: "As of Jan 1, 2017, Florida requires health insurers without an electronic PA process to use a specific 2-page form approved by the Financial Services Commission.",
        impact: "Mandates use of an electronic portal or a standardized paper form, streamlining the submission process.",
      },
      {
        law_name: "FL Prior Authorization Timeframes (ACA/Medicaid)",
        description: "For ACA plans, Florida adheres to federal rules requiring a response to standard PA requests within 15 days. For Medicaid, the standard is 14 days.",
        impact: "Provides a predictable timeframe for receiving a decision on the authorization request.",
      },
    ],
    reviewer_requirement: "Not specified in provided documentation.",
  },
  decision_tree_validation: {
    policy_id: "UHC Surgery of the Knee / InterQual CP: Procedures",
    policy_wording: "UnitedHealthcare's commercial policy refers to InterQual criteria for medical necessity. A proxy policy requires imaging confirmation of a meniscal tear, presence of mechanical symptoms, and a trial of conservative therapy.",
    logic_path: [
      {
        step: 1,
        criteria: "Is there imaging confirmation of a meniscal tear extending to the articular surface?",
        patient_data_meets: true,
        evidence: "MRI dated Jan 2026 shows medial meniscus tear.",
      },
      {
        step: 2,
        criteria: "Does the patient report significant knee pain and at least one mechanical symptom (locking, catching, giving-way)?",
        patient_data_meets: true,
        evidence: "Pain rated 7/10 with reported locking and catching sensation.",
      },
      {
        step: 3,
        criteria: "Has a trial of conservative therapy failed?",
        patient_data_meets: true,
        evidence: "8 weeks of physical therapy, 4 weeks of NSAIDs, and activity modification with minimal improvement.",
      },
      {
        step: 4,
        criteria: "Are there specific clinical reasons for an Outpatient Hospital setting (e.g., bleeding disorder, anticipated overnight stay)?",
        patient_data_meets: false,
        evidence: "No documented conditions meeting UHC's site of service criteria for an outpatient hospital.",
      },
    ],
  },
  gap_comparison_table: [
    {
      requirement: "Imaging Confirmation: MRI confirms a meniscal tear.",
      current_evidence: "MRI dated Jan 2026 shows medial meniscus tear with associated joint effusion.",
      status: "MET",
      action_required: null,
    },
    {
      requirement: "Mechanical Symptoms: Patient reports significant pain plus locking, catching, or giving-way.",
      current_evidence: "Patient reports pain at 7/10, a locking and catching sensation, and difficulty climbing stairs.",
      status: "MET",
      action_required: null,
    },
    {
      requirement: "Conservative Treatment Failure: Trial of non-surgical therapy (e.g., PT for 8-12 weeks, NSAIDs for 3+ weeks).",
      current_evidence: "Physical therapy for 8 weeks and NSAIDs for 4 weeks with minimal improvement.",
      status: "PARTIALLY_MET",
      action_required: "Some UHC policies imply a 12-week PT trial. Justify why further PT is not clinically indicated due to persistent mechanical symptoms.",
    },
    {
      requirement: "Absence of Exclusionary Imaging Findings: No moderate/severe arthritis, meniscal extrusion, or significant degenerative changes on MRI.",
      current_evidence: "Clinical notes do not explicitly rule out exclusionary findings. The MRI report summary only mentions the tear and effusion.",
      status: "UNCLEAR",
      action_required: "Review the full radiologist's report for the MRI to confirm the absence of advanced degenerative changes.",
    },
    {
      requirement: "Site of Service Justification: Patient meets criteria for procedure in an Outpatient Hospital setting.",
      current_evidence: "No clinical documentation supports the need for an outpatient hospital setting over an Ambulatory Surgery Center (ASC).",
      status: "NOT_MET",
      action_required: "Provide specific medical justification for the outpatient hospital location or consider moving to an ASC to prevent denial.",
    },
  ],
  final_recommendation: {
    decision: "SUBMIT",
    primary_reason: "The patient's clinical presentation strongly aligns with the core medical necessity criteria, including an MRI-confirmed tear and persistent mechanical symptoms that have failed a reasonable course of conservative management.",
    risk_of_denial: "Medium",
    next_steps: [
      "Bolster the clinical narrative to emphasize that the 8-week course of physical therapy was a sufficient trial and further non-operative care is futile given the persistent mechanical symptoms.",
      "Obtain and submit the full radiologist's MRI report to proactively confirm the absence of exclusionary degenerative conditions.",
      "Provide a clear medical justification for the Outpatient Hospital site of service, or confirm with the provider if an Ambulatory Surgery Center (ASC) is a clinically appropriate alternative.",
      "Submit the prior authorization request via UHC's electronic portal with all supporting documentation.",
    ],
  },
};

// Initial steps - only eligibility is active, others locked
const initialSteps: WorkflowStep[] = [
  {
    id: "eligibility",
    title: "Eligibility & Benefits",
    description: "Insurance verification",
    status: "active",
    canEdit: true,
  },
  {
    id: "document-analysis",
    title: "Document Analysis",
    description: "Document summary & review",
    status: "pending",
    canEdit: false,
  },
  {
    id: "prior-auth-decision",
    title: "Prior Auth Readiness Check",
    description: "Pre-certification & policy check",
    status: "pending",
    canEdit: false,
  },
  {
    id: "gap-analysis",
    title: "Gap Analysis & Review",
    description: "Clinical audit & gaps",
    status: "pending",
    canEdit: false,
  },
  {
    id: "submit-to-payer",
    title: "Submit to Payer",
    description: "Final submission & notification",
    status: "pending",
    canEdit: false,
  },
];

export function PreAuthProviderWorkflow() {
  const { caseId } = useParams();
  const [currentStep, setCurrentStep] = useState("eligibility");
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Record<string, boolean>>({});
  const [eligibilityStatus, setEligibilityStatus] = useState<"idle" | "processing" | "eligible" | "not-eligible">(
    "idle",
  );
  const [hasAutoRun, setHasAutoRun] = useState(false);
  const [workflowPhase, setWorkflowPhase] = useState<
    "eligibility" | "document-analysis" | "unlocked" | "complete"
  >("eligibility");

  // Determine if this case has gaps based on caseId
  const caseHasGaps = caseId === "CASE-001";

  // Auto-run only eligibility and document analysis, then unlock manual navigation
  useEffect(() => {
    if (!hasAutoRun && eligibilityStatus === "idle") {
      setHasAutoRun(true);
      setEligibilityStatus("processing");

      // Phase 1: Eligibility (2 seconds)
      setTimeout(() => {
        const isEligible = true;
        const status = isEligible ? "eligible" : "not-eligible";
        setEligibilityStatus(status);
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === "eligibility") {
              return { ...s, status: "completed" as const, eligibilityStatus: status };
            }
            if (isEligible && s.id === "document-analysis") {
              return {
                ...s,
                status: "active" as const,
                documentAnalysisStatus: "in-progress" as const,
                canEdit: false,
              };
            }
            return s;
          }),
        );
        if (isEligible) {
          setCurrentStep("document-analysis");
          setWorkflowPhase("document-analysis");
        }
      }, 2000);
    }
  }, [hasAutoRun, eligibilityStatus]);

  // Phase 2: Document Analysis auto-run, then unlock all subsequent steps for manual navigation
  useEffect(() => {
    if (workflowPhase === "document-analysis") {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === "document-analysis") {
              return { ...s, status: "completed" as const, documentAnalysisStatus: "analyzed" as const, canEdit: true };
            }
            // Unlock all steps after document analysis for manual navigation
            if (s.id === "prior-auth-decision") {
              return { ...s, status: "active" as const, canEdit: true };
            }
            if (s.id === "gap-analysis") {
              return { ...s, status: "active" as const, canEdit: true };
            }
            if (s.id === "submit-to-payer") {
              return { ...s, status: "active" as const, canEdit: true };
            }
            return s;
          }),
        );
        setCurrentStep("prior-auth-decision");
        setWorkflowPhase("unlocked");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [workflowPhase]);

  // Check if user can access a step based on eligibility and step status
  const canAccessStep = useCallback(
    (stepId: string) => {
      if (stepId === "eligibility") return true;
      if (eligibilityStatus !== "eligible") return false;
      const step = steps.find((s) => s.id === stepId);
      return step?.status === "completed" || step?.status === "active";
    },
    [eligibilityStatus, steps],
  );

  const handleStepClick = useCallback(
    (stepId: string) => {
      if (canAccessStep(stepId)) {
        setCurrentStep(stepId);
      }
    },
    [canAccessStep],
  );

  const handleEditStep = useCallback(
    (stepId: string) => {
      if (canAccessStep(stepId)) {
        setEditingStep(stepId);
        setCurrentStep(stepId);
      }
    },
    [canAccessStep],
  );

  const handleSaveCorrection = useCallback((stepId: string) => {
    setCorrections((prev) => ({ ...prev, [stepId]: true }));
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, hasCorrections: true } : s)));
    setEditingStep(null);
    setCurrentStep("gap-analysis");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingStep(null);
    setCurrentStep("gap-analysis");
  }, []);

  // Handle eligibility check completion - unlocks next step
  const handleEligibilityComplete = useCallback((status: "eligible" | "not-eligible") => {
    setEligibilityStatus(status);
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === "eligibility") {
          return {
            ...s,
            status: "completed" as const,
            eligibilityStatus: status === "eligible" ? "eligible" : "not-eligible",
          };
        }
        if (status === "eligible" && s.id === "document-analysis") {
          return { ...s, status: "active" as const, canEdit: true };
        }
        return s;
      }),
    );
    if (status === "eligible") {
      setCurrentStep("document-analysis");
    }
  }, []);

  // Progress to next step
  const handleStepComplete = useCallback((completedStepId: string, nextStepId: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === completedStepId) {
          return { ...s, status: "completed" as const, canEdit: true };
        }
        if (s.id === nextStepId) {
          return { ...s, status: "active" as const, canEdit: false };
        }
        return s;
      }),
    );
    setCurrentStep(nextStepId);
  }, []);

  const handleProceedToSubmit = useCallback(() => {
    handleStepComplete("gap-analysis", "submit-to-payer");
  }, [handleStepComplete]);

  const renderPanel = () => {
    switch (currentStep) {
      case "eligibility":
        return (
          <EligibilitySection
            isEditing={editingStep === "eligibility"}
            onSave={() => handleSaveCorrection("eligibility")}
            onCancel={handleCancelEdit}
            eligibilityStatus={eligibilityStatus}
            onStatusChange={setEligibilityStatus}
            onComplete={handleEligibilityComplete}
          />
        );
      case "document-analysis":
        return (
          <DocumentAnalysisSection
            isEditing={editingStep === "document-analysis"}
            onSave={() => handleSaveCorrection("document-analysis")}
            onCancel={handleCancelEdit}
            onComplete={() => handleStepComplete("document-analysis", "prior-auth-decision")}
          />
        );
      case "prior-auth-decision":
        return (
          <PriorAuthDecisionSection
            isEditing={editingStep === "prior-auth-decision"}
            onSave={() => handleSaveCorrection("prior-auth-decision")}
            onCancel={handleCancelEdit}
            onComplete={() => setCurrentStep("gap-analysis")}
          />
        );
      case "gap-analysis":
        return (
          <GapAnalysisSection
            onProceed={handleProceedToSubmit}
            onEditStep={handleEditStep}
            corrections={corrections}
            hasGaps={caseHasGaps}
          />
        );
      case "submit-to-payer":
        return <SubmitToPayerSection />;
      default:
        return (
          <EligibilitySection
            isEditing={false}
            eligibilityStatus={eligibilityStatus}
            onStatusChange={setEligibilityStatus}
            onComplete={handleEligibilityComplete}
          />
        );
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
              onStepClick={handleStepClick}
              onEditStep={handleEditStep}
              lockedSteps={
                eligibilityStatus !== "eligible"
                  ? ["document-analysis", "prior-auth-decision", "gap-analysis", "submit-to-payer"]
                  : workflowPhase === "document-analysis"
                    ? ["prior-auth-decision", "gap-analysis", "submit-to-payer"]
                    : []
              }
            />
          </Card>
        </div>
      </div>
      <div className="flex-1 min-w-0">{renderPanel()}</div>
    </div>
  );
}

// Section Components
interface SectionProps {
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

interface EligibilitySectionProps {
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  eligibilityStatus: "idle" | "processing" | "eligible" | "not-eligible";
  onStatusChange: (status: "idle" | "processing" | "eligible" | "not-eligible") => void;
  onComplete: (status: "eligible" | "not-eligible") => void;
}

function EligibilityHeader({
  status,
  eligibilityStatus,
  onRun,
  isRunning,
}: {
  status: "idle" | "processing" | "complete";
  eligibilityStatus: "idle" | "processing" | "eligible" | "not-eligible";
  onRun: () => void;
  isRunning: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
          status === "processing"
            ? "bg-primary/20 ring-2 ring-primary/30"
            : status === "complete"
              ? "bg-success/20"
              : "bg-muted"
        }`}
      >
        <Shield
          className={`h-5 w-5 ${
            status === "processing"
              ? "text-primary animate-pulse-soft"
              : status === "complete"
                ? "text-success"
                : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Agent</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRun} disabled={isRunning}>
          {isRunning ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : eligibilityStatus === "eligible" || eligibilityStatus === "not-eligible" ? (
            <RefreshCw className="h-4 w-4 mr-1" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          {eligibilityStatus === "eligible" || eligibilityStatus === "not-eligible" ? "Run Again" : "Run Check"}
        </Button>
        <AuditLogsDialog agentName="Eligibility" />
      </div>
    </div>
  );
}

function AgentHeader({
  name,
  status,
  showRunButton,
  onRun,
  isRunning,
}: {
  name: string;
  status: "active" | "complete" | "idle";
  showRunButton?: boolean;
  onRun?: () => void;
  isRunning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
          status === "active"
            ? "bg-primary/20 ring-2 ring-primary/30"
            : status === "complete"
              ? "bg-success/20"
              : "bg-muted"
        }`}
      >
        <Sparkles
          className={`h-5 w-5 ${
            status === "active"
              ? "text-primary animate-pulse-soft"
              : status === "complete"
                ? "text-success"
                : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        {showRunButton && (
          <Button variant="outline" size="sm" onClick={onRun} disabled={isRunning}>
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
      </div>
    </div>
  );
}

function EligibilitySection({
  isEditing,
  onSave,
  onCancel,
  eligibilityStatus,
  onStatusChange,
  onComplete,
}: EligibilitySectionProps) {
  const handleRunCheck = () => {
    onStatusChange("processing");
    setTimeout(() => {
      const isEligible = true;
      const status = isEligible ? "eligible" : "not-eligible";
      onComplete(status);
    }, 2000);
  };

  const hasResults = eligibilityStatus === "eligible" || eligibilityStatus === "not-eligible";
  const isRunning = eligibilityStatus === "processing";

  return (
    <Card className="p-6 bg-card border-border">
      <EligibilityHeader
        status={isRunning ? "processing" : hasResults ? "complete" : "idle"}
        eligibilityStatus={eligibilityStatus}
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Insurance & Eligibility Verification</h3>

      {hasResults ? (
        <div className="grid gap-4">
          <Card
            className={`p-4 ${eligibilityStatus === "eligible" ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {eligibilityStatus === "eligible" ? (
                <>
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Eligibility Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Not Eligible</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {eligibilityStatus === "eligible"
                ? "Member is active with valid coverage for requested procedure"
                : "Member coverage is not active or does not cover requested procedure"}
            </p>
          </Card>

          {eligibilityStatus === "eligible" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={<Shield className="h-4 w-4" />}
                  label="Payer"
                  value="Blue Cross Blue Shield"
                  editable={isEditing}
                />
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
            </>
          )}
        </div>
      ) : isRunning ? (
        <Card className="p-6 bg-primary/5 border-primary/20 text-center">
          <Loader2 className="h-12 w-12 mx-auto text-primary mb-3 animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying member eligibility and benefits...</p>
        </Card>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Click "Run Check" to verify member eligibility and benefits
          </p>
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

function DocumentAnalysisSection({ isEditing, onSave, onCancel, onComplete }: SectionProps) {
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
        name="Agent"
        status={hasAnalysis ? "complete" : "idle"}
        showRunButton
        onRun={handleAnalyze}
        isRunning={isAnalyzing}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Analysis & Summary</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/case/${caseId}/documents`)}>
          <FileUp className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {hasAnalysis ? (
        <div className="grid gap-4">
          <Card className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">AI Document Summary</h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{documentSummary}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Retrieved Documents ({documents.length})</h4>
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background cursor-pointer"
                  onClick={() => navigate(`/case/${caseId}/documents`)}
                >
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
          <p className="text-sm text-muted-foreground mb-3">
            Upload documents and click "Analyze Documents" to generate summary
          </p>
        </Card>
      )}

      {isEditing ? (
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
      ) : (
        hasAnalysis &&
        onComplete && (
          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={onComplete}>
              Proceed to Readiness Check
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )
      )}
    </Card>
  );
}

// ─── REDESIGNED: Prior Auth Readiness Check ─────────────────────────────────
function PriorAuthDecisionSection({ isEditing, onSave, onCancel, onComplete }: SectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const data = priorAuthAgentResponse;

  const handleRunCheck = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 2000);
  };

  const metCount = data.decision_tree_validation.logic_path.filter((s) => s.patient_data_meets).length;
  const totalSteps = data.decision_tree_validation.logic_path.length;

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader
        name="Prior Auth Agent"
        status={hasResults ? "complete" : "idle"}
        showRunButton
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-1">Prior Auth Readiness Check</h3>
      <p className="text-sm text-muted-foreground mb-6">
        CPT {data.summary.cpt_code} — {data.summary.procedure_description}
      </p>

      {hasResults ? (
        <div className="grid gap-5">
          {/* ── Summary Banner ── */}
          <Card className={`p-4 ${data.summary.overall_recommendation === "SUBMIT" ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"}`}>
            <div className="flex items-center gap-3">
              <Target className={`h-5 w-5 ${data.summary.overall_recommendation === "SUBMIT" ? "text-success" : "text-warning"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-base font-semibold ${data.summary.overall_recommendation === "SUBMIT" ? "text-success" : "text-warning"}`}>
                    Recommendation: {data.summary.overall_recommendation}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Risk: {data.final_recommendation.risk_of_denial}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Payer: {data.summary.payer} · {data.pre_certification_analysis.authorization_type} · TAT: {data.pre_certification_analysis.estimated_tat_days} days
                </p>
              </div>
            </div>
          </Card>

          {/* ── Pre-certification Analysis ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <ClipboardList className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Pre-certification Analysis</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                CPT: {data.summary.cpt_code}
              </Badge>
            </div>
            <div className="space-y-2 text-sm ml-8">
              <DataRow label="PA Required" value={data.pre_certification_analysis.pa_required ? "Yes" : "No"} highlight={data.pre_certification_analysis.pa_required} />
              <DataRow label="Authorization Type" value={data.pre_certification_analysis.authorization_type} />
              <DataRow label="Estimated TAT" value={`${data.pre_certification_analysis.estimated_tat_days} business days`} />
            </div>
          </Card>

          {/* ── State Policy Analysis ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Scale className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">State Policy Analysis</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                {data.state_policy_analysis.state}
              </Badge>
            </div>
            <div className="space-y-3 ml-8">
              {data.state_policy_analysis.applicable_laws.map((law, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-start gap-2">
                    <Gavel className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{law.law_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{law.description}</p>
                      <p className="text-xs text-primary mt-1.5">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Impact: {law.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Reviewer Requirement:</span> {data.state_policy_analysis.reviewer_requirement}
              </div>
            </div>
          </Card>

          {/* ── Decision Tree Validation ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <GitBranch className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Decision Tree Validation</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                {metCount}/{totalSteps} criteria met
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3 ml-8">
              Policy: {data.decision_tree_validation.policy_id}
            </p>
            <p className="text-xs text-muted-foreground mb-4 ml-8 p-2 rounded bg-background/50 border border-border/50 italic">
              "{data.decision_tree_validation.policy_wording}"
            </p>
            <div className="space-y-2 ml-8">
              {data.decision_tree_validation.logic_path.map((step) => (
                <div key={step.step} className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.patient_data_meets ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Step {step.step}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${step.patient_data_meets ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}`}
                        >
                          {step.patient_data_meets ? "Criteria Met" : "Not Met"}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mt-1">{step.criteria}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <CircleDot className="h-3 w-3 inline mr-1" />
                        {step.evidence}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Final Recommendation ── */}
          <Card className={`p-5 ${data.final_recommendation.decision === "SUBMIT" ? "bg-primary/10 border-primary/30" : "bg-warning/10 border-warning/30"}`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground">Final Recommendation & Reason</h4>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-4">
              {data.final_recommendation.primary_reason}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                Decision: {data.final_recommendation.decision}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  data.final_recommendation.risk_of_denial === "Low"
                    ? "border-success/30 text-success"
                    : data.final_recommendation.risk_of_denial === "Medium"
                      ? "border-warning/30 text-warning"
                      : "border-destructive/30 text-destructive"
                }`}
              >
                Denial Risk: {data.final_recommendation.risk_of_denial}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Recommended Next Steps:</p>
              {data.final_recommendation.next_steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-medium flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Click "Run Check" to analyze prior authorization requirements
          </p>
        </Card>
      )}

      {isEditing ? (
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
      ) : (
        hasResults &&
        onComplete && (
          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={onComplete}>
              Proceed to Gap Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )
      )}
    </Card>
  );
}

// ─── REDESIGNED: Gap Analysis & Review ──────────────────────────────────────
interface GapAnalysisSectionProps {
  onProceed: () => void;
  onEditStep: (stepId: string) => void;
  corrections: Record<string, boolean>;
  hasGaps: boolean;
}

function GapAnalysisSection({ onProceed, onEditStep, corrections, hasGaps }: GapAnalysisSectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const [notes, setNotes] = useState<string>("");
  const data = priorAuthAgentResponse;

  const gapItems = data.gap_comparison_table;
  const metItems = gapItems.filter((g) => g.status === "MET");
  const issueItems = gapItems.filter((g) => g.status !== "MET");

  const handleRunCheck = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MET":
        return (
          <Badge variant="outline" className="text-xs border-success/30 text-success bg-success/10">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Met
          </Badge>
        );
      case "PARTIALLY_MET":
        return (
          <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/10">
            <AlertTriangle className="h-3 w-3 mr-1" /> Partially Met
          </Badge>
        );
      case "UNCLEAR":
        return (
          <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/10">
            <HelpCircle className="h-3 w-3 mr-1" /> Unclear
          </Badge>
        );
      case "NOT_MET":
        return (
          <Badge variant="outline" className="text-xs border-destructive/30 text-destructive bg-destructive/10">
            <XCircle className="h-3 w-3 mr-1" /> Not Met
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  // No gaps scenario
  if (!hasGaps) {
    return (
      <Card className="p-6 bg-card border-border">
        <AgentHeader name="Agent" status="complete" showRunButton onRun={handleRunCheck} isRunning={isRunning} />
        <h3 className="text-lg font-semibold text-foreground mb-4">Gap Analysis & Review</h3>

        <Card className="p-4 bg-success/10 border-success/30 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <div className="flex-1">
              <span className="text-base font-semibold text-success">No Gaps Identified</span>
              <p className="text-xs text-muted-foreground mt-1">
                All required clinical documentation is complete. This case meets all payer requirements.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Ready for Submission</p>
              <p className="text-xs text-muted-foreground">All criteria met, no gaps to address</p>
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

  // Has gaps scenario — show gap comparison table from agent response
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader
        name="Gap Analysis Agent"
        status={hasResults ? "complete" : "idle"}
        showRunButton
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-1">Gap Analysis & Review</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Comparing clinical evidence against {data.summary.payer} medical necessity requirements for CPT {data.summary.cpt_code}.
      </p>

      {hasResults ? (
        <>
          {/* Summary Counts */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="p-3 bg-success/10 border-success/30 text-center">
              <p className="text-2xl font-bold text-success">{metItems.length}</p>
              <p className="text-xs text-muted-foreground">Met</p>
            </Card>
            <Card className="p-3 bg-warning/10 border-warning/30 text-center">
              <p className="text-2xl font-bold text-warning">{issueItems.filter((i) => i.status === "PARTIALLY_MET" || i.status === "UNCLEAR").length}</p>
              <p className="text-xs text-muted-foreground">Partially Met / Unclear</p>
            </Card>
            <Card className="p-3 bg-destructive/10 border-destructive/30 text-center">
              <p className="text-2xl font-bold text-destructive">{issueItems.filter((i) => i.status === "NOT_MET").length}</p>
              <p className="text-xs text-muted-foreground">Not Met</p>
            </Card>
          </div>

          {/* Gap Comparison — Issues First */}
          {issueItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Action Required ({issueItems.length})
              </h4>
              <div className="space-y-3">
                {issueItems.map((item, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 ${item.status === "NOT_MET" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium text-foreground">{item.requirement}</p>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 mb-3">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Current Evidence: </span>
                        {item.current_evidence}
                      </p>
                    </div>
                    {item.action_required && (
                      <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-primary">
                            <span className="font-medium">Action: </span>
                            {item.action_required}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Met Criteria */}
          {metItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Criteria Met ({metItems.length})
              </h4>
              <Card className="p-4 bg-secondary/30 border-border/50">
                <div className="space-y-3">
                  {metItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-background/50">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{item.requirement}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.current_evidence}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Notes Section */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Gap Resolution Notes
            </h4>
            <Card className="p-4 bg-secondary/30 border-border/50">
              <textarea
                placeholder="Add notes about gaps, actions taken, or items pending physician response..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[80px] p-3 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Card>
          </div>

          {/* Draft Email */}
          <Card className="p-4 bg-primary/10 border-primary/30 mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Draft Email to Physician
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Send an email to the ordering physician requesting the missing documentation and gap corrections.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const subject = encodeURIComponent("Prior Authorization - Additional Documentation Required");
                const body = encodeURIComponent(
                  `Dear Dr.,\n\nWe are processing a prior authorization request for CPT ${data.summary.cpt_code} (${data.summary.procedure_description}).\n\nThe following items require attention:\n\n${issueItems.map((item, i) => `${i + 1}. [${item.status}] ${item.requirement}\n   Action: ${item.action_required || "N/A"}`).join("\n\n")}\n\nPlease provide the required documentation at your earliest convenience.\n\nThank you.`,
                );
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Draft Email with Missing Details
            </Button>
          </Card>

          {/* Proceed */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Ready for Submission</p>
                <p className="text-xs text-muted-foreground">
                  {issueItems.length} gap(s) identified — review and proceed
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
          <p className="text-sm text-muted-foreground mb-3">
            Click "Run Check" to perform clinical audit and gap analysis
          </p>
        </Card>
      )}
    </Card>
  );
}

function SubmitToPayerSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Agent" status={submitted ? "complete" : "active"} />
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
function InfoCard({
  icon,
  label,
  value,
  editable,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <Card className={`p-3 bg-secondary/30 border-border/50 ${editable ? "ring-1 ring-primary/30" : ""}`}>
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
