import { useEffect, useState } from "react";
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
import { mockCases } from "@/data/mockCases";
import { toast } from "sonner";

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPersona = (location.state as { persona?: Persona })?.persona || "provider";
  
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [activeTab, setActiveTab] = useState("documents");
  const [selectedCodes, setSelectedCodes] = useState<SelectedCode[]>([]);
  const [approvedCodes, setApprovedCodes] = useState<SelectedCode[]>([]);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  const allCases = mockCases;
  const caseData = allCases.find((c) => c.id === caseId) || allCases[0];

  useEffect(() => {
    // Prevent carrying generated summary to a different case.
    setGeneratedSummary(null);
  }, [caseData.id]);

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
          aiSummary={generatedSummary || undefined}
          hasSummary={!!generatedSummary}
          approvedCodes={approvedCodes}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="h-12 p-1 bg-muted">
            <TabsTrigger value="documents" className="h-10 px-6 data-[state=active]:bg-card">
              <FileText className="h-4 w-4 mr-2" />
              Document Analysis
            </TabsTrigger>
            <TabsTrigger value="coding" className="h-10 px-6 data-[state=active]:bg-card">
              <Code2 className="h-4 w-4 mr-2" />
              Medical Coding
            </TabsTrigger>
            <TabsTrigger value="pre-auth" className="h-10 px-6 data-[state=active]:bg-card">
              <FileCheck className="h-4 w-4 mr-2" />
              Prior Authorization
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

          <TabsContent value="coding" className="mt-6" forceMount>
            <MedicalCodingWorkflow 
              aiSummary={caseData.aiSummary} 
              caseId={caseData.id}
              selectedCodes={selectedCodes}
              onSelectedCodesChange={setSelectedCodes}
              onApprove={handleApproveCodes}
            />
          </TabsContent>


          <TabsContent value="pre-auth" className="mt-6" forceMount>
            {persona === "provider" ? (
              <PreAuthProviderWorkflow
                caseData={caseData}
                selectedCodes={selectedCodes}
                approvedCodes={approvedCodes}
              />
            ) : (
              <PreAuthPayerWorkflow />
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-6" forceMount>
            <InlineDocumentViewer
              caseId={caseId || "CASE-001"}
              summaryContent={caseData.aiSummary || caseData.documentSummary || ""}
              onSummaryGenerated={setGeneratedSummary}
            />
          </TabsContent>

          <TabsContent value="claims" className="mt-6" forceMount>
            <ClaimsManagementWorkflow />
          </TabsContent>

          <TabsContent value="ar" className="mt-6" forceMount>
            <AccountsReceivableWorkflow />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
