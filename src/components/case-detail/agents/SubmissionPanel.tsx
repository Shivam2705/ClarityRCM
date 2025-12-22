import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  CheckCircle2, 
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mail,
  Clock,
  ExternalLink,
  Download,
  Loader2
} from "lucide-react";
import { SubmissionAgentState } from "@/types/agents";
import { useState } from "react";

interface SubmissionPanelProps {
  agent: SubmissionAgentState;
  isActive: boolean;
  onSubmit?: () => void;
  onPreview?: () => void;
}

export function SubmissionPanel({ agent, isActive, onSubmit, onPreview }: SubmissionPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit?.();
    // Simulate submission
    setTimeout(() => setIsSubmitting(false), 2000);
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
            <Send className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Form completion & payer submission</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={agent.status === "completed" ? "default" : "secondary"}>
            {agent.status === "completed" ? "Submitted" : 
             agent.status === "processing" ? "Submitting..." : 
             "Ready"}
          </Badge>
        </div>
      </div>

      {/* Pre-Submission View */}
      {agent.status !== "completed" && agent.input && (
        <div className="space-y-4">
          {/* Submission Method */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Submission Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Payer</span>
                <p className="font-medium text-foreground">{agent.input.payerDetails.payerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Method</span>
                <p className="font-medium text-foreground uppercase">{agent.input.payerDetails.submissionMethod}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Form Type</span>
                <p className="font-medium text-foreground">{agent.input.payerDetails.formType}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Endpoint</span>
                <p className="font-medium text-foreground font-mono text-xs">{agent.input.payerDetails.endpoint || "Portal"}</p>
              </div>
            </div>
          </Card>

          {/* Packet Summary */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Packet</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Prior Auth Request Form</span>
                </div>
                <Badge variant="outline" className="text-success">Auto-filled</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Clinical Documentation (5 files)</span>
                </div>
                <Badge variant="outline" className="text-success">Attached</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Clinical Summary</span>
                </div>
                <Badge variant="outline" className="text-success">Generated</Badge>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onPreview} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Submission
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit to Payer
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Post-Submission View */}
      {agent.output && (
        <div className="space-y-4">
          {/* Success Banner */}
          <Card className="p-4 bg-success/10 border-success/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Successfully Submitted</h4>
                <p className="text-sm text-muted-foreground">
                  Confirmation #: {agent.output.confirmationNumber}
                </p>
              </div>
            </div>
          </Card>

          {/* Submission Details */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Submission ID</span>
                <p className="font-medium text-foreground font-mono">{agent.output.submissionId}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Method</span>
                <p className="font-medium text-foreground uppercase">{agent.output.submissionMethod}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Submitted At</span>
                <p className="font-medium text-foreground">{new Date(agent.output.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Documents</span>
                <p className="font-medium text-foreground">{agent.output.attachedDocuments.length} attached</p>
              </div>
            </div>
          </Card>

          {/* Expected Response */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Expected Response Time</h4>
                <p className="text-sm text-muted-foreground">{agent.output.expectedResponseTime}</p>
              </div>
            </div>
          </Card>

          {/* Notifications Sent */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Notifications Sent
            </h4>
            <div className="space-y-2">
              {agent.output.notificationsSent.map((notification, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-background/50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-foreground">{notification.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{notification.method}</Badge>
                    <span>{new Date(notification.sentAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Download Options */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Submission Record
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Track in Payer Portal
            </Button>
          </div>
        </div>
      )}

      {/* Idle State */}
      {!agent.input && agent.status === "idle" && (
        <Card className="p-8 bg-secondary/20 border-border/50 text-center">
          <Send className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="text-sm font-medium text-foreground">Awaiting Approval</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Complete the review step before submission
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
