import { useState } from "react";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { ClinicalIntakePanel } from "./panels/ClinicalIntakePanel";
import { ReferralPanel } from "./panels/ReferralPanel";
import { EligibilityPanel } from "./panels/EligibilityPanel";
import { PriorAuthDecisionPanel } from "./panels/PriorAuthDecisionPanel";
import { DocumentRetrievalPanel } from "./panels/DocumentRetrievalPanel";
import { GapAnalysisPanel } from "./panels/GapAnalysisPanel";
import { SubmissionPanel } from "./panels/SubmissionPanel";

const providerSteps: WorkflowStep[] = [
  { id: "clinical-intake", title: "Order & Clinical Intake", description: "EHR data collection", status: "completed" },
  { id: "referral", title: "Referral & Prioritization", description: "Priority scoring", status: "completed" },
  { id: "eligibility", title: "Insurance & Eligibility", description: "Payer verification", status: "completed" },
  { id: "prior-auth-decision", title: "Prior Auth Decision", description: "Policy analysis", status: "completed" },
  { id: "document-retrieval", title: "Document Retrieval", description: "Clinical summary", status: "completed" },
  { id: "gap-analysis", title: "Gap Analysis", description: "Guideline comparison", status: "active" },
  { id: "submission", title: "Submission & Notification", description: "Payer submission", status: "pending" },
];

export function PreAuthProviderWorkflow() {
  const [currentStep, setCurrentStep] = useState("gap-analysis");

  const renderPanel = () => {
    switch (currentStep) {
      case "clinical-intake":
        return <ClinicalIntakePanel />;
      case "referral":
        return <ReferralPanel />;
      case "eligibility":
        return <EligibilityPanel />;
      case "prior-auth-decision":
        return <PriorAuthDecisionPanel />;
      case "document-retrieval":
        return <DocumentRetrievalPanel />;
      case "gap-analysis":
        return <GapAnalysisPanel />;
      case "submission":
        return <SubmissionPanel />;
      default:
        return <ClinicalIntakePanel />;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Steps sidebar */}
      <div className="w-72 shrink-0">
        <div className="sticky top-24 rounded-xl border bg-card p-4">
          <h4 className="text-sm font-semibold text-foreground mb-4">Provider Workflow</h4>
          <WorkflowSteps
            steps={providerSteps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 min-w-0">
        {renderPanel()}
      </div>
    </div>
  );
}
