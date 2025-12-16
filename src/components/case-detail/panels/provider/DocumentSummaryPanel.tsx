import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { 
  FileText, Download, Eye, CheckCircle2, AlertCircle, 
  FileSearch, Sparkles, Clock, Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentSummaryPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Document Retrieval & Summarization</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Medical documents retrieved and AI-summarized for pre-authorization submission
        </p>
      </div>

      <AgentStatus name="Document Agent" state="completed" />

      {/* Document Collection Status */}
      <div className="rounded-xl border-2 border-success/30 bg-success-light p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-success" />
            <div>
              <h4 className="font-semibold text-foreground">Documents Retrieved</h4>
              <p className="text-sm text-muted-foreground">All required documents collected</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-success">8/8</p>
            <p className="text-xs text-muted-foreground">Documents</p>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Retrieved Documents</h4>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download All
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { name: "Clinical Progress Notes", type: "PDF", pages: 12, status: "reviewed", source: "Epic EHR" },
            { name: "MRI Right Knee Report", type: "PDF", pages: 4, status: "reviewed", source: "Radiology PACS" },
            { name: "X-Ray Images & Report", type: "DICOM", pages: 6, status: "reviewed", source: "Radiology PACS" },
            { name: "Physical Therapy Records", type: "PDF", pages: 8, status: "reviewed", source: "PT Portal" },
            { name: "Lab Results Panel", type: "PDF", pages: 3, status: "reviewed", source: "Lab System" },
            { name: "Pre-op Clearance Letter", type: "PDF", pages: 2, status: "reviewed", source: "Cardiology" },
            { name: "Medication List", type: "PDF", pages: 1, status: "reviewed", source: "Epic EHR" },
            { name: "Insurance Authorization Form", type: "PDF", pages: 2, status: "pending", source: "Manual Upload" },
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type} • {doc.pages} pages • {doc.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge 
                  variant={doc.status === "reviewed" ? "success" : "warning"} 
                  size="sm"
                >
                  {doc.status === "reviewed" ? "Reviewed" : "Pending"}
                </StatusBadge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Generated Summary */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">AI-Generated Clinical Summary</h4>
          <StatusBadge variant="info" size="sm">Auto-Generated</StatusBadge>
        </div>

        <div className="p-4 rounded-lg bg-muted space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Patient Overview</p>
            <p className="text-sm text-foreground">
              62-year-old female with severe right knee osteoarthritis (Kellgren-Lawrence Grade IV) 
              presenting for total knee arthroplasty after failure of conservative management.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Clinical History</p>
            <p className="text-sm text-foreground">
              Patient has experienced progressive knee pain for 3+ years with significant functional 
              decline. Failed treatments include: NSAIDs (6 months), physical therapy (6 months, 
              18 sessions), viscosupplementation (3 injections), and corticosteroid injections (2 injections).
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Imaging Findings</p>
            <p className="text-sm text-foreground">
              MRI demonstrates complete loss of articular cartilage in medial compartment with 
              bone-on-bone contact, subchondral cyst formation, and Grade IV changes. X-ray confirms 
              joint space narrowing &gt;75%, osteophyte formation, and varus deformity of 8 degrees.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Functional Assessment</p>
            <p className="text-sm text-foreground">
              WOMAC score: 68/96 (significant impairment). Patient reports difficulty with ADLs 
              including walking &gt;1 block, climbing stairs, and prolonged standing. Pain level: 7-8/10 
              with activity, 4/10 at rest.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Medical Clearance</p>
            <p className="text-sm text-foreground">
              Pre-operative evaluation complete. Cardiology clearance obtained. BMI 28.4 (acceptable). 
              Type 2 DM well-controlled (HbA1c 5.8%). No contraindications to surgery identified.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Generated in 12 seconds</span>
          </div>
          <ConfidenceIndicator value={94} size="sm" />
        </div>
      </div>

      {/* Missing Documents Alert */}
      <div className="rounded-xl border border-warning/30 bg-warning-light p-5">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="h-5 w-5 text-warning" />
          <h4 className="font-medium text-foreground">Documentation Gaps Identified</h4>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span className="text-sm">WOMAC Assessment Form</span>
            </div>
            <StatusBadge variant="warning" size="sm">Recommended</StatusBadge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm">Physical Therapy Discharge Summary</span>
            </div>
            <StatusBadge variant="success" size="sm">Found in Notes</StatusBadge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Note: Missing WOMAC form data was extracted from clinical notes. Consider formal assessment 
          for stronger documentation.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-xl bg-muted text-center">
          <p className="text-2xl font-bold text-foreground">38</p>
          <p className="text-xs text-muted-foreground">Total Pages</p>
        </div>
        <div className="p-4 rounded-xl bg-muted text-center">
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-xs text-muted-foreground">Documents</p>
        </div>
        <div className="p-4 rounded-xl bg-muted text-center">
          <p className="text-2xl font-bold text-foreground">94%</p>
          <p className="text-xs text-muted-foreground">Completeness</p>
        </div>
        <div className="p-4 rounded-xl bg-muted text-center">
          <p className="text-2xl font-bold text-success">Ready</p>
          <p className="text-xs text-muted-foreground">For Submission</p>
        </div>
      </div>
    </div>
  );
}
