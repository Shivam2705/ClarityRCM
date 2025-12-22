import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { GapAnalysisAgentState, Gap } from "@/types/agents";
import { useState } from "react";

interface GapAnalysisPanelProps {
  agent: GapAnalysisAgentState;
  isActive: boolean;
  onFixGap?: (gapId: string) => void;
  onProceed?: () => void;
}

export function GapAnalysisPanel({ agent, isActive, onFixGap, onProceed }: GapAnalysisPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  const severityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning",
    high: "bg-orange-500/20 text-orange-500",
    critical: "bg-destructive/20 text-destructive"
  };

  const statusColors = {
    met: "text-success",
    "not-met": "text-destructive",
    partial: "text-warning"
  };

  return (
    <Card className="p-6 bg-card border-border">
      {/* Agent Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            agent.status === "completed" ? "bg-success/20" :
            agent.status === "processing" ? "bg-primary/20 ring-2 ring-primary/30" :
            "bg-muted"
          }`}>
            <Search className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Compliance & gap identification</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={agent.status === "completed" ? "default" : "secondary"}>
            {agent.status === "completed" ? "Complete" : "Processing"}
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {Math.round(agent.confidence * 100)}% Confidence
          </Badge>
        </div>
      </div>

      {/* Output */}
      {agent.output && (
        <div className="space-y-4">
          {/* Overall Score */}
          <Card className={`p-4 border-2 ${
            agent.output.overallScore >= 90 ? "bg-success/10 border-success/30" :
            agent.output.overallScore >= 70 ? "bg-warning/10 border-warning/30" :
            "bg-destructive/10 border-destructive/30"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Compliance Score</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-bold text-foreground">{agent.output.overallScore}</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={agent.output.readyForSubmission ? "default" : "secondary"}>
                  {agent.output.readyForSubmission ? "Ready to Submit" : "Gaps Found"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {agent.output.gaps.filter(g => g.status === "open").length} open gaps
                </p>
              </div>
            </div>
            <Progress value={agent.output.overallScore} className="h-3" />
          </Card>

          {/* Compliance Checks */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-4">Compliance Checks</h4>
            <div className="space-y-2">
              {agent.output.complianceChecks.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {check.status === "met" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : check.status === "partial" ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <div>
                      <span className="text-sm text-foreground">{check.guideline}</span>
                      <span className="text-xs text-muted-foreground ml-2">({check.source})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={check.confidence * 100} className="w-16 h-2" />
                    <Badge variant="outline" className={statusColors[check.status]}>
                      {check.status === "met" ? "Met" : check.status === "partial" ? "Partial" : "Not Met"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Identified Gaps */}
          {agent.output.gaps.length > 0 && (
            <Card className="p-4 bg-warning/5 border-warning/30">
              <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Identified Gaps ({agent.output.gaps.length})
              </h4>
              <div className="space-y-3">
                {agent.output.gaps.map((gap) => (
                  <GapCard key={gap.id} gap={gap} onFix={() => onFixGap?.(gap.id)} />
                ))}
              </div>
            </Card>
          )}

          {/* Next Best Actions */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              AI-Recommended Next Actions
            </h4>
            <div className="space-y-2">
              {agent.output.nextBestActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{action.priority}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{action.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.impact}</p>
                  </div>
                  {action.autoExecutable && (
                    <Badge variant="outline" className="text-xs">Auto</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              onClick={onProceed}
              className="flex-1"
              disabled={!agent.output.readyForSubmission && agent.output.gaps.filter(g => g.status === "open").length > 0}
            >
              {agent.output.readyForSubmission ? "Proceed to Correction" : "Resolve Gaps First"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Reasoning Log */}
      <Card className="p-4 bg-secondary/20 border-border/50 mt-4">
        <button 
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Agent Reasoning ({agent.reasoning.length} steps)
          </h4>
          {showReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showReasoning && (
          <div className="mt-3 space-y-2">
            {agent.reasoning.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span className="text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Card>
  );
}

function GapCard({ gap, onFix }: { gap: Gap; onFix: () => void }) {
  const severityColors = {
    low: "bg-muted/50 text-muted-foreground border-muted",
    medium: "bg-warning/10 text-warning border-warning/30",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    critical: "bg-destructive/10 text-destructive border-destructive/30"
  };

  return (
    <Card className={`p-3 border ${severityColors[gap.severity]}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{gap.title}</p>
            <Badge variant="outline" className="text-xs capitalize">{gap.severity}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{gap.description}</p>
        </div>
        {gap.status === "open" && (
          <Button variant="outline" size="sm" onClick={onFix}>
            Fix
          </Button>
        )}
        {gap.status === "resolved" && (
          <Badge className="bg-success/20 text-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )}
      </div>
      <div className="flex items-start gap-2 p-2 bg-background/50 rounded-lg mt-2">
        <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground">{gap.recommendation}</p>
      </div>
    </Card>
  );
}
