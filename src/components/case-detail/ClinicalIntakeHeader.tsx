import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building2, 
  Stethoscope, 
  FileText, 
  Phone, 
  MapPin,
  CreditCard,
  Activity,
  Pill,
  AlertCircle,
  Sparkles
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

  const aiSummary = `${patientName}, a ${patientInfo.age.replace(' years', '-year-old')} ${patientInfo.gender.toLowerCase()} patient, presents with ${patientInfo.clinical.primaryDiagnosis} (${patientInfo.clinical.severity}) persisting for ${patientInfo.clinical.duration}. Currently managed with conservative treatment including NSAIDs (Meloxicam) and analgesics. Patient has well-controlled comorbidities including Type 2 Diabetes and Hypertension. Requesting ${procedureName} (CPT: ${procedureCode}). Known allergies to Penicillin and Sulfa drugs noted. Clinical documentation supports medical necessity for the requested procedure.`;

  return (
    <Card className="p-4 bg-card border-border mb-4">
      {/* Compact Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{patientName}</h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                MRN: {patientInfo.mrn}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{patientInfo.dob}</span>
              <span>•</span>
              <span>{patientInfo.age}</span>
              <span>•</span>
              <span>{patientInfo.gender}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {patientInfo.phone}
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={() => navigate(`/case/${caseId}/documents`)}>
          <FileText className="h-4 w-4 mr-2" />
          View Documents
        </Button>
      </div>

      {/* AI Generated Summary */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 mb-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">AI Patient Summary</h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Compact Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {/* Insurance */}
        <div className="p-2 rounded-md bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <CreditCard className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Insurance</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{patientInfo.insurance.payer}</p>
          <p className="text-[10px] text-muted-foreground">{patientInfo.insurance.memberId}</p>
        </div>

        {/* Provider */}
        <div className="p-2 rounded-md bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Stethoscope className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Provider</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{orderingProvider}</p>
          <p className="text-[10px] text-muted-foreground truncate">Springfield Orthopedic</p>
        </div>

        {/* Procedure */}
        <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Procedure</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{procedureName}</p>
          <div className="flex gap-1 mt-0.5">
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">
              {procedureCode}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-success/20 text-success border-success/30">
              {patientInfo.clinical.icdCode}
            </Badge>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-2 rounded-md bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="h-3 w-3 text-warning" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Diagnosis</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{patientInfo.clinical.primaryDiagnosis}</p>
          <p className="text-[10px] text-muted-foreground">{patientInfo.clinical.severity}</p>
        </div>

        {/* Allergies & Meds */}
        <div className="p-2 rounded-md bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Pill className="h-3 w-3 text-destructive" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Allergies</span>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {patientInfo.clinical.allergies.map((allergy, idx) => (
              <Badge key={idx} variant="destructive" className="text-[10px] px-1 py-0 h-4">
                {allergy}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
