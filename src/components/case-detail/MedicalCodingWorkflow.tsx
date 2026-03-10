import { useState } from "react";
import { callMedicalCodingApi } from "@/services/medicalCodingApi";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getClinicalData } from "@/data/clinicalData";
import { 
  FileText, AlertTriangle, CheckCircle2, 
  ChevronRight, ChevronDown,
  Loader2, Brain, Quote
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

export interface SelectedCode {
  type: "CPT" | "ICD-10";
  code: string;
  description: string;
  confidence: number;
  parentCpt?: string;
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

interface MedicalCodingWorkflowProps {
  aiSummary: string;
  caseId: string;
  selectedCodes: SelectedCode[];
  onSelectedCodesChange: (codes: SelectedCode[]) => void;
  onApprove: (codes: SelectedCode[]) => void;
}

export function MedicalCodingWorkflow({ aiSummary, caseId, selectedCodes, onSelectedCodesChange, onApprove }: MedicalCodingWorkflowProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["27447", "99223"]);
  const [hasRun, setHasRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);

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
    } catch (err: any) {
      setApiResult({ error: err?.message || "Unknown error" });
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

  const toggleCptWithIcds = (group: CPTGroup) => {
    const cptSelected = isCodeSelected("CPT", group.cpt.code);
    if (cptSelected) {
      // Remove CPT and all its linked ICDs
      const icdCodes = group.icdCodes.map(i => i.code);
      onSelectedCodesChange(selectedCodes.filter(sc => 
        !(sc.type === "CPT" && sc.code === group.cpt.code) && 
        !(sc.type === "ICD-10" && icdCodes.includes(sc.code) && sc.parentCpt === group.cpt.code)
      ));
    } else {
      // Add CPT and all its linked ICDs
      const newCodes: SelectedCode[] = [
        { type: "CPT", code: group.cpt.code, description: group.cpt.description, confidence: group.cpt.confidence },
        ...group.icdCodes.map(icd => ({ type: "ICD-10" as const, code: icd.code, description: icd.description, confidence: icd.confidence, parentCpt: group.cpt.code }))
      ];
      const existing = selectedCodes.filter(sc => 
        !(sc.type === "CPT" && sc.code === group.cpt.code) && 
        !(sc.type === "ICD-10" && group.icdCodes.map(i => i.code).includes(sc.code) && sc.parentCpt === group.cpt.code)
      );
      onSelectedCodesChange([...existing, ...newCodes]);
    }
  };

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

        {hasRun && apiResult && !Array.isArray(apiResult) && (
          <div className="mt-4 p-3 rounded bg-muted border">
            <h5 className="font-medium mb-2">API Response:</h5>
          </div>
        )}

        <div className="space-y-5">
          {hasRun && apiResult && Array.isArray(apiResult) && apiResult.length > 0
            ? apiResult.map((item: any) => {
                const isExpanded = expandedGroups.includes(item.cpt_code);
                return (
                  <div key={item.cpt_code} className="rounded-xl border bg-card overflow-hidden">
                    <div className="flex items-start gap-3 p-4">
                      <Checkbox
                        checked={isCodeSelected("CPT", item.cpt_code)}
                        onCheckedChange={() => toggleCode({ type: "CPT", code: item.cpt_code, description: item.justification || "", confidence: item.cpt_score * 100 })}
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
                          </div>
                          <div className="flex flex-col items-start mt-1 ml-7">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Score</span>
                            <ConfidenceIndicator value={item.cpt_score * 100} size="sm" />
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
                          {item.icd_link.map((icd: any, icdIdx: number) => (
                            <div key={icdIdx} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                              <div className="ml-11 flex items-start gap-3">
                                <Checkbox
                                  checked={isCodeSelected("ICD-10", icd.icd10_code.code)}
                                  onCheckedChange={() => toggleCode({ type: "ICD-10", code: icd.icd10_code.code, description: icd.icd10_code.description, confidence: icd.icd10_code.score * 100, parentCpt: item.cpt_code })}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">ICD-10</span>
                                      <span className="font-mono font-semibold text-sm text-foreground">{icd.icd10_code.code}</span>
                                    </div>
                                    <div className="flex flex-col items-start mt-1">
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
                    <div className="flex items-start gap-3 p-4">
                      <Checkbox
                        checked={isCodeSelected("CPT", group.cpt.code)}
                        onCheckedChange={() => toggleCptWithIcds(group)}
                        className="mt-1"
                      />
                      <button
                        onClick={() => toggleGroup(group.cpt.code)}
                        className="flex-1 flex items-start gap-3 text-left hover:bg-muted/30 transition-colors rounded"
                      >
                        <div className="mt-0.5">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">CPT</span>
                            <span className="font-mono font-semibold text-foreground">{group.cpt.code}</span>
                            <span className="text-sm text-muted-foreground">{group.cpt.description}</span>
                          </div>
                          <div className="flex flex-col items-start mt-1 ml-7">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Confidence</span>
                            <ConfidenceIndicator value={group.cpt.confidence} size="sm" />
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
                          <p className="text-xs text-muted-foreground leading-relaxed">{group.cpt.reasoning}</p>
                        </div>
                      </div>
                    )}
                    {isExpanded && (
                      <div className="border-t">
                        <div className="px-4 py-2 bg-muted/30">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Linked ICD-10 Codes</span>
                        </div>
                        <div className="divide-y">
                          {group.icdCodes.map((icd) => (
                            <div key={icd.code} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                              <div className="ml-11 flex items-start gap-3">
                                <Checkbox
                                  checked={isCodeSelected("ICD-10", icd.code)}
                                  onCheckedChange={() => toggleCode({ type: "ICD-10", code: icd.code, description: icd.description, confidence: icd.confidence, parentCpt: group.cpt.code })}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">ICD-10</span>
                                      <span className="font-mono font-semibold text-sm text-foreground">{icd.code}</span>
                                      <span className="text-xs text-muted-foreground">{icd.description}</span>
                                    </div>
                                    <ConfidenceIndicator value={icd.confidence} size="sm" />
                                  </div>
                                  <div className="mt-2 p-2.5 rounded-md bg-muted/50 border">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <Brain className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reasoning</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{icd.reasoning}</p>
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

        {/* Human Override Panel */}
        <HumanOverridePanel selectedCodes={selectedCodes} onSelectedCodesChange={onSelectedCodesChange} />
      </div>

      {/* Right Column - Citation from Summary */}
      <div className="lg:col-span-5 space-y-6">
        <CitationPanel aiSummary={aiSummary} clinicalData={clinicalData} />
      </div>
    </div>
  );
}

/* ── Citation Sub-component ── */

function CitationPanel({ aiSummary, clinicalData }: { aiSummary: string; clinicalData: any }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Quote className="h-5 w-5 text-primary" />
        <h4 className="font-medium text-foreground">Citation from Summary</h4>
      </div>

      {/* AI Summary Citation */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Patient Summary</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{aiSummary}</p>
      </div>

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
