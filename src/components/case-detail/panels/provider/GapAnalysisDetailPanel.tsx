import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, CheckCircle2, XCircle, FileText, 
  Lightbulb, ArrowRight, Target, TrendingUp, Sparkles 
} from "lucide-react";

export function GapAnalysisDetailPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Pre-Auth Gap Analysis</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed comparison of clinical documentation against payer guidelines and policies
        </p>
      </div>

      <AgentStatus name="Gap Analysis Agent" state="reasoning" />

      {/* Overall Gap Score */}
      <div className="rounded-xl border-2 border-warning/50 bg-warning-light p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-warning" />
            <div>
              <h4 className="font-semibold text-foreground">Gap Analysis Score</h4>
              <p className="text-sm text-muted-foreground">Documentation vs Policy Requirements</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-warning">78%</p>
            <p className="text-xs text-muted-foreground">Match Score</p>
          </div>
        </div>
        
        <div className="grid gap-3 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-card text-center">
            <p className="text-xl font-bold text-success">12</p>
            <p className="text-xs text-muted-foreground">Criteria Met</p>
          </div>
          <div className="p-3 rounded-lg bg-card text-center">
            <p className="text-xl font-bold text-warning">3</p>
            <p className="text-xs text-muted-foreground">Gaps Found</p>
          </div>
          <div className="p-3 rounded-lg bg-card text-center">
            <p className="text-xl font-bold text-destructive">1</p>
            <p className="text-xs text-muted-foreground">Critical Gap</p>
          </div>
        </div>
      </div>

      {/* Clinical Guidelines Comparison */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Clinical Guidelines Evaluation</h4>
        </div>

        <div className="space-y-3">
          {/* Met Criteria */}
          <div className="p-4 rounded-lg border border-success/30 bg-success-light/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-medium text-foreground">Criteria Met (12)</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                "Radiographic evidence of Grade IV OA",
                "Failed conservative treatment (6+ months)",
                "Failed NSAID therapy",
                "Failed physical therapy (12+ sessions)",
                "Failed injection therapy",
                "BMI within acceptable range (<40)",
                "Cardiac clearance obtained",
                "No active infection",
                "Patient consented",
                "Age-appropriate candidate",
                "Functional impairment documented",
                "Pre-op labs within normal limits",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps Found */}
          <div className="p-4 rounded-lg border border-warning/30 bg-warning-light/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="font-medium text-foreground">Documentation Gaps (3)</span>
            </div>
            <div className="space-y-3">
              {[
                { 
                  gap: "Formal WOMAC assessment form missing", 
                  impact: "Medium",
                  detail: "WOMAC score mentioned in notes but formal assessment form not in records"
                },
                { 
                  gap: "PT discharge summary incomplete", 
                  impact: "Low",
                  detail: "Discharge summary lacks specific outcome measures"
                },
                { 
                  gap: "Duration of symptoms not explicitly stated", 
                  impact: "Low",
                  detail: "Timeline implied but not clearly documented with dates"
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.gap}</span>
                    <StatusBadge 
                      variant={item.impact === "Medium" ? "warning" : "secondary"} 
                      size="sm"
                    >
                      {item.impact} Impact
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Gaps */}
          <div className="p-4 rounded-lg border-2 border-destructive/30 bg-destructive-light">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-foreground">Critical Gap (1)</span>
            </div>
            <div className="p-3 rounded-lg bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-destructive">Peer-to-peer documentation may be requested</span>
                <StatusBadge variant="destructive" size="sm">High Risk</StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on payer historical patterns, BCBS may request peer-to-peer review for TKA cases 
                with WOMAC scores between 60-70. Current extracted score is 68/96.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Alignment */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-info" />
          <h4 className="font-medium text-foreground">Policy Alignment Analysis</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">BCBS Medical Policy TKR-2024-001</p>
              <p className="text-xs text-muted-foreground">Total Knee Arthroplasty Criteria</p>
            </div>
            <div className="flex items-center gap-2">
              <ConfidenceIndicator value={85} size="sm" />
              <StatusBadge variant="success">85% Match</StatusBadge>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">CMS LCD L33967</p>
              <p className="text-xs text-muted-foreground">Local Coverage Determination</p>
            </div>
            <div className="flex items-center gap-2">
              <ConfidenceIndicator value={90} size="sm" />
              <StatusBadge variant="success">90% Match</StatusBadge>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">InterQual 2024 Inpatient Criteria</p>
              <p className="text-xs text-muted-foreground">Clinical Appropriateness</p>
            </div>
            <div className="flex items-center gap-2">
              <ConfidenceIndicator value={78} size="sm" />
              <StatusBadge variant="warning">78% Match</StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggested Next Best Actions */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">AI-Suggested Next Best Actions</h4>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-card border-l-4 border-destructive">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">1. Complete WOMAC Assessment Form</span>
              <StatusBadge variant="destructive" size="sm">Priority: High</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Request formal WOMAC assessment from orthopedic office to strengthen medical necessity documentation.
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Generate Request
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-card border-l-4 border-warning">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">2. Add Explicit Timeline to Notes</span>
              <StatusBadge variant="warning" size="sm">Priority: Medium</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Request addendum to clinical notes specifying exact symptom duration with dates.
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Draft Addendum
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-card border-l-4 border-info">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">3. Prepare Peer-to-Peer Summary</span>
              <StatusBadge variant="info" size="sm">Priority: Recommended</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Pre-emptively prepare talking points for potential peer-to-peer review request.
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Generate Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Continue to Submission */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
        <div>
          <p className="font-medium text-foreground">Ready for Submission</p>
          <p className="text-sm text-muted-foreground">Gaps are minor and non-blocking. Proceed with submission.</p>
        </div>
        <Button className="gap-2">
          Continue to Submission <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
