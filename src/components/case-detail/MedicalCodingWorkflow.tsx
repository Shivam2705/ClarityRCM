import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { AgentStatus } from "@/components/ui/agent-status";
import { Button } from "@/components/ui/button";
import { 
  FileText, Code2, Search, AlertTriangle, CheckCircle2, 
  MessageSquare, Shield, Download, Play, ChevronRight,
  Loader2, ThumbsUp, ThumbsDown, Edit3
} from "lucide-react";

interface CodeSuggestion {
  code: string;
  description: string;
  type: "ICD-10" | "CPT" | "HCPCS";
  confidence: number;
  rationale: string;
  evidence: string;
}

const mockCodes: CodeSuggestion[] = [
  { code: "M17.11", description: "Primary osteoarthritis, right knee", type: "ICD-10", confidence: 98, rationale: "Documented severe OA right knee with K-L Grade IV", evidence: "Clinical notes, X-ray report" },
  { code: "27447", description: "Total knee arthroplasty", type: "CPT", confidence: 99, rationale: "Primary procedure - TKA right knee", evidence: "Surgical order, consent" },
  { code: "Z96.651", description: "Presence of right artificial knee joint", type: "ICD-10", confidence: 95, rationale: "Post-procedure status code", evidence: "Procedure completion" },
  { code: "99223", description: "Initial hospital care, high complexity", type: "CPT", confidence: 92, rationale: "Inpatient admission E/M", evidence: "H&P documentation" },
];

const complianceChecks = [
  { check: "NCCI Edit Check", status: "pass", detail: "No bundling conflicts detected" },
  { check: "MUE Validation", status: "pass", detail: "Units within maximum allowed" },
  { check: "LCD L33967", status: "pass", detail: "Medical necessity criteria met" },
  { check: "NCD 150.3", status: "pass", detail: "Coverage requirements satisfied" },
  { check: "Medical Necessity", status: "warning", detail: "WOMAC score documentation recommended" },
];

export function MedicalCodingWorkflow() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(["M17.11", "27447"]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left Column - Case Summary & Document Viewer */}
      <div className="lg:col-span-4 space-y-6">
        {/* Case Summary */}
        <div className="rounded-xl border bg-card p-5">
          <h4 className="font-medium text-foreground mb-4">Case Summary</h4>
          <div className="space-y-3 text-sm">
            <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-medium">Sarah Johnson (PT-78234)</p></div>
            <div><p className="text-xs text-muted-foreground">Provider</p><p className="font-medium">Dr. Michael Chen</p></div>
            <div><p className="text-xs text-muted-foreground">Encounter</p><p className="font-medium">Inpatient Surgery</p></div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-muted-foreground">Coding Status</span>
              <StatusBadge variant="review">In Progress</StatusBadge>
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Document & Evidence Viewer</h4>
            <Button variant="ghost" size="sm"><Search className="h-4 w-4" /></Button>
          </div>
          
          <div className="space-y-2 mb-4">
            {["Clinical Notes", "Operative Report", "Discharge Summary", "Pathology Report"].map((doc) => (
              <button key={doc} className="w-full flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 text-left text-sm transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{doc}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* OCR Text Preview */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground mb-2">OCR Extracted Text (Clinical Notes)</p>
            <p className="text-xs text-foreground leading-relaxed">
              <span className="bg-primary-light px-1 rounded">68 y/o female</span> with severe 
              <span className="bg-warning-light px-1 rounded mx-1">right knee osteoarthritis</span> 
              (K-L Grade IV). Conservative management failed. Scheduled for 
              <span className="bg-success-light px-1 rounded mx-1">total knee replacement</span>.
            </p>
          </div>
        </div>

        {/* Query Builder */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">Query Builder</h4>
          </div>
          
          <div className="p-3 rounded-lg bg-info-light border border-info/20 mb-4">
            <p className="text-xs font-medium text-info mb-1">Auto-Generated Query</p>
            <p className="text-sm text-foreground">Please provide WOMAC functional assessment score to support medical necessity documentation.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">Edit Query</Button>
            <Button variant="default" size="sm" className="flex-1">Send to Provider</Button>
          </div>
        </div>
      </div>

      {/* Middle Column - Coding Suggestions */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Coding Suggestions</h3>
          <AgentStatus name="Coding Agent" state="completed" />
        </div>

        <div className="space-y-4">
          {mockCodes.map((code) => (
            <div
              key={code.code}
              className={`rounded-xl border p-4 transition-all ${
                selectedCodes.includes(code.code) 
                  ? "border-primary bg-primary-light" 
                  : "bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    code.type === "ICD-10" ? "bg-info-light text-info" :
                    code.type === "CPT" ? "bg-success-light text-success" :
                    "bg-warning-light text-warning"
                  }`}>
                    {code.type}
                  </div>
                  <span className="font-mono font-semibold text-foreground">{code.code}</span>
                </div>
                <ConfidenceIndicator value={code.confidence} size="sm" />
              </div>

              <p className="text-sm text-foreground mb-2">{code.description}</p>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Rationale:</span> {code.rationale}</p>
                <p><span className="font-medium">Evidence:</span> {code.evidence}</p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Button 
                  variant={selectedCodes.includes(code.code) ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCodes(prev => 
                    prev.includes(code.code) 
                      ? prev.filter(c => c !== code.code)
                      : [...prev, code.code]
                  )}
                >
                  {selectedCodes.includes(code.code) ? (
                    <><CheckCircle2 className="h-4 w-4 mr-1" /> Selected</>
                  ) : (
                    <><ThumbsUp className="h-4 w-4 mr-1" /> Accept</>
                  )}
                </Button>
                <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4 mr-1" /> Modify</Button>
                <Button variant="ghost" size="sm"><ThumbsDown className="h-4 w-4 mr-1" /> Reject</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Human Override Panel */}
        <div className="rounded-xl border bg-card p-5">
          <h4 className="font-medium text-foreground mb-4">Human Override / Add Custom Code</h4>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter code (e.g., 99213)" 
              className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
            />
            <Button variant="outline">Add Code</Button>
          </div>
          <textarea 
            placeholder="Justification for manual override (required)..." 
            className="w-full mt-3 p-3 rounded-lg border bg-background text-sm min-h-20"
          />
        </div>
      </div>

      {/* Right Column - Compliance & Export */}
      <div className="lg:col-span-3 space-y-6">
        {/* Compliance Validation */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Compliance Validation</h4>
          </div>

          <div className="space-y-2">
            {complianceChecks.map((check) => (
              <div key={check.check} className={`p-3 rounded-lg ${
                check.status === "pass" ? "bg-success-light" : "bg-warning-light"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{check.check}</span>
                  {check.status === "pass" ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Batch Mode */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">Batch Execution</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Process multiple cases at once</p>
          <Button variant="outline" className="w-full">
            <Loader2 className="h-4 w-4 mr-2" />
            Run Batch Coding
          </Button>
        </div>

        {/* Export Panel */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-5 w-5 text-success" />
            <h4 className="font-medium text-foreground">Export Codes</h4>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">Selected: {selectedCodes.length} codes</p>
          </div>

          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Code2 className="h-4 w-4 mr-2" /> Export as JSON
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" /> Export as FHIR
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" /> Export as CSV
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button variant="hero" className="w-full">
              Send to Pre-Auth Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
