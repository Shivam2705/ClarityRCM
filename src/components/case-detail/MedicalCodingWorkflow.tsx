import { useState } from "react";
import { callMedicalCodingApi, MedicalCodingResponse, AgentOp } from "@/services/medicalCodingApi";
import { HumanOverridePanel } from "./HumanOverridePanel";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getClinicalData } from "@/data/clinicalData";
import { 
  FileText, AlertTriangle, CheckCircle2, 
  ChevronRight, ChevronDown,
  Loader2, Brain, Quote
} from "lucide-react";

export interface SelectedCode {
  type: "CPT" | "ICD-10";
  code: string;
  description: string;
  confidence: number;
  parentCpt?: string;
}

interface MedicalCodingWorkflowProps {
  aiSummary: string;
  caseId: string;
  selectedCodes: SelectedCode[];
  onSelectedCodesChange: (codes: SelectedCode[]) => void;
  onApprove: (codes: SelectedCode[]) => void;
}

export function MedicalCodingWorkflow({ aiSummary, caseId, selectedCodes, onSelectedCodesChange, onApprove }: MedicalCodingWorkflowProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<MedicalCodingResponse | null>(null);

  const clinicalData = getClinicalData(caseId);

  const toggleGroup = (cpt: string) => {
    setExpandedGroups(prev => prev.includes(cpt) ? prev.filter(c => c !== cpt) : [...prev, cpt]);
  };

  const handleRun = async () => {
    setLoading(true);
    setApiResult(null);
    try {
      const result = await callMedicalCodingApi(aiSummary);
      setApiResult(result);
      // Auto-expand all groups
      if (result.agent_op) {
        setExpandedGroups(result.agent_op.map(op => op.cpt_code));
      }
    } catch (err: any) {
      console.error(err);
    }
    setHasRun(true);
    setLoading(false);
  };

  const isCodeSelected = (type: "CPT" | "ICD-10", code: string) => {
    return selectedCodes.some(sc => sc.type === type && sc.code === code);
  };

  const toggleCode = (codeItem: SelectedCode) => {
    if (isCodeSelected(codeItem.type, codeItem.code)) {
      onSelectedCodesChange(selectedCodes.filter(sc => !(sc.type === codeItem.type && sc.code === codeItem.code)));
    } else {
      onSelectedCodesChange([...selectedCodes, codeItem]);
    }
  };

  const toggleCptWithIcds = (item: AgentOp) => {
    const cptSelected = isCodeSelected("CPT", item.cpt_code);
    if (cptSelected) {
      const icdCodes = item.icd_link.map(i => i.icd10_code.code);
      onSelectedCodesChange(selectedCodes.filter(sc => 
        !(sc.type === "CPT" && sc.code === item.cpt_code) && 
        !(sc.type === "ICD-10" && icdCodes.includes(sc.code) && sc.parentCpt === item.cpt_code)
      ));
    } else {
      const newCodes: SelectedCode[] = [
        { type: "CPT", code: item.cpt_code, description: item.definition, confidence: Math.round(item.cpt_score * 100) },
        ...item.icd_link.map(icd => ({ type: "ICD-10" as const, code: icd.icd10_code.code, description: icd.icd10_code.description, confidence: Math.round(icd.icd10_code.score * 100), parentCpt: item.cpt_code }))
      ];
      const existing = selectedCodes.filter(sc => 
        !(sc.type === "CPT" && sc.code === item.cpt_code) && 
        !(sc.type === "ICD-10" && item.icd_link.map(i => i.icd10_code.code).includes(sc.code) && sc.parentCpt === item.cpt_code)
      );
      onSelectedCodesChange([...existing, ...newCodes]);
    }
  };

  const agentOps = apiResult?.agent_op || [];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left Column - Coding Suggestions */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">Coding Suggestions</h3>
          <div className="flex items-center gap-2">
            {selectedCodes.length > 0 && (
              <span className="text-xs text-muted-foreground">{selectedCodes.length} codes selected</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-1" />{hasRun ? "Rerunning..." : "Running..."}</span>
              ) : (
                hasRun ? "Rerun" : "Run"
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(selectedCodes)}
              disabled={selectedCodes.length === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </div>
        </div>

        {!hasRun && !loading && (
          <div className="rounded-xl border bg-card p-8 text-center">
            <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Click <strong>Run</strong> to analyze the clinical summary and generate coding suggestions.</p>
          </div>
        )}

        {hasRun && agentOps.length > 0 && (
          <div className="space-y-5">
            {agentOps.map((item) => {
              const isExpanded = expandedGroups.includes(item.cpt_code);
              return (
                <div key={item.cpt_code} className="rounded-xl border bg-card overflow-hidden">
                  <div className="flex items-start gap-3 p-4">
                    <Checkbox
                      checked={isCodeSelected("CPT", item.cpt_code)}
                      onCheckedChange={() => toggleCptWithIcds(item)}
                      className="mt-1"
                    />
                    <button
                      onClick={() => toggleGroup(item.cpt_code)}
                      className="flex-1 flex items-start gap-3 text-left hover:bg-muted/30 transition-colors rounded"
                    >
                      <div className="mt-0.5">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">CPT</span>
                          <span className="font-mono font-semibold text-foreground">{item.cpt_code}</span>
                          <span className="text-sm text-muted-foreground">{item.definition}</span>
                        </div>
                        <div className="flex flex-col items-start mt-1 ml-7">
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Score</span>
                          <ConfidenceIndicator value={Math.round(item.cpt_score * 100)} size="sm" />
                        </div>
                      </div>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-3">
                      <div className="ml-11 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Brain className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-medium text-primary">AI Reasoning</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.justification}</p>
                      </div>
                    </div>
                  )}
                  {isExpanded && (
                    <div className="border-t">
                      <div className="px-4 py-2 bg-muted/30">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Linked ICD-10 Codes</span>
                      </div>
                      <div className="divide-y">
                        {item.icd_link.map((icd, icdIdx) => (
                          <div key={icdIdx} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                            <div className="ml-11 flex items-start gap-3">
                              <Checkbox
                                checked={isCodeSelected("ICD-10", icd.icd10_code.code)}
                                onCheckedChange={() => toggleCode({ type: "ICD-10", code: icd.icd10_code.code, description: icd.icd10_code.description, confidence: Math.round(icd.icd10_code.score * 100), parentCpt: item.cpt_code })}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">ICD-10</span>
                                    <span className="font-mono font-semibold text-sm text-foreground">{icd.icd10_code.code}</span>
                                    <span className="text-xs text-muted-foreground">{icd.icd10_code.description}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Score</span>
                                    <ConfidenceIndicator value={Math.round(icd.icd10_code.score * 100)} size="sm" />
                                  </div>
                                </div>
                                <div className="mt-2 p-2.5 rounded-md bg-muted/50 border">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Brain className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Matched Text</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed italic">"{icd.text}"</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Human Override Panel */}
        <HumanOverridePanel selectedCodes={selectedCodes} onSelectedCodesChange={onSelectedCodesChange} />
      </div>

      {/* Right Column - Citation from Summary */}
      <div className="lg:col-span-5 space-y-6">
        <CitationPanel 
          aiSummary={aiSummary} 
          clinicalData={clinicalData} 
          markdown={apiResult?.markdown || null} 
        />
      </div>
    </div>
  );
}

/* ── Citation Sub-component ── */

function CitationPanel({ aiSummary, clinicalData, markdown }: { aiSummary: string; clinicalData: any; markdown: string | null }) {
  // Convert markdown string with <mark> tags to highlighted HTML
  const renderMarkdown = (md: string) => {
    // Replace \n with <br> and keep <mark> tags
    const html = md
      .replace(/\n/g, "<br/>")
      .replace(/<mark>/g, '<mark style="background-color: #fde68a; padding: 1px 3px; border-radius: 2px;">')
    return html;
  };

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Quote className="h-5 w-5 text-primary" />
        <h4 className="font-medium text-foreground">Citation from Summary</h4>
      </div>

      {/* AI-generated Markdown Citation */}
      {markdown ? (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Clinical Summary with Highlights</span>
          </div>
          <div 
            className="text-sm text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-muted/30 border border-border mb-4 text-center py-8">
          <Quote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Run the coding agent to generate citations from the clinical summary.</p>
        </div>
      )}

      {/* Key Clinical Citations */}
      <div className="space-y-3">
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Clinical Citations</h5>
        
        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">Primary Dx</span>
          </div>
          <p className="text-sm font-medium text-foreground">{clinicalData.primaryDiagnosis}</p>
          <p className="text-xs text-muted-foreground mt-1">ICD-10: {clinicalData.icdCode || "N/A"} · Severity: {clinicalData.severity}</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">Comorbidities</span>
          </div>
          <ul className="space-y-1">
            {clinicalData.comorbidities.map((c: string) => (
              <li key={c} className="text-xs text-foreground flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">Allergies</span>
          </div>
          <ul className="space-y-1">
            {clinicalData.allergies.map((a: string) => (
              <li key={a} className="text-xs text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">Medications</span>
          </div>
          <ul className="space-y-1">
            {clinicalData.medications.map((m: string) => (
              <li key={m} className="text-xs text-foreground flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 mb-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Source Documents</span>
          </div>
          <ul className="space-y-1.5">
            {clinicalData.documents.map((doc: any) => (
              <li key={doc.name} className="text-xs text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  {doc.name}
                </span>
                <span className="text-muted-foreground">{doc.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
