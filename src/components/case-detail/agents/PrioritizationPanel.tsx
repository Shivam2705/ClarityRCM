import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Bell,
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from "lucide-react";
import { PrioritizationAgentState } from "@/types/agents";
import { useState } from "react";

interface PrioritizationPanelProps {
  agent: PrioritizationAgentState;
  isActive: boolean;
}

export function PrioritizationPanel({ agent, isActive }: PrioritizationPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  const priorityColors = {
    low: "text-muted-foreground bg-muted",
    medium: "text-warning bg-warning/20",
    high: "text-orange-500 bg-orange-500/20",
    urgent: "text-destructive bg-destructive/20"
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
            <ArrowUpCircle className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Case prioritization & triage</p>
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

      {/* Input Display */}
      <Card className="p-4 bg-secondary/20 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Prioritization Inputs
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Patient</span>
            <p className="font-medium text-foreground">{agent.input?.patientInfo.name || "N/A"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Payer</span>
            <p className="font-medium text-foreground">{agent.input?.payerName || "N/A"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Procedure</span>
            <p className="font-medium text-foreground">{agent.input?.orderDetails.procedureName || "N/A"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Diagnosis Severity</span>
            <p className="font-medium text-foreground capitalize">{agent.input?.diagnosisSeverity || "N/A"}</p>
          </div>
        </div>
      </Card>

      {/* Output - Priority Score */}
      {agent.output && (
        <div className="space-y-4">
          {/* Main Priority Display */}
          <Card className={`p-6 border-2 ${
            agent.output.priorityLevel === "urgent" ? "bg-destructive/10 border-destructive/30" :
            agent.output.priorityLevel === "high" ? "bg-orange-500/10 border-orange-500/30" :
            agent.output.priorityLevel === "medium" ? "bg-warning/10 border-warning/30" :
            "bg-secondary/20 border-border/50"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Priority Assessment</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-4xl font-bold text-foreground">{agent.output.priorityScore}</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
              </div>
              <Badge className={`text-lg px-4 py-2 uppercase ${priorityColors[agent.output.priorityLevel]}`}>
                {agent.output.priorityLevel}
              </Badge>
            </div>
            <Progress value={agent.output.priorityScore} className="h-3" />
          </Card>

          {/* Scoring Factors */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-4">Scoring Factors</h4>
            <div className="space-y-3">
              {agent.output.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{factor.factor}</span>
                    <span className="text-xs text-muted-foreground">({Math.round(factor.weight * 100)}% weight)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={factor.score} className="w-24 h-2" />
                    <span className="text-sm font-medium text-foreground w-8">{factor.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Action */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Recommended Action</h4>
                <p className="text-sm text-muted-foreground mt-1">{agent.output.recommendedAction}</p>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <div className="flex items-center gap-4">
            <Card className={`flex-1 p-3 ${agent.output.coordinatorNotified ? "bg-success/10 border-success/30" : "bg-secondary/20 border-border/50"}`}>
              <div className="flex items-center gap-2">
                <Bell className={`h-4 w-4 ${agent.output.coordinatorNotified ? "text-success" : "text-muted-foreground"}`} />
                <span className="text-sm text-foreground">Coordinator Notified</span>
                {agent.output.coordinatorNotified && <CheckCircle2 className="h-4 w-4 text-success ml-auto" />}
              </div>
            </Card>
            <Card className={`flex-1 p-3 ${agent.output.escalationRequired ? "bg-warning/10 border-warning/30" : "bg-secondary/20 border-border/50"}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${agent.output.escalationRequired ? "text-warning" : "text-muted-foreground"}`} />
                <span className="text-sm text-foreground">Escalation Required</span>
                {!agent.output.escalationRequired && <span className="text-xs text-muted-foreground ml-auto">No</span>}
              </div>
            </Card>
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
