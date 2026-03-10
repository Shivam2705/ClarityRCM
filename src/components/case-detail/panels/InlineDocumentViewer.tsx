import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCaseDocuments, CaseDocument } from "@/data/caseDocuments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentChatbot } from "@/components/document-viewer/DocumentChatbot";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText,
  ClipboardList,
  Pill,
  TestTube,
  Image as ImageIcon,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Upload,
  StickyNote,
  Sparkles,
  Loader2,
  X,
  FileUp,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "medical-records" | "medical-history" | "prescription" | "medical-test" | "imaging-report" | "notes" | "summary";
  date: string;
  pages: number;
  preview: string;
}

const initialDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Clinical Progress Notes",
    type: "medical-records",
    date: "Jan 10, 2024",
    pages: 5,
    preview:
      "Patient presents with chronic right knee pain, Kellgren-Lawrence Grade IV osteoarthritis confirmed. Conservative treatment including physical therapy, NSAIDs, and corticosteroid injections have failed to provide adequate relief over the past 6 months.",
  },
  {
    id: "doc-2",
    name: "Orthopedic Consultation",
    type: "medical-records",
    date: "Jan 8, 2024",
    pages: 3,
    preview:
      "Recommendation for total knee arthroplasty based on clinical examination and imaging findings. Patient has exhausted conservative treatment options and meets surgical criteria.",
  },
  {
    id: "doc-3",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Dec 15, 2023",
    pages: 8,
    preview:
      "68-year-old female with history of hypertension (controlled), Type 2 Diabetes (HbA1c 6.8%), and osteoarthritis. No known drug allergies. Previous surgeries: Appendectomy (1985), Cholecystectomy (2010).",
  },
  {
    id: "doc-4",
    name: "Meloxicam 15mg",
    type: "prescription",
    date: "Nov 20, 2023",
    pages: 1,
    preview:
      "Meloxicam 15mg once daily for pain management. Patient has been on this medication for 4 months with minimal relief of symptoms.",
  },
  {
    id: "doc-5",
    name: "Acetaminophen 500mg",
    type: "prescription",
    date: "Nov 20, 2023",
    pages: 1,
    preview: "Acetaminophen 500mg as needed for breakthrough pain. Maximum 3000mg per day.",
  },
  {
    id: "doc-6",
    name: "Complete Blood Count",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 2,
    preview:
      "WBC: 7.2 x10^9/L (Normal)\nRBC: 4.5 x10^12/L (Normal)\nHemoglobin: 13.8 g/dL (Normal)\nHematocrit: 41.2% (Normal)\nPlatelets: 245 x10^9/L (Normal)",
  },
  {
    id: "doc-7",
    name: "Basic Metabolic Panel",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 2,
    preview:
      "Glucose: 112 mg/dL (Slightly elevated)\nBUN: 18 mg/dL (Normal)\nCreatinine: 0.9 mg/dL (Normal)\nSodium: 140 mEq/L (Normal)\nPotassium: 4.2 mEq/L (Normal)",
  },
  {
    id: "doc-8",
    name: "MRI Right Knee",
    type: "imaging-report",
    date: "Dec 28, 2023",
    pages: 4,
    preview:
      "FINDINGS:\n- Complete loss of articular cartilage in medial compartment\n- Subchondral bone marrow edema\n- Moderate joint effusion\n- Medial meniscus: Degenerative changes with complex tear\n- ACL/PCL: Intact\n\nIMPRESSION: Advanced tricompartmental osteoarthritis, most severe in medial compartment.",
  },
  {
    id: "doc-9",
    name: "X-Ray Right Knee",
    type: "imaging-report",
    date: "Dec 15, 2023",
    pages: 2,
    preview:
      "Weight-bearing AP and lateral views demonstrate:\n- Bone-on-bone contact in medial compartment\n- Osteophyte formation\n- Subchondral sclerosis\n- Kellgren-Lawrence Grade IV osteoarthritis",
  },
];

const documentCategories = [
  { type: "medical-records", label: "Medical Documents", icon: FileText },
  { type: "medical-history", label: "Medical History", icon: ClipboardList },
  { type: "prescription", label: "Prescriptions", icon: Pill },
  { type: "medical-test", label: "Medical Tests", icon: TestTube },
  { type: "imaging-report", label: "Imaging Reports", icon: ImageIcon },
  { type: "notes", label: "Notes", icon: StickyNote },
  { type: "summary", label: "AI Summaries", icon: Sparkles },
];

interface InlineDocumentViewerProps {
  caseId: string;
}

export function InlineDocumentViewer({ caseId }: InlineDocumentViewerProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState<Document>(documents[0]);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  // Upload dialog
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  // Notes dialog
  const [showNotes, setShowNotes] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Summary generation
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const getDocsByType = (type: string) => documents.filter((d) => d.type === type);
  const getCategoryIcon = (type: string) => {
    const category = documentCategories.find((c) => c.type === type);
    return category?.icon || FileText;
  };

  const handleUpload = () => {
    if (uploadFiles.length === 0) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newDocs: Document[] = uploadFiles.map((file, i) => ({
      id: `doc-upload-${Date.now()}-${i}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      type: "medical-records" as const,
      date: today,
      pages: 1,
      preview: `Uploaded document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nType: ${file.type || "Unknown"}`,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
    setSelectedDoc(newDocs[0]);
    setCurrentPage(1);
    setUploadFiles([]);
    setShowUpload(false);
    toast.success(`${newDocs.length} document${newDocs.length > 1 ? "s" : ""} uploaded successfully`);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newDoc: Document = {
      id: `doc-note-${Date.now()}`,
      name: noteTitle.trim() || "Untitled Note",
      type: "notes",
      date: today,
      pages: 1,
      preview: noteContent,
    };
    setDocuments((prev) => [...prev, newDoc]);
    setSelectedDoc(newDoc);
    setCurrentPage(1);
    setNoteTitle("");
    setNoteContent("");
    setShowNotes(false);
    toast.success("Note saved as document");
  };

  const handleGenerateSummary = () => {
    setGeneratingSummary(true);
    // Simulate AI generation
    setTimeout(() => {
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const summaryDoc: Document = {
        id: `doc-summary-${Date.now()}`,
        name: "AI Patient Summary",
        type: "summary",
        date: today,
        pages: 1,
        preview: `PATIENT SUMMARY — Generated ${today}\n\n` +
          `DEMOGRAPHICS:\n68-year-old female presenting for total knee arthroplasty evaluation.\n\n` +
          `PRIMARY DIAGNOSIS:\nKellgren-Lawrence Grade IV osteoarthritis of the right knee with complete loss of articular cartilage in the medial compartment, bone-on-bone contact, subchondral sclerosis, and osteophyte formation.\n\n` +
          `CLINICAL HISTORY:\nPatient reports chronic right knee pain with progressive functional decline over 3+ years. Failed conservative management including:\n• NSAIDs (Meloxicam 15mg daily × 4 months) — minimal relief\n• Acetaminophen 500mg PRN for breakthrough pain\n• Physical therapy — completed without significant improvement\n• Corticosteroid injections — temporary relief only\n\n` +
          `IMAGING FINDINGS:\n• MRI (Dec 28, 2023): Complete cartilage loss medial compartment, subchondral bone marrow edema, moderate effusion, degenerative medial meniscus tear. ACL/PCL intact.\n• X-Ray (Dec 15, 2023): Bone-on-bone medial compartment, Grade IV OA changes, varus deformity.\n\n` +
          `LABORATORY RESULTS (Jan 5, 2024):\n• CBC: All values within normal limits\n• BMP: Glucose slightly elevated at 112 mg/dL; electrolytes and renal function normal\n• HbA1c: 6.8% (Type 2 DM, controlled)\n\n` +
          `COMORBIDITIES:\n• Hypertension — controlled\n• Type 2 Diabetes Mellitus — HbA1c 6.8%\n• No known drug allergies\n\n` +
          `SURGICAL HISTORY:\n• Appendectomy (1985)\n• Cholecystectomy (2010)\n\n` +
          `RECOMMENDATION:\nTotal knee arthroplasty recommended. Patient meets medical necessity criteria with documented failure of conservative treatment, significant functional impairment, and Grade IV radiographic changes.\n\n` +
          `CONFIDENCE: 96% — Based on analysis of 9 clinical documents.`,
      };
      setDocuments((prev) => [...prev, summaryDoc]);
      setSelectedDoc(summaryDoc);
      setCurrentPage(1);
      setGeneratingSummary(false);
      toast.success("AI Patient Summary generated successfully");
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Action Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" className="gap-2" onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4" />
          Upload Documents
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setShowNotes(true)}>
          <StickyNote className="h-4 w-4" />
          Add Notes
        </Button>
        <Button
          variant="default"
          className="gap-2"
          onClick={handleGenerateSummary}
          disabled={generatingSummary}
        >
          {generatingSummary ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generatingSummary ? "Generating..." : "Generate Summary"}
        </Button>
      </div>

      <div className="flex rounded-xl border bg-card overflow-hidden" style={{ height: "calc(100vh - 390px)", minHeight: "500px" }}>
        {/* Left Sidebar - Document List */}
        <div className="w-72 border-r border-border bg-muted/30 flex flex-col">
          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Documents</h3>
            <p className="text-xs text-muted-foreground mt-1">Case {caseId}</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-4">
              {documentCategories.map((category) => {
                const docs = getDocsByType(category.type);
                const Icon = category.icon;
                if (docs.length === 0) return null;

                return (
                  <div key={category.type}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <h4 className="text-xs font-medium text-foreground">{category.label}</h4>
                      <span className="text-xs text-muted-foreground">({docs.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {docs.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoc(doc);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                            selectedDoc.id === doc.id
                              ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                              : "bg-background/50 border-border/50 hover:bg-muted/50"
                          }`}
                        >
                          <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-muted-foreground">
                              {doc.pages} page{doc.pages > 1 ? "s" : ""}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Document Viewer */}
        <div className="flex-1 flex flex-col bg-muted/10">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/50 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {(() => {
                const Icon = getCategoryIcon(selectedDoc.type);
                return <Icon className="h-4 w-4 text-primary flex-shrink-0" />;
              })()}
              <div className="min-w-0">
                <h2 className="text-sm font-medium text-foreground truncate">{selectedDoc.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedDoc.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[40px] text-center">{zoom}%</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <div className="h-5 w-px bg-border mx-1" />
              <Button variant="outline" size="icon" className="h-8 w-8">
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-auto p-4">
            <div className="flex justify-center">
              <Card className="bg-white text-slate-900 shadow-lg w-full max-w-2xl">
                <div className="p-6">
                  {/* Document Header */}
                  <div className="border-b border-slate-200 pb-3 mb-4">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <h1 className="text-lg font-bold text-slate-900 truncate">{selectedDoc.name}</h1>
                      <span className="text-xs text-slate-500 flex-shrink-0">{selectedDoc.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>Case: {caseId}</span>
                      <span>•</span>
                      <span>
                        Page {currentPage} of {selectedDoc.pages}
                      </span>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm">
                      {selectedDoc.preview}
                    </pre>

                    {selectedDoc.pages > 1 && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <p className="text-slate-500 italic text-xs">
                          Additional clinical details and supporting documentation continue on subsequent pages...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Page Navigation */}
          {selectedDoc.pages > 1 && (
            <div className="flex items-center justify-center gap-3 py-2.5 border-t border-border bg-card/50">
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {selectedDoc.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                disabled={currentPage === selectedDoc.pages}
                onClick={() => setCurrentPage((p) => Math.min(selectedDoc.pages, p + 1))}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* AI Chatbot */}
      <DocumentChatbot documentName={selectedDoc.name} documentContent={selectedDoc.preview} />

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Documents
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-upload-input")?.click()}
            >
              <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Click to browse or drag files here</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, JPG, PNG up to 20MB each</p>
              <input
                id="file-upload-input"
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.dicom"
                onChange={(e) => {
                  if (e.target.files) setUploadFiles(Array.from(e.target.files));
                }}
              />
            </div>
            {uploadFiles.length > 0 && (
              <div className="space-y-2">
                {uploadFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setUploadFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowUpload(false); setUploadFiles([]); }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploadFiles.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Upload {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              Add Notes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Content</label>
              <Textarea
                placeholder="Write your notes here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNotes(false); setNoteTitle(""); setNoteContent(""); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} disabled={!noteContent.trim()}>
              <StickyNote className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
