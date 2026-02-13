export type CaseStatus = "New" | "Eligible" | "Eligible PA Req" | "Not Eligible" | "PA Review" | "PA Submitted" | "PA Denied";

export interface Case {
  id: string;
  patientName: string;
  documentSummary?: string;
  aiSummary?: string;
  patientId: string;
  dateOfBirth: string;
  encounterType: "Inpatient" | "Outpatient" | "Procedure";
  orderingProvider: string;
  payerName: string;
  groupId?: string;
  status: CaseStatus;
  priority: "High" | "Medium" | "Low";
  lastUpdated: string;
  procedureCode?: string;
  procedureName?: string;
  hasGaps?: boolean;
}

export const mockCases: Case[] = (JSON.parse(localStorage.getItem("userCases") || "[]").concat([
  {
    id: "CASE-001",
    patientName: "Sarah Johnson",
    documentSummary: `Sarah Johnson (DOB: 03/12/1958) is a 67-year-old female with an 18-month history of progressively worsening right knee pain due to advanced primary osteoarthritis, confirmed by weight-bearing radiographs demonstrating Kellgren-Lawrence Grade IV changes with bone-on-bone joint space narrowing, osteophyte formation, and subchondral sclerosis. She reports severe pain (8/10 with activity), stiffness, and instability that significantly impair activities of daily living, including walking short distances, climbing stairs, rising from a chair, and performing routine household tasks. Physical examination reveals antalgic gait, varus deformity, crepitus, joint line tenderness, effusion, and restricted range of motion (10°–85°). The patient has failed extensive conservative management, including an 8-week course of supervised in-person physical therapy within the past year, ongoing NSAID therapy (Meloxicam), analgesics, bracing, activity modification, and a structured home exercise program, all providing inadequate relief. Comorbid type 2 diabetes and hypertension are well controlled. Given severe radiographic disease, documented functional limitation, and failure of non-operative treatment, total knee arthroplasty (CPT 27447) is medically necessary.`,
    aiSummary: "Sarah Johnson (PT-78234), born 1958-03-12, underwent Total Knee Replacement. Summary: Sarah Johnson is a 68-year-old female with a history of progressively worsening right knee pain over more than two years, consistent with advanced osteoarthritis...",
    patientId: "PT-78234",
    dateOfBirth: "1958-03-12",
    encounterType: "Inpatient",
    orderingProvider: "Dr. Michael Chen",
    payerName: "Aetna",
    groupId: "GRP-12345",
    status: "New",
    priority: "High",
    lastUpdated: "2024-01-15T10:30:00Z",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
    hasGaps: true,
  },
  {
    id: "CASE-002",
    patientName: "Robert Williams",
    documentSummary: `Robert Miller is a 47-year-old male with a 14-month history of severe lower back pain with right-sided radiculopathy secondary to degenerative disc disease and Grade I spondylolisthesis at L4–L5, confirmed on MRI demonstrating disc collapse, foraminal stenosis, and nerve root compression correlating with clinical symptoms. The patient reports persistent pain rated 7–9/10, numbness, and weakness that significantly limit activities of daily living, including standing longer than 10 minutes, walking more than one block, and performing work-related tasks, resulting in functional disability despite exhaustive conservative treatment. He has completed over 12 weeks of documented non-operative management within the past year, including supervised physical therapy, structured home exercise, NSAIDs, neuropathic pain medications, and two image-guided epidural steroid injections, all providing only transient or minimal relief. Physical examination shows antalgic gait, reduced lumbar range of motion, positive straight-leg raise, and objective neurologic deficit with decreased sensation in the L5 dermatome. Symptoms and imaging findings are concordant, and the condition has failed to improve with prolonged conservative care. Based on established medical-necessity criteria outlined in Aetna clinical policy guidelines for spinal surgery, lumbar decompression with fusion (CPT 22630) is medically necessary to relieve neural compression, stabilize the spine, and restore function.`,
    aiSummary: "Robert Miller is a 47-year-old male with a 14-month history of severe lower back pain with right-sided radiculopathy secondary to degenerative disc disease and Grade I spondylolisthesis at L4–L5, confirmed on MRI demonstrating disc collapse, foraminal stenosis, and nerve root compression correlating with clinical symptoms. The patient reports persistent pain rated 7–9/10, numbness, and weakness that significantly limit activities of daily living, including standing longer than 10 minutes, walking more than one block, and performing work-related tasks, resulting in functional disability despite exhaustive conservative treatment. He has completed over 12 weeks of documented non-operative management within the past year, including supervised physical therapy, structured home exercise, NSAIDs, neuropathic pain medications, and two image-guided epidural steroid injections, all providing only transient or minimal relief. Physical examination shows antalgic gait, reduced lumbar range of motion, positive straight-leg raise, and objective neurologic deficit with decreased sensation in the L5 dermatome. Symptoms and imaging findings are concordant, and the condition has failed to improve with prolonged conservative care. Based on established medical-necessity criteria outlined in Aetna clinical policy guidelines for spinal surgery, lumbar decompression with fusion (CPT 22630) is medically necessary to relieve neural compression, stabilize the spine, and restore function.",
    patientId: "PT-45129",
    dateOfBirth: "1979-07-22",
    encounterType: "Outpatient",
    orderingProvider: "Dr. Emily Watson",
    payerName: "UnitedHealthcare",
    groupId: "GRP-67890",
    status: "New",
    priority: "Medium",
    lastUpdated: "2024-01-15T09:15:00Z",
    procedureCode: "22630",
    procedureName: "Lumbar Spinal Fusion (Posterior Interbody Technique)",
    hasGaps: false,
  },
  {
    id: "CASE-003",
    patientName: "Maria Garcia",
    documentSummary: `Maria Garcia is a 43-year-old female who presented to the outpatient clinic with a 3-day history of dysuria, urinary frequency, and urgency without fever, flank pain, or systemic symptoms. She reports gradual worsening of symptoms despite increased hydration and over-the-counter remedies. Her medical history is significant for well-controlled type 2 diabetes mellitus, hypertension, and hyperlipidemia, managed with Metformin, Lisinopril, and Atorvastatin. Physical examination revealed stable vital signs, a soft non-tender abdomen, and no costovertebral angle tenderness. In-office urinalysis was positive for leukocyte esterase, nitrites, and white blood cells, consistent with an acute uncomplicated urinary tract infection, and a urine culture was ordered. The patient was started on Nitrofurantoin for treatment, advised to maintain hydration, and instructed to follow up if symptoms worsen while continuing her chronic disease medications.
 `,
    aiSummary: "Maria Garcia is a 43-year-old female who presented to the outpatient clinic with a 3-day history of dysuria, urinary frequency, and urgency without fever, flank pain, or systemic symptoms. She reports gradual worsening of symptoms despite increased hydration and over-the-counter remedies. Her medical history is significant for well-controlled type 2 diabetes mellitus, hypertension, and hyperlipidemia, managed with Metformin, Lisinopril, and Atorvastatin. Physical examination revealed stable vital signs, a soft non-tender abdomen, and no costovertebral angle tenderness. In-office urinalysis was positive for leukocyte esterase, nitrites, and white blood cells, consistent with an acute uncomplicated urinary tract infection, and a urine culture was ordered. The patient was started on Nitrofurantoin for treatment, advised to maintain hydration, and instructed to follow up if symptoms worsen while continuing her chronic disease medications.",
    patientId: "PT-91823",
    dateOfBirth: "1982-11-05",
    encounterType: "Procedure",
    orderingProvider: "Dr. James Park",
    payerName: "UnitedHealthcare",
    groupId: "GRP-11223",
    status: "New",
    priority: "Low",
    lastUpdated: "2024-01-14T16:45:00Z",
    procedureCode: "",
    procedureName: "",
  },
  {
    id: "CASE-004",
    patientName: "David Thompson",
    documentSummary: `Patient: David Thompson, DOB: 1955-09-18, ID: PT-33847, Encounter: Inpatient, Provider: Dr. Lisa Martinez`,
    aiSummary: "David Thompson (PT-33847), born 1955-09-18, underwent CABG Single Arterial Graft. Summary: Patient: David Thompson, DOB: 1955-09-18, ID: PT-33847, Encounter: Inpatient, Provider: Dr. Lisa Martinez",
    patientId: "PT-33847",
    dateOfBirth: "1955-09-18",
    encounterType: "Inpatient",
    orderingProvider: "Dr. Lisa Martinez",
    payerName: "Cigna",
    groupId: "GRP-44556",
    status: "New",
    priority: "High",
    lastUpdated: "2024-01-14T14:20:00Z",
    procedureCode: "33533",
    procedureName: "CABG Single Arterial Graft",
  },
  {
    id: "CASE-005",
    patientName: "Jennifer Brown",
    documentSummary: `Patient: Jennifer Brown, DOB: 1990-01-30, ID: PT-62951, Encounter: Outpatient, Provider: Dr. Robert Kim`,
    aiSummary: "Jennifer Brown (PT-62951), born 1990-01-30, underwent Screening Mammography. Summary: Patient: Jennifer Brown, DOB: 1990-01-30, ID: PT-62951, Encounter: Outpatient, Provider: Dr. Robert Kim",
    patientId: "PT-62951",
    dateOfBirth: "1990-01-30",
    encounterType: "Outpatient",
    orderingProvider: "Dr. Robert Kim",
    payerName: "Humana",
    groupId: "GRP-78901",
    status: "PA Denied",
    priority: "Medium",
    lastUpdated: "2024-01-13T11:30:00Z",
    procedureCode: "77067",
    procedureName: "Screening Mammography",
  },
  {
    id: "CASE-006",
    patientName: "Michael Davis",
    documentSummary: `Patient: Michael Davis, DOB: 1970-06-14, ID: PT-18293, Encounter: Procedure, Provider: Dr. Sarah Lee`,
    aiSummary: "Michael Davis (PT-18293), born 1970-06-14, underwent Lumbar Epidural Injection. Summary: Patient: Michael Davis, DOB: 1970-06-14, ID: PT-18293, Encounter: Procedure, Provider: Dr. Sarah Lee",
    patientId: "PT-18293",
    dateOfBirth: "1970-06-14",
    encounterType: "Procedure",
    orderingProvider: "Dr. Sarah Lee",
    payerName: "Medicare",
    groupId: "GRP-33445",
    status: "PA Review",
    priority: "High",
    lastUpdated: "2024-01-15T08:00:00Z",
    procedureCode: "64483",
    procedureName: "Lumbar Epidural Injection",
  },
]));

/**
 * Find a case by ID from mockCases
 * @param caseId - The case ID to search for (e.g., "CASE-001")
 * @returns The matching Case object or undefined if not found
 */
export function getCaseById(caseId: string | undefined): Case | undefined {
  if (!caseId) return undefined;
  return mockCases.find((caseItem) => caseItem.id === caseId);
}
