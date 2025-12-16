import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GapAnalysisPanel() {
  const guidelines = [
    {
      criterion: "Documented failed conservative treatment (6+ months)",
      status: "met",
      evidence: "Physical therapy records show 6 months of treatment ending Nov 2023",
      confidence: 98,
    },
    {
      criterion: "Radiographic evidence of severe OA (K-L Grade III/IV)",
      status: "met",
      evidence: "X-ray report confirms Kellgren-Lawrence Grade IV",
      confidence: 99,
    },
    {
      criterion: "Functional impairment documented (WOMAC/KOOS scores)",
      status: "gap",
      evidence: "WOMAC score not documented in clinical notes",
      confidence: 45,
    },
    {
      criterion: "BMI within acceptable range (<40)",
      status: "met",
      evidence: "BMI documented as 28.5 in recent visit",
      confidence: 100,
    },
    {
      criterion: "No active infection",
      status: "met",
      evidence: "CBC and CRP within normal limits",
      confidence: 97,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Gap Analysis</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Comparison of clinical evidence against payer medical necessity guidelines.
        </p>
      </div>

      {/* Agent Status */}
      <AgentStatus name="Policy Agent" state="completed" />

      {/* Summary Card */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Medical Necessity Criteria</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">4/5 criteria met</span>
            <StatusBadge variant="warning">1 Gap Found</StatusBadge>
          </div>
        </div>

        <div className="space-y-3">
          {guidelines.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                item.status === "gap" 
                  ? "border-warning/50 bg-warning-light" 
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {item.status === "met" ? (
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.criterion}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.evidence}</p>
                  </div>
                </div>
                <ConfidenceIndicator value={item.confidence} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gap Details */}
      <div className="rounded-xl border-2 border-warning/50 bg-warning-light p-5">
        <div className="flex items-start gap-3 mb-4">
          <XCircle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Documentation Gap Identified</h4>
            <p className="text-sm text-muted-foreground mt-1">
              WOMAC or KOOS functional assessment score is required by BCBS policy but was not 
              found in the submitted documentation.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-card">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">AI Suggested Action</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Request WOMAC functional assessment from ordering provider. Based on documented 
            pain levels (8/10) and ADL limitations, expected score would likely meet threshold 
            for medical necessity.
          </p>
        </div>
      </div>

      {/* Next Best Actions */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Next Best Actions</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary">
                1
              </div>
              <span className="text-sm text-foreground">Request WOMAC assessment from provider</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary">
                2
              </div>
              <span className="text-sm text-foreground">Generate peer-to-peer request template</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary">
                3
              </div>
              <span className="text-sm text-foreground">Submit with available documentation + appeal letter</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="default">Request WOMAC Score</Button>
          <Button variant="outline">Proceed to Submission</Button>
        </div>
      </div>
    </div>
  );
}
