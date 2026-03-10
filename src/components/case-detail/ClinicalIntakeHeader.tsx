import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Stethoscope, Phone, CreditCard, Activity, AlertCircle, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { getClinicalData } from "@/data/clinicalData";
import { format } from "date-fns";
interface ApprovedCode {
  type: "CPT" | "ICD-10";
  code: string;
  description: string;
  confidence: number;
  parentCpt?: string;
}

interface ClinicalIntakeHeaderProps {
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  procedureName?: string;
  procedureCode?: string;
  payerName: string;
  orderingProvider: string;
  hasDocuments?: boolean;
  hasSummary?: boolean;
  aiSummary?: string;
  approvedCodes?: ApprovedCode[];
}
export function ClinicalIntakeHeader({
  patientName,
  patientId,
  dateOfBirth,
  procedureName,
  procedureCode,
  payerName,
  orderingProvider,
  hasDocuments = true,
  hasSummary = false,
  aiSummary,
  approvedCodes = []
}: ClinicalIntakeHeaderProps) {
  const { caseId } = useParams();
  const clinicalData = getClinicalData(caseId || "CASE-001");
  const { formattedDob, ageLabel, ageDescriptor } = useMemo(() => {
    if (!dateOfBirth) {
      return {
        formattedDob: "N/A",
        ageLabel: "N/A",
        ageDescriptor: ""
      };
    }
    const parsedDob = new Date(dateOfBirth);
    if (Number.isNaN(parsedDob.getTime())) {
      return {
        formattedDob: "N/A",
        ageLabel: "N/A",
        ageDescriptor: ""
      };
    }
    const today = new Date();
    if (parsedDob.getTime() > today.getTime()) {
      return {
        formattedDob: format(parsedDob, "MMMM d, yyyy"),
        ageLabel: "0 years",
        ageDescriptor: "0-year-old"
      };
    }
    let years = today.getFullYear() - parsedDob.getFullYear();
    const hadBirthdayThisYear =
      today.getMonth() > parsedDob.getMonth() ||
      (today.getMonth() === parsedDob.getMonth() && today.getDate() >= parsedDob.getDate());
    if (!hadBirthdayThisYear) {
      years -= 1;
    }
    const safeYears = Math.max(0, years);
    if (safeYears === 0) {
      let months = (today.getFullYear() - parsedDob.getFullYear()) * 12 + (today.getMonth() - parsedDob.getMonth());
      if (today.getDate() < parsedDob.getDate()) {
        months -= 1;
      }
      const safeMonths = Math.max(0, months);
      const monthLabel = `${safeMonths} month${safeMonths === 1 ? "" : "s"}`;
      const descriptor = safeMonths === 0 ? "newborn" : `${safeMonths}-month-old`;
      return {
        formattedDob: format(parsedDob, "MMMM d, yyyy"),
        ageLabel: monthLabel,
        ageDescriptor: descriptor
      };
    }
    const descriptor = `${safeYears}-year-old`;
    return {
      formattedDob: format(parsedDob, "MMMM d, yyyy"),
      ageLabel: `${safeYears} year${safeYears === 1 ? "" : "s"}`,
      ageDescriptor: descriptor
    };
  }, [dateOfBirth]);
  const patientInfo = {
    dob: formattedDob,
    age: ageLabel,
    gender: clinicalData.gender,
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
      primaryDiagnosis: clinicalData.primaryDiagnosis,
      icdCode: clinicalData.icdCode,
      severity: clinicalData.severity,
      duration: clinicalData.duration,
      allergies: clinicalData.allergies,
      medications: clinicalData.medications,
      comorbidities: clinicalData.comorbidities,
    }
  };

  // Payer details for tabular display
  const payerDetails = [{
    field: "Payer Name",
    value: payerName
  }, {
    field: "Member ID",
    value: patientInfo.insurance.memberId
  }, {
    field: "Group Number",
    value: patientInfo.insurance.groupNumber
  }, {
    field: "Plan Type",
    value: patientInfo.insurance.planType
  }, {
    field: "Network Status",
    value: "In-Network"
  },
  //  {
  //   field: "Prior Auth Required",
  //   value: "Yes"
  // }
];
  // Use aiSummary from props if available, otherwise fallback to template
  const summaryToShow = aiSummary || clinicalData.summaryTemplate(patientName, ageDescriptor, procedureName || "requested procedure", procedureCode || "N/A");
  return <>
    <Card className="p-4 bg-card border-border mb-4">
      {/* Compact Header Row with Action Buttons */}
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
      </div>

      {/* Compact Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {/* Provider */}
        <div className="p-2 rounded-md bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Stethoscope className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Provider</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{orderingProvider}</p>
          <p className="text-[10px] text-muted-foreground truncate">Springfield</p>
        </div>

        {/* Procedure */}
        <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Procedure</span>
          </div>
          {approvedCodes.length > 0 ? (
            <div className="space-y-0.5">
              {approvedCodes.filter(c => c.type === "CPT").map(c => (
                <div key={c.code} className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">
                    CPT: {c.code}
                  </Badge>
                </div>
              ))}
              {approvedCodes.filter(c => c.type === "ICD-10").map(c => (
                <div key={c.code} className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-success/20 text-success border-success/30">
                    ICD: {c.code}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-xs font-medium text-foreground truncate">{procedureName}</p>
              <div className="flex gap-1 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">
                  {procedureCode}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-success/20 text-success border-success/30">
                  {patientInfo.clinical.icdCode}
                </Badge>
              </div>
            </>
          )}
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
        
      </div>

      {/* Payer Details Table */}
      <Card className="bg-secondary/20 border-border/50">
        <div className="flex items-center gap-1.5 p-2 border-b border-border/50">
          <CreditCard className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase">Payer Details</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {payerDetails.map((detail, idx) => <TableHead key={idx} className="text-[10px] font-medium h-8 py-1">
                  {detail.field}
                </TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-muted/30">
              {payerDetails.map((detail, idx) => <TableCell key={idx} className="text-xs py-1.5 font-medium">
                  {detail.field === "Prior Auth Required" ? <Badge variant="outline" className="text-[10px] bg-warning/20 text-warning border-warning/30">
                      {detail.value}
                    </Badge> : detail.value}
                </TableCell>)}
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Card>

    {/* AI Generated Summary - Separate Card */}
    {hasSummary && hasDocuments && (
      <Card className="p-4 bg-card border-border mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">AI Patient Summary</h4>
              <p className="text-sm text-foreground/90 leading-relaxed">{summaryToShow}</p>
            </div>
          </div>
        </div>
      </Card>
    )}
  </>;
}