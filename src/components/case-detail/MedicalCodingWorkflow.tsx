import { useState } from "react";
import { useParams } from "react-router-dom";
import { callMedicalCodingApi } from "@/services/medicalCodingApi";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { AgentStatus } from "@/components/ui/agent-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Code2, Search, AlertTriangle, CheckCircle2, 
  MessageSquare, Shield, Download, Play, ChevronRight, ChevronDown,
  Loader2, ThumbsUp, ThumbsDown, Edit3, X, Save, Brain, Link2
} from "lucide-react";

interface LinkedICD {
  code: string;
  description: string;
  confidence: number;
  reasoning: string;
}

interface CPTGroup {
  cpt: { code: string; description: string; confidence: number; reasoning: string };
  icdCodes: LinkedICD[];
}

const mockCPTGroups: CPTGroup[] = [
  {
    cpt: { code: "27447", description: "Total knee arthroplasty", confidence: 99, reasoning: "Primary surgical procedure documented in operative report. Patient consent and surgical order confirm TKA right knee scheduled as definitive treatment after failed conservative management." },
    icdCodes: [
      { code: "M17.11", description: "Primary osteoarthritis, right knee", confidence: 98, reasoning: "Clinical notes document severe OA right knee with Kellgren-Lawrence Grade IV. X-ray confirms bone-on-bone changes. This is the primary diagnosis driving the surgical intervention." },
      { code: "M25.561", description: "Pain in right knee", confidence: 88, reasoning: "Patient reports chronic pain rated 8/10, limiting daily activities. WOMAC pain subscale elevated. Supports medical necessity as a secondary diagnosis." },
      { code: "Z96.651", description: "Presence of right artificial knee joint", confidence: 95, reasoning: "Post-procedure status code required for tracking. Applicable after TKA completion to document prosthetic joint presence." },
    ],
  },
  {
    cpt: { code: "99223", description: "Initial hospital care, high complexity", confidence: 92, reasoning: "Inpatient admission E/M level justified by high-complexity medical decision making: multiple comorbidities (HTN, DM2), surgical admission requiring comprehensive H&P, and moderate risk of complications." },
    icdCodes: [
      { code: "M17.11", description: "Primary osteoarthritis, right knee", confidence: 96, reasoning: "Primary reason for inpatient admission. Severity of OA necessitates surgical management requiring hospital-level care." },
      { code: "E11.9", description: "Type 2 diabetes mellitus without complications", confidence: 85, reasoning: "Documented comorbidity requiring perioperative glucose monitoring. Affects anesthesia risk and post-op management, supporting high-complexity E/M." },
      { code: "I10", description: "Essential hypertension", confidence: 83, reasoning: "Active comorbidity managed during admission. Blood pressure monitoring and medication adjustment documented in admission orders." },
    ],
  },
];

const complianceChecks = [
  { check: "NCCI Edit Check", status: "pass", detail: "No bundling conflicts detected" },
  { check: "MUE Validation", status: "pass", detail: "Units within maximum allowed" },
  { check: "LCD L33967", status: "pass", detail: "Medical necessity criteria met" },
  { check: "NCD 150.3", status: "pass", detail: "Coverage requirements satisfied" },
  { check: "Medical Necessity", status: "warning", detail: "WOMAC score documentation recommended" },
];

export function MedicalCodingWorkflow({ aiSummary }: { aiSummary: string }) {
    const { caseId } = useParams();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["27447", "99223"]);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ code: string; description: string }>({ code: "", description: "" });

  const toggleGroup = (cpt: string) => {
    setExpandedGroups(prev => prev.includes(cpt) ? prev.filter(c => c !== cpt) : [...prev, cpt]);
  };

  const startEdit = (code: string, description: string) => {
    setEditingCode(code);
    setEditValues({ code, description });
  };

  const cancelEdit = () => {
    setEditingCode(null);
    setEditValues({ code: "", description: "" });
  };

  // State for run/rerun button
  const [hasRun, setHasRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);


  const handleRun = async () => {
    setLoading(true);
    setApiResult(null);
    try {
      const result = await callMedicalCodingApi(aiSummary);
      setApiResult(result);
    } catch (err) {
      setApiResult({ error: err?.message || "Unknown error" });
    }
    setHasRun(true);
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left Column */}
      <div className="lg:col-span-4 space-y-6">
        <CaseSummaryPanel />
        <DocumentViewerPanel />
        <QueryBuilderPanel />
      </div>

      {/* Middle Column - Coding Suggestions */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">Coding Suggestions</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={loading}
            className="ml-2"
          >
            {loading ? (
              <span className="flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-1" />{hasRun ? "Rerunning..." : "Running..."}</span>
            ) : (
              hasRun ? "Rerun" : "Run"
            )}
          </Button>
        </div>
        {hasRun && (
          <div className="mt-4 p-3 rounded bg-muted border">
            <h5 className="font-medium mb-2">API Response:</h5>
          </div>
        )}

        <div className="space-y-5">
          {hasRun && apiResult && Array.isArray(apiResult) && apiResult.length > 0
            ? apiResult.map((item, idx) => {
                const isExpanded = expandedGroups.includes(item.cpt_code);
                return (
                  <div key={item.cpt_code} className="rounded-xl border bg-card overflow-hidden">
                    {/* CPT Header */}
                    <button
                      onClick={() => toggleGroup(item.cpt_code)}
                      className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="mt-0.5">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">CPT</span>
                          <span className="font-mono font-semibold text-foreground">{item.cpt_code}</span>
                        </div>
                        <div className="flex flex-col items-start mt-1 ml-7">
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Score</span>
                          <ConfidenceIndicator value={item.cpt_score * 100} size="sm" />
                        </div>
                      </div>
                    </button>

                    {/* AI Reasoning for CPT */}
                    {isExpanded && (
                      <div className="px-4 pb-3">
                        <div className="ml-7 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Brain className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Reasoning</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.justification}</p>
                        </div>
                      </div>
                    )}

                    {/* Linked ICD-10 Codes */}
                    {isExpanded && (
                      <div className="border-t">
                        <div className="px-4 py-2 bg-muted/30">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Linked ICD-10 Codes</span>
                        </div>
                        <div className="divide-y">
                          {item.icd_link.map((icd, icdIdx) => (
                            <div key={icdIdx} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                              <div className="ml-7">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">ICD-10</span>
                                    <span className="font-mono font-semibold text-sm text-foreground">{icd.icd10_code.code}</span>
                                  </div>
                                  <div className="flex flex-col items-start mt-1 ml-7">
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Score</span>
                                    <ConfidenceIndicator value={icd.icd10_code.score * 100} size="sm" />
                                  </div>
                                </div>
                                <div className="mt-2 p-2.5 rounded-md bg-muted/50 border">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Brain className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Description</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{icd.icd10_code.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            : mockCPTGroups.map((group) => {
                const isExpanded = expandedGroups.includes(group.cpt.code);
                return (
                  <div key={group.cpt.code} className="rounded-xl border bg-card overflow-hidden">
                    {/* ...existing code... */}
                  </div>
                );
              })}
        </div>

        {/* Human Override Panel */}
        <div className="rounded-xl border bg-card p-5">
          <h4 className="font-medium text-foreground mb-4">Human Override / Add Custom Code</h4>
          <div className="flex gap-2">
            <Input placeholder="Enter code (e.g., 99213)" className="flex-1" />
            <Button variant="outline">Add Code</Button>
          </div>
          <Textarea placeholder="Justification for manual override (required)..." className="mt-3" />
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-3 space-y-6">
        <CompliancePanel />
        <BatchPanel />
        <ExportPanel groupCount={mockCPTGroups.length} />
      </div>
    </div>
  );
}

/* ── Extracted Sub-components ── */

function CaseSummaryPanel() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h4 className="font-medium text-foreground mb-4">Case Summary</h4>
      <div className="space-y-3 text-sm">
        <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-medium">Sarah Johnson (PT-78234)</p></div>
        <div><p className="text-xs text-muted-foreground">Provider</p><p className="font-medium">Dr. Michael Chen</p></div>
        <div><p className="text-xs text-muted-foreground">Encounter</p><p className="font-medium">Inpatient Surgery</p></div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-muted-foreground">Coding Status</span>
          <StatusBadge variant="pa-review">In Progress</StatusBadge>
        </div>
      </div>
    </div>
  );
}

function DocumentViewerPanel() {
  return (
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
      <div className="p-3 rounded-lg bg-muted/50 border">
        <p className="text-xs text-muted-foreground mb-2">OCR Extracted Text (Clinical Notes)</p>
        <p className="text-xs text-foreground leading-relaxed">
          <span className="bg-primary/10 px-1 rounded">68 y/o female</span> with severe 
          <span className="bg-warning/10 px-1 rounded mx-1">right knee osteoarthritis</span> 
          (K-L Grade IV). Conservative management failed. Scheduled for 
          <span className="bg-success/10 px-1 rounded mx-1">total knee replacement</span>.
        </p>
      </div>
    </div>
  );
}

function QueryBuilderPanel() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-info" />
        <h4 className="font-medium text-foreground">Query Builder</h4>
      </div>
      <div className="p-3 rounded-lg bg-info/5 border border-info/20 mb-4">
        <p className="text-xs font-medium text-info mb-1">Auto-Generated Query</p>
        <p className="text-sm text-foreground">Please provide WOMAC functional assessment score to support medical necessity documentation.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">Edit Query</Button>
        <Button variant="default" size="sm" className="flex-1">Send to Provider</Button>
      </div>
    </div>
  );
}

function CompliancePanel() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h4 className="font-medium text-foreground">Compliance Validation</h4>
      </div>
      <div className="space-y-2">
        {complianceChecks.map((check) => (
          <div key={check.check} className={`p-3 rounded-lg ${check.status === "pass" ? "bg-success/5" : "bg-warning/5"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{check.check}</span>
              {check.status === "pass" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
            </div>
            <p className="text-xs text-muted-foreground">{check.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BatchPanel() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-info" />
        <h4 className="font-medium text-foreground">Batch Execution</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Process multiple cases at once</p>
      <Button variant="outline" className="w-full"><Loader2 className="h-4 w-4 mr-2" />Run Batch Coding</Button>
    </div>
  );
}

function ExportPanel({ groupCount }: { groupCount: number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Download className="h-5 w-5 text-success" />
        <h4 className="font-medium text-foreground">Export Codes</h4>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">{groupCount} CPT groups with linked ICD-10 codes</p>
      </div>
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start"><Code2 className="h-4 w-4 mr-2" /> Export as JSON</Button>
        <Button variant="outline" size="sm" className="w-full justify-start"><FileText className="h-4 w-4 mr-2" /> Export as FHIR</Button>
        <Button variant="outline" size="sm" className="w-full justify-start"><FileText className="h-4 w-4 mr-2" /> Export as CSV</Button>
      </div>
      <div className="mt-4 pt-4 border-t">
        <Button variant="hero" className="w-full">Send to Pre-Auth Agent</Button>
      </div>
    </div>
  );
}
