import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { 
  Clock, User, AlertTriangle, TrendingUp, 
  Calendar, CheckCircle2, ArrowRight, Flag 
} from "lucide-react";

export function ReferralPrioritizationPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Referral & Prioritization</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Order prioritization and referral coordinator assignment for pre-auth review
        </p>
      </div>

      <AgentStatus name="Prioritization Agent" state="completed" />

      {/* Priority Score Card */}
      <div className="rounded-xl border-2 border-warning/50 bg-warning-light p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Flag className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Priority: HIGH</h4>
              <p className="text-sm text-muted-foreground">Requires immediate attention</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-warning">87</p>
            <p className="text-xs text-muted-foreground">Priority Score</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 mt-4">
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground">Clinical Urgency</p>
            <p className="text-lg font-semibold text-foreground">High</p>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground">Financial Impact</p>
            <p className="text-lg font-semibold text-foreground">$45,000+</p>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground">Payer Complexity</p>
            <p className="text-lg font-semibold text-foreground">Medium</p>
          </div>
        </div>
      </div>

      {/* AI Priority Scoring Explanation */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Priority Score Breakdown</h4>
        </div>
        
        <div className="space-y-4">
          {[
            { factor: "Procedure Complexity", score: 25, max: 30, reason: "Total knee replacement - Major surgery" },
            { factor: "Patient Age & Comorbidities", score: 18, max: 20, reason: "Age 62, Type 2 DM controlled" },
            { factor: "Surgery Date Urgency", score: 20, max: 25, reason: "Scheduled in 21 days" },
            { factor: "Payer Auth Requirements", score: 15, max: 15, reason: "BCBS requires PA for all TKA" },
            { factor: "Documentation Completeness", score: 9, max: 10, reason: "All required docs available" },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.factor}</span>
                <span className="text-muted-foreground">{item.score}/{item.max}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Coordinator Assignment */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-info" />
          <h4 className="font-medium text-foreground">Referral Coordinator Assigned</h4>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
          <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
            JM
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Jennifer Martinez</p>
            <p className="text-sm text-muted-foreground">Senior Referral Coordinator</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Specialization:</span>
              <StatusBadge variant="info" size="sm">Orthopedics</StatusBadge>
              <StatusBadge variant="info" size="sm">BCBS Expert</StatusBadge>
            </div>
          </div>
          <StatusBadge variant="success">Active</StatusBadge>
        </div>

        <div className="grid gap-3 md:grid-cols-2 mt-4">
          <div className="p-3 rounded-lg border">
            <p className="text-xs text-muted-foreground">Current Workload</p>
            <p className="text-sm font-medium">12 Active Cases</p>
          </div>
          <div className="p-3 rounded-lg border">
            <p className="text-xs text-muted-foreground">Avg. Processing Time</p>
            <p className="text-sm font-medium">2.4 Days</p>
          </div>
        </div>
      </div>

      {/* SLA Timer */}
      <div className="rounded-xl border-2 border-info/30 bg-info-light p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">SLA Timer</h4>
          </div>
          <StatusBadge variant="info">On Track</StatusBadge>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-3 rounded-lg bg-card">
            <p className="text-2xl font-bold text-foreground">18</p>
            <p className="text-xs text-muted-foreground">Days Until Surgery</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-card">
            <p className="text-2xl font-bold text-info">5</p>
            <p className="text-xs text-muted-foreground">Days for PA Decision</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-card">
            <p className="text-2xl font-bold text-success">3</p>
            <p className="text-xs text-muted-foreground">Days Elapsed</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-card">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium">Complete PA submission by Jan 20, 2024</span>
          </div>
        </div>
      </div>

      {/* Workflow Status */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-sm font-medium">Referral assigned and prioritized</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary">
          <span>Proceed to Insurance Verification</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
