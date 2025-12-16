import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, Calendar, ArrowRight, Zap, 
  Phone, Mail, Clock, FileCheck, Sparkles 
} from "lucide-react";

export function DirectNextActionPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Direct Next Best Action</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Prior Authorization NOT required - proceeding directly to scheduling
        </p>
      </div>

      <AgentStatus name="Action Agent" state="completed" />

      {/* No PA Required Banner */}
      <div className="rounded-2xl border-2 border-success/50 bg-success-light p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-foreground">No Prior Authorization Required</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Gold Card exemption applied - skip PA submission and proceed to scheduling
            </p>
          </div>
          <StatusBadge variant="success">Fast Track</StatusBadge>
        </div>
      </div>

      {/* Why No PA Needed */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="h-5 w-5 text-success" />
          <h4 className="font-medium text-foreground">Why Prior Auth Not Required</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">Provider Gold Card Status: Active</p>
              <p className="text-xs text-muted-foreground">Dr. Michael Chen has 94% approval rate for this procedure type</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">Procedure Pre-Approved by Payer</p>
              <p className="text-xs text-muted-foreground">BCBS auto-approves Gold Card providers for routine TKA</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">Member Benefits Include Procedure</p>
              <p className="text-xs text-muted-foreground">Coverage confirmed with no PA requirement flag</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Next Actions */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Recommended Next Steps</h4>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-card border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">Schedule Surgery</span>
              </div>
              <StatusBadge variant="info" size="sm">Next Step</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Contact surgical scheduling to book the procedure date
            </p>
            <Button size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Open Scheduling
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-card border-l-4 border-info">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-info" />
                <span className="text-sm font-semibold">Notify Patient</span>
              </div>
              <StatusBadge variant="default" size="sm">Pending</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Inform patient that surgery can be scheduled without PA delays
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Call Patient
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-card border-l-4 border-success">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-success" />
                <span className="text-sm font-semibold">Send Confirmation</span>
              </div>
              <StatusBadge variant="default" size="sm">Optional</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Send written confirmation of no PA requirement to provider and patient
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </div>

      {/* Time Saved */}
      <div className="rounded-xl border bg-muted p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-success" />
            <div>
              <p className="font-medium text-foreground">Time Saved by Skipping PA</p>
              <p className="text-sm text-muted-foreground">Average PA processing time avoided</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-success">5-7</p>
            <p className="text-xs text-muted-foreground">Business Days</p>
          </div>
        </div>
      </div>

      {/* Complete Workflow */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-success-light border border-success/30">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-success" />
          <div>
            <p className="font-medium text-foreground">Workflow Complete</p>
            <p className="text-sm text-muted-foreground">No further action required for prior authorization</p>
          </div>
        </div>
        <Button variant="success" className="gap-2">
          Mark Complete <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
