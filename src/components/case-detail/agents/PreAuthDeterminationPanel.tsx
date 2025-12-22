import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  FileText
} from "lucide-react";
import { PreAuthDeterminationAgentState } from "@/types/agents";
import { useState } from "react";

interface PreAuthDeterminationPanelProps {
  agent: PreAuthDeterminationAgentState;
  isActive: boolean;
}

export function PreAuthDeterminationPanel({ agent, isActive }: PreAuthDeterminationPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [showClinicalSummary, setShowClinicalSummary] = useState(false);

  const decisionColors = {
    required: "bg-warning/10 border-warning/30 text-warning",
    "not-required": "bg-success/10 border-success/30 text-success",
    exempt: "bg-info/10 border-info/30 text-info"
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
            <GitBranch className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Policy analysis & decision tree</p>
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

      {/* Decision Banner */}
      {agent.output && (
        <Card className={`p-4 mb-4 border-2 ${decisionColors[agent.output.decision]}`}>
          <div className="flex items-center gap-3">
            {agent.output.decision === "required" ? (
              <AlertTriangle className="h-8 w-8" />
            ) : agent.output.decision === "not-required" ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <Award className="h-8 w-8" />
            )}
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                Prior Authorization {agent.output.decision === "required" ? "Required" : 
                  agent.output.decision === "not-required" ? "Not Required" : "Exempt"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Based on payer policy and procedure type analysis
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Output */}
      {agent.output && (
        <div className="space-y-4">
          {/* Decision Tree */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              Decision Tree Evaluation
            </h4>
            <div className="space-y-2">
              {agent.output.decisionTree.map((node, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {node.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-foreground">{node.node}</span>
                  </div>
                  <Badge variant="outline" className={node.passed ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                    {node.result}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Applicable Policies */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applicable Policies
            </h4>
            {agent.output.applicablePolicies.map((policy, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{policy.policyName}</p>
                    <p className="text-xs text-muted-foreground">{policy.policyId} • Effective {policy.effectiveDate}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {policy.criteria.map((criterion, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between p-2 bg-background/50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        {criterion.met ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span className="text-foreground">{criterion.criterion}</span>
                      </div>
                      {criterion.evidence && (
                        <span className="text-xs text-muted-foreground">{criterion.evidence}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* Gold Card Status */}
          <Card className={`p-4 ${agent.output.goldCardStatus.enrolled ? "bg-success/10 border-success/30" : "bg-secondary/20 border-border/50"}`}>
            <div className="flex items-center gap-3">
              <Award className={`h-6 w-6 ${agent.output.goldCardStatus.enrolled ? "text-success" : "text-muted-foreground"}`} />
              <div>
                <h4 className="text-sm font-medium text-foreground">Gold Card Status</h4>
                <p className="text-xs text-muted-foreground">
                  {agent.output.goldCardStatus.enrolled ? "Enrolled - Auto-approval eligible" : 
                    agent.output.goldCardStatus.reason || "Not enrolled in Gold Card program"}
                </p>
              </div>
              <Badge variant="outline" className="ml-auto">
                {agent.output.goldCardStatus.enrolled ? "Active" : "Not Enrolled"}
              </Badge>
            </div>
          </Card>

          {/* Clinical Summary */}
          {agent.output.clinicalSummary && (
            <Card className="p-4 bg-primary/10 border-primary/30">
              <button 
                onClick={() => setShowClinicalSummary(!showClinicalSummary)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI-Generated Clinical Summary
                </h4>
                {showClinicalSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showClinicalSummary && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {agent.output.clinicalSummary}
                </p>
              )}
            </Card>
          )}

          {/* Required Documents */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Required Documents for Submission</h4>
            <div className="flex flex-wrap gap-2">
              {agent.output.requiredDocuments.map((doc, idx) => (
                <Badge key={idx} variant="outline" className="bg-background/50">
                  <FileText className="h-3 w-3 mr-1" />
                  {doc}
                </Badge>
              ))}
            </div>
          </Card>
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
