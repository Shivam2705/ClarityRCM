import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PersonaToggle, Persona } from "@/components/dashboard/PersonaToggle";
import { PreAuthProviderWorkflow } from "@/components/case-detail/PreAuthProviderWorkflow";
import { PreAuthPayerWorkflow } from "@/components/case-detail/PreAuthPayerWorkflow";
import { MedicalCodingWorkflow } from "@/components/case-detail/MedicalCodingWorkflow";
import { ClinicalIntakeHeader } from "@/components/case-detail/ClinicalIntakeHeader";
import { InlineDocumentViewer } from "@/components/case-detail/panels/InlineDocumentViewer";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileCheck, Code2, FileText, Receipt, Landmark } from "lucide-react";
import { ClaimsManagementWorkflow } from "@/components/case-detail/ClaimsManagementWorkflow";
import { AccountsReceivableWorkflow } from "@/components/case-detail/AccountsReceivableWorkflow";
import { mockCases, Case } from "@/data/mockCases";

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPersona = (location.state as { persona?: Persona })?.persona || "provider";
  
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [activeTab, setActiveTab] = useState("pre-auth");

  function getAllCases(): Case[] {
    try {
      const userCases = JSON.parse(localStorage.getItem("userCases") || "[]");
      return [...mockCases, ...userCases];
    } catch {
      return [...mockCases];
    }
  }

  const allCases = getAllCases();
  const caseData = allCases.find((c) => c.id === caseId) || allCases[0];

  const statusVariant: Record<string, "new" | "eligible" | "eligible-pa-req" | "not-eligible" | "pa-review" | "pa-submitted" | "pa-denied"> = {
    "New": "new",
    "Eligible": "eligible",
    "Eligible PA Req": "eligible-pa-req",
    "Not Eligible": "not-eligible",
    "PA Review": "pa-review",
    "PA Submitted": "pa-submitted",
    "PA Denied": "pa-denied",
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Case Header with Status */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">Case: {caseData.id}</h1>
          </div>
          <PersonaToggle value={persona} onChange={setPersona} />
        </div>

        {/* Clinical Intake - Patient Information Header */}
        <ClinicalIntakeHeader 
          patientName={caseData.patientName}
          patientId={caseData.patientId}
          dateOfBirth={caseData.dateOfBirth}
          procedureName={caseData.procedureName}
          procedureCode={caseData.procedureCode}
          payerName={caseData.payerName}
          orderingProvider={caseData.orderingProvider}
          aiSummary={caseData.aiSummary}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="h-12 p-1 bg-muted">
            <TabsTrigger value="pre-auth" className="h-10 px-6 data-[state=active]:bg-card">
              <FileCheck className="h-4 w-4 mr-2" />
              Pre-Authorization
            </TabsTrigger>
            <TabsTrigger value="coding" className="h-10 px-6 data-[state=active]:bg-card">
              <Code2 className="h-4 w-4 mr-2" />
              Medical Coding
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

          <TabsContent value="pre-auth" className="mt-6">
            {persona === "provider" ? (
              <PreAuthProviderWorkflow caseData={caseData} />
            ) : (
              <PreAuthPayerWorkflow />
            )}
          </TabsContent>

          <TabsContent value="coding" className="mt-6">
            <MedicalCodingWorkflow aiSummary={caseData.aiSummary} />
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
