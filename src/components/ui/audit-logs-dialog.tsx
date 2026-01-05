import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  status: "success" | "warning" | "info" | "error";
  details: string;
  duration?: string;
}

interface AuditLogsDialogProps {
  agentName: string;
  lastExecution?: Date;
}

// Mock audit logs data
const mockAuditLogs: Record<string, AuditLog[]> = {
  "Eligibility Agent": [
    {
      id: "1",
      timestamp: new Date("2024-01-15T10:30:00"),
      action: "Started eligibility verification",
      status: "info",
      details: "Initiated member lookup for ID: AET-789456123",
      duration: "0.2s"
    },
    {
      id: "2",
      timestamp: new Date("2024-01-15T10:30:02"),
      action: "Connected to payer system",
      status: "success",
      details: "Successfully connected to Aetna EDI gateway",
      duration: "1.8s"
    },
    {
      id: "3",
      timestamp: new Date("2024-01-15T10:30:05"),
      action: "Retrieved member benefits",
      status: "success",
      details: "Fetched plan details, deductibles, and coverage limits",
      duration: "2.5s"
    },
    {
      id: "4",
      timestamp: new Date("2024-01-15T10:30:08"),
      action: "Verified network status",
      status: "success",
      details: "Provider confirmed as in-network for member's plan",
      duration: "0.8s"
    },
    {
      id: "5",
      timestamp: new Date("2024-01-15T10:30:10"),
      action: "Completed eligibility check",
      status: "success",
      details: "Member eligible with active coverage. Deductible met.",
      duration: "0.3s"
    }
  ],
  "Policy Agent": [
    {
      id: "1",
      timestamp: new Date("2024-01-15T10:31:00"),
      action: "Initiated policy lookup",
      status: "info",
      details: "Searching for applicable policies for CPT 27447",
      duration: "0.1s"
    },
    {
      id: "2",
      timestamp: new Date("2024-01-15T10:31:03"),
      action: "Retrieved payer policies",
      status: "success",
      details: "Found 3 applicable policies for orthopedic procedures",
      duration: "2.8s"
    },
    {
      id: "3",
      timestamp: new Date("2024-01-15T10:31:06"),
      action: "Evaluated decision tree",
      status: "success",
      details: "Processed 8 decision nodes for prior auth determination",
      duration: "1.2s"
    },
    {
      id: "4",
      timestamp: new Date("2024-01-15T10:31:08"),
      action: "Checked Gold Card status",
      status: "warning",
      details: "Provider not enrolled in Gold Card program",
      duration: "0.5s"
    },
    {
      id: "5",
      timestamp: new Date("2024-01-15T10:31:10"),
      action: "Determination complete",
      status: "success",
      details: "Prior authorization required based on policy analysis",
      duration: "0.2s"
    }
  ],
  "Clinical Reasoning Agent": [
    {
      id: "1",
      timestamp: new Date("2024-01-15T10:35:00"),
      action: "Started gap analysis",
      status: "info",
      details: "Analyzing clinical documentation against payer requirements",
      duration: "0.2s"
    },
    {
      id: "2",
      timestamp: new Date("2024-01-15T10:35:05"),
      action: "Reviewed clinical notes",
      status: "success",
      details: "Extracted key clinical findings from 5 documents",
      duration: "4.5s"
    },
    {
      id: "3",
      timestamp: new Date("2024-01-15T10:35:10"),
      action: "Compared against guidelines",
      status: "success",
      details: "Matched clinical data against 12 payer criteria",
      duration: "3.2s"
    },
    {
      id: "4",
      timestamp: new Date("2024-01-15T10:35:15"),
      action: "Identified documentation gaps",
      status: "warning",
      details: "Found 2 gaps: WOMAC score missing, BMI not documented",
      duration: "1.0s"
    },
    {
      id: "5",
      timestamp: new Date("2024-01-15T10:35:18"),
      action: "Generated recommendations",
      status: "success",
      details: "Created action items to address identified gaps",
      duration: "0.8s"
    }
  ],
  "Submission Agent": [
    {
      id: "1",
      timestamp: new Date("2024-01-15T10:40:00"),
      action: "Preparing submission package",
      status: "info",
      details: "Compiling documents and clinical summary for submission",
      duration: "0.3s"
    }
  ]
};

const lastExecutionTimes: Record<string, Date> = {
  "Eligibility Agent": new Date("2024-01-15T10:30:10"),
  "Policy Agent": new Date("2024-01-15T10:31:10"),
  "Clinical Reasoning Agent": new Date("2024-01-15T10:35:18"),
  "Submission Agent": new Date("2024-01-15T10:40:00")
};

export function AuditLogsDialog({ agentName }: AuditLogsDialogProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const logs = mockAuditLogs[agentName] || [];
  const lastExecution = lastExecutionTimes[agentName];

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const getStatusIcon = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusBadge = (status: AuditLog["status"]) => {
    const variants: Record<AuditLog["status"], "default" | "outline" | "secondary" | "destructive"> = {
      success: "default",
      warning: "secondary",
      error: "destructive",
      info: "outline"
    };
    return (
      <Badge variant={variants[status]} className="text-xs">
        {status}
      </Badge>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
          <History className="h-3 w-3 mr-1" />
          Audit Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Audit Logs - {agentName}
          </DialogTitle>
        </DialogHeader>
        
        {/* Last Execution Info */}
        {lastExecution && (
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Execution:</span>
            <span className="text-sm font-medium text-foreground">
              {formatDate(lastExecution)} at {formatTime(lastExecution)}
            </span>
          </div>
        )}

        {/* Logs List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={log.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(log.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {expandedLogs.has(log.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="text-xs font-mono w-16">{formatTime(log.timestamp)}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className="text-sm font-medium text-foreground">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.duration && (
                      <span className="text-xs text-muted-foreground">{log.duration}</span>
                    )}
                    {getStatusBadge(log.status)}
                  </div>
                </button>
                
                {expandedLogs.has(log.id) && (
                  <div className="px-4 pb-3 pt-0 border-t border-border bg-secondary/10">
                    <div className="pt-3">
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Step {index + 1} of {logs.length}</span>
                        {log.duration && <span>Duration: {log.duration}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No audit logs available for this agent</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
