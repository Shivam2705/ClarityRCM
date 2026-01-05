import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentChatbot } from "@/components/document-viewer/DocumentChatbot";
import { 
  ArrowLeft, 
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
  Mail
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "medical-records" | "medical-history" | "prescription" | "medical-test" | "imaging-report";
  date: string;
  pages: number;
  preview: string;
}

const documents: Document[] = [
  {
    id: "doc-1",
    name: "Clinical Progress Notes",
    type: "medical-records",
    date: "Jan 10, 2024",
    pages: 5,
    preview: "Patient presents with chronic right knee pain, Kellgren-Lawrence Grade IV osteoarthritis confirmed. Conservative treatment including physical therapy, NSAIDs, and corticosteroid injections have failed to provide adequate relief over the past 6 months."
  },
  {
    id: "doc-2",
    name: "Orthopedic Consultation",
    type: "medical-records",
    date: "Jan 8, 2024",
    pages: 3,
    preview: "Recommendation for total knee arthroplasty based on clinical examination and imaging findings. Patient has exhausted conservative treatment options and meets surgical criteria."
  },
  {
    id: "doc-3",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Dec 15, 2023",
    pages: 8,
    preview: "68-year-old female with history of hypertension (controlled), Type 2 Diabetes (HbA1c 6.8%), and osteoarthritis. No known drug allergies. Previous surgeries: Appendectomy (1985), Cholecystectomy (2010)."
  },
  {
    id: "doc-4",
    name: "Meloxicam 15mg",
    type: "prescription",
    date: "Nov 20, 2023",
    pages: 1,
    preview: "Meloxicam 15mg once daily for pain management. Patient has been on this medication for 4 months with minimal relief of symptoms."
  },
  {
    id: "doc-5",
    name: "Acetaminophen 500mg",
    type: "prescription",
    date: "Nov 20, 2023",
    pages: 1,
    preview: "Acetaminophen 500mg as needed for breakthrough pain. Maximum 3000mg per day."
  },
  {
    id: "doc-6",
    name: "Complete Blood Count",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 2,
    preview: "WBC: 7.2 x10^9/L (Normal)\nRBC: 4.5 x10^12/L (Normal)\nHemoglobin: 13.8 g/dL (Normal)\nHematocrit: 41.2% (Normal)\nPlatelets: 245 x10^9/L (Normal)"
  },
  {
    id: "doc-7",
    name: "Basic Metabolic Panel",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 2,
    preview: "Glucose: 112 mg/dL (Slightly elevated)\nBUN: 18 mg/dL (Normal)\nCreatinine: 0.9 mg/dL (Normal)\nSodium: 140 mEq/L (Normal)\nPotassium: 4.2 mEq/L (Normal)"
  },
  {
    id: "doc-8",
    name: "MRI Right Knee",
    type: "imaging-report",
    date: "Dec 28, 2023",
    pages: 4,
    preview: "FINDINGS:\n- Complete loss of articular cartilage in medial compartment\n- Subchondral bone marrow edema\n- Moderate joint effusion\n- Medial meniscus: Degenerative changes with complex tear\n- ACL/PCL: Intact\n\nIMPRESSION: Advanced tricompartmental osteoarthritis, most severe in medial compartment."
  },
  {
    id: "doc-9",
    name: "X-Ray Right Knee",
    type: "imaging-report",
    date: "Dec 15, 2023",
    pages: 2,
    preview: "Weight-bearing AP and lateral views demonstrate:\n- Bone-on-bone contact in medial compartment\n- Osteophyte formation\n- Subchondral sclerosis\n- Kellgren-Lawrence Grade IV osteoarthritis"
  }
];

const documentCategories = [
  { type: "medical-records", label: "Medical Documents", icon: FileText },
  { type: "medical-history", label: "Medical History", icon: ClipboardList },
  { type: "prescription", label: "Prescriptions", icon: Pill },
  { type: "medical-test", label: "Medical Tests", icon: TestTube },
  { type: "imaging-report", label: "Imaging Reports", icon: ImageIcon },
];

export default function DocumentViewer() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<Document>(documents[0]);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const getDocsByType = (type: string) => documents.filter(d => d.type === type);
  const getCategoryIcon = (type: string) => {
    const category = documentCategories.find(c => c.type === type);
    return category?.icon || FileText;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="h-[calc(100vh-64px)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/case/${caseId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Case
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Document Viewer</h1>
                <p className="text-sm text-muted-foreground">Case {caseId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const subject = encodeURIComponent(`Document Request - Case ${caseId}`);
                  const body = encodeURIComponent(`Dear Team,\n\nI am writing to request the following missing documents for Case ${caseId}:\n\n1. [Document Name]\n2. [Document Name]\n\nPlease provide these documents at your earliest convenience.\n\nThank you.`);
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Request for Documents
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Document List */}
          <div className="w-80 border-r border-border bg-card/50 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {documentCategories.map((category) => {
                  const docs = getDocsByType(category.type);
                  const Icon = category.icon;
                  if (docs.length === 0) return null;
                  
                  return (
                    <div key={category.type}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium text-foreground">{category.label}</h3>
                        <span className="text-xs text-muted-foreground">({docs.length})</span>
                      </div>
                      <div className="space-y-2">
                        {docs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => {
                              setSelectedDoc(doc);
                              setCurrentPage(1);
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedDoc.id === doc.id
                                ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                                : "bg-background/50 border-border/50 hover:bg-muted/50"
                            }`}
                          >
                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{doc.date}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{doc.pages} page{doc.pages > 1 ? 's' : ''}</span>
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
          <div className="flex-1 flex flex-col bg-muted/20">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getCategoryIcon(selectedDoc.type);
                  return <Icon className="h-5 w-5 text-primary" />;
                })()}
                <div>
                  <h2 className="text-sm font-medium text-foreground">{selectedDoc.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedDoc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[50px] text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border mx-2" />
                <Button variant="outline" size="icon">
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-auto p-6">
              <Card 
                className="mx-auto bg-white text-slate-900 shadow-lg"
                style={{ 
                  width: `${(8.5 * zoom / 100) * 72}px`, 
                  minHeight: `${(11 * zoom / 100) * 72}px`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center'
                }}
              >
                <div className="p-8" style={{ fontSize: `${14 * (zoom / 100)}px` }}>
                  {/* Document Header */}
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-xl font-bold text-slate-900">{selectedDoc.name}</h1>
                      <span className="text-sm text-slate-500">{selectedDoc.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Case: {caseId}</span>
                      <span>•</span>
                      <span>Page {currentPage} of {selectedDoc.pages}</span>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                      {selectedDoc.preview}
                    </pre>

                    {/* Additional placeholder content for multi-page documents */}
                    {selectedDoc.pages > 1 && (
                      <div className="mt-8 pt-8 border-t border-slate-200">
                        <p className="text-slate-500 italic">
                          Additional clinical details and supporting documentation continue on subsequent pages...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Page Navigation */}
            {selectedDoc.pages > 1 && (
              <div className="flex items-center justify-center gap-4 py-3 border-t border-border bg-card/50">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {selectedDoc.pages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === selectedDoc.pages}
                  onClick={() => setCurrentPage(p => Math.min(selectedDoc.pages, p + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* AI Chatbot */}
        <DocumentChatbot 
          documentName={selectedDoc.name} 
          documentContent={selectedDoc.preview} 
        />
      </main>
    </div>
  );
}
