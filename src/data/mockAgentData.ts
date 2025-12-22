import { 
  WorkflowOrchestrator, 
  DataOnboardingAgentState,
  PrioritizationAgentState,
  EligibilityAgentState,
  PreAuthDeterminationAgentState,
  GapAnalysisAgentState,
  CorrectionAgentState,
  ReviewerAgentState,
  SubmissionAgentState
} from "@/types/agents";

// Mock data for the 8-agent workflow

export const mockDataOnboarding: DataOnboardingAgentState = {
  id: "agent-001",
  name: "Data Onboarding Agent",
  status: "completed",
  confidence: 0.95,
  reasoning: [
    "Received EHR order via API connection",
    "Extracted patient demographics from registration",
    "Parsed clinical notes using NLP",
    "Identified 5 supporting documents",
    "Generated structured metadata"
  ],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: {
    source: "ehr-api",
    ehrConnectionId: "EHR-EPIC-001"
  },
  output: {
    patientInfo: {
      name: "John Smith",
      dob: "1959-03-15",
      mrn: "MRN-2024-78456",
      ssn: "***-**-4521",
      phone: "(555) 123-4567",
      address: "1234 Oak Street, Springfield, IL 62701"
    },
    providerInfo: {
      name: "Dr. Sarah Johnson",
      npi: "1234567890",
      specialty: "Orthopedic Surgery",
      facility: "Springfield Medical Center",
      phone: "(555) 987-6543"
    },
    orderDetails: {
      procedureName: "Total Knee Arthroplasty, Right",
      cptCode: "27447",
      icdCodes: ["M17.11", "M25.561"],
      dateOfService: "2024-12-28",
      urgency: "routine"
    },
    clinicalDocs: [
      { id: "doc-1", name: "Clinical Notes - Dr. Johnson", type: "pdf", size: "245 KB", uploadedAt: "2024-12-20T10:30:00Z", status: "extracted", preview: "Patient presents with chronic right knee pain..." },
      { id: "doc-2", name: "X-Ray Report - Right Knee", type: "pdf", size: "1.2 MB", uploadedAt: "2024-12-20T10:31:00Z", status: "extracted", preview: "Findings: Severe degenerative changes..." },
      { id: "doc-3", name: "MRI Report - Right Knee", type: "pdf", size: "2.8 MB", uploadedAt: "2024-12-20T10:32:00Z", status: "extracted", preview: "Complete cartilage loss in medial compartment..." },
      { id: "doc-4", name: "Physical Therapy Notes", type: "pdf", size: "156 KB", uploadedAt: "2024-12-20T10:33:00Z", status: "extracted", preview: "12-week PT program completed..." },
      { id: "doc-5", name: "Injection Records", type: "pdf", size: "89 KB", uploadedAt: "2024-12-20T10:34:00Z", status: "extracted", preview: "3 cortisone injections administered..." }
    ],
    extractedMetadata: {
      totalPages: 47,
      documentTypes: ["clinical-notes", "imaging", "therapy-records"],
      lastVisitDate: "2024-12-15",
      primaryDiagnosis: "Primary Osteoarthritis, Right Knee"
    }
  },
  fileHistory: [
    { id: "doc-1", name: "Clinical Notes - Dr. Johnson", type: "pdf", size: "245 KB", uploadedAt: "2024-12-20T10:30:00Z", status: "extracted" },
    { id: "doc-2", name: "X-Ray Report - Right Knee", type: "pdf", size: "1.2 MB", uploadedAt: "2024-12-20T10:31:00Z", status: "extracted" },
    { id: "doc-3", name: "MRI Report - Right Knee", type: "pdf", size: "2.8 MB", uploadedAt: "2024-12-20T10:32:00Z", status: "extracted" },
    { id: "doc-4", name: "Physical Therapy Notes", type: "pdf", size: "156 KB", uploadedAt: "2024-12-20T10:33:00Z", status: "extracted" },
    { id: "doc-5", name: "Injection Records", type: "pdf", size: "89 KB", uploadedAt: "2024-12-20T10:34:00Z", status: "extracted" }
  ]
};

export const mockPrioritization: PrioritizationAgentState = {
  id: "agent-002",
  name: "Prioritization Agent",
  status: "completed",
  confidence: 0.88,
  reasoning: [
    "Evaluated case criticality based on procedure type",
    "Assessed diagnosis severity as moderate-high",
    "Checked payer turnaround requirements",
    "No missing critical information detected",
    "Assigned priority score based on weighted factors"
  ],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: {
    patientInfo: mockDataOnboarding.output!.patientInfo,
    orderDetails: mockDataOnboarding.output!.orderDetails,
    payerName: "Aetna Commercial",
    diagnosisSeverity: "high"
  },
  output: {
    priorityScore: 72,
    priorityLevel: "high",
    factors: [
      { factor: "Procedure Complexity", weight: 0.25, score: 85 },
      { factor: "Diagnosis Severity", weight: 0.20, score: 78 },
      { factor: "Documentation Completeness", weight: 0.20, score: 65 },
      { factor: "Payer Requirements", weight: 0.15, score: 70 },
      { factor: "Patient Age/Risk", weight: 0.10, score: 68 },
      { factor: "Urgency Level", weight: 0.10, score: 50 }
    ],
    recommendedAction: "Begin eligibility verification immediately",
    escalationRequired: false,
    coordinatorNotified: true
  }
};

export const mockEligibility: EligibilityAgentState = {
  id: "agent-003",
  name: "Eligibility & Benefits Agent",
  status: "completed",
  confidence: 0.97,
  reasoning: [
    "Connected to Aetna 270/271 API",
    "Retrieved real-time eligibility status",
    "Validated member ID against patient registration",
    "Extracted benefit details from response",
    "Confirmed prior authorization requirement"
  ],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: {
    patientInfo: mockDataOnboarding.output!.patientInfo,
    payerName: "Aetna Commercial",
    memberId: "AET-789456123",
    groupNumber: "GRP-2024-0847"
  },
  output: {
    isEligible: true,
    verificationSource: "api",
    memberDetails: {
      memberId: "AET-789456123",
      groupNumber: "GRP-2024-0847",
      planName: "Aetna Choice POS II",
      planType: "PPO",
      effectiveDate: "2024-01-01",
      termDate: undefined
    },
    benefits: {
      deductible: { amount: 500, met: 500 },
      outOfPocketMax: { amount: 6000, met: 1250 },
      coinsurance: 20,
      copay: 50,
      coveragePercentage: 80
    },
    priorAuthRequired: true,
    networkStatus: "in-network",
    payerResponse: {
      transactionId: "TXN-2024-789456",
      responseCode: "Y",
      responseTimestamp: new Date().toISOString()
    }
  }
};

export const mockPreAuthDetermination: PreAuthDeterminationAgentState = {
  id: "agent-004",
  name: "Pre-Auth Determination Agent",
  status: "completed",
  confidence: 0.92,
  reasoning: [
    "Retrieved Aetna orthopedic surgery policy",
    "Evaluated decision tree for CPT 27447",
    "Checked Gold Card eligibility status",
    "Identified required clinical documentation",
    "Generated clinical evidence summary"
  ],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: {
    orderDetails: mockDataOnboarding.output!.orderDetails,
    eligibilityOutput: mockEligibility.output!,
    providerInfo: mockDataOnboarding.output!.providerInfo
  },
  output: {
    decision: "required",
    decisionTree: [
      { node: "Procedure Category", result: "Major Joint Surgery", passed: true },
      { node: "Prior Auth Required?", result: "Yes - Per Policy", passed: true },
      { node: "Gold Card Check", result: "Not Enrolled", passed: false },
      { node: "Emergency Exempt?", result: "No - Routine", passed: false },
      { node: "Network Status", result: "In-Network Provider", passed: true }
    ],
    applicablePolicies: [
      {
        policyId: "AETNA-ORTHO-2024-001",
        policyName: "Orthopedic Surgery Prior Authorization",
        effectiveDate: "2024-01-01",
        criteria: [
          { criterion: "Conservative treatment ≥ 6 months", met: true, evidence: "18 months documented" },
          { criterion: "Physical therapy completed", met: true, evidence: "12-week PT program" },
          { criterion: "Imaging confirms surgical indication", met: true, evidence: "MRI/X-ray on file" },
          { criterion: "Functional assessment documented", met: false, evidence: "WOMAC score missing" },
          { criterion: "BMI < 40 (recommended)", met: false, evidence: "BMI not documented" }
        ]
      }
    ],
    goldCardStatus: {
      enrolled: false,
      eligible: false,
      reason: "Provider has not met volume threshold for auto-approval"
    },
    exemptions: [],
    clinicalSummary: "65-year-old male with 18-month history of progressive right knee osteoarthritis. Failed conservative management including 12 weeks physical therapy, NSAIDs, and three corticosteroid injections. Imaging confirms Kellgren-Lawrence Grade 4 changes with complete joint space narrowing. Functional impairment includes limited ambulation (<100m) and significant ADL limitations.",
    requiredDocuments: ["Clinical Notes", "X-Ray Report", "MRI Report", "PT Records", "Functional Assessment"]
  }
};

export const mockGapAnalysis: GapAnalysisAgentState = {
  id: "agent-005",
  name: "Gap Analysis Agent",
  status: "completed",
  confidence: 0.85,
  reasoning: [
    "Compared documentation against Aetna policy criteria",
    "Evaluated clinical guidelines for TKA",
    "Checked coding accuracy for CPT/ICD",
    "Identified 2 documentation gaps",
    "Calculated overall compliance score"
  ],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: {
    clinicalDocs: mockDataOnboarding.output!.clinicalDocs,
    orderDetails: mockDataOnboarding.output!.orderDetails,
    applicablePolicies: mockPreAuthDetermination.output!.applicablePolicies,
    payerName: "Aetna Commercial"
  },
  output: {
    overallScore: 78,
    complianceChecks: [
      { guideline: "Diagnosis matches procedure", source: "CMS LCD", status: "met", confidence: 0.98 },
      { guideline: "Conservative treatment documented", source: "Aetna Policy", status: "met", confidence: 0.95 },
      { guideline: "Imaging supports indication", source: "AAOS Guidelines", status: "met", confidence: 0.97 },
      { guideline: "Functional assessment complete", source: "Aetna Policy", status: "not-met", confidence: 0.90 },
      { guideline: "BMI documented", source: "Best Practice", status: "not-met", confidence: 0.85 }
    ],
    gaps: [
      {
        id: "gap-001",
        type: "missing-doc",
        severity: "high",
        title: "WOMAC Score Missing",
        description: "Functional assessment score (WOMAC or KOOS) not found in clinical documentation",
        affectedStep: "data-onboarding",
        recommendation: "Request WOMAC score from provider or add to clinical notes",
        autoFixable: false,
        status: "open"
      },
      {
        id: "gap-002",
        type: "insufficient-evidence",
        severity: "medium",
        title: "BMI Not Documented",
        description: "Current BMI not recorded in clinical notes - recommended for surgical candidacy",
        affectedStep: "data-onboarding",
        recommendation: "Document current BMI from recent visit (recommended < 40)",
        autoFixable: false,
        status: "open"
      }
    ],
    nextBestActions: [
      { priority: 1, action: "Request WOMAC score from clinical team", impact: "Increases approval probability by 25%", autoExecutable: false },
      { priority: 2, action: "Add BMI to clinical documentation", impact: "Addresses payer best practice requirement", autoExecutable: false },
      { priority: 3, action: "Proceed with current documentation", impact: "May result in pend for additional info", autoExecutable: true }
    ],
    readyForSubmission: false
  }
};

export const mockCorrection: CorrectionAgentState = {
  id: "agent-006",
  name: "Correction Agent",
  status: "awaiting-input",
  confidence: 0.80,
  reasoning: [
    "Analyzed gaps identified by Gap Analysis Agent",
    "Determined WOMAC score requires human input",
    "BMI can be retrieved from recent lab results",
    "Prepared correction templates for both issues",
    "Awaiting human input for functional assessment"
  ],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: {
    gaps: mockGapAnalysis.output!.gaps,
    currentData: {
      onboarding: mockDataOnboarding.output!,
      eligibility: mockEligibility.output!,
      clinicalSummary: mockPreAuthDetermination.output!.clinicalSummary!
    }
  },
  output: null,
  pendingHumanInput: [
    {
      id: "corr-001",
      gapId: "gap-001",
      type: "human-required",
      field: "functionalAssessment.womacScore",
      originalValue: null,
      correctedValue: null,
      status: "pending"
    },
    {
      id: "corr-002",
      gapId: "gap-002",
      type: "manual",
      field: "patientInfo.bmi",
      originalValue: null,
      correctedValue: null,
      status: "pending"
    }
  ]
};

export const mockReviewer: ReviewerAgentState = {
  id: "agent-007",
  name: "Reviewer Agent",
  status: "idle",
  confidence: 0,
  reasoning: [],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: null,
  output: null,
  awaitingHumanDecision: false
};

export const mockSubmission: SubmissionAgentState = {
  id: "agent-008",
  name: "Submission Agent",
  status: "idle",
  confidence: 0,
  reasoning: [],
  errors: [],
  lastUpdated: new Date().toISOString(),
  input: null,
  output: null
};

export const mockWorkflowOrchestrator: WorkflowOrchestrator = {
  caseId: "CASE-001",
  currentAgent: "correction",
  status: "in-progress",
  agents: {
    dataOnboarding: mockDataOnboarding,
    prioritization: mockPrioritization,
    eligibility: mockEligibility,
    preAuthDetermination: mockPreAuthDetermination,
    gapAnalysis: mockGapAnalysis,
    correction: mockCorrection,
    reviewer: mockReviewer,
    submission: mockSubmission
  },
  auditTrail: [
    { timestamp: "2024-12-20T10:30:00Z", action: "Workflow Started", agent: "Orchestrator", details: "Case CASE-001 initiated" },
    { timestamp: "2024-12-20T10:30:05Z", action: "Data Extraction", agent: "Data Onboarding Agent", details: "5 documents extracted from EHR" },
    { timestamp: "2024-12-20T10:30:15Z", action: "Priority Assigned", agent: "Prioritization Agent", details: "Priority score: 72 (High)" },
    { timestamp: "2024-12-20T10:30:25Z", action: "Eligibility Verified", agent: "Eligibility Agent", details: "Member active, PA required" },
    { timestamp: "2024-12-20T10:30:35Z", action: "Decision Made", agent: "Pre-Auth Determination Agent", details: "Prior auth required per policy" },
    { timestamp: "2024-12-20T10:30:45Z", action: "Gaps Identified", agent: "Gap Analysis Agent", details: "2 gaps found, 78% compliance score" },
    { timestamp: "2024-12-20T10:30:55Z", action: "Awaiting Input", agent: "Correction Agent", details: "Human input required for WOMAC score" }
  ],
  startedAt: "2024-12-20T10:30:00Z"
};
