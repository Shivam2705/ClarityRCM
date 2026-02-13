export interface ClinicalProfile {
  gender: string;
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

const case1: ClinicalProfile = {
  gender: "Female",
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
    `${patientName}${patientAge ? `, a ${patientAge} patient` : ""} presents with Primary Osteoarthritis, Right Knee (Grade IV - Kellgren-Lawrence) persisting for 18 months. Currently managed with conservative treatment including NSAIDs (Meloxicam) and analgesics. Patient has well-controlled comorbidities including Type 2 Diabetes and Hypertension. Requesting ${procedureName} (CPT: ${procedureCode}). Known allergies to Penicillin and Sulfa drugs noted. Clinical documentation supports medical necessity for the requested procedure.`,
};

const case2: ClinicalProfile = {
  gender: "Male",
  primaryDiagnosis: "Lumbar Spondylolisthesis with Spinal Stenosis",
  icdCode: "M43.16",
  severity: "Grade I spondylolisthesis with radiculopathy",
  duration: "14 months",
  allergies: ["Iodine contrast", "Shellfish"],
  medications: ["Gabapentin 300mg", "Naproxen 500mg", "Cyclobenzaprine 10mg", "Tramadol 50mg"],
  comorbidities: ["Hypertension (controlled)", "Obesity", "Degenerative disc disease"],
  documents: [
    { name: "Ortho Spine Consultation - Dr. Patel", date: "2024-01-18", status: "analyzed" },
    { name: "Lumbar MRI Report", date: "2024-01-12", status: "analyzed" },
    { name: "Lumbar X-Ray Flex/Extension", date: "2024-01-10", status: "analyzed" },
    { name: "EMG/NCS Report", date: "2024-01-08", status: "analyzed" },
    { name: "Physical Therapy Summary", date: "2023-12-20", status: "analyzed" },
  ],
  summaryTemplate: (patientName, patientAge, procedureName, procedureCode) =>
    `${patientName}${patientAge ? `, a ${patientAge} patient` : ""} presents with lumbar spondylolisthesis and spinal stenosis with persistent low back pain and radicular symptoms for 14 months. Imaging shows Grade I spondylolisthesis with foraminal stenosis and degenerative disc disease. Conservative management including NSAIDs, neuropathic agents, muscle relaxants, and physical therapy has failed to provide sustained relief. Comorbidities include controlled Hypertension and Obesity. Requesting ${procedureName} (CPT: ${procedureCode}). Allergies to Iodine contrast and Shellfish noted. Clinical documentation supports medical necessity for lumbar fusion with interbody technique.`,
};

const case3: ClinicalProfile = {
  gender: "Female",
  primaryDiagnosis: "Essential Hypertension - Follow-up Visit",
  icdCode: "",
  severity: "Controlled with medication",
  duration: "5 years",
  allergies: ["Penicillin"],
  medications: ["Amlodipine 5mg", "Lisinopril 20mg", "Metformin 500mg"],
  comorbidities: ["Type 2 Diabetes (controlled)", "Hyperlipidemia"],
  documents: [
    { name: "Primary Care Visit Note", date: "2024-01-16", status: "analyzed" },
    { name: "Home BP Log", date: "2024-01-14", status: "analyzed" },
    { name: "A1c & Lipid Panel", date: "2024-01-12", status: "analyzed" },
    { name: "Medication Reconciliation", date: "2024-01-16", status: "analyzed" },
  ],
  summaryTemplate: (patientName, patientAge, procedureName, procedureCode) =>
    `${patientName}${patientAge ? `, a ${patientAge} patient` : ""} presents for an established patient office visit to manage chronic conditions including essential hypertension and controlled Type 2 diabetes. Home BP log and recent labs were reviewed, medications reconciled, and counseling provided on diet and exercise. Requesting ${procedureName} (CPT: ${procedureCode}). Allergies to Penicillin noted. Clinical documentation supports medical necessity for an established patient evaluation and management visit.`,
};
const clinicalDataMap: Record<string, ClinicalProfile> = {
  "CASE-001": case1,
  "CASE-002": case2,
  "CASE-003": case3,
};

export function getClinicalData(caseId: string): ClinicalProfile {
  return clinicalDataMap[caseId] || case3;;
}
