import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  Building2
} from "lucide-react";
import { EligibilityAgentState } from "@/types/agents";
import { useState } from "react";

interface EligibilityPanelProps {
  agent: EligibilityAgentState;
  isActive: boolean;
}

export function EligibilityPanel({ agent, isActive }: EligibilityPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);

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
            <Shield className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Insurance & benefits verification</p>
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

      {/* Eligibility Status Banner */}
      {agent.output && (
        <Card className={`p-4 mb-4 ${agent.output.isEligible ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"}`}>
          <div className="flex items-center gap-3">
            {agent.output.isEligible ? (
              <CheckCircle2 className="h-8 w-8 text-success" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive" />
            )}
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                {agent.output.isEligible ? "Eligibility Verified" : "Eligibility Issue"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Verified via {agent.output.verificationSource.toUpperCase()} • {agent.output.networkStatus.replace("-", " ")}
              </p>
            </div>
            {agent.output.priorAuthRequired && (
              <Badge className="ml-auto bg-warning/20 text-warning border-warning/30">
                Prior Auth Required
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Input Display */}
      <Card className="p-4 bg-secondary/20 border-border/50 mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          Verification Input
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
            <span className="text-muted-foreground text-xs">Member ID</span>
            <p className="font-medium text-foreground">{agent.input?.memberId || "N/A"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Group Number</span>
            <p className="font-medium text-foreground">{agent.input?.groupNumber || "N/A"}</p>
          </div>
        </div>
      </Card>

      {/* Output - Member Details */}
      {agent.output && (
        <div className="space-y-4">
          {/* Member Information */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Member Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Member ID</span>
                <p className="font-medium text-foreground">{agent.output.memberDetails.memberId}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Group Number</span>
                <p className="font-medium text-foreground">{agent.output.memberDetails.groupNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Plan Name</span>
                <p className="font-medium text-foreground">{agent.output.memberDetails.planName}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Plan Type</span>
                <p className="font-medium text-foreground">{agent.output.memberDetails.planType}</p>
              </div>
            </div>
          </Card>

          {/* Coverage Dates */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Coverage Period
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Effective Date</span>
                <p className="font-medium text-foreground">{agent.output.memberDetails.effectiveDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Term Date</span>
                <p className="font-medium text-foreground">{agent.output.memberDetails.termDate || "Active"}</p>
              </div>
            </div>
          </Card>

          {/* Benefits Summary */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Benefits Summary
            </h4>
            <div className="space-y-4">
              {/* Deductible */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Deductible</span>
                  <span className="text-foreground font-medium">
                    ${agent.output.benefits.deductible.met} / ${agent.output.benefits.deductible.amount}
                    {agent.output.benefits.deductible.met >= agent.output.benefits.deductible.amount && (
                      <Badge variant="outline" className="ml-2 text-xs bg-success/20 text-success border-success/30">Met</Badge>
                    )}
                  </span>
                </div>
                <Progress 
                  value={(agent.output.benefits.deductible.met / agent.output.benefits.deductible.amount) * 100} 
                  className="h-2"
                />
              </div>

              {/* Out of Pocket Max */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Out-of-Pocket Max</span>
                  <span className="text-foreground font-medium">
                    ${agent.output.benefits.outOfPocketMax.met} / ${agent.output.benefits.outOfPocketMax.amount}
                  </span>
                </div>
                <Progress 
                  value={(agent.output.benefits.outOfPocketMax.met / agent.output.benefits.outOfPocketMax.amount) * 100} 
                  className="h-2"
                />
              </div>

              {/* Coverage Details */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <div className="text-xl font-bold text-primary">{agent.output.benefits.coveragePercentage}%</div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">{agent.output.benefits.coinsurance}%</div>
                  <div className="text-xs text-muted-foreground">Coinsurance</div>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <div className="text-xl font-bold text-foreground">${agent.output.benefits.copay || 0}</div>
                  <div className="text-xs text-muted-foreground">Copay</div>
                </div>
              </div>
            </div>
          </Card>

          {/* API Response Metadata */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-2">Verification Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Transaction ID</span>
                <p className="font-medium text-foreground font-mono text-xs">{agent.output.payerResponse.transactionId}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Response Code</span>
                <p className="font-medium text-foreground">{agent.output.payerResponse.responseCode} (Active)</p>
              </div>
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
