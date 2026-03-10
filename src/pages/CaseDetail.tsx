import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PersonaToggle, Persona } from "@/components/dashboard/PersonaToggle";
import { PreAuthProviderWorkflow } from "@/components/case-detail/PreAuthProviderWorkflow";
import { PreAuthPayerWorkflow } from "@/components/case-detail/PreAuthPayerWorkflow";
import { MedicalCodingWorkflow, SelectedCode } from "@/components/case-detail/MedicalCodingWorkflow";
import { ClinicalIntakeHeader } from "@/components/case-detail/ClinicalIntakeHeader";
import { InlineDocumentViewer } from "@/components/case-detail/panels/InlineDocumentViewer";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileCheck, Code2, FileText, Receipt, Landmark } from "lucide-react";
import { ClaimsManagementWorkflow } from "@/components/case-detail/ClaimsManagementWorkflow";
import { AccountsReceivableWorkflow } from "@/components/case-detail/AccountsReceivableWorkflow";
import { mockCases, Case } from "@/data/mockCases";
import { toast } from "sonner";

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPersona = (location.state as { persona?: Persona })?.persona || "provider";
  
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [activeTab, setActiveTab] = useState("coding");
  const [selectedCodes, setSelectedCodes] = useState<SelectedCode[]>([]);
  const [approvedCodes, setApprovedCodes] = useState<SelectedCode[]>([]);

  const handleApproveCodes = (codes: SelectedCode[]) => {
    setApprovedCodes(codes);
    toast.success(`${codes.length} codes approved and applied to Clinical Intake Header`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">Case: {caseData.id}</h1>
          </div>
          <PersonaToggle value={persona} onChange={setPersona} />
        </div>

        <ClinicalIntakeHeader 
          patientName={caseData.patientName}
          patientId={caseData.patientId}
          dateOfBirth={caseData.dateOfBirth}
          procedureName={caseData.procedureName}
          procedureCode={caseData.procedureCode}
          payerName={caseData.payerName}
          orderingProvider={caseData.orderingProvider}
          aiSummary={caseData.aiSummary}
          approvedCodes={approvedCodes}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="h-12 p-1 bg-muted">
            <TabsTrigger value="coding" className="h-10 px-6 data-[state=active]:bg-card">
              <Code2 className="h-4 w-4 mr-2" />
              Medical Coding
            </TabsTrigger>
            <TabsTrigger value="procedure" className="h-10 px-6 data-[state=active]:bg-card">
              <ClipboardList className="h-4 w-4 mr-2" />
              Procedure
              {selectedCodes.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  {selectedCodes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pre-auth" className="h-10 px-6 data-[state=active]:bg-card">
              <FileCheck className="h-4 w-4 mr-2" />
              Pre-Authorization
            </TabsTrigger>
            <TabsTrigger value="documents" className="h-10 px-6 data-[state=active]:bg-card">
              <FileText className="h-4 w-4 mr-2" />
              View Documents
            </TabsTrigger>
            <TabsTrigger value="claims" className="h-10 px-6 data-[state=active]:bg-card">
              <Receipt className="h-4 w-4 mr-2" />
              Claims Management
            </TabsTrigger>
            <TabsTrigger value="ar" className="h-10 px-6 data-[state=active]:bg-card">
              <Landmark className="h-4 w-4 mr-2" />
              Accounts Receivable
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coding" className="mt-6">
            <MedicalCodingWorkflow 
              aiSummary={caseData.aiSummary} 
              caseId={caseData.id}
              selectedCodes={selectedCodes}
              onSelectedCodesChange={setSelectedCodes}
            />
          </TabsContent>

          <TabsContent value="procedure" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Selected Procedure Codes</h3>
                {selectedCodes.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedCodes([])}>
                    Clear All
                  </Button>
                )}
              </div>

              {selectedCodes.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No Codes Selected</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select CPT and ICD-10 codes from the Medical Coding tab to add them here.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("coding")}>
                    Go to Medical Coding
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* CPT Codes */}
                  {selectedCptCodes.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                      <div className="px-5 py-3 bg-muted/30 border-b">
                        <span className="text-sm font-medium text-foreground">CPT Codes ({selectedCptCodes.length})</span>
                      </div>
                      <div className="divide-y">
                        {selectedCptCodes.map(sc => (
                          <div key={sc.code} className="px-5 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">CPT</span>
                              <span className="font-mono font-semibold text-foreground">{sc.code}</span>
                              <span className="text-sm text-muted-foreground">{sc.description}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <ConfidenceIndicator value={sc.confidence} size="sm" />
                              <Button variant="ghost" size="sm" onClick={() => removeCode("CPT", sc.code)}>
                                <X className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ICD-10 Codes */}
                  {selectedIcdCodes.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                      <div className="px-5 py-3 bg-muted/30 border-b">
                        <span className="text-sm font-medium text-foreground">ICD-10 Codes ({selectedIcdCodes.length})</span>
                      </div>
                      <div className="divide-y">
                        {selectedIcdCodes.map(sc => (
                          <div key={`${sc.parentCpt}-${sc.code}`} className="px-5 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">ICD-10</span>
                              <span className="font-mono font-semibold text-foreground">{sc.code}</span>
                              <span className="text-sm text-muted-foreground">{sc.description}</span>
                              {sc.parentCpt && (
                                <span className="text-xs text-muted-foreground">← CPT {sc.parentCpt}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <ConfidenceIndicator value={sc.confidence} size="sm" />
                              <Button variant="ghost" size="sm" onClick={() => removeCode("ICD-10", sc.code)}>
                                <X className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pre-auth" className="mt-6">
            {persona === "provider" ? (
              <PreAuthProviderWorkflow caseData={caseData} />
            ) : (
              <PreAuthPayerWorkflow />
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <InlineDocumentViewer caseId={caseId || "CASE-001"} />
          </TabsContent>

          <TabsContent value="claims" className="mt-6">
            <ClaimsManagementWorkflow />
          </TabsContent>

          <TabsContent value="ar" className="mt-6">
            <AccountsReceivableWorkflow />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
