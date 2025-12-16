import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentRetrievalPanel() {
  const documents = [
    { name: "Clinical Notes - Orthopedic Consult", status: "retrieved", date: "Jan 10, 2024" },
    { name: "MRI Right Knee Report", status: "retrieved", date: "Dec 28, 2023" },
    { name: "X-Ray Imaging Report", status: "retrieved", date: "Dec 15, 2023" },
    { name: "Physical Therapy Notes", status: "retrieved", date: "Nov 30, 2023" },
    { name: "Primary Care Referral Letter", status: "missing", date: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Document Retrieval & Summarization</h3>
        <p className="text-sm text-muted-foreground mb-6">
          AI agents have retrieved and summarized relevant clinical documentation.
        </p>
      </div>

      {/* Agent Status */}
      <AgentStatus name="Clinical Reasoning Agent" state="completed" />

      {/* Document List */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Retrieved Documents</h4>
          </div>
          <StatusBadge variant="warning">1 Missing</StatusBadge>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                doc.status === "missing" ? "border-warning/50 bg-warning-light" : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {doc.status === "retrieved" ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  {doc.date && (
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  )}
                </div>
              </div>
              {doc.status === "retrieved" ? (
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  Request
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium text-foreground mb-4">AI-Generated Clinical Summary</h4>
        <div className="prose prose-sm max-w-none">
          <div className="p-4 rounded-lg bg-primary-light border border-primary/20">
            <p className="text-sm text-foreground leading-relaxed">
              <strong>Patient Presentation:</strong> 68-year-old female with severe right knee osteoarthritis 
              (Kellgren-Lawrence Grade IV) presenting with chronic pain (8/10) and functional limitation. 
              Conservative management including 6 months of physical therapy, NSAIDs, and corticosteroid 
              injections has failed to provide adequate relief.
            </p>
            <p className="text-sm text-foreground leading-relaxed mt-3">
              <strong>Clinical Findings:</strong> Weight-bearing X-rays demonstrate bone-on-bone contact 
              with medial compartment narrowing. MRI confirms complete cartilage loss with subchondral 
              edema and moderate effusion. No contraindications to surgery identified.
            </p>
            <p className="text-sm text-foreground leading-relaxed mt-3">
              <strong>Recommendation:</strong> Total knee arthroplasty is medically necessary per 
              BCBS criteria. Patient meets all clinical thresholds for surgical intervention.
            </p>
          </div>
        </div>
      </div>

      {/* Missing Document Alert */}
      <div className="rounded-xl border-2 border-warning/50 bg-warning-light p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Missing Document Alert</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Primary Care Referral Letter is required by payer policy. Agent has initiated 
              an automated request to Dr. Smith's office.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Track Request Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
