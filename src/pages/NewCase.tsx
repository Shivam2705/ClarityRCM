import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Upload, 
  X, 
  Plus,
  Calendar,
  Building2,
  Hash,
  Stethoscope,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner";

const payerOptions = [
  "Blue Cross Blue Shield",
  "Aetna",
  "UnitedHealthcare",
  "Cigna",
  "Humana",
  "Medicare",
  "Medicaid",
  "Kaiser Permanente",
  "Anthem",
];

const documentTypes = [
  "Clinical Notes",
  "Lab Results",
  "Imaging Report",
  "Referral Letter",
  "Prior Authorization Form",
  "Insurance Card",
  "Patient Consent",
  "Other",
];

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
}

export default function NewCase() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    dob: "",
    payerName: "",
    groupNumber: "",
    icdCodes: [] as string[],
    cptCode: "",
    description: "",
  });
  
  const [icdInput, setIcdInput] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addIcdCode = () => {
    const trimmed = icdInput.trim().toUpperCase();
    if (trimmed && !formData.icdCodes.includes(trimmed)) {
      setFormData(prev => ({ ...prev, icdCodes: [...prev.icdCodes, trimmed] }));
      setIcdInput("");
    }
  };

  const removeIcdCode = (code: string) => {
    setFormData(prev => ({
      ...prev,
      icdCodes: prev.icdCodes.filter(c => c !== code)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedDocType) {
      toast.error("Please select a document type first");
      return;
    }

    Array.from(files).forEach(file => {
      const doc: UploadedDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        type: selectedDocType,
        size: file.size,
      };
      setUploadedDocuments(prev => [...prev, doc]);
    });

    e.target.value = "";
    toast.success(`${files.length} document(s) uploaded`);
  };

  const removeDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.memberId || !formData.memberName || !formData.dob || !formData.payerName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Case created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">New Case</h1>
            <p className="text-xs text-muted-foreground">Create a new prior authorization case</p>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Patient Demographics Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Patient Demographics</h2>
                <p className="text-sm text-muted-foreground">Enter patient and insurance information</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Member ID */}
              <div className="space-y-2">
                <Label htmlFor="memberId" className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Member ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="memberId"
                  placeholder="e.g., MBR-123456789"
                  value={formData.memberId}
                  onChange={(e) => handleInputChange("memberId", e.target.value)}
                  required
                />
              </div>

              {/* Member Name */}
              <div className="space-y-2">
                <Label htmlFor="memberName" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Member Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="memberName"
                  placeholder="e.g., John Smith"
                  value={formData.memberName}
                  onChange={(e) => handleInputChange("memberName", e.target.value)}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dob" className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  required
                />
              </div>

              {/* Payer Name */}
              <div className="space-y-2">
                <Label htmlFor="payerName" className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Payer Name <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.payerName} 
                  onValueChange={(value) => handleInputChange("payerName", value)}
                >
                  <SelectTrigger id="payerName" className="bg-background">
                    <SelectValue placeholder="Select payer" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {payerOptions.map((payer) => (
                      <SelectItem key={payer} value={payer}>
                        {payer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Group Number */}
              <div className="space-y-2">
                <Label htmlFor="groupNumber" className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Group Number
                </Label>
                <Input
                  id="groupNumber"
                  placeholder="e.g., GRP-12345"
                  value={formData.groupNumber}
                  onChange={(e) => handleInputChange("groupNumber", e.target.value)}
                />
              </div>

              {/* CPT Code */}
              <div className="space-y-2">
                <Label htmlFor="cptCode" className="flex items-center gap-2">
                  <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                  CPT Code
                </Label>
                <Input
                  id="cptCode"
                  placeholder="e.g., 27447"
                  value={formData.cptCode}
                  onChange={(e) => handleInputChange("cptCode", e.target.value)}
                />
              </div>

              {/* ICD Codes */}
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                  ICD Codes
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., M17.11"
                    value={icdInput}
                    onChange={(e) => setIcdInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIcdCode();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addIcdCode}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.icdCodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.icdCodes.map((code) => (
                      <Badge 
                        key={code} 
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {code}
                        <button
                          type="button"
                          onClick={() => removeIcdCode(code)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the case or procedure..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Upload Medical Documents Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Upload Medical Documents</h2>
                <p className="text-sm text-muted-foreground">Attach relevant clinical documents</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Document Type Selector */}
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={!selectedDocType}
                />
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  selectedDocType 
                    ? "border-primary/50 hover:border-primary hover:bg-primary/5 cursor-pointer" 
                    : "border-muted-foreground/30 bg-muted/30 cursor-not-allowed"
                }`}>
                  <Upload className={`h-10 w-10 mx-auto mb-3 ${
                    selectedDocType ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className={`text-sm font-medium ${
                    selectedDocType ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {selectedDocType 
                      ? "Click or drag files to upload" 
                      : "Select a document type first"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX, JPG, PNG (max 20MB)
                  </p>
                </div>
              </div>

              {/* Uploaded Documents List */}
              {uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents ({uploadedDocuments.length})</Label>
                  <div className="space-y-2">
                    {uploadedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                      >
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Case..." : "Create Case"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
