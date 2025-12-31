import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Building2, 
  Stethoscope, 
  FileText, 
  Phone, 
  MapPin,
  CreditCard,
  Activity,
  Pill,
  AlertCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ClinicalIntakeHeaderProps {
  patientName: string;
  patientId: string;
  procedureName?: string;
  procedureCode?: string;
  payerName: string;
  orderingProvider: string;
}

export function ClinicalIntakeHeader({ 
  patientName, 
  patientId, 
  procedureName, 
  procedureCode,
  payerName,
  orderingProvider 
}: ClinicalIntakeHeaderProps) {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const patientInfo = {
    dob: "March 15, 1956",
    age: "68 years",
    gender: "Female",
    phone: "(555) 234-5678",
    address: "1234 Oak Street, Springfield, IL 62701",
    mrn: patientId,
    insurance: {
      payer: payerName,
      memberId: "BCB-987654321",
      groupNumber: "GRP-12345",
      planType: "PPO"
    },
    clinical: {
      primaryDiagnosis: "Primary Osteoarthritis, Right Knee",
      icdCode: "M17.11",
      severity: "Grade IV (Kellgren-Lawrence)",
      duration: "18 months",
      allergies: ["Penicillin", "Sulfa drugs"],
      medications: ["Meloxicam 15mg", "Acetaminophen 500mg", "Lisinopril 10mg", "Metformin 500mg"],
      comorbidities: ["Type 2 Diabetes (controlled)", "Hypertension (controlled)", "Hyperlipidemia"]
    }
  };

  return (
    <Card className="p-6 bg-card border-border mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{patientName}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">{patientInfo.dob}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{patientInfo.age}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{patientInfo.gender}</span>
              <span className="text-muted-foreground">•</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                MRN: {patientInfo.mrn}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate(`/case/${caseId}/documents`)}>
          <FileText className="h-4 w-4 mr-2" />
          View Documents
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Contact Info */}
        <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{patientInfo.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm text-foreground">{patientInfo.address}</span>
            </div>
          </div>
        </div>

        {/* Insurance Info */}
        <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Insurance Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{patientInfo.insurance.payer}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Member ID: {patientInfo.insurance.memberId}</p>
              <p>Group: {patientInfo.insurance.groupNumber}</p>
              <p>Plan: {patientInfo.insurance.planType}</p>
            </div>
          </div>
        </div>

        {/* Ordering Provider */}
        <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Ordering Provider</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{orderingProvider}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Springfield Orthopedic Center</span>
            </div>
          </div>
        </div>

        {/* Procedure Info */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Requested Procedure</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{procedureName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                CPT: {procedureCode}
              </Badge>
              <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                ICD-10: {patientInfo.clinical.icdCode}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Primary Diagnosis */}
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-warning" />
            Primary Diagnosis
          </h4>
          <p className="text-sm font-medium text-foreground">{patientInfo.clinical.primaryDiagnosis}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-warning/20 text-warning border-warning/30">{patientInfo.clinical.severity}</Badge>
            <span className="text-xs text-muted-foreground">Duration: {patientInfo.clinical.duration}</span>
          </div>
        </div>

        {/* Allergies & Medications */}
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Allergies & Current Medications
          </h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {patientInfo.clinical.allergies.map((allergy, idx) => (
              <Badge key={idx} variant="destructive" className="text-xs">
                {allergy}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {patientInfo.clinical.medications.slice(0, 3).map((med, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-background/50">
                <Pill className="h-3 w-3 mr-1" />
                {med}
              </Badge>
            ))}
            {patientInfo.clinical.medications.length > 3 && (
              <Badge variant="outline" className="text-xs">+{patientInfo.clinical.medications.length - 3} more</Badge>
            )}
          </div>
        </div>

        {/* Comorbidities */}
        <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Comorbidities</h4>
          <div className="flex flex-wrap gap-1">
            {patientInfo.clinical.comorbidities.map((condition, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
