import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  RefreshCw,
  Save
} from "lucide-react";
import { CorrectionAgentState, Correction, Gap } from "@/types/agents";
import { useState } from "react";

interface CorrectionPanelProps {
  agent: CorrectionAgentState;
  gaps: Gap[];
  isActive: boolean;
  onApplyCorrection?: (correctionId: string, value: any) => void;
  onProceed?: () => void;
}

export function CorrectionPanel({ agent, gaps, isActive, onApplyCorrection, onProceed }: CorrectionPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [corrections, setCorrections] = useState<Record<string, string>>({});

  const handleCorrectionChange = (id: string, value: string) => {
    setCorrections(prev => ({ ...prev, [id]: value }));
  };

  const handleApply = (correction: Correction) => {
    const value = corrections[correction.id];
    if (value) {
      onApplyCorrection?.(correction.id, value);
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      {/* Agent Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            agent.status === "completed" ? "bg-success/20" :
            agent.status === "awaiting-input" ? "bg-warning/20 ring-2 ring-warning/30" :
            agent.status === "processing" ? "bg-primary/20 ring-2 ring-primary/30" :
            "bg-muted"
          }`}>
            <Wrench className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "awaiting-input" ? "text-warning" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Autonomous fixes & human input</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={
            agent.status === "completed" ? "default" : 
            agent.status === "awaiting-input" ? "default" : 
            "secondary"
          } className={agent.status === "awaiting-input" ? "bg-warning/20 text-warning" : ""}>
            {agent.status === "completed" ? "Complete" : 
             agent.status === "awaiting-input" ? "Awaiting Input" : 
             "Processing"}
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {Math.round(agent.confidence * 100)}% Confidence
          </Badge>
        </div>
      </div>

      {/* Human Input Required Banner */}
      {agent.status === "awaiting-input" && agent.pendingHumanInput.length > 0 && (
        <Card className="p-4 bg-warning/10 border-warning/30 mb-4">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-warning" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Human Input Required</h4>
              <p className="text-xs text-muted-foreground">
                {agent.pendingHumanInput.length} correction(s) need manual input to proceed
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Pending Corrections */}
      {agent.pendingHumanInput && agent.pendingHumanInput.length > 0 && (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Pending Corrections ({agent.pendingHumanInput.length})
          </h4>
          
          {agent.pendingHumanInput.map((correction) => {
            const relatedGap = gaps.find(g => g.id === correction.gapId);
            return (
              <Card key={correction.id} className="p-4 bg-secondary/20 border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {relatedGap?.title || correction.field}
                      </p>
                      <Badge variant="outline" className={
                        correction.type === "human-required" ? "bg-warning/20 text-warning" :
                        correction.type === "auto" ? "bg-success/20 text-success" :
                        "bg-muted"
                      }>
                        {correction.type === "human-required" ? "Human Required" :
                         correction.type === "auto" ? "Auto-fixable" : "Manual"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {relatedGap?.description || `Update ${correction.field}`}
                    </p>
                  </div>
                </div>

                {/* Input Field */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    {correction.field === "functionalAssessment.womacScore" 
                      ? "Enter WOMAC Score (0-96, lower is better)"
                      : correction.field === "patientInfo.bmi"
                      ? "Enter Current BMI"
                      : `Enter value for ${correction.field}`
                    }
                  </label>
                  {correction.field === "functionalAssessment.womacScore" ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        min="0"
                        max="96"
                        placeholder="e.g., 65"
                        value={corrections[correction.id] || ""}
                        onChange={(e) => handleCorrectionChange(correction.id, e.target.value)}
                        className="bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        WOMAC score measures pain, stiffness, and physical function. Score ≥ 39 typically indicates surgical candidacy.
                      </p>
                    </div>
                  ) : correction.field === "patientInfo.bmi" ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        step="0.1"
                        min="15"
                        max="60"
                        placeholder="e.g., 28.5"
                        value={corrections[correction.id] || ""}
                        onChange={(e) => handleCorrectionChange(correction.id, e.target.value)}
                        className="bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        BMI &lt; 40 is typically recommended for elective TKA. Document current value from recent visit.
                      </p>
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Enter correction value..."
                      value={corrections[correction.id] || ""}
                      onChange={(e) => handleCorrectionChange(correction.id, e.target.value)}
                      className="bg-background"
                    />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={() => handleApply(correction)}
                    disabled={!corrections[correction.id]}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Apply Correction
                  </Button>
                  {correction.type === "auto" && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Auto-Fix
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Applied Corrections */}
      {agent.output?.corrections && agent.output.corrections.length > 0 && (
        <Card className="p-4 bg-success/10 border-success/30 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Applied Corrections ({agent.output.corrections.filter(c => c.status === "applied").length})
          </h4>
          <div className="space-y-2">
            {agent.output.corrections.filter(c => c.status === "applied").map((correction) => (
              <div key={correction.id} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-foreground">{correction.field}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground line-through">{String(correction.originalValue) || "null"}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-success font-medium">{String(correction.correctedValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Audit Log */}
      {agent.output?.auditLog && agent.output.auditLog.length > 0 && (
        <Card className="p-4 bg-secondary/20 border-border/50 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Correction Audit Log</h4>
          <div className="space-y-1 font-mono text-xs">
            {agent.output.auditLog.map((entry, idx) => (
              <div key={idx} className="text-muted-foreground p-1 bg-background/50 rounded">
                {entry}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Proceed Button */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button 
          onClick={onProceed}
          className="flex-1"
          disabled={agent.pendingHumanInput.some(c => c.status === "pending")}
        >
          {agent.pendingHumanInput.some(c => c.status === "pending") 
            ? "Complete All Corrections First" 
            : "Proceed to Review"}
        </Button>
      </div>

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
