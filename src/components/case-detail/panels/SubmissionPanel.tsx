import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { CheckCircle2, Send, Bell, FileCheck, Clock, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmissionPanel() {
  const auditTrail = [
    { action: "Case created", user: "System", timestamp: "Jan 12, 2024 9:00 AM" },
    { action: "Clinical data ingested", user: "EHR Agent", timestamp: "Jan 12, 2024 9:02 AM" },
    { action: "Eligibility verified", user: "Eligibility Agent", timestamp: "Jan 12, 2024 9:05 AM" },
    { action: "Prior auth determination completed", user: "Policy Agent", timestamp: "Jan 12, 2024 9:08 AM" },
    { action: "Gap analysis completed", user: "Clinical Reasoning Agent", timestamp: "Jan 12, 2024 9:15 AM" },
    { action: "Documents compiled for submission", user: "System", timestamp: "Jan 15, 2024 10:30 AM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Submission & Notification</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Final submission to payer with automated notifications to all stakeholders.
        </p>
      </div>

      {/* Agent Status */}
      <AgentStatus name="Submission Agent" state="decisioning" />

      {/* Submission Status */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary-light p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
            <FileCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">Ready for Submission</h4>
            <p className="text-sm text-muted-foreground">All required documents compiled</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Submission Method</p>
            <p className="text-sm font-medium text-foreground">Electronic (Portal)</p>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Target Payer</p>
            <p className="text-sm font-medium text-foreground">Blue Cross Blue Shield</p>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Est. Response Time</p>
            <p className="text-sm font-medium text-foreground">2-3 Business Days</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="hero" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Submit to Payer
          </Button>
          <Button variant="outline" size="lg">
            Preview Submission
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-info" />
          <h4 className="font-medium text-foreground">Notification Recipients</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Dr. Michael Chen</p>
                <p className="text-xs text-muted-foreground">Ordering Provider</p>
              </div>
            </div>
            <StatusBadge variant="info" dot={false}>Email + Portal</StatusBadge>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Patient</p>
              </div>
            </div>
            <StatusBadge variant="info" dot={false}>Patient Portal</StatusBadge>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Metro General Hospital</p>
                <p className="text-xs text-muted-foreground">Facility</p>
              </div>
            </div>
            <StatusBadge variant="info" dot={false}>API Callback</StatusBadge>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h4 className="font-medium text-foreground">Audit Trail</h4>
        </div>

        <div className="space-y-1">
          {auditTrail.map((entry, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              <div className="mt-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                </div>
                <p className="text-xs text-muted-foreground">{entry.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
