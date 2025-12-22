// Agent System Types for Pre-Authorization Workflow

export type AgentStatus = "idle" | "processing" | "awaiting-input" | "completed" | "error" | "human-review";

export interface AgentError {
  code: string;
  message: string;
  recoverable: boolean;
  suggestedAction?: string;
}

export interface AgentAuditEntry {
  timestamp: string;
  action: string;
  agent: string;
  details: string;
  user?: string;
}

// Base Agent Interface
export interface BaseAgentState {
  id: string;
  name: string;
  status: AgentStatus;
  confidence: number;
  reasoning: string[];
  errors: AgentError[];
  lastUpdated: string;
  humanOverride?: boolean;
}

// 1. Data Onboarding Agent
export interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "docx" | "image" | "ehr" | "structured";
  size: string;
  uploadedAt: string;
  preview?: string;
  extractedContent?: string;
  status: "pending" | "processing" | "extracted" | "error";
}

export interface DataOnboardingInput {
  source: "ehr-api" | "manual-upload" | "fax" | "portal";
  files?: File[];
  ehrConnectionId?: string;
}

export interface DataOnboardingOutput {
  patientInfo: {
    name: string;
    dob: string;
    mrn: string;
    ssn?: string;
    phone: string;
    address: string;
  };
  providerInfo: {
    name: string;
    npi: string;
    specialty: string;
    facility: string;
    phone: string;
  };
  orderDetails: {
    procedureName: string;
    cptCode: string;
    icdCodes: string[];
    dateOfService: string;
    urgency: "routine" | "urgent" | "emergent";
  };
  clinicalDocs: UploadedFile[];
  extractedMetadata: Record<string, any>;
}

export interface DataOnboardingAgentState extends BaseAgentState {
  input: DataOnboardingInput | null;
  output: DataOnboardingOutput | null;
  fileHistory: UploadedFile[];
}

// 2. Prioritization Agent
export interface PrioritizationInput {
  patientInfo: DataOnboardingOutput["patientInfo"];
  orderDetails: DataOnboardingOutput["orderDetails"];
  payerName: string;
  diagnosisSeverity: "low" | "medium" | "high" | "critical";
}

export interface PrioritizationOutput {
  priorityScore: number; // 0-100
  priorityLevel: "low" | "medium" | "high" | "urgent";
  factors: {
    factor: string;
    weight: number;
    score: number;
  }[];
  recommendedAction: string;
  escalationRequired: boolean;
  coordinatorNotified: boolean;
}

export interface PrioritizationAgentState extends BaseAgentState {
  input: PrioritizationInput | null;
  output: PrioritizationOutput | null;
}

// 3. Eligibility & Benefits Agent
export interface EligibilityInput {
  patientInfo: DataOnboardingOutput["patientInfo"];
  payerName: string;
  memberId?: string;
  groupNumber?: string;
}

export interface EligibilityOutput {
  isEligible: boolean;
  verificationSource: "api" | "portal" | "manual";
  memberDetails: {
    memberId: string;
    groupNumber: string;
    planName: string;
    planType: string;
    effectiveDate: string;
    termDate?: string;
  };
  benefits: {
    deductible: { amount: number; met: number };
    outOfPocketMax: { amount: number; met: number };
    coinsurance: number;
    copay?: number;
    coveragePercentage: number;
  };
  priorAuthRequired: boolean;
  networkStatus: "in-network" | "out-of-network" | "unknown";
  payerResponse: Record<string, any>;
}

export interface EligibilityAgentState extends BaseAgentState {
  input: EligibilityInput | null;
  output: EligibilityOutput | null;
}

// 4. Pre-Authorization Determination Agent
export interface PreAuthDeterminationInput {
  orderDetails: DataOnboardingOutput["orderDetails"];
  eligibilityOutput: EligibilityOutput;
  providerInfo: DataOnboardingOutput["providerInfo"];
}

export interface PolicyMatch {
  policyId: string;
  policyName: string;
  effectiveDate: string;
  criteria: {
    criterion: string;
    met: boolean;
    evidence?: string;
  }[];
}

export interface PreAuthDeterminationOutput {
  decision: "required" | "not-required" | "exempt";
  decisionTree: {
    node: string;
    result: string;
    passed: boolean;
  }[];
  applicablePolicies: PolicyMatch[];
  goldCardStatus: {
    enrolled: boolean;
    eligible: boolean;
    reason?: string;
  };
  exemptions: string[];
  clinicalSummary?: string;
  requiredDocuments: string[];
}

export interface PreAuthDeterminationAgentState extends BaseAgentState {
  input: PreAuthDeterminationInput | null;
  output: PreAuthDeterminationOutput | null;
}

// 5. Gap Analysis Agent
export interface GapAnalysisInput {
  clinicalDocs: UploadedFile[];
  orderDetails: DataOnboardingOutput["orderDetails"];
  applicablePolicies: PolicyMatch[];
  payerName: string;
}

export interface Gap {
  id: string;
  type: "missing-doc" | "insufficient-evidence" | "coding-issue" | "policy-mismatch";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedStep: string;
  recommendation: string;
  autoFixable: boolean;
  status: "open" | "in-progress" | "resolved" | "dismissed";
}

export interface ComplianceCheck {
  guideline: string;
  source: string;
  status: "met" | "not-met" | "partial";
  evidence?: string;
  confidence: number;
}

export interface GapAnalysisOutput {
  overallScore: number;
  complianceChecks: ComplianceCheck[];
  gaps: Gap[];
  nextBestActions: {
    priority: number;
    action: string;
    impact: string;
    autoExecutable: boolean;
  }[];
  readyForSubmission: boolean;
}

export interface GapAnalysisAgentState extends BaseAgentState {
  input: GapAnalysisInput | null;
  output: GapAnalysisOutput | null;
}

// 6. Correction Agent
export interface CorrectionInput {
  gaps: Gap[];
  currentData: {
    onboarding: DataOnboardingOutput | null;
    eligibility: EligibilityOutput | null;
    clinicalSummary: string | null;
  };
}

export interface Correction {
  id: string;
  gapId: string;
  type: "auto" | "manual" | "human-required";
  field: string;
  originalValue: any;
  correctedValue: any;
  appliedAt?: string;
  appliedBy?: string;
  status: "pending" | "applied" | "rejected" | "review-required";
}

export interface CorrectionOutput {
  corrections: Correction[];
  updatedData: CorrectionInput["currentData"];
  unresolvedGaps: Gap[];
  auditLog: string[];
}

export interface CorrectionAgentState extends BaseAgentState {
  input: CorrectionInput | null;
  output: CorrectionOutput | null;
  pendingHumanInput: Correction[];
}

// 7. Reviewer Agent (Human-in-the-loop)
export interface ReviewerInput {
  fullPacket: {
    patientInfo: DataOnboardingOutput["patientInfo"];
    providerInfo: DataOnboardingOutput["providerInfo"];
    orderDetails: DataOnboardingOutput["orderDetails"];
    eligibility: EligibilityOutput;
    determination: PreAuthDeterminationOutput;
    gapAnalysis: GapAnalysisOutput;
    corrections: Correction[];
  };
}

export interface RiskFlag {
  level: "info" | "warning" | "critical";
  category: string;
  message: string;
}

export interface ReviewerOutput {
  approved: boolean;
  confidenceScore: number;
  riskFlags: RiskFlag[];
  reviewerComments?: string;
  edits: {
    field: string;
    before: any;
    after: any;
  }[];
  readyForSubmission: boolean;
}

export interface ReviewerAgentState extends BaseAgentState {
  input: ReviewerInput | null;
  output: ReviewerOutput | null;
  awaitingHumanDecision: boolean;
}

// 8. Submission Agent
export interface SubmissionInput {
  reviewedPacket: ReviewerInput["fullPacket"];
  payerDetails: {
    payerName: string;
    submissionMethod: "api" | "portal" | "fax" | "email";
    formType: string;
    endpoint?: string;
  };
}

export interface SubmissionOutput {
  submitted: boolean;
  submissionId: string;
  submissionMethod: string;
  submittedAt: string;
  confirmationNumber?: string;
  expectedResponseTime: string;
  attachedDocuments: string[];
  notificationsSent: {
    recipient: string;
    method: string;
    sentAt: string;
  }[];
}

export interface SubmissionAgentState extends BaseAgentState {
  input: SubmissionInput | null;
  output: SubmissionOutput | null;
}

// Orchestrator State
export interface WorkflowOrchestrator {
  caseId: string;
  currentAgent: string;
  status: "in-progress" | "paused" | "completed" | "failed";
  agents: {
    dataOnboarding: DataOnboardingAgentState;
    prioritization: PrioritizationAgentState;
    eligibility: EligibilityAgentState;
    preAuthDetermination: PreAuthDeterminationAgentState;
    gapAnalysis: GapAnalysisAgentState;
    correction: CorrectionAgentState;
    reviewer: ReviewerAgentState;
    submission: SubmissionAgentState;
  };
  auditTrail: AgentAuditEntry[];
  startedAt: string;
  completedAt?: string;
}
