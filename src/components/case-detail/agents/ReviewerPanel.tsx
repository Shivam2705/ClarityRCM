import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Eye
} from "lucide-react";
import { ReviewerAgentState, RiskFlag } from "@/types/agents";
import { useState } from "react";

interface ReviewerPanelProps {
  agent: ReviewerAgentState;
  isActive: boolean;
  onApprove?: (comments?: string) => void;
  onReject?: (comments: string) => void;
  onEdit?: (field: string) => void;
}

export function ReviewerPanel({ agent, isActive, onApprove, onReject, onEdit }: ReviewerPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [comments, setComments] = useState("");
  const [showFullPacket, setShowFullPacket] = useState(false);

  const riskColors = {
    info: "bg-info/10 border-info/30 text-info",
    warning: "bg-warning/10 border-warning/30 text-warning",
    critical: "bg-destructive/10 border-destructive/30 text-destructive"
  };

  const riskIcons = {
    info: Info,
    warning: AlertTriangle,
    critical: AlertCircle
  };

  return (
    <Card className="p-6 bg-card border-border">
      {/* Agent Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            agent.status === "completed" ? "bg-success/20" :
            agent.status === "human-review" ? "bg-primary/20 ring-2 ring-primary/30" :
            agent.status === "processing" ? "bg-primary/20" :
            "bg-muted"
          }`}>
            <UserCheck className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "human-review" ? "text-primary animate-pulse" :
              agent.status === "processing" ? "text-primary" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Human-in-the-loop final review</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={
            agent.status === "completed" ? "default" : 
            agent.status === "human-review" ? "default" : 
            "secondary"
          } className={agent.status === "human-review" ? "bg-primary/20 text-primary" : ""}>
            {agent.status === "completed" ? "Approved" : 
             agent.status === "human-review" ? "Awaiting Review" : 
             agent.awaitingHumanDecision ? "Decision Required" :
             "Idle"}
          </Badge>
        </div>
      </div>

      {/* Human Review Required Banner */}
      {(agent.awaitingHumanDecision || agent.status === "human-review") && (
        <Card className="p-4 bg-primary/10 border-primary/30 mb-4">
          <div className="flex items-center gap-3">
            <UserCheck className="h-6 w-6 text-primary" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Human Review Required</h4>
              <p className="text-xs text-muted-foreground">
                Please review the complete prior authorization packet and make a decision
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Review Content */}
      {agent.input && (
        <div className="space-y-4">
          {/* Confidence Score */}
          {agent.output && (
            <Card className={`p-4 border-2 ${
              agent.output.confidenceScore >= 90 ? "bg-success/10 border-success/30" :
              agent.output.confidenceScore >= 70 ? "bg-warning/10 border-warning/30" :
              "bg-destructive/10 border-destructive/30"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">AI Confidence Score</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-4xl font-bold text-foreground">{agent.output.confidenceScore}</span>
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>
                </div>
                <Badge variant={agent.output.readyForSubmission ? "default" : "secondary"}>
                  {agent.output.readyForSubmission ? "Ready for Submission" : "Needs Review"}
                </Badge>
              </div>
              <Progress value={agent.output.confidenceScore} className="h-3" />
            </Card>
          )}

          {/* Risk Flags */}
          {agent.output?.riskFlags && agent.output.riskFlags.length > 0 && (
            <Card className="p-4 bg-secondary/20 border-border/50">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Risk Flags ({agent.output.riskFlags.length})
              </h4>
              <div className="space-y-2">
                {agent.output.riskFlags.map((flag, idx) => {
                  const Icon = riskIcons[flag.level];
                  return (
                    <div key={idx} className={`flex items-start gap-2 p-2 rounded-lg border ${riskColors[flag.level]}`}>
                      <Icon className="h-4 w-4 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{flag.category}</p>
                        <p className="text-xs opacity-80">{flag.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Full Packet Summary */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <button 
              onClick={() => setShowFullPacket(!showFullPacket)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Full Prior Auth Packet
              </h4>
              {showFullPacket ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {showFullPacket && agent.input.fullPacket && (
              <div className="mt-4 space-y-4">
                {/* Patient Info */}
                <div className="p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase">Patient Information</h5>
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.("patient")}>
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> {agent.input.fullPacket.patientInfo.name}</div>
                    <div><span className="text-muted-foreground">DOB:</span> {agent.input.fullPacket.patientInfo.dob}</div>
                    <div><span className="text-muted-foreground">MRN:</span> {agent.input.fullPacket.patientInfo.mrn}</div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase">Order Details</h5>
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.("order")}>
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Procedure:</span> {agent.input.fullPacket.orderDetails.procedureName}</div>
                    <div><span className="text-muted-foreground">CPT:</span> {agent.input.fullPacket.orderDetails.cptCode}</div>
                    <div><span className="text-muted-foreground">ICD:</span> {agent.input.fullPacket.orderDetails.icdCodes.join(", ")}</div>
                    <div><span className="text-muted-foreground">DOS:</span> {agent.input.fullPacket.orderDetails.dateOfService}</div>
                  </div>
                </div>

                {/* Eligibility Summary */}
                <div className="p-3 bg-background/50 rounded-lg">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase mb-2">Eligibility</h5>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm">
                      {agent.input.fullPacket.eligibility.memberDetails.planName} - 
                      {agent.input.fullPacket.eligibility.networkStatus.replace("-", " ")}
                    </span>
                  </div>
                </div>

                {/* Decision Summary */}
                <div className="p-3 bg-background/50 rounded-lg">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase mb-2">Prior Auth Decision</h5>
                  <Badge className="bg-warning/20 text-warning">
                    Prior Auth {agent.input.fullPacket.determination.decision}
                  </Badge>
                </div>
              </div>
            )}
          </Card>

          {/* Reviewer Comments */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Reviewer Comments (Optional)</h4>
            <Textarea
              placeholder="Add any comments or notes about this review..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="bg-background"
              rows={3}
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              onClick={() => onApprove?.(comments)}
              className="flex-1 bg-success hover:bg-success/90"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve & Proceed
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onReject?.(comments)}
              className="flex-1"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject / Request Changes
            </Button>
          </div>
        </div>
      )}

      {/* Idle State */}
      {!agent.input && agent.status === "idle" && (
        <Card className="p-8 bg-secondary/20 border-border/50 text-center">
          <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="text-sm font-medium text-foreground">Awaiting Previous Steps</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Complete all corrections before proceeding to review
          </p>
        </Card>
      )}

      {/* Reasoning Log */}
      {agent.reasoning.length > 0 && (
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
      )}
    </Card>
  );
}
