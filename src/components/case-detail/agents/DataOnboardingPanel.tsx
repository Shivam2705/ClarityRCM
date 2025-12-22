import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Download,
  Database,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { DataOnboardingAgentState, UploadedFile } from "@/types/agents";
import { useState } from "react";

interface DataOnboardingPanelProps {
  agent: DataOnboardingAgentState;
  isActive: boolean;
  onEdit?: () => void;
}

export function DataOnboardingPanel({ agent, isActive }: DataOnboardingPanelProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [showFileHistory, setShowFileHistory] = useState(false);

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
            <Database className={`h-6 w-6 ${
              agent.status === "completed" ? "text-success" :
              agent.status === "processing" ? "text-primary animate-pulse" :
              "text-muted-foreground"
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">Data ingestion, parsing & extraction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={agent.status === "completed" ? "default" : agent.status === "processing" ? "default" : "secondary"}>
            {agent.status === "completed" ? "Complete" : agent.status === "processing" ? "Processing" : "Idle"}
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {Math.round(agent.confidence * 100)}% Confidence
          </Badge>
        </div>
      </div>

      {/* Input Schema */}
      <Card className="p-4 bg-secondary/20 border-border/50 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Upload className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-medium text-foreground">Input</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Source:</span>
            <span className="ml-2 text-foreground font-medium capitalize">{agent.input?.source?.replace("-", " ") || "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Connection:</span>
            <span className="ml-2 text-foreground font-medium">{agent.input?.ehrConnectionId || "Manual"}</span>
          </div>
        </div>
      </Card>

      {/* Output Schema - Patient Info */}
      {agent.output && (
        <div className="space-y-4">
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Extracted Patient Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DataField label="Name" value={agent.output.patientInfo.name} />
              <DataField label="DOB" value={agent.output.patientInfo.dob} />
              <DataField label="MRN" value={agent.output.patientInfo.mrn} />
              <DataField label="Phone" value={agent.output.patientInfo.phone} />
            </div>
          </Card>

          {/* Provider Info */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Provider Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DataField label="Provider" value={agent.output.providerInfo.name} />
              <DataField label="NPI" value={agent.output.providerInfo.npi} />
              <DataField label="Specialty" value={agent.output.providerInfo.specialty} />
              <DataField label="Facility" value={agent.output.providerInfo.facility} />
            </div>
          </Card>

          {/* Order Details */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <h4 className="text-sm font-medium text-foreground mb-3">Order Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DataField label="Procedure" value={agent.output.orderDetails.procedureName} highlight />
              <DataField label="CPT Code" value={agent.output.orderDetails.cptCode} highlight />
              <DataField label="ICD Codes" value={agent.output.orderDetails.icdCodes.join(", ")} />
              <DataField label="Date of Service" value={agent.output.orderDetails.dateOfService} />
              <DataField label="Urgency" value={agent.output.orderDetails.urgency} capitalize />
            </div>
          </Card>

          {/* Clinical Documents */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Clinical Documents ({agent.output.clinicalDocs.length})
              </h4>
              <Badge variant="outline" className="text-success border-success/30">All Extracted</Badge>
            </div>
            <div className="space-y-2">
              {agent.output.clinicalDocs.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))}
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-4 bg-secondary/20 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Extracted Metadata</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{agent.output.extractedMetadata.totalPages}</div>
                <div className="text-xs text-muted-foreground">Total Pages</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{agent.output.clinicalDocs.length}</div>
                <div className="text-xs text-muted-foreground">Documents</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-success">100%</div>
                <div className="text-xs text-muted-foreground">Extracted</div>
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

      {/* File History */}
      <Card className="p-4 bg-secondary/20 border-border/50 mt-4">
        <button 
          onClick={() => setShowFileHistory(!showFileHistory)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Processing History ({agent.fileHistory.length} files)
          </h4>
          {showFileHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showFileHistory && (
          <div className="mt-3 space-y-2">
            {agent.fileHistory.map((file) => (
              <div key={file.id} className="flex items-center justify-between text-sm p-2 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{file.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{new Date(file.uploadedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Card>
  );
}

function DataField({ label, value, highlight, capitalize }: { 
  label: string; 
  value: string; 
  highlight?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div>
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className={`font-medium ${highlight ? "text-primary" : "text-foreground"} ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function DocumentRow({ document }: { document: UploadedFile }) {
  return (
    <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{document.name}</p>
          <p className="text-xs text-muted-foreground">{document.size} • {document.type.toUpperCase()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-success border-success/30 text-xs">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Extracted
        </Badge>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
