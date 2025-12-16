import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { Button } from "@/components/ui/button";
import { 
  Send, CheckCircle2, Clock, FileText, User, 
  Bell, Mail, Phone, Building2, ArrowRight, 
  Loader2, AlertCircle, Calendar, Shield 
} from "lucide-react";

export function SubmissionNotificationPanel() {
  const [submissionStatus, setSubmissionStatus] = useState<"ready" | "submitting" | "submitted">("ready");

  const handleSubmit = () => {
    setSubmissionStatus("submitting");
    setTimeout(() => setSubmissionStatus("submitted"), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Submission & Notification</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Final review and submission to payer with automated notifications
        </p>
      </div>

      <AgentStatus 
        name="Submission Agent" 
        state={submissionStatus === "submitting" ? "decisioning" : submissionStatus === "submitted" ? "completed" : "reasoning"} 
      />

      {/* Submission Status Card */}
      <div className={`rounded-2xl border-2 p-6 ${
        submissionStatus === "submitted" 
          ? "border-success/50 bg-success-light" 
          : "border-primary/30 bg-primary-light"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
            submissionStatus === "submitted" ? "bg-success/20" : "bg-primary/20"
          }`}>
            {submissionStatus === "submitting" ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : submissionStatus === "submitted" ? (
              <CheckCircle2 className="h-8 w-8 text-success" />
            ) : (
              <Send className="h-8 w-8 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-foreground">
              {submissionStatus === "submitted" 
                ? "Prior Auth Submitted" 
                : submissionStatus === "submitting"
                ? "Submitting..."
                : "Ready for Submission"}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {submissionStatus === "submitted"
                ? "Request submitted via BCBS provider portal"
                : "All documentation reviewed and validated"}
            </p>
          </div>
          {submissionStatus === "submitted" && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Confirmation #</p>
              <p className="text-lg font-mono font-bold">PA-2024-00847</p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Summary */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Submission Summary</h4>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="text-sm font-medium">Sarah Johnson (MRN-789456123)</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Procedure</p>
              <p className="text-sm font-medium">Total Knee Arthroplasty (CPT 27447)</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Provider</p>
              <p className="text-sm font-medium">Dr. Michael Chen, MD</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Payer</p>
              <p className="text-sm font-medium">Blue Cross Blue Shield of Texas</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Service Setting</p>
              <p className="text-sm font-medium">Inpatient - Metro General Hospital</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Requested Service Date</p>
              <p className="text-sm font-medium">February 5, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attached Documents */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">Attached Documents</h4>
          </div>
          <StatusBadge variant="success">8 Files Attached</StatusBadge>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {[
            "Clinical Summary (AI-Generated)",
            "MRI Report - Right Knee",
            "X-Ray Report",
            "Physical Therapy Records",
            "Pre-op Clearance",
            "Lab Results",
            "Medication List",
            "Authorization Request Form",
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Channel */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">Submission Channel</h4>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
          <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">BCBS Provider Portal (Availity)</p>
            <p className="text-sm text-muted-foreground">Electronic submission via API integration</p>
          </div>
          <StatusBadge variant="success">Connected</StatusBadge>
        </div>
      </div>

      {/* Submit Button */}
      {submissionStatus === "ready" && (
        <Button onClick={handleSubmit} size="lg" className="w-full gap-2 h-14 text-lg">
          <Send className="h-5 w-5" />
          Submit Prior Authorization Request
        </Button>
      )}

      {/* Post-Submission: Notifications */}
      {submissionStatus === "submitted" && (
        <>
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-warning" />
              <h4 className="font-medium text-foreground">Notifications Sent</h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Michael Chen (Provider)</p>
                    <p className="text-xs text-muted-foreground">Email notification sent</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-success" />
                  <StatusBadge variant="success" size="sm">Sent</StatusBadge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-info-light flex items-center justify-center">
                    <User className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson (Patient)</p>
                    <p className="text-xs text-muted-foreground">SMS & Email notification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-success" />
                  <Mail className="h-4 w-4 text-success" />
                  <StatusBadge variant="success" size="sm">Sent</StatusBadge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Surgical Scheduling</p>
                    <p className="text-xs text-muted-foreground">Internal notification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge variant="success" size="sm">Notified</StatusBadge>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Timeline */}
          <div className="rounded-xl border bg-muted p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-info" />
              <h4 className="font-medium text-foreground">Expected Timeline</h4>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 rounded-lg bg-card text-center">
                <p className="text-2xl font-bold text-foreground">24-48</p>
                <p className="text-xs text-muted-foreground">Hours for Initial Review</p>
              </div>
              <div className="p-3 rounded-lg bg-card text-center">
                <p className="text-2xl font-bold text-foreground">3-5</p>
                <p className="text-xs text-muted-foreground">Days for Decision</p>
              </div>
              <div className="p-3 rounded-lg bg-card text-center">
                <p className="text-2xl font-bold text-info">Feb 5</p>
                <p className="text-xs text-muted-foreground">Target Service Date</p>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium text-foreground">Audit Trail</h4>
            </div>

            <div className="space-y-3">
              {[
                { time: "10:45:32 AM", action: "Prior auth request submitted", user: "System" },
                { time: "10:45:33 AM", action: "Confirmation received from payer", user: "BCBS API" },
                { time: "10:45:35 AM", action: "Provider notification sent", user: "System" },
                { time: "10:45:36 AM", action: "Patient notification sent", user: "System" },
                { time: "10:45:38 AM", action: "Case status updated to 'Submitted'", user: "System" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <span className="text-xs text-muted-foreground font-mono w-24">{item.time}</span>
                  <span className="flex-1">{item.action}</span>
                  <span className="text-xs text-muted-foreground">{item.user}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
