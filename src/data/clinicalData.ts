export interface ClinicalProfile {
  primaryDiagnosis: string;
  icdCode: string;
  severity: string;
  duration: string;
  allergies: string[];
  medications: string[];
  comorbidities: string[];
  documents: { name: string; date: string; status: string }[];
  summaryTemplate: (patientName: string, patientAge: string, procedureName: string, procedureCode: string) => string;
}

const defaultClinical: ClinicalProfile = {
  primaryDiagnosis: "Primary Osteoarthritis, Right Knee",
  icdCode: "M17.11",
  severity: "Grade IV (Kellgren-Lawrence)",
  duration: "18 months",
  allergies: ["Penicillin", "Sulfa drugs"],
  medications: ["Meloxicam 15mg", "Acetaminophen 500mg", "Lisinopril 10mg", "Metformin 500mg"],
  comorbidities: ["Type 2 Diabetes (controlled)", "Hypertension (controlled)", "Hyperlipidemia"],
  documents: [
    { name: "Clinical Notes - Dr. Chen", date: "2024-01-15", status: "analyzed" },
    { name: "X-Ray Report - Right Knee", date: "2024-01-10", status: "analyzed" },
    { name: "MRI Report - Right Knee", date: "2024-01-08", status: "analyzed" },
    { name: "Physical Therapy Progress Notes", date: "2024-01-05", status: "analyzed" },
    { name: "Injection Records (3x)", date: "2023-12-15", status: "analyzed" },
  ],
  summaryTemplate: (patientName, patientAge, procedureName, procedureCode) =>
    `${patientName}, a ${patientAge} patient, presents with Primary Osteoarthritis, Right Knee (Grade IV - Kellgren-Lawrence) persisting for 18 months. Currently managed with conservative treatment including NSAIDs (Meloxicam) and analgesics. Patient has well-controlled comorbidities including Type 2 Diabetes and Hypertension. Requesting ${procedureName} (CPT: ${procedureCode}). Known allergies to Penicillin and Sulfa drugs noted. Clinical documentation supports medical necessity for the requested procedure.`,
};

const nephrologyClinical: ClinicalProfile = {
  primaryDiagnosis: "End-Stage Renal Disease (ESRD)",
  icdCode: "N18.6",
  severity: "Stage 5 CKD (eGFR < 15 mL/min)",
  duration: "36 months",
  allergies: ["Iodine contrast", "Cephalosporins"],
  medications: ["Epoetin Alfa 10,000 units", "Sevelamer 800mg", "Calcitriol 0.25mcg", "Tacrolimus 2mg"],
  comorbidities: ["Hypertension (controlled)", "Secondary Hyperparathyroidism", "Anemia of CKD"],
  documents: [
    { name: "Nephrology Consultation - Dr. Watson", date: "2024-01-15", status: "analyzed" },
    { name: "Renal Ultrasound Report", date: "2024-01-12", status: "analyzed" },
    { name: "Dialysis Access Records", date: "2024-01-10", status: "analyzed" },
    { name: "Transplant Evaluation Summary", date: "2024-01-08", status: "analyzed" },
    { name: "HLA Typing & Crossmatch Results", date: "2024-01-05", status: "analyzed" },
  ],
  summaryTemplate: (patientName, patientAge, procedureName, procedureCode) =>
    `${patientName}, a ${patientAge} patient, presents with End-Stage Renal Disease (ESRD, Stage 5 CKD, eGFR < 15 mL/min) progressing over 36 months. Currently on hemodialysis three times weekly. Patient has completed pre-transplant evaluation with favorable crossmatch results. Comorbidities include controlled Hypertension, Secondary Hyperparathyroidism, and Anemia of CKD. Requesting ${procedureName} (CPT: ${procedureCode}). Known allergies to Iodine contrast and Cephalosporins noted. Clinical documentation supports medical necessity for renal transplantation.`,
};

const clinicalDataMap: Record<string, ClinicalProfile> = {
  "CASE-001": defaultClinical,
  "CASE-002": nephrologyClinical,
};

export function getClinicalData(caseId: string): ClinicalProfile {
  return clinicalDataMap[caseId] || defaultClinical;
}
