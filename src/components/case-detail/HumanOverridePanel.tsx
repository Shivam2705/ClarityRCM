import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { SelectedCode } from "./MedicalCodingWorkflow";

interface HumanOverridePanelProps {
  selectedCodes: SelectedCode[];
  onSelectedCodesChange: (codes: SelectedCode[]) => void;
}

export function HumanOverridePanel({ selectedCodes, onSelectedCodesChange }: HumanOverridePanelProps) {
  const [cptCode, setCptCode] = useState("");
  const [cptDescription, setCptDescription] = useState("");
  const [icdEntries, setIcdEntries] = useState<{ code: string; description: string }[]>([{ code: "", description: "" }]);
  const [justification, setJustification] = useState("");

  const addIcdEntry = () => setIcdEntries(prev => [...prev, { code: "", description: "" }]);

  const removeIcdEntry = (idx: number) => setIcdEntries(prev => prev.filter((_, i) => i !== idx));

  const updateIcdEntry = (idx: number, field: "code" | "description", value: string) => {
    setIcdEntries(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };

  const handleAdd = () => {
    const newCodes: SelectedCode[] = [];

    if (cptCode.trim()) {
      newCodes.push({ type: "CPT", code: cptCode.trim(), description: cptDescription.trim() || "Manual entry", confidence: 100 });
    }

    icdEntries.forEach(entry => {
      if (entry.code.trim()) {
        newCodes.push({
          type: "ICD-10",
          code: entry.code.trim(),
          description: entry.description.trim() || "Manual entry",
          confidence: 100,
          parentCpt: cptCode.trim() || undefined,
        });
      }
    });

    if (newCodes.length === 0) return;

    onSelectedCodesChange([...selectedCodes, ...newCodes]);
    setCptCode("");
    setCptDescription("");
    setIcdEntries([{ code: "", description: "" }]);
    setJustification("");
  };

  const canAdd = cptCode.trim() || icdEntries.some(e => e.code.trim());

  return (
    <div className="rounded-xl border bg-card p-5">
      <h4 className="font-medium text-foreground mb-4">Human Override / Add Custom Code</h4>

      {/* CPT Code */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">CPT</Badge>
          <span className="text-xs text-muted-foreground">Procedure Code</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="CPT code (e.g., 99213)" value={cptCode} onChange={e => setCptCode(e.target.value)} />
          <Input placeholder="Description" value={cptDescription} onChange={e => setCptDescription(e.target.value)} />
        </div>
      </div>

      {/* ICD-10 Codes */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-xs">ICD-10</Badge>
            <span className="text-xs text-muted-foreground">Diagnosis Codes</span>
          </div>
          <Button variant="ghost" size="sm" onClick={addIcdEntry} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add ICD-10
          </Button>
        </div>
        <div className="space-y-2">
          {icdEntries.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input placeholder="ICD-10 code (e.g., M17.11)" value={entry.code} onChange={e => updateIcdEntry(idx, "code", e.target.value)} className="flex-1" />
              <Input placeholder="Description" value={entry.description} onChange={e => updateIcdEntry(idx, "description", e.target.value)} className="flex-1" />
              {icdEntries.length > 1 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeIcdEntry(idx)}>
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Justification */}
      <Textarea placeholder="Justification for manual override (required)..." value={justification} onChange={e => setJustification(e.target.value)} className="mb-3" />

      <Button onClick={handleAdd} disabled={!canAdd} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add Manual Codes
      </Button>
    </div>
  );
}
