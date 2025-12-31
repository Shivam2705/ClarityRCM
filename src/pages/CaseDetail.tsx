import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PersonaToggle, Persona } from "@/components/dashboard/PersonaToggle";
import { PreAuthProviderWorkflow } from "@/components/case-detail/PreAuthProviderWorkflow";
import { PreAuthPayerWorkflow } from "@/components/case-detail/PreAuthPayerWorkflow";
import { MedicalCodingWorkflow } from "@/components/case-detail/MedicalCodingWorkflow";
import { ClinicalIntakeHeader } from "@/components/case-detail/ClinicalIntakeHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileCheck, Code2 } from "lucide-react";
import { mockCases } from "@/data/mockCases";

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPersona = (location.state as { persona?: Persona })?.persona || "provider";
  
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [activeTab, setActiveTab] = useState("pre-auth");

  const caseData = mockCases.find((c) => c.id === caseId) || mockCases[0];

  const statusVariant: Record<string, "new" | "review" | "submitted" | "approved" | "denied"> = {
    "New": "new",
    "In Review": "review",
    "Submitted": "submitted",
    "Approved": "approved",
    "Denied": "denied",
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
            <StatusBadge variant={statusVariant[caseData.status]}>{caseData.status}</StatusBadge>
          </div>
          <PersonaToggle value={persona} onChange={setPersona} />
        </div>

        {/* Clinical Intake - Patient Information Header */}
        <ClinicalIntakeHeader 
          patientName={caseData.patientName}
          patientId={caseData.patientId}
          procedureName={caseData.procedureName}
          procedureCode={caseData.procedureCode}
          payerName={caseData.payerName}
          orderingProvider={caseData.orderingProvider}
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
          </TabsList>

          <TabsContent value="pre-auth" className="mt-6">
            {persona === "provider" ? (
              <PreAuthProviderWorkflow />
            ) : (
              <PreAuthPayerWorkflow />
            )}
          </TabsContent>

          <TabsContent value="coding" className="mt-6">
            <MedicalCodingWorkflow />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
