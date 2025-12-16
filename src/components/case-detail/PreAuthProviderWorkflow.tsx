import { useState } from "react";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { OrderIntakePanel } from "./panels/provider/OrderIntakePanel";
import { ReferralPrioritizationPanel } from "./panels/provider/ReferralPrioritizationPanel";
import { InsuranceEligibilityPanel } from "./panels/provider/InsuranceEligibilityPanel";
import { PolicyDecisionTreePanel } from "./panels/provider/PolicyDecisionTreePanel";
import { DocumentSummaryPanel } from "./panels/provider/DocumentSummaryPanel";
import { GapAnalysisDetailPanel } from "./panels/provider/GapAnalysisDetailPanel";
import { DirectNextActionPanel } from "./panels/provider/DirectNextActionPanel";
import { SubmissionNotificationPanel } from "./panels/provider/SubmissionNotificationPanel";

const providerSteps: WorkflowStep[] = [
  { id: "order-intake", title: "Order & Clinical Intake", description: "EHR data & order creation", status: "completed" },
  { id: "referral", title: "Referral & Prioritization", description: "Priority scoring & assignment", status: "completed" },
  { id: "insurance-eligibility", title: "Insurance & Eligibility", description: "Payer API/portal lookup", status: "completed" },
  { id: "policy-decision", title: "Prior Auth Decision", description: "Policy & Gold Card check", status: "completed" },
  { id: "document-retrieval", title: "Document Retrieval", description: "Medical record summary", status: "completed" },
  { id: "gap-analysis", title: "Gap Analysis", description: "Guidelines comparison", status: "active" },
  { id: "direct-action", title: "Direct Next Action", description: "If PA not required", status: "pending" },
  { id: "submission", title: "Submission & Notification", description: "Payer submission", status: "pending" },
];

export function PreAuthProviderWorkflow() {
  const [currentStep, setCurrentStep] = useState("gap-analysis");

  const renderPanel = () => {
    switch (currentStep) {
      case "order-intake":
        return <OrderIntakePanel />;
      case "referral":
        return <ReferralPrioritizationPanel />;
      case "insurance-eligibility":
        return <InsuranceEligibilityPanel />;
      case "policy-decision":
        return <PolicyDecisionTreePanel />;
      case "document-retrieval":
        return <DocumentSummaryPanel />;
      case "gap-analysis":
        return <GapAnalysisDetailPanel />;
      case "direct-action":
        return <DirectNextActionPanel />;
      case "submission":
        return <SubmissionNotificationPanel />;
      default:
        return <OrderIntakePanel />;
    }
  };

  return (
    <div className="flex gap-6">
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
      <div className="flex-1 min-w-0">
        {renderPanel()}
      </div>
    </div>
  );
}
